# Spec: VibeCode Lifecycle Automation Skill

## Goal
Automate the 15-step VibeCode Lifecycle into a portable, high-context AI Skill that ensures disciplined development across different agent environments.

## Requirements

### R1: Portability
- The skill must be defined in a standard-compliant `SKILL.md` file.
- It must also support the Antigravity-native `.agent/workflows/` format.

### R2: Disciplined Planning
- **Step 1 (Discovery)**: Must be mandatory. The agent always generates a questionnaire to clarify the "Definition of Done".
- **Step 2 (Ingestion)**: Must perform a full-repo scrape via `gitingest` to build an "overall map" of the project.

### R3: State Management (Beads)
- The workflow state must be persisted in `.agent/work/vibe-state.json`.
- Task planning (Step 3) must use the **Beads Pattern**: structured tasks with IDs and dependencies in `.agent/workflows/vibe-plan.md`.

### R4: Context Packing
- Step 7 must use `gitingest` to provide a "full view" of the repository to the implementation agent.

## Architecture

### Components
1. **The Skill Controller (`SKILL.md`)**: The core prompt instructions that enforce the 15 steps.
2. **The Workflow Driver (`vibe-lifecycle.md`)**: The Antigravity-specific execution script.
3. **State Tracker (`vibe-state.json`)**: Persistent JSON for current step and history.
4. **Beads Engine (`vibe-plan.md`)**: The task queue with status and dependency tracking.

### Tool Integration
- **Context**: `gitingest` (CLI or MCP).
- **Communication**: Subagents (for critique and second reviews).
- **Persistence**: Filesystem (for beads and state).

## Test Strategy
1. **Workflow Traverse**: Verify that the agent proceeds from Step 0 to 15 without skipping steps.
2. **State Persistence**: Verify that restarting the agent allows it to resume from the last completed step in `vibe-state.json`.
3. **Beads Logic**: Verify that Step 6 correctly identifies the next task based on dependency completion in `vibe-plan.md`.
