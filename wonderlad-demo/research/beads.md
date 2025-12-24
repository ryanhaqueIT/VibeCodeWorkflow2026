# Beads Research Notes

Sources:
- Project instructions in `AGENTS.md`
- `skills/beads-utility/SKILL.md`

## Core Concepts
- Beads (`bd`) is the single source of truth for task tracking.
- Issues are stored in `.beads/issues.jsonl` (git-synced).
- The workflow uses `bd ready`, `bd update --status in_progress`, `bd close`.

## Workflow Expectations
- Always check `bd ready` to find unblocked work.
- Claim tasks by moving to `in_progress`.
- Close only after verification and human approval.
- Keep planning artifacts in a dedicated folder (`wonderlad-demo/` for this project).

## Integration Notes
- Prefer using `bd` CLI for reads/writes (avoid direct DB access).
- Maintain explicit status mapping between beads and runner session states.
- Record provenance for bead status changes (which session updated it).
