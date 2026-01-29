# VibeCode Lifecycle Controller

> **This file is your OPERATING SYSTEM, not documentation.**
> It defines how you behave, not what the project does.

## 🎯 PRIMARY DIRECTIVE

You are executing the **VibeCode 18-Step Lifecycle**. You MUST follow these steps in order and NEVER skip gates.

## 📊 STATE AWARENESS

At the start of EVERY session, your state is loaded from `.agent/work/vibe-state.json`.

**Always know:**
1. Current step number (0-18)
2. Current bead/task ID
3. Gate requirements for current step
4. What actions are allowed

Use `TaskList` to see workflow progress at any time.

---

## 🚫 MANDATORY GATES (NEVER SKIP)

### Gate 1: No Code Before Step 11
```
IF current_step < 11:
    REFUSE to edit/write code files
    EXPLAIN: "Code editing requires Step 11 (Implementation). Current: Step {N}"
```

### Gate 2: PRD Approval Before Git Ingest
```
IF action == "git_ingest" AND NOT prd_approved:
    REFUSE to proceed
    EXPLAIN: "Step 3 (PRD Approval) must complete first"
    ASK: "Has the PRD been approved by stakeholders? (yes/no)"
```

### Gate 3: Repo Context Before ERD
```
IF action == "generate_erd" AND NOT (exists(".agent/workflows/repo-context.md") OR greenfield_project):
    REFUSE to proceed
    EXPLAIN: "Step 4 (Git Ingest) must complete first, or mark as greenfield project"
```

### Gate 4: ERD Before Plan
```
IF action == "generate_plan" AND NOT exists(".agent/workflows/erd.md"):
    REFUSE to proceed
    EXPLAIN: "Step 5 (Generate ERD) must complete first"
```

### Gate 5: Context Pack Before Implementation
```
IF action == "implement" AND NOT exists(".agent/workflows/context-pack.md"):
    REFUSE to proceed
    EXPLAIN: "Step 10 (Context Packing) must complete first"
```

### Gate 6: Tests Before Human Review
```
IF action == "request_review" AND NOT tests_passed:
    REFUSE to proceed
    EXPLAIN: "Step 12 (Verification) must pass before Step 15"
```

### Gate 7: Human Approval Before Commit
```
IF action == "git_commit" AND NOT human_approved:
    REFUSE to proceed
    EXPLAIN: "Step 15 (Human Review) approval required"
    ASK: "Do you understand and approve this code? (yes/no)"
```

---

## 📋 WORKFLOW STEPS QUICK REFERENCE

| Step | Name | Code Edit? | Gate | Artifact |
|------|------|------------|------|----------|
| 0 | Problem Statement | ❌ | None | - |
| 1 | Discovery Q&A | ❌ | None | - |
| 2 | Write PRD | ❌ | None | `prd.md` |
| 3 | PRD Approval Gate | ❌ | **Stakeholder "yes"** | approval record |
| 4 | Git Ingest & Repo Context | ❌ | PRD approved | `repo-context.md` |
| 5 | Generate ERD | ❌ | Repo context exists | `erd.md` |
| 6 | Generate plan.md | ❌ | ERD exists | `plan.md` |
| 7 | Plan Critique | ❌ | None | - |
| 8 | Rules/Guardrails | ❌ | None | - |
| 9 | Select Task | ❌ | Task selected | - |
| 10 | Context Packing | ❌ | context-pack.md exists | `context-pack.md` |
| 11 | **Implementation** | ✅ | Context verified | code files |
| 12 | Run Tests | ✅ | Tests pass | test results |
| 13 | GREEN Check | ✅ | All green | - |
| 14 | Debug Loop | ✅ | None | - |
| 15 | Human Review | ❌ | Human approval | - |
| 16 | Second Review | ❌ | None | - |
| 17 | Commit | ❌ | Approval verified | git commit |
| 18 | Loop/Merge | ❌ | None | - |

**Note**: ERD = Engineering Requirements Document (technical requirements derived from PRD)

---

## 🔄 STEP TRANSITIONS

### Advancing Steps
Use `TaskUpdate` to mark steps complete. The enforcement hooks will automatically sync state.

### Starting a New Task
```
1. TaskList → identify next pending task
2. TaskUpdate taskId status="in_progress"
3. State automatically advances to correct step
```

### Completing a Task
```
1. Verify gate requirements met
2. TaskUpdate taskId status="completed"
3. State automatically advances
```

---

## 📝 CONTEXT MANAGEMENT

### On Context > 70%
1. Save critical state: `python scripts/enforcement/save-state-before-compact.py`
2. Use `/compact` to compress context
3. State will be reloaded automatically

### Session Resume
State is automatically loaded at session start via hooks.

---

## ⚡ QUICK COMMANDS

| Command | Purpose |
|---------|---------|
| `TaskList` | See all workflow tasks |
| `python scripts/enforcement/vibe-cli.py status` | Full state summary |
| `python scripts/enforcement/vibe-cli.py set-step N` | Manual step override |
| `python scripts/enforcement/vibe-cli.py approve` | Grant human approval |
| `python scripts/enforcement/vibe-cli.py reset` | Reset workflow state |

---

## 🎯 BEHAVIORAL RULES

1. **Always announce your current step** before taking action
2. **Never edit code before Step 11** - even if user asks
3. **Never skip Git Ingest** - understand existing code before engineering requirements (unless greenfield)
4. **Never generate ERD before repo context** - you need to know what exists
5. **Never generate plan before ERD** - engineering requirements inform architecture
6. **Never commit before Step 17** - even if tests pass
7. **Always explain code changes** in business terms at Step 15
8. **Ask for explicit approval** before committing: "Do you understand and approve?"

---

## 🔧 ENFORCEMENT ARCHITECTURE

This workflow is enforced by hooks in `.claude/settings.local.json`:

- **SessionStart**: Loads state, prints summary
- **UserPromptSubmit**: Injects current step reminder
- **PreToolUse**: Validates gates before edit/commit/push
- **PostToolUse**: Syncs task completion to state
- **PreCompact**: Saves state backup
- **Stop**: Final state save

You cannot bypass these gates - they run automatically.
