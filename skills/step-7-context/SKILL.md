---
name: vibecode-step-7-context
description: Step 7 - Pack context for the selected task
category: workflow
---

# Step 7: Context Packing

You are executing **Step 7** of the VibeCode Lifecycle.

## Objective

Gather all relevant context for the selected task BEFORE writing any code.

## Why This Matters

- Prevents hallucination by grounding in actual code
- Reduces token waste by focusing only on relevant files
- Ensures changes fit the existing architecture

## Process

1. **Identify** files related to the task
2. **Read** those files to understand current state
3. **Gather** relevant API docs, schemas, patterns
4. **Document** the context in `context-pack.md`
5. **Verify** you have everything needed

## Context Pack Template

Create `.agent/workflows/context-pack.md`:

```markdown
# Context Pack: [Task Name]

## Task
- ID: [Task ID]
- Goal: [What we're building]
- Done When: [Acceptance criteria]

## Files to Modify
- `path/to/file1.py` - [Why]
- `path/to/file2.ts` - [Why]

## Files to Reference (Read-Only)
- `path/to/types.ts` - Type definitions
- `path/to/utils.py` - Helper functions

## Existing Patterns
[Document patterns from the codebase that should be followed]

## API/Schema Information
[Relevant API endpoints, database schemas, etc.]

## Constraints & Pitfalls
- [Constraint 1]
- [Known pitfall to avoid]

## Non-Goals for This Task
- [What we're NOT changing]
```

## Tools to Use

| Tool | Purpose |
|------|---------|
| `Glob` | Find files by pattern |
| `Grep` | Search for references |
| `Read` | Read file contents |
| `Task(Explore)` | Codebase exploration |
| MCP Serena | Symbol navigation |
| Context7 MCP | API documentation |

## Gate

`context-pack.md` MUST exist before proceeding to Step 8.

The enforcement hook will block code edits until this file exists.

## Verification

```bash
# Mark context pack as complete
python scripts/enforcement/vibe-cli.py context-pack
```

## Next Step

Advance to **Step 8: Implementation**.

⚠️ **Code editing is now ALLOWED** after this step completes.
