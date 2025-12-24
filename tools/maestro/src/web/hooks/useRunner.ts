import { useCallback, useEffect, useMemo, useState } from 'react';

type RunnerBead = {
  id: string;
  title?: string;
  status?: string;
};

type RunnerSession = {
  id: string;
  beadId: string | null;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
  exitCode: number | null;
};

type RunnerEvent = {
  type: string;
  timestamp?: string;
  payload?: {
    sessionId?: string;
    beadId?: string;
    data?: string;
    stream?: string;
  };
};

function getRunnerBaseUrl() {
  const envUrl =
    (import.meta as ImportMeta & { env?: { VITE_RUNNER_URL?: string } }).env
      ?.VITE_RUNNER_URL;
  return envUrl || 'http://localhost:5179';
}

function buildWsUrl(baseUrl: string) {
  if (baseUrl.startsWith('https://')) {
    return baseUrl.replace('https://', 'wss://');
  }
  if (baseUrl.startsWith('http://')) {
    return baseUrl.replace('http://', 'ws://');
  }
  return `ws://${baseUrl}`;
}

function safeJson(response: Response) {
  return response.json().catch(() => ({}));
}

export function useRunner() {
  const baseUrl = useMemo(() => getRunnerBaseUrl(), []);
  const [beads, setBeads] = useState<RunnerBead[]>([]);
  const [sessions, setSessions] = useState<RunnerSession[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    const [beadsRes, sessionsRes] = await Promise.all([
      fetch(`${baseUrl}/beads`),
      fetch(`${baseUrl}/sessions`),
    ]);
    const beadsJson = await safeJson(beadsRes);
    const sessionsJson = await safeJson(sessionsRes);
    const beadList = Array.isArray(beadsJson.beads) ? beadsJson.beads : [];
    const sessionList = Array.isArray(sessionsJson.sessions)
      ? sessionsJson.sessions
      : [];
    setBeads(beadList);
    setSessions(sessionList);
  }, [baseUrl]);

  const startSessions = useCallback(
    async (beadIds: string[]) => {
      await fetch(`${baseUrl}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beadIds }),
      });
      refresh();
    },
    [baseUrl, refresh]
  );

  const cancelSession = useCallback(
    async (sessionId: string) => {
      await fetch(`${baseUrl}/sessions/${sessionId}/cancel`, {
        method: 'POST',
      });
      refresh();
    },
    [baseUrl, refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const ws = new WebSocket(buildWsUrl(baseUrl));
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as RunnerEvent;
        if (message.type === 'session_output' && message.payload?.data) {
          setLogs((prev) => [...prev.slice(-200), message.payload?.data || '']);
        }
        if (
          message.type === 'session_exit' ||
          message.type === 'session_started' ||
          message.type === 'session_queued' ||
          message.type === 'session_cancelled'
        ) {
          refresh();
        }
      } catch {
        // ignore malformed events
      }
    };
    return () => ws.close();
  }, [baseUrl, refresh]);

  const sessionsWithElapsed = useMemo(() => {
    return sessions.map((session) => {
      if (!session.startedAt) {
        return { ...session, elapsed: '--:--' };
      }
      const start = new Date(session.startedAt).getTime();
      const end = session.endedAt ? new Date(session.endedAt).getTime() : Date.now();
      const seconds = Math.max(0, Math.floor((end - start) / 1000));
      const minutes = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
      const remaining = (seconds % 60).toString().padStart(2, '0');
      return { ...session, elapsed: `${minutes}:${remaining}` };
    });
  }, [sessions]);

  return {
    beads,
    sessions: sessionsWithElapsed,
    logs,
    refresh,
    startSessions,
    cancelSession,
  };
}
