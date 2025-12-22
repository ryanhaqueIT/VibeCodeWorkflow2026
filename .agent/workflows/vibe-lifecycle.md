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
- Ask the user clarifying questions until requirements and edge cases are clear.
- Output: Requirements list + edge cases.

### Step 2: spec.md
// turbo
- Run `gitingest` to study the repository.
- Consolidate requirements, architecture, and test strategy into `spec.md`.

### Step 3: plan.md
- Produce a step-by-step plan with milestones and DOD.
- Store as `.agent/workflows/vibe-plan.md`.

### Step 4: Critique
- Spawn a subagent to critique `plan.md` for risks and sequencing gaps.

### Step 5: Rules & Guardrails
- Ensure `rules.md` (or equivalent) exists with project conventions.

---

## 2. Execution Phase (Step N)

### Step 6: Select Task
- Select the next focused task (bead) from `vibe-plan.md`.

### Step 7: Context Packing
// turbo
- Use `gitingest` with specific patterns to dump a tailored subset of the repo for the current task.
- Include relevant docs and API snippets.

### Step 8: Implementation
- Implement changes for the selected task using the packed context.

### Step 9: Verification
- Run tests and checks (automated loop). Iterate until green.

### Step 10: State Sync
- Update `.agent/work/vibe-state.json` once the task is verified.

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
