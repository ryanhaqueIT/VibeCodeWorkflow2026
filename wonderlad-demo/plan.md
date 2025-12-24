# Plan (Derived from spec.md)

## Phase 0: Planning / Setup
1) Confirm `spec.md` is approved (user sign-off).
   - Done criteria: explicit approval recorded in session.
   - Tests: N/A (approval gate).
2) Establish work locations and repo hygiene.
   - Create `wonderlad-demo/` subfolders for `apps/`, `research/`, `logs/`.
   - Done criteria: folders exist and are documented in `wonderlad-demo/README.md` (if needed).
   - Tests: N/A (filesystem check).

## Phase 1: Maestro Research + Integration Design
3) Audit Maestro architecture in `tools/maestro`.
   - Capture key integration points for process spawning, IPC, and UI patterns.
   - Done criteria: research notes in `wonderlad-demo/research/maestro.md`.
   - Tests: N/A (doc review).
4) Define beads-to-session status mapping and runner API contract.
   - Done criteria: mapping + API endpoints documented in `wonderlad-demo/plan.md` appendix.
   - Tests: N/A (doc review).

## Phase 2: Runner Service (Parallel Codex Execution)
5) Implement a local runner service (Node) with:
   - Queue and concurrency control.
   - Spawn `codex` CLI processes per bead.
   - Stream logs to files and emit status events.
   - Done criteria: local runner can start 2+ sessions and emit status.
   - Tests: manual run with 2+ parallel sessions; verify exit codes and logs.
6) Beads adapter integration:
   - `bd ready` / `bd update` / `bd close`.
   - Status provenance tracking.
   - Done criteria: status updates are reflected in beads.
   - Tests: create a test bead; run through status changes; verify `bd show`.

## Phase 3: Maestro-Style Web UI
7) Stand up a web UI shell in `tools/maestro` (web-first).
   - Reuse Maestro web/renderer components as appropriate.
   - Done criteria: UI loads with basic layout and theme.
   - Tests: manual UI load on localhost; check for console errors.
8) Wire UI to runner service:
   - Bead list, run/cancel controls, session log viewer.
   - Done criteria: UI can start/cancel and view logs.
   - Tests: start one bead; verify UI reflects running -> success/blocked; verify log tail.

## Phase 4: Wanderlog Trip Plan Replica
9) Scaffold `wonderlad-demo/apps/wanderlog-clone`.
   - Use existing UI/UX inventory and screenshot set.
   - Done criteria: app builds and renders main layout sections.
   - Tests: dev server runs; baseline render on desktop + mobile widths.
10) Implement structural replica layout:
   - Header, sidebar, main tabs, cards, map panel, etc.
   - Done criteria: visual structure matches inventory sections.
   - Tests: compare against UI/UX inventory and screenshots; manual spot check.

## Phase 5: Verification & Docs
11) Manual verification:
   - Run 2+ beads in parallel and verify status/logs.
   - Verify UI responsiveness with 10+ sessions.
   - Done criteria: verification notes recorded.
   - Tests: stress run with 10 sessions; observe UI responsiveness.
12) Document usage:
   - How to start runner + UI.
   - How to run beads in parallel.
   - Done criteria: quickstart instructions added to `wonderlad-demo/README.md` (if needed).
   - Tests: follow docs to launch runner + UI from scratch.

---

## Appendix: Runner API Contract (Draft)
- `GET /beads` -> list beads with status and metadata
- `POST /sessions` -> start sessions `{ beadIds: string[] }`
- `POST /sessions/:id/cancel` -> cancel a running session
- `GET /sessions` -> session list with bead mapping
- `GET /sessions/:id/log` -> tail log (last N lines)
- `GET /sessions/:id` -> session detail with status + exit info
- WebSocket `/events` -> session events (start/output/exit/status) + bead status updates

## Appendix: Beads Status Mapping
- `open` -> `queued` (not started)
- `in_progress` -> `running`
- `success` -> `success`
- `blocked` -> `blocked` (include reason)
- `failed` -> `failed` (include exit code + error)
