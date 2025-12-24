const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");

const PORT = Number(process.env.RUNNER_PORT || 5179);
const MAX_PARALLEL = Number(process.env.RUNNER_MAX_PARALLEL || 2);
const REPO_ROOT =
  process.env.RUNNER_REPO_ROOT ||
  path.resolve(__dirname, "..", "..", "..");
const LOG_DIR =
  process.env.RUNNER_LOG_DIR ||
  path.resolve(REPO_ROOT, "wonderlad-demo", "logs");
const BD_BIN = process.env.RUNNER_BD_PATH || "bd";
const PROVENANCE_LOG =
  process.env.RUNNER_PROVENANCE_LOG ||
  path.resolve(LOG_DIR, "beads-provenance.jsonl");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const sessions = new Map();
const queue = [];
let runningCount = 0;

function nowIso() {
  return new Date().toISOString();
}

function parseJsonOutput(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch (err) {
    return trimmed;
  }
}

function recordProvenance(entry) {
  const record = {
    timestamp: nowIso(),
    ...entry,
  };
  fs.appendFileSync(PROVENANCE_LOG, `${JSON.stringify(record)}\n`);
}

function runBd(args, options = {}) {
  const finalArgs = [...args];
  if (options.actor) {
    finalArgs.push("--actor", options.actor);
  }
  if (!finalArgs.includes("--json")) {
    finalArgs.push("--json");
  }
  return new Promise((resolve) => {
    const child = spawn(BD_BIN, finalArgs, {
      cwd: REPO_ROOT,
      shell: false,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    child.on("error", (err) => {
      resolve({ code: null, stdout, stderr: `${stderr}${err.message}` });
    });
    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

function emitEvent(type, payload) {
  const message = JSON.stringify({ type, timestamp: nowIso(), payload });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

function startNext() {
  while (runningCount < MAX_PARALLEL && queue.length > 0) {
    const session = queue.shift();
    spawnSession(session);
  }
}

function spawnSession(session) {
  runningCount += 1;
  session.status = "running";
  session.startedAt = nowIso();

  const logStream = fs.createWriteStream(session.logPath, { flags: "a" });
  const child = spawn(session.command, session.args, {
    cwd: session.workdir,
    shell: false,
  });

  session.pid = child.pid;
  sessions.set(session.id, session);

  emitEvent("session_started", { sessionId: session.id, beadId: session.beadId });

  child.stdout.on("data", (data) => {
    logStream.write(data);
    emitEvent("session_output", {
      sessionId: session.id,
      beadId: session.beadId,
      stream: "stdout",
      data: data.toString(),
    });
  });

  child.stderr.on("data", (data) => {
    logStream.write(data);
    emitEvent("session_output", {
      sessionId: session.id,
      beadId: session.beadId,
      stream: "stderr",
      data: data.toString(),
    });
  });

  child.on("error", (err) => {
    session.status = "failed";
    session.lastError = err.message;
    session.endedAt = nowIso();
    session.exitCode = null;
    logStream.write(`\n[runner] error: ${err.message}\n`);
    logStream.end();
    runningCount -= 1;
    emitEvent("session_exit", {
      sessionId: session.id,
      beadId: session.beadId,
      exitCode: null,
      error: err.message,
    });
    startNext();
  });

  child.on("exit", (code) => {
    session.exitCode = code;
    session.endedAt = nowIso();
    session.status = code === 0 ? "success" : "failed";
    logStream.write(`\n[runner] exit code: ${code}\n`);
    logStream.end();
    runningCount -= 1;
    emitEvent("session_exit", {
      sessionId: session.id,
      beadId: session.beadId,
      exitCode: code,
    });
    startNext();
  });
}

function createSession({ beadId, command, args, workdir }) {
  const id = `sess_${Math.random().toString(36).slice(2, 10)}`;
  const logPath = path.join(LOG_DIR, `${id}.log`);
  const session = {
    id,
    beadId: beadId || null,
    status: "queued",
    startedAt: null,
    endedAt: null,
    pid: null,
    logPath,
    exitCode: null,
    lastError: null,
    workdir: workdir || REPO_ROOT,
    command,
    args,
  };
  sessions.set(id, session);
  return session;
}

function parseJson(req, res, cb) {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    try {
      const parsed = data ? JSON.parse(data) : {};
      cb(parsed);
    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "invalid_json", detail: err.message }));
    }
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/beads") {
    const wantReady = url.searchParams.get("ready") === "true";
    const result = await runBd(wantReady ? ["ready"] : ["list"]);
    if (result.code !== 0) {
      return sendJson(res, 500, {
        error: "bd_failed",
        detail: result.stderr.trim() || result.stdout.trim(),
      });
    }
    return sendJson(res, 200, { beads: parseJsonOutput(result.stdout) });
  }

  if (req.method === "GET" && url.pathname === "/beads/ready") {
    const result = await runBd(["ready"]);
    if (result.code !== 0) {
      return sendJson(res, 500, {
        error: "bd_failed",
        detail: result.stderr.trim() || result.stdout.trim(),
      });
    }
    return sendJson(res, 200, { beads: parseJsonOutput(result.stdout) });
  }

  if (
    req.method === "POST" &&
    url.pathname.startsWith("/beads/") &&
    url.pathname.endsWith("/claim")
  ) {
    const beadId = url.pathname.split("/")[2];
    return parseJson(req, res, async (body) => {
      const actor = body.actor || null;
      const sessionId = body.sessionId || null;
      const result = await runBd(
        ["update", beadId, "--status", "in_progress"],
        { actor }
      );
      if (result.code !== 0) {
        return sendJson(res, 500, {
          error: "bd_failed",
          detail: result.stderr.trim() || result.stdout.trim(),
        });
      }
      recordProvenance({
        action: "claim",
        beadId,
        status: "in_progress",
        command: "bd update",
        sessionId,
        actor,
      });
      emitEvent("bead_status_changed", {
        beadId,
        status: "in_progress",
        sessionId,
      });
      return sendJson(res, 200, { result: parseJsonOutput(result.stdout) });
    });
  }

  if (
    req.method === "POST" &&
    url.pathname.startsWith("/beads/") &&
    url.pathname.endsWith("/close")
  ) {
    const beadId = url.pathname.split("/")[2];
    return parseJson(req, res, async (body) => {
      const actor = body.actor || null;
      const sessionId = body.sessionId || null;
      const result = await runBd(["close", beadId], { actor });
      if (result.code !== 0) {
        return sendJson(res, 500, {
          error: "bd_failed",
          detail: result.stderr.trim() || result.stdout.trim(),
        });
      }
      recordProvenance({
        action: "close",
        beadId,
        status: "closed",
        command: "bd close",
        sessionId,
        actor,
      });
      emitEvent("bead_status_changed", {
        beadId,
        status: "closed",
        sessionId,
      });
      return sendJson(res, 200, { result: parseJsonOutput(result.stdout) });
    });
  }

  if (req.method === "GET" && url.pathname === "/sessions") {
    const list = Array.from(sessions.values());
    return sendJson(res, 200, { sessions: list });
  }

  if (req.method === "GET" && url.pathname.startsWith("/sessions/")) {
    const parts = url.pathname.split("/");
    const sessionId = parts[2];
    const session = sessions.get(sessionId);
    if (!session) {
      return sendJson(res, 404, { error: "not_found" });
    }
    if (parts[3] === "log") {
      const log = fs.existsSync(session.logPath)
        ? fs.readFileSync(session.logPath, "utf8")
        : "";
      return sendJson(res, 200, { log });
    }
    return sendJson(res, 200, { session });
  }

  if (req.method === "POST" && url.pathname === "/sessions") {
    return parseJson(req, res, (body) => {
      const beadIds = Array.isArray(body.beadIds) ? body.beadIds : [null];
      const command = body.command || "codex";
      const args = Array.isArray(body.args) ? body.args : ["--help"];
      const workdir = body.workdir || REPO_ROOT;

      const created = beadIds.map((beadId) =>
        createSession({ beadId, command, args, workdir })
      );
      created.forEach((session) => queue.push(session));
      emitEvent("session_queued", { sessions: created.map((s) => s.id) });
      startNext();
      return sendJson(res, 201, { sessions: created });
    });
  }

  if (req.method === "POST" && url.pathname.endsWith("/cancel")) {
    const sessionId = url.pathname.split("/")[2];
    const session = sessions.get(sessionId);
    if (!session) {
      return sendJson(res, 404, { error: "not_found" });
    }
    if (session.pid) {
      try {
        process.kill(session.pid, "SIGINT");
      } catch (err) {
        session.lastError = err.message;
      }
    }
    session.status = "cancelled";
    session.endedAt = nowIso();
    emitEvent("session_cancelled", { sessionId });
    return sendJson(res, 200, { session });
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

const wss = new WebSocketServer({ server });
server.listen(PORT, () => {
  // Log to stdout for easy discovery when running locally.
  console.log(`[runner] listening on http://localhost:${PORT}`);
});
