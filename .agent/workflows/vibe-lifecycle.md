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
- ALWAYS generate a mandatory questionnaire.
- **Action**: Intelligently request specific docs (Architecture, Logic, etc.) needed for absolute clarity based on the ask.
- Output: User-approved Requirements list + Constraints.

### Step 2: spec.md
// turbo
- Run `gitingest` to verify repo start state.
- **Primary Mode**: User provides `spec.md`. Agent role is to CRITIQUE and provide feedback/gap analysis.
- Consolidate into a finalized, user-approved `spec.md`.

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

### Step 11: Debug Loop
- If technical verification fails, use logs to debug. Return to Step 9.

---

## 3. Review & Deployment Phase

### Step 12: Human Review
- Present diffs and explain logic for human accountability.

### Step 13: Second Model Review
- (Optional) Spawn a second subagent with a different model to audit the changes.

### Step 14: Bead Completion & Commit
- **Action**: Run `bd close <id>` only after approval.
- **Action**: Run `.\scripts\sync-vibe.ps1 -BeadId <id> -Approved`.
- **Action**: Perform an atomic git commit.

### Step 15: Loop or Merge
- If tasks remain, return to Step 6. Otherwise, initiate PR/merge.
