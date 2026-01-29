---
description: Initialize and run the complete VibeCode 18-step workflow with automatic task tracking
allowed-tools: ["Read", "Write", "Bash", "Glob", "Grep", "TaskCreate", "TaskUpdate", "TaskList", "TaskGet", "Edit"]
---

# VibeCode Workflow - Complete Setup & Execution

You are now operating under the **VibeCode 18-Step Lifecycle**. This command sets everything up automatically using Claude Code's native Task system.

## Step 1: Load Your Operating Instructions

Read and internalize - this defines your behavior:

@CLAUDE.md

## Step 2: Create the Planning Phase Tasks

Create these tasks using TaskCreate with the exact structure below. Use the naming convention `[PLAN]` prefix and set up dependencies.

**IMPORTANT**: Create these tasks in order and note the IDs returned so you can set up blockedBy correctly.

### Task 1: Problem Statement
```
TaskCreate:
  subject: "[PLAN] Step 0: Problem Statement"
  description: "Capture the user's problem/request clearly. Ask clarifying questions to understand scope, constraints, and success criteria. NO code editing allowed."
  activeForm: "Capturing problem statement"
  metadata: { phase: "planning", step: 0, allowsCodeEdit: false }
```

### Task 2: Discovery Q&A
```
TaskCreate:
  subject: "[PLAN] Step 1: Discovery Q&A"
  description: "Ask discovery questions about requirements, edge cases, existing code, and constraints. NO code editing allowed."
  activeForm: "Gathering requirements"
  metadata: { phase: "planning", step: 1, allowsCodeEdit: false }
  blockedBy: [Task 1 ID]
```

### Task 3: Write PRD
```
TaskCreate:
  subject: "[PLAN] Step 2: Write PRD"
  description: "Write a Product Requirements Document (PRD) summarizing the product vision, user stories, acceptance criteria, and success metrics. Save as .agent/workflows/prd.md. NO code editing allowed."
  activeForm: "Writing PRD"
  metadata: { phase: "planning", step: 2, allowsCodeEdit: false, artifact: "prd.md" }
  blockedBy: [Task 2 ID]
```

### Task 4: PRD Approval Gate
```
TaskCreate:
  subject: "[PLAN] Step 3: PRD Approval Gate"
  description: "Get explicit approval on the PRD from stakeholders. Present the PRD summary and ask: 'Does this PRD accurately capture what we're building? (yes/no)'. Record approver names/roles. NO code editing allowed."
  activeForm: "Awaiting PRD approval"
  metadata: { phase: "planning", step: 3, allowsCodeEdit: false, gate: "prd_approval", approvers: [] }
  blockedBy: [Task 3 ID]
```

### Task 5: Git Ingest (Repo Context)
```
TaskCreate:
  subject: "[PLAN] Step 4: Git Ingest & Repo Context"
  description: "If a repo exists, analyze the codebase to understand existing architecture, patterns, and constraints. Use gitingest or similar to generate a comprehensive context summary. Document: (1) Directory structure, (2) Key files and their purposes, (3) Existing patterns/conventions, (4) Dependencies, (5) Integration points. Save as .agent/workflows/repo-context.md. Skip if greenfield project. NO code editing allowed."
  activeForm: "Ingesting repo context"
  metadata: { phase: "planning", step: 4, allowsCodeEdit: false, artifact: "repo-context.md", optional_if: "greenfield" }
  blockedBy: [Task 4 ID]
```

### Task 6: Generate ERD
```
TaskCreate:
  subject: "[PLAN] Step 5: Generate ERD"
  description: "Based on the approved PRD and repo context, generate the Engineering Requirements Document (ERD). Define: (1) Technical requirements derived from PRD, (2) System constraints and dependencies, (3) API contracts and interfaces, (4) Data models and schemas, (5) Non-functional requirements (performance, security, scalability). Save as .agent/workflows/erd.md. NO code editing allowed."
  activeForm: "Generating ERD"
  metadata: { phase: "planning", step: 5, allowsCodeEdit: false, artifact: "erd.md", requires: "prd_approval" }
  blockedBy: [Task 5 ID]
```

### Task 7: Generate Plan
```
TaskCreate:
  subject: "[PLAN] Step 6: Generate plan.md"
  description: "Based on the approved PRD, repo context, and ERD, create implementation plan breaking down work into features/tasks. Include task dependencies, data model considerations, and integration with existing code. Save as .agent/workflows/plan.md. NO code editing allowed."
  activeForm: "Generating implementation plan"
  metadata: { phase: "planning", step: 6, allowsCodeEdit: false, artifact: "plan.md" }
  blockedBy: [Task 6 ID]
```

### Task 8: Plan Critique
```
TaskCreate:
  subject: "[PLAN] Step 7: Plan Critique"
  description: "Critically review the plan against the PRD, repo context, and ERD. Identify risks, missing steps, edge cases. Verify alignment with existing codebase patterns. Revise if needed. NO code editing allowed."
  activeForm: "Critiquing plan"
  metadata: { phase: "planning", step: 7, allowsCodeEdit: false }
  blockedBy: [Task 7 ID]
```

