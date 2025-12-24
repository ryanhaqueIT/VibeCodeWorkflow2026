# Context Pack: VibeCodeWorkflow2026-5zu (Implement runner service)

## Scope
Implement the local runner service that can spawn multiple Codex CLI sessions in parallel, enforce concurrency limits, and stream logs. This is **runner-only** (no UI wiring yet).

## References (must read)
- `wonderlad-demo/spec.md` (runner requirements, architecture, data model)
- `wonderlad-demo/plan.md` (Phase 2 step 5 + API contract appendix)
- `wonderlad-demo/rules.md` (project guardrails)
- `wonderlad-demo/research/maestro.md` (integration points and web-first direction)
- `wonderlad-demo/research/beads.md` (bd usage expectations)

## Relevant Upstream Docs
- `tools/maestro/ARCHITECTURE.md` (process manager + web server model)

## Files to Modify / Create
- **New**: runner service folder (location TBD; propose `wonderlad-demo/runner/`)
- **Maybe**: `wonderlad-demo/README.md` if runner setup needs documentation later

## Decisions Needed (confirm before coding)
- Runner location: `wonderlad-demo/runner/` (chosen)
- IPC boundary: local HTTP + WebSocket (chosen, per spec)
- Workdir mode default: repo root (chosen)

## Invariants / Non-Goals
- Do not change UI yet (only runner service).
- Do not bypass `bd` (beads adapter is a separate bead).
- Do not store secrets in logs or repo files.
- Keep concurrency limits and log paths explicit.
- Windows-first local execution.

## Tooling / MCP Notes
- `gitingest` attempted but fails under current Python 3.8 + pydantic union types.
  - Error: `TypeError: unsupported operand type(s) for |: 'type' and 'NoneType'`
  - Proceed without gitingest; rely on manual file inspection.

## Test / Verification (from plan)
- Manual run: start 2+ sessions in parallel; verify exit codes and logs.

## Bead Output Expectations
- Runner service can spawn Codex CLI processes concurrently.
- Logs are written per session and status events are emitted.
