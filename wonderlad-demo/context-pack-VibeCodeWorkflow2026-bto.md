# Context Pack: VibeCodeWorkflow2026-bto (Wire UI to runner)

## Goal
Connect the Maestro-style web UI to the local runner service so users can start/cancel sessions and view logs.

## Scope
- UI reads beads and sessions from the runner.
- UI can start sessions for selected beads.
- UI can cancel a running session.
- UI surfaces live output (tail).

## In-Scope Files
- `tools/maestro/src/web/OrchestratorShell.tsx`
- `tools/maestro/src/web/hooks/useRunner.ts`

## Out of Scope / Non-Goals
- Runner service changes.
- Persistent session storage.
- Styling redesign beyond existing Maestro UI classes.

## Invariants / Constraints
- Use `VITE_RUNNER_URL` if set, otherwise `http://localhost:5179`.
- Use runner endpoints from `wonderlad-demo/plan.md` Appendix.
- Keep Windows-friendly paths in UI examples.
- No new dependencies unless required.

## Test Cases (Required)
1) Start one bead from the UI:
   - Runner is running.
   - Select a bead in UI; click "Start Selected".
   - Verify session appears with `running` status and log output shows activity.
2) Cancel a running session:
   - Click cancel on a running session.
   - Verify session status transitions to `cancelled` and bead status updates.
3) Refresh behavior:
   - Click "Refresh" and confirm beads + sessions rehydrate.
4) Log tail:
   - Confirm log panel appends new output lines via WebSocket events.
