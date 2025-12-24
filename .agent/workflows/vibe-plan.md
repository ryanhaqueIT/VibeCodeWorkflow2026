# Beads Plan: VibeCode Lifecycle Automation

This plan tracks the implementation of the automated VibeCode Skill.

| ID | Task Name | Status | Dependencies | Definition of Done |
| :--- | :--- | :--- | :--- | :--- |
| eia | B1: Infrastructure Setup | Success | - | .agent/work and state.json initialized. |
| jqp | B2: Utility Skills | Success | B1 | BEADS_UTILITY_SKILL.md created. |
| bw1 | B3: Meta-Skill Step 2 | Success | B2 | SKILL.md updated with full-scrape logic. |
| 8de | B4: State Sync Logic | Ready | B3 | vibe-lifecycle.md handles status updates. |
| 8m7 | B5: Context Packing Step 7| Blocked | B4 | SKILL.md handles per-task context. |
| oiu | B6: Robustness/Recovery | Blocked | B5 | Lockfile or backup for vibe-state.json. |
| 2qb | B7: Distribution Bundle | Blocked | B6 | Skill folders zipped and README updated. |

---

## Thread State
- **Problem**: Automate the VibeCode Lifecycle as a portable Skill.
- **Current Bead**: 8de (B4)
- **Official Engine**: bd CLI (installed via Go)

---

# Beads Plan: Wonderlog Clone + Parallel Beads Runner

This plan tracks the Wanderlog trip plan replica and parallel bead execution tooling.

| ID | Task Name | Status | Dependencies | Definition of Done |
| :--- | :--- | :--- | :--- | :--- |
| oie | MCP Setup (Exa + Playwright) | In Progress | - | `codex mcp list` shows `exa` and `playwright` enabled and configured. |
| v06 | UI/UX Spec Capture | Ready | oie | UI/UX spec doc exists with component inventory + layout notes. |
| byy | App Scaffold | Ready | v06 | New app folder exists with initial structural layout. |
| 0cn | Parallel Beads Runner (Maestro) | Ready | v06 | Skill updates + runner/server design implemented. |

---

## Thread State (Wonderlog Clone)
- **Problem**: Create a structural replica of the Wanderlog trip plan UI and evolve skills to run beads in parallel.
- **Current Bead**: oie
- **Official Engine**: bd CLI (installed via Go)
