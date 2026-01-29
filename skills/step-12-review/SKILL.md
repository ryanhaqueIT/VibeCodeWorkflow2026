---
name: vibecode-step-12-review
description: Step 12 - Human review and approval gate
category: workflow
---

# Step 12: Human Review

You are executing **Step 12** of the VibeCode Lifecycle.

## ⚠️ THIS IS AN ACCOUNTABILITY GATE

You MUST NOT proceed without explicit human approval.

## Objective

Present changes to the human and ensure they understand the code.

## Mandatory Actions

### 1. Present the Diff

Show all changed files with context:

```bash
git diff --staged
# or
git diff HEAD~1
```

### 2. Explain in Business Terms

```markdown
## Change Summary

**What Changed**: [Business-level description]

**Why**: [The problem this solves]

**How**: [Technical approach in plain language]
```

### 3. Detailed Code Breakdown

For EACH significant change:

```markdown
### File: `path/to/file.ts`

**Lines 42-58**: Added `filterByDateRange` function
- Takes start/end dates as parameters
- Filters results array using `Array.filter()`
- Returns new array (immutable pattern)

**Why this approach**: Matches existing filter functions in the codebase.
Uses the same validation pattern as `filterByStatus`.
```

### 4. Ask Comprehension Questions

```markdown
## Comprehension Check

Before I commit, please confirm:

1. Do you understand what the `filterByDateRange` function does?
2. Do you understand why we used Array.filter instead of mutating?
3. Do you have any concerns about this approach?

**Please respond with:**
- "Yes, I understand and approve" → Proceed to commit
- Questions or concerns → I will address them
```

## Gate Enforcement

The `PreToolUse` hook for `git commit` will block unless:
- `human_approved = true` in state

To grant approval:
```bash
python scripts/enforcement/vibe-cli.py approve
```

## What "Approval" Means

The human is stating:
1. "I understand what this code does"
2. "I could explain it to someone else"
3. "I believe it's correct and appropriate"
4. "I take responsibility for this change"

## Anti-Patterns

❌ Rushing through the review
❌ Accepting "looks good" without comprehension
❌ Skipping the explanation step
❌ Auto-approving without reading

## Next Step

After approval, advance to **Step 14: Commit**.
