# Context Pack: VibeCodeWorkflow2026-swy (Integrate beads adapter)

## Scope
Integrate a beads adapter into the local runner service so the UI (later bead)
can call `bd ready`, `bd update --status in_progress`, and `bd close`.
Add provenance tracking for bead status updates.

## References (must read)
- `wonderlad-demo/spec.md` (beads integration requirements, status mapping)
- `wonderlad-demo/plan.md` (Phase 2 step 6 + API contract appendix)
- `wonderlad-demo/rules.md` (guardrails, bd is source of truth)
- `wonderlad-demo/research/beads.md` (bd usage expectations)
- `wonderlad-demo/runner/src/index.js` (current runner HTTP/WebSocket service)
- `wonderlad-demo/runner/package.json` (runtime + deps)

## Existing Runner Summary
Location: `wonderlad-demo/runner/`
- HTTP server in `wonderlad-demo/runner/src/index.js`.
- Endpoints:
  - `GET /sessions` -> list in-memory sessions.
  - `GET /sessions/:id` -> session details.
  - `GET /sessions/:id/log` -> full log file contents.
  - `POST /sessions` -> create sessions (queue + concurrency).
  - `POST /sessions/:id/cancel` -> cancel a running session.
- WebSocket emits session events (`session_started`, `session_output`, `session_exit`, `session_cancelled`).

## Required Beads Adapter Behaviors
- Use `bd` CLI as system of record. Do not read `.beads/issues.jsonl` directly.
- Expose bead list and readiness (`bd list`, `bd ready`) for UI consumption.
- Allow status updates:
  - `bd update <id> --status in_progress`
  - `bd close <id>`
- Capture provenance on updates:
  - Record which session/request triggered the status change.
  - Store as JSONL alongside runner logs (no secrets).

## API Contract Alignment (from plan.md)
- `GET /beads` -> list beads with status and metadata
- Optional: `GET /beads/ready` -> list ready beads (aligns with `bd ready`)
- `POST /beads/:id/claim` -> set in_progress
- `POST /beads/:id/close` -> close bead

## Invariants / Non-Goals
- Do not change the UI yet.
- Do not bypass `bd` or mutate bead data directly.
- Keep Windows-first execution in mind (use `bd` from PATH).
