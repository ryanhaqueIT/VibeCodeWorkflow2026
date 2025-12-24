const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const assert = require("assert");

const PORT = 5189;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, pathName, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      `${BASE_URL}${pathName}`,
      {
        method,
        headers: data
          ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) }
          : {},
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          const parsed = raw ? JSON.parse(raw) : {};
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function waitForServer(retries = 20) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await request("GET", "/sessions");
      if (res.status === 200) return true;
    } catch (err) {
      // ignore and retry
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

async function main() {
  const logDir = fs.mkdtempSync(path.join(os.tmpdir(), "wonderlad-runner-"));
  const env = {
    ...process.env,
    RUNNER_PORT: String(PORT),
    RUNNER_LOG_DIR: logDir,
  };

  const runner = spawn("node", ["src/index.js"], {
    cwd: path.resolve(__dirname, ".."),
    env,
    shell: false,
    stdio: "ignore",
  });

  const ready = await waitForServer();
  assert.strictEqual(ready, true, "runner did not start");

  const createRes = await request("POST", "/sessions", {
    beadIds: ["bead-test-1", "bead-test-2"],
    command: "cmd",
    args: ["/c", "echo runner-ok"],
  });
  assert.strictEqual(createRes.status, 201, "failed to create sessions");
  assert.strictEqual(createRes.body.sessions.length, 2, "expected 2 sessions");

  await new Promise((r) => setTimeout(r, 500));
  const listRes = await request("GET", "/sessions");
  assert.strictEqual(listRes.status, 200, "failed to list sessions");

  const statuses = listRes.body.sessions.map((s) => s.status);
  assert.ok(statuses.includes("success") || statuses.includes("running"), "unexpected status");

  const beadsRes = await request("GET", "/beads");
  assert.strictEqual(beadsRes.status, 200, "failed to list beads");
  assert.ok(
    Object.prototype.hasOwnProperty.call(beadsRes.body, "beads"),
    "beads response missing beads field"
  );

  const logs = fs.readdirSync(logDir).filter((name) => name.endsWith(".log"));
  assert.ok(logs.length >= 1, "expected log files to be created");

  runner.kill("SIGINT");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
