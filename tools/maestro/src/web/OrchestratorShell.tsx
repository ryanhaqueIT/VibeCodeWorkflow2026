import React, { useMemo, useState } from 'react';

const beads = [
  { id: 'VibeCodeWorkflow2026-380', title: 'Stand up UI shell', status: 'in_progress' },
  { id: 'VibeCodeWorkflow2026-bto', title: 'Wire UI to runner', status: 'open' },
  { id: 'VibeCodeWorkflow2026-32o', title: 'Parallel run verification', status: 'open' },
  { id: 'VibeCodeWorkflow2026-zoj', title: 'Scaffold wanderlog clone', status: 'open' },
];

const sessions = [
  { id: 'sess-ax91', beadId: 'VibeCodeWorkflow2026-380', status: 'running', elapsed: '00:12' },
  { id: 'sess-bc02', beadId: 'VibeCodeWorkflow2026-5zu', status: 'success', elapsed: '00:04' },
  { id: 'sess-fk77', beadId: 'VibeCodeWorkflow2026-swy', status: 'success', elapsed: '00:07' },
];

const logs = [
  '[runner] session_started sess-ax91',
  '[runner] spawning codex --model gpt-5',
  '[codex] analyzing context-pack...',
  '[runner] session_output stdout: scaffolding shell layout',
  '[runner] heartbeat: 00:12:41',
];

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`shell-status shell-status--${status}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export function OrchestratorShell() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const noop = useMemo(() => () => {}, []);

  const selectedIds = useMemo(() => Array.from(selected), [selected]);
  const runningCount = useMemo(
    () => sessions.filter((session) => session.status === 'running').length,
    [sessions]
  );
  const queuedCount = useMemo(
    () => sessions.filter((session) => session.status === 'queued').length,
    [sessions]
  );
  const activeCount = useMemo(
    () =>
      sessions.filter((session) =>
        ['running', 'queued', 'starting'].includes(session.status)
      ).length,
    [sessions]
  );

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function startSelected() {
    if (selectedIds.length === 0) return;
    noop();
  }

  return (
    <div className="orchestrator-shell">
      <div className="shell-ambient shell-ambient--one" />
      <div className="shell-ambient shell-ambient--two" />

      <header className="shell-header shell-reveal shell-reveal--1">
        <div>
          <p className="shell-eyebrow">Maestro Orchestrator</p>
          <h1>Run beads in parallel, keep the tempo.</h1>
        </div>
        <div className="shell-header-actions">
          <button className="shell-button shell-button--ghost" onClick={noop}>
            Refresh
          </button>
          <button className="shell-button" onClick={startSelected}>
            Start Selected
          </button>
        </div>
      </header>

      <section className="shell-stats shell-reveal shell-reveal--2">
        <div className="shell-stat-card">
          <p>Active Sessions</p>
          <strong>{activeCount}</strong>
          <span>
            {runningCount} running, {queuedCount} queued
          </span>
        </div>
        <div className="shell-stat-card">
          <p>Queue Depth</p>
          <strong>{queuedCount}</strong>
          <span>Max parallel: 2</span>
        </div>
        <div className="shell-stat-card">
          <p>Beads Ready</p>
          <strong>{beads.length}</strong>
          <span>Last sync: now</span>
        </div>
      </section>

      <main className="shell-grid shell-reveal shell-reveal--3">
        <aside className="shell-panel shell-panel--list">
          <div className="shell-panel-header">
            <h2>Beads</h2>
            <button className="shell-link" onClick={noop}>
              Refresh
            </button>
          </div>
          <div className="shell-list">
            {beads.map((bead) => (
              <div
                className="shell-list-item"
                key={bead.id}
                role="button"
                tabIndex={0}
                onClick={() => toggleSelected(bead.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    toggleSelected(bead.id);
                  }
                }}
              >
                <div>
                  <p className="shell-item-title">{bead.title || bead.id}</p>
                  <p className="shell-item-meta">{bead.id}</p>
                </div>
                <div className="shell-item-meta">
                  {selected.has(bead.id) ? 'selected' : ''}
                </div>
                <StatusBadge status={bead.status || 'unknown'} />
              </div>
            ))}
          </div>
        </aside>

        <section className="shell-panel shell-panel--center">
          <div className="shell-panel-header">
            <h2>Sessions</h2>
            <div className="shell-chip-row">
              <span className="shell-chip">All</span>
              <span className="shell-chip shell-chip--muted">Running</span>
              <span className="shell-chip shell-chip--muted">Queued</span>
            </div>
          </div>
          <div className="shell-session-grid">
            {sessions.map((session) => (
              <div className="shell-session-card" key={session.id}>
                <div>
                  <p className="shell-item-title">{session.id}</p>
                  <p className="shell-item-meta">{session.beadId || 'unassigned'}</p>
                </div>
                <div className="shell-session-meta">
                  <StatusBadge status={session.status} />
                  <span className="shell-timer">{session.elapsed || '--:--'}</span>
                </div>
                {['running', 'queued'].includes(session.status) ? (
                  <button className="shell-button shell-button--ghost" onClick={noop}>
                    Cancel
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          <div className="shell-log">
            <div className="shell-panel-header">
              <h3>Live Output</h3>
              <button className="shell-link">Tail Log</button>
            </div>
            <pre className="shell-log-stream">
              {logs.map((line, index) => `${index + 1}: ${line}\n`)}
            </pre>
          </div>
        </section>

        <aside className="shell-panel shell-panel--inspector">
          <div className="shell-panel-header">
            <h2>Inspector</h2>
            <button className="shell-link">Pin</button>
          </div>
          <div className="shell-inspector-card">
            <p className="shell-item-title">Selected Beads</p>
            <p className="shell-item-meta">{selectedIds.join(', ') || 'none'}</p>
            <div className="shell-divider" />
            <div className="shell-kv">
              <span>Total</span>
              <strong>{selectedIds.length}</strong>
            </div>
            <div className="shell-kv">
              <span>Sessions</span>
              <strong>{sessions.length}</strong>
            </div>
          </div>
          <div className="shell-inspector-card shell-inspector-card--secondary">
            <h3>Queue Policy</h3>
            <p>Max parallel sessions set to 2. Remaining beads are queued automatically.</p>
            <button className="shell-button shell-button--ghost">Edit Limits</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
