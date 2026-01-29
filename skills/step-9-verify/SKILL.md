---
name: vibecode-step-9-verify
description: Step 9 - Run tests and verification checks
category: workflow
---

# Step 9: Verification

You are executing **Step 9** of the VibeCode Lifecycle.

## Objective

Run all verification gates to ensure code changes are correct.

## Verification Checklist

### 1. Type Checking
```bash
# TypeScript
npx tsc --noEmit

# Python
mypy .
```

### 2. Linting
```bash
# TypeScript/JavaScript
npx eslint . --fix

# Python
ruff check . --fix
```

### 3. Unit Tests
```bash
# JavaScript/TypeScript
npm test
# or
pnpm test

# Python
pytest tests/
```

### 4. Build Verification
```bash
# Ensure project builds
npm run build
# or
python -m py_compile your_file.py
```

## Process

1. **Run** each verification in order
2. **Fix** any failures immediately (Step 11 loop)
3. **Re-run** until all pass
4. **Mark** tests as passed

## Marking Tests Passed

When all checks pass:

```bash
python scripts/enforcement/vibe-cli.py tests-pass
```

Or use TaskUpdate to complete a "verification" task.

## Gate

ALL verification must pass before Step 10 (GREEN check).

| Check | Status |
|-------|--------|
| Type check | ✓ / ✗ |
| Lint | ✓ / ✗ |
| Unit tests | ✓ / ✗ |
| Build | ✓ / ✗ |

## If Verification Fails

Go to **Step 11: Debug Loop**

1. Read the error message
2. Identify the root cause
3. Fix the code
4. Return to Step 9

## Explaining Verification

You MUST explain what was tested and why it proves correctness:

```markdown
## Verification Summary

**Type Check**: ✓ Passed
- Verified all function signatures match expected types

**Lint**: ✓ Passed (2 auto-fixed)
- Fixed: unused import, trailing whitespace

**Tests**: ✓ 12 passed, 0 failed
- `test_feature_x`: Verifies the new filter works
- `test_edge_case_y`: Confirms empty input handling

**Build**: ✓ Successful
- Production bundle generated without errors
```

## Next Step

When all green, advance to **Step 10: GREEN Check** → **Step 12: Human Review**.
