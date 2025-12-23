---
description: VibeCode Lifecycle Workflow - A 15-step automated process for deep context-aware coding.
---

# VibeCode Lifecycle Workflow

This workflow automates the 15-step VibeCode Lifecycle. It integrates Steve Yegge's `beads` for state management and `gitingest` for high-context ingestion.

## Core Setup
1. **Beads (`beads`)**: Use for workflow tracking in `.agent/workflows`. State is stored in `.agent/work/vibe-state.json`.
2. **GitIngest**: Use for repo-wide context gathering during Planning and Execution.

---

## 1. Planning & Definition Phase

### Step 0: Problem Statement
- Define the core problem in 1-3 sentences.
- Ensure boundaries are clear before proceeding.

### Step 1: Discovery
- ALWAYS generate a mandatory questionnaire to clarify requirements and edge cases.
- Output: Requirements list + edge cases.


### Step 2: spec.md
// turbo
- Run `gitingest` to study the repository.
- Consolidate requirements, architecture, and test strategy into `spec.md`.

### Step 3: Beads Plan (`bd create`)
- Use the codebase context to generate a structured plan.
- **Action**: For each task, run `bd create "[ID]: [Title]" -p 0`.
- **Action**: Link dependencies with `bd dep add <child> <parent>`.

### Step 4: Critique
- Spawn a subagent to critique the bead sequence for risks and gaps.

### Step 5: Rules & Guardrails
- Ensure `rules.md` (or equivalent) exists with project conventions.

---

## 2. Execution Phase (Step N)

### Step 6: Select Bead
- Run `bd ready` and select the next available task.
- **Action**: Run `bd update <id> --status in_progress`.

### Step 7: Context Packing
// turbo
- ALWAYS perform a full repo scrape via `gitingest` to provide an overall view.
- List all files and their roles.

### Step 8: Implementation
- Implement changes for the selected bead only.

### Step 9: Verification
- Run tests and checks. Iterate until the bead's DOD is met.

### Step 10: Bead Completion
- **Action**: Run `bd close <id>`.
- Update state in `.agent/work/vibe-state.json`.

---

## 3. Review & Deployment Phase

### Step 12: Human Review
- Present diffs and explain logic for human accountability.

### Step 13: Second Model Review
- (Optional) Spawn a second subagent with a different model to audit the changes.

### Step 14: Atomic Commit
- Perform an atomic git commit with a structured message.

### Step 15: Loop or Merge
- If tasks remain, return to Step 6. Otherwise, initiate PR/merge.
