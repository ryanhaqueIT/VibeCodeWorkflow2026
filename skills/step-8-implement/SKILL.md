---
name: vibecode-step-8-implement
description: Step 8 - Implement the task (code editing allowed)
category: workflow
---

# Step 8: Implementation

You are executing **Step 8** of the VibeCode Lifecycle.

## ✅ Code Editing is NOW ALLOWED

This is the first step where you may edit/write code files.

## Objective

Generate code changes for the SELECTED TASK ONLY.

## Constraints

1. **Only modify files listed in context-pack.md**
2. **Follow patterns identified in context packing**
3. **Keep changes minimal and focused**
4. **One task = one logical change set**

## Process

1. **Review** the context pack
2. **Plan** the specific changes (mentally or briefly)
3. **Implement** one file at a time
4. **Verify** each change compiles/parses
5. **Document** significant decisions

## Implementation Checklist

Before each edit, verify:

- [ ] File is in context-pack.md's "Files to Modify" list
- [ ] Change aligns with existing patterns
- [ ] No scope creep (only what the task requires)
- [ ] Error handling follows project conventions
- [ ] No hardcoded values (use config/env)

## Code Quality Rules

```
✓ Small, focused functions (<50 lines)
✓ Clear, descriptive names
✓ Immutable patterns where possible
✓ Proper error handling
✗ No console.log/print statements
✗ No TODO comments without ticket references
✗ No dead code or commented-out code
```

## After Each Edit

The `PostToolUse` hook will:
1. Log the edit in history
2. Invalidate test verification
3. Remind about Step 9 (verification)

## Gate

No formal gate - proceed to Step 9 to verify changes.

## Anti-Patterns

❌ Editing files not in context pack
❌ Making "while I'm here" improvements
❌ Adding features beyond task scope
❌ Skipping to commit without testing

## Next Step

Advance to **Step 9: Run Tests/Checks**.
