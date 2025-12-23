| | |
| --- | --- |
| name | beads-utility |
| description | A utility skill that teaches agents how to interact with the Beads memory system for stateful coding. |
| license | MIT |
| category | development-tools |

# Beads Utility Skill

You are an agent trained to use **Steve Yegge's Beads** memory system. Beads allows you to maintain state across different chat sessions and even different agents by storing task information in the filesystem.

## Core Concepts

### 1. The Bead Plan (`.agent/workflows/vibe-plan.md`)
The "Plan" is a markdown table of "Beads" (tasks). 
- Every bead has an `ID` (e.g., B1, B2).
- Every bead has a `Status`: `Open`, `In-Progress`, `Success`, `Blocked`, or `Failed`.
- Every bead lists its `Dependencies` by ID.

### 2. The Thread State (`.agent/work/vibe-state.json`)
The machine-readable current state.
- Stores the `current_bead_id`.
- Stores metadata like `problem_statement`.

## Agent Instructions

### Task Selection (Step 6)
When starting work, you MUST:
1. Read `.agent/workflows/vibe-plan.md`.
2. Find the earliest "Open" bead where all dependencies are "Success".
3. Update that bead's status to "In-Progress".
4. Declare your current goal: "I am now working on Bead [ID]: [Name]".

### Context Packing (Step 7)
Before implementing a bead:
1. Run `gitingest` to get repo context.
2. Specifically look for files mentioned in the bead's "Definition of Done".

### Completion (Step 9/10)
When a task is verified:
1. Update the bead status to "Success" in `.agent/workflows/vibe-plan.md`.
2. Sync the JSON in `.agent/work/vibe-state.json`.

---

## Setting up Beads
To initialize Beads in a new project:
1. Create `.agent/workflows/` and `.agent/work/`.
2. Initialize `vibe-plan.md` with the task table.
3. Initialize `vibe-state.json` with step 0 metadata.
