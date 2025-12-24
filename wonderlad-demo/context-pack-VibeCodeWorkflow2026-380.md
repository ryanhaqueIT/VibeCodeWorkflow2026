# Context Pack: VibeCodeWorkflow2026-380 (Stand up Maestro-style web UI shell)

## Scope
Stand up a web-first Maestro-style UI shell inside `tools/maestro`.
This bead is UI shell only (no runner wiring yet).

## References
- `wonderlad-demo/spec.md` (UI requirements + constraints)
- `wonderlad-demo/plan.md` (Phase 3 step 7)
- `wonderlad-demo/rules.md` (guardrails)
- `tools/maestro/README.md` (existing Maestro structure)
- `tools/maestro/src/web/` (existing web client shell)

## Decisions / Assumptions
- Use the existing `tools/maestro/src/web/` client as the base for the shell.
- Keep changes web-only; do not touch Electron-specific code paths yet.

## Files to Inspect / Modify
- `tools/maestro/src/web/App.tsx`
- `tools/maestro/src/web/index.ts` / `tools/maestro/src/web/main.tsx`
- `tools/maestro/src/web/index.css`
- `tools/maestro/src/web/components/*`
- `tools/maestro/src/web/hooks/*`

## Invariants / Non-Goals
- Do not wire the UI to the runner (separate bead).
- Preserve Maestro theme system and keyboard-first patterns.
- Avoid new build tooling; stay within existing `tools/maestro` setup.

## Tests
- Manual: run the web dev server and confirm the shell loads without console errors.
- Manual: verify basic layout responsiveness on desktop + mobile widths.
- Automated: `npm --prefix tools/maestro test -- OrchestratorShell` (renders shell header + panels).
