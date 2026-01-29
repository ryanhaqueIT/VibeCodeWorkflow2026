---
name: vibecode-step-14-commit
description: Step 14 - Atomic commit after approval
category: workflow
---

# Step 14: Commit

You are executing **Step 14** of the VibeCode Lifecycle.

## Prerequisites

Before committing, verify:

- [ ] Step 9: All tests passed ✓
- [ ] Step 12: Human approved ✓

The `PreToolUse` hook will block if these aren't met.

## Objective

Create an atomic commit with a clear, meaningful message.

## Commit Message Format

```
<type>: <description>

<body - what and why>

Closes: #<issue-number>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes nor adds
- `docs`: Documentation only
- `test`: Adding tests
- `chore`: Maintenance tasks

## Process

1. **Stage** only the files for this task:
   ```bash
   git add path/to/file1.ts path/to/file2.py
   ```

2. **Verify** staged changes:
   ```bash
   git status
   git diff --staged
   ```

3. **Commit** with clear message:
   ```bash
   git commit -m "$(cat <<'EOF'
   feat: Add date range filter to search results

   - Added filterByDateRange function to filter utils
   - Integrated with SearchResults component
   - Added unit tests for edge cases

   Closes: #123
   EOF
   )"
   ```

## Rules

1. **Never commit what you can't explain**
2. **One task = one commit** (atomic)
3. **No "WIP" or "fix" commits** - be descriptive
4. **Don't commit sensitive files** (.env, credentials)

## Post-Commit

After successful commit:

1. Mark the task complete:
   ```
   TaskUpdate taskId="X" status="completed"
   ```

2. Update state:
   ```bash
   python scripts/enforcement/vibe-cli.py set-step 15
   ```

## Gate

Commit is allowed only when:
- `tests_passed = true`
- `human_approved = true`

## Next Step

Advance to **Step 15: Loop or Merge**.

If more tasks remain → Return to Step 6
If all tasks complete → Create PR/Merge
