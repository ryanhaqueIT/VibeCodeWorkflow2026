---
name: vibecode-step-0-problem
description: Step 0 - Define the problem statement and boundaries
category: workflow
---

# Step 0: Problem Statement

You are executing **Step 0** of the VibeCode Lifecycle.

## Objective

Define a clear, bounded problem statement in 1-3 sentences.

## Process

1. **Listen** to the user's initial idea or request
2. **Clarify** the core problem (not the solution)
3. **Bound** the scope explicitly
4. **Output** a problem statement

## Template

```markdown
## Problem Statement

**Problem**: [What is broken, missing, or needs improvement?]

**Boundary**: [What is explicitly OUT of scope?]

**Success**: [How will we know when this is solved?]
```

## Example

```markdown
## Problem Statement

**Problem**: Users cannot filter search results by date range, causing them to manually scroll through hundreds of irrelevant results.

**Boundary**: This does not include full-text search improvements or pagination changes.

**Success**: Users can specify a date range and see only results within that range.
```

## Gate

No formal gate. Proceed to Step 1 when problem statement is clear.

## Next Step

After completing, advance to **Step 1: Discovery Q&A**.

```
TaskUpdate: status="completed" → Step 0
TaskUpdate: status="in_progress" → Step 1
```
