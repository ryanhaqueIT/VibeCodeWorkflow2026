# VibeCode Enforcement System

> How we prevent Claude from forgetting steps or skipping gates.

---

## The Problem

When working with Claude Code on long tasks:

1. **Claude forgets what step it's on** - After many messages, it loses track
2. **Claude skips important steps** - Jumps to coding without planning
3. **Sessions reset** - New chat = blank slate

---

## The Solution: 4 Layers of Protection

### Layer 1: The Rule Book (`CLAUDE.md`)

Claude reads this file at session start. It contains mandatory rules:
- "Cannot edit code until Step 8"
- "Cannot commit until human approves"

**Why it works**: High priority in Claude's attention - doesn't get forgotten easily.

---

### Layer 2: The Memory File (`.agent/work/vibe-state.json`)

```json
{
  "current_step": 7,
  "tests_passed": false,
  "human_approved": false
}
```

Remembers: current step, test status, approval status.

**Why it works**: File persists even when Claude's memory compacts.

---

### Layer 3: Automatic Triggers (Hooks)

Hooks in `.claude/settings.local.json` run automatically:

| Trigger | What Happens |
|---------|--------------|
| Session starts | Load memory file, show current step |
| You send a message | Add "[Step N]" reminder |
| Claude tries to edit | Check: step ≥ 8? If no → **BLOCK** |
| Claude tries to commit | Check: human approved? If no → **BLOCK** |
| Context compacts | Save backup of memory file |
| Session ends | Save final state |

**Why it works**: Runs every time - Claude can't skip them.

---

### Layer 4: The Blocker Scripts

When Claude tries something it shouldn't:

```
╔══════════════════════════════════════════════════════════════╗
║              ⚠️  VIBECODE WORKFLOW GATE BLOCKED               ║
║ REASON: Code editing requires Step 8+. Current: Step 3       ║
╚══════════════════════════════════════════════════════════════╝
```

Script exits with error code → Claude Code stops the action.

**Why it works**: Hard block, not a suggestion.

---

## Files Created

```
VibeCodeWorkflow2026/
├── .claude/
│   └── settings.local.json     # Hook definitions
├── .agent/
│   └── work/
│       └── vibe-state.json     # Persistent state
├── scripts/
│   └── enforcement/
│       ├── config.py           # Step definitions
│       ├── state_manager.py    # State read/write logic
│       ├── vibe-cli.py         # Manual CLI commands
│       ├── check-step-validation.py    # Gate checker
│       ├── reload-state.py     # Session start loader
│       ├── save-state-before-compact.py
│       ├── inject-current-step.py
│       ├── post-edit-verification.py
│       ├── sync-task-to-state.py
│       └── save-session-state.py
└── CLAUDE.md                   # Orchestration rules
```

---

## CLI Commands

```bash
# Show current state
python scripts/enforcement/vibe-cli.py status

# Set step (0-15)
python scripts/enforcement/vibe-cli.py set-step 8

# Grant human approval
python scripts/enforcement/vibe-cli.py approve

# Mark tests passed
python scripts/enforcement/vibe-cli.py tests-pass

# Mark context pack complete
python scripts/enforcement/vibe-cli.py context-pack

# Reset to initial state
python scripts/enforcement/vibe-cli.py reset
```

---

## The 4 Gates

| Gate | Blocks | Until |
|------|--------|-------|
| **Gate 1** | Code editing | Step ≥ 8 |
| **Gate 2** | Implementation | context-pack.md exists |
| **Gate 3** | Commit | Tests passed |
| **Gate 4** | Commit | Human approved |

---

## Flow Diagram

```
Session Start
    ↓
[Hook: Load vibe-state.json] → Claude knows current step
    ↓
You Send Message
    ↓
[Hook: Inject step reminder] → "[VibeCode Step 7]"
    ↓
Claude Tries Action
    ↓
[Hook: Check gates] → BLOCK or ALLOW
    ↓
If Allowed → Action proceeds
If Blocked → Error message, action stopped
```

---

## Key Insight

**Prompts are suggestions. Hooks are guarantees.**

| Before | After |
|--------|-------|
| "Remember to run tests" → might forget | Hook blocks commit if tests haven't passed |
| "Don't code yet" → might ignore | Hook blocks Edit/Write before Step 8 |

---

## Troubleshooting

**State seems wrong?**
```bash
python scripts/enforcement/vibe-cli.py status
python scripts/enforcement/vibe-cli.py set-step N
```

**Hooks not running?**
Check `.claude/settings.local.json` exists and has hook definitions.

**State lost after compaction?**
```bash
ls .agent/work/backups/
cp .agent/work/backups/vibe-state_TIMESTAMP.json .agent/work/vibe-state.json
```
