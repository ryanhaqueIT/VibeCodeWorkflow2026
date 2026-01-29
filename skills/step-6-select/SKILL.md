---
name: vibecode-step-6-select
description: Step 6 - Select the next task/bead from the plan
category: workflow
---

# Step 6: Select Task

You are executing **Step 6** of the VibeCode Lifecycle.

## Objective

Select ONE small, focused task from the plan for this iteration.

## Process

1. **Read** the plan (`.agent/workflows/vibe-plan.md` or TaskList)
2. **Identify** the next available task:
   - Status = "pending" or "Ready"
   - All dependencies completed
   - Earliest ID preferred
3. **Declare** your selection
4. **Update** status to "in_progress"

## Commands

```bash
# Using Claude Code Tasks
TaskList  # See all tasks

# Select a task
TaskUpdate taskId="X" status="in_progress"
```

## Selection Criteria

| Priority | Criterion |
|----------|-----------|
| 1 | Dependencies complete |
| 2 | Smallest scope |
| 3 | Earliest ID |

## Announcement Template

```markdown
## Task Selection

I am now working on:

**Task ID**: [ID]
**Name**: [Task Name]
**Scope**: [What specifically will change]
**Done When**: [Definition of done]

Dependencies verified: ✓
```

## Gate

Task must be selected and marked "in_progress" before proceeding.

## Anti-Patterns

❌ Selecting multiple tasks at once
❌ Selecting tasks with incomplete dependencies
❌ Skipping to implementation without declaring selection

## Next Step

Advance to **Step 7: Context Packing**.
