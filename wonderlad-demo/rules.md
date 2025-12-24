# Wonderlad Demo Rules

## Conventions
- Keep planning artifacts in `wonderlad-demo/`.
- Use `bd` as the only source of truth for task tracking.
- Prefer small, focused commits per bead.
- Use ASCII only unless a file already contains Unicode.

## Forbidden Patterns
- Do not write or edit `spec.md` unless explicitly requested by the user.
- Do not bypass bead status updates in `bd`.
- Do not run destructive git commands (reset/checkout --/clean) unless explicitly asked.
- Do not store secrets in repo files or logs.

## Ask-If-Unclear
- If requirements, architecture, data model, or test strategy are unclear, stop and ask.

## Testing
- Runner: start 2+ sessions in parallel and verify status/logs.
- UI: open in browser and check console for errors.
- Replica: confirm layout against UI/UX inventory.
