# Context Pack: VibeCodeWorkflow2026-0cn (Integrate Maestro for parallel bead execution)

## Scope
Integrate Maestro (web-first UI) with the runner/beads adapter so multiple beads can run in parallel from a Maestro-style interface. This bead focuses on integration wiring/entrypoints (not full UI polish).

## References (must read)
- `wonderlad-demo/spec.md` (goals, architecture, data model)
- `wonderlad-demo/plan.md` (Phase 3 steps 7–8)
- `wonderlad-demo/rules.md` (guardrails)
- `wonderlad-demo/research/maestro.md` (modules + integration path)
- `wonderlad-demo/runner/src/index.js` (runner API + websocket events)

## Relevant Maestro Files
- `tools/maestro/src/web/` (PWA client; web-first UI base)
- `tools/maestro/vite.config.web.mts` (web build config)

## Files to Modify / Create
- `tools/maestro/src/web/` (add a minimal integration screen)
- `tools/maestro/src/web/hooks/` (new hook to call runner API)
- Optional: `tools/maestro/src/web/utils/config.ts` for runner base URL

## Invariants / Non-Goals
- Do not change runner logic in this bead.
- Do not add heavy UI polish yet; minimal functional wiring only.
- Do not bypass `bd`; use runner API to reach beads endpoints.

## Tooling / MCP Notes
- `gitingest` currently fails on this machine (Python 3.8 typing union error).
- Use local file inspection in `tools/maestro/src/web`.

## Test / Verification
- Manual: load web UI and confirm it can fetch `/beads` and start sessions via runner.
- Use `npm test` in `wonderlad-demo/runner` to verify runner still passes.
