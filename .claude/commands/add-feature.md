---
description: Add a new feature task group with all sub-tasks (context-pack, implement, test, review, commit)
allowed-tools: ["TaskCreate", "TaskUpdate", "TaskList"]
---

# Add Feature Task Group

Create a complete task group for implementing feature: **$ARGUMENTS**

## Task Structure to Create

Using TaskCreate, create these tasks with dependencies:

1. **$ARGUMENTS - Context Pack**
   - Description: Create context-pack.md for "$ARGUMENTS". Gather all relevant code, docs, and requirements.
   - activeForm: "Context packing for $ARGUMENTS"
   - blockedBy: [ID of last planning task or previous feature's commit task]

2. **$ARGUMENTS - Implement**
   - Description: Implement "$ARGUMENTS". Code editing is NOW ALLOWED for this task.
   - activeForm: "Implementing $ARGUMENTS"
   - blockedBy: [Context Pack task ID]

3. **$ARGUMENTS - Run Tests**
   - Description: Run tests for "$ARGUMENTS". Verify all functionality works.
   - activeForm: "Testing $ARGUMENTS"
   - blockedBy: [Implement task ID]

4. **$ARGUMENTS - Debug** (optional, create if tests fail)
   - Description: Debug and fix failing tests for "$ARGUMENTS".
   - activeForm: "Debugging $ARGUMENTS"
   - blockedBy: [Run Tests task ID]

5. **$ARGUMENTS - Human Review**
   - Description: Explain "$ARGUMENTS" changes to user. Get explicit approval.
   - activeForm: "Reviewing $ARGUMENTS with user"
   - blockedBy: [Run Tests or Debug task ID]

6. **$ARGUMENTS - Commit**
   - Description: Commit "$ARGUMENTS" changes. REQUIRES user saying "yes" to approval.
   - activeForm: "Committing $ARGUMENTS"
   - blockedBy: [Human Review task ID]

## After Creating

1. Use `TaskList` to verify the tasks were created with correct dependencies
2. Report the task group structure to the user
3. If this is the first feature, set "Context Pack" to in_progress