### Task 9: Define Rules
```
TaskCreate:
  subject: "[PLAN] Step 8: Define Rules & Guardrails"
  description: "Define coding standards, patterns, and guardrails for implementation. Incorporate conventions discovered during repo context analysis. Include database conventions from ERD. NO code editing allowed."
  activeForm: "Defining coding rules"
  metadata: { phase: "planning", step: 8, allowsCodeEdit: false }
  blockedBy: [Task 8 ID]
```

## Step 3: After Planning - Create Feature Task Groups

Once planning is complete (all [PLAN] tasks done), create task groups for EACH feature from the plan using this template:

### Feature Task Group Template

For a feature named "User Authentication", create:

```
[AUTH] Context Pack
  description: "Create context-pack.md for User Authentication. Gather all relevant code, docs, requirements."
  metadata: { phase: "implementation", feature: "auth", step: "context-pack", allowsCodeEdit: false }
  blockedBy: [Last PLAN task ID]

[AUTH] Implement
  description: "Implement User Authentication. CODE EDITING NOW ALLOWED."
  metadata: { phase: "implementation", feature: "auth", step: "implement", allowsCodeEdit: true }
  blockedBy: [Context Pack ID]

[AUTH] Run Tests
  description: "Run tests for User Authentication. Verify functionality."
  metadata: { phase: "implementation", feature: "auth", step: "test", allowsCodeEdit: true }
  blockedBy: [Implement ID]

[AUTH] Debug (create only if tests fail)
  description: "Fix failing tests for User Authentication."
  metadata: { phase: "implementation", feature: "auth", step: "debug", allowsCodeEdit: true }
  blockedBy: [Run Tests ID]

[AUTH] Human Review
  description: "Explain User Authentication changes to user. Get EXPLICIT 'yes' approval."
  metadata: { phase: "review", feature: "auth", step: "review", allowsCodeEdit: false }
  blockedBy: [Run Tests or Debug ID]

[AUTH] Commit
  description: "Commit User Authentication. REQUIRES user approval confirmation."
  metadata: { phase: "review", feature: "auth", step: "commit", allowsCodeEdit: false }
  blockedBy: [Human Review ID]
```

## Step 4: Your Behavior Rules

### MANDATORY - Check Before Every Action

1. Run `TaskList` to see current state
2. Identify which task is `in_progress`
3. Check its `metadata.allowsCodeEdit` value
4. **REFUSE code editing if `allowsCodeEdit: false`**

### Gate Enforcement

| Task Type | Code Editing | Gate |
|-----------|--------------|------|
| `[PLAN] Step 0-1` | ❌ NEVER | None |
| `[PLAN] Step 2: PRD` | ❌ NEVER | None |
| `[PLAN] Step 3: PRD Approval` | ❌ NEVER | **Stakeholder "yes"** |
| `[PLAN] Step 4: Git Ingest` | ❌ NEVER | PRD approved (skip if greenfield) |
| `[PLAN] Step 5: ERD` | ❌ NEVER | Repo context gathered |
| `[PLAN] Step 6: Plan` | ❌ NEVER | ERD exists |
| `[PLAN] Step 7-8` | ❌ NEVER | None |
| `* Context Pack` | ❌ NO | Planning complete |
| `* Implement` | ✅ YES | Context pack exists |
| `* Run Tests` | ✅ YES | Implementation done |
| `* Debug` | ✅ YES | Tests ran |
| `* Human Review` | ❌ NO | Tests pass |
| `* Commit` | ❌ NO | User said "yes" |

### Workflow Commands

- **Check state**: `TaskList`
- **Start task**: `TaskUpdate taskId status="in_progress"`
- **Complete task**: `TaskUpdate taskId status="completed"`
- **See task details**: `TaskGet taskId`

## Step 5: Begin!

After creating the 9 planning tasks:

1. Set `[PLAN] Step 0: Problem Statement` to `in_progress`
2. Ask the user: **"What would you like to build or accomplish today?"**
3. Work through tasks respecting the `blockedBy` dependencies
4. **Critical Gate**: At Step 3, get explicit PRD approval before proceeding
5. **Context Gate**: At Step 4, ingest repo context (skip if greenfield project)
6. When planning completes, use `/add-feature <name>` to create implementation task groups

## Remember

- **Announce your current task** before every action
- **Check `TaskList` frequently** - it's your source of truth
- **PRD must be approved** before Git Ingest
- **Repo context must be gathered** before generating ERD (or marked as greenfield)
- **ERD must exist** before generating plan
- **Code editing is ONLY allowed** when `metadata.allowsCodeEdit: true`
- **Never commit without explicit "yes"** from user

---

You are now initialized. Create the 9 planning tasks and begin at Step 0.
