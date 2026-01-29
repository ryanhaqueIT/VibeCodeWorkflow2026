"""
VibeCode Enforcement Configuration

Central configuration for all enforcement scripts.
"""

import os
from pathlib import Path

# Base paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
AGENT_DIR = PROJECT_ROOT / ".agent"
WORK_DIR = AGENT_DIR / "work"
WORKFLOWS_DIR = AGENT_DIR / "workflows"

# State files
STATE_FILE = WORK_DIR / "vibe-state.json"
HISTORY_FILE = WORK_DIR / "step-history.jsonl"
BACKUP_DIR = WORK_DIR / "backups"

# Workflow files
PLAN_FILE = WORKFLOWS_DIR / "vibe-plan.md"
CONTEXT_PACK_FILE = WORKFLOWS_DIR / "context-pack.md"

# Step definitions with validation requirements
STEPS = {
    0: {
        "name": "Problem Statement",
        "required_artifacts": [],
        "gate": "none",
        "allows_code_edit": False
    },
    1: {
        "name": "Discovery Q&A",
        "required_artifacts": [],
        "gate": "none",
        "allows_code_edit": False
    },
    2: {
        "name": "Write spec.md",
        "required_artifacts": ["spec.md"],
        "gate": "user_approval",
        "allows_code_edit": False
    },
    3: {
        "name": "Generate plan.md",
        "required_artifacts": ["plan.md"],
        "gate": "subagent_critique",
        "allows_code_edit": False
    },
    4: {
        "name": "Plan Critique",
        "required_artifacts": [],
        "gate": "none",
        "allows_code_edit": False
    },
    5: {
        "name": "Rules & Guardrails",
        "required_artifacts": ["rules.md"],
        "gate": "none",
        "allows_code_edit": False
    },
    6: {
        "name": "Select Bead/Task",
        "required_artifacts": [],
        "gate": "task_selected",
        "allows_code_edit": False
    },
    7: {
        "name": "Context Packing",
        "required_artifacts": ["context-pack.md"],
        "gate": "context_exists",
        "allows_code_edit": False
    },
    8: {
        "name": "Implementation",
        "required_artifacts": [],
        "gate": "context_pack_verified",
        "allows_code_edit": True  # First step that allows code edits
    },
    9: {
        "name": "Run Tests/Checks",
        "required_artifacts": [],
        "gate": "tests_pass",
        "allows_code_edit": True
    },
    10: {
        "name": "GREEN Check",
        "required_artifacts": [],
        "gate": "all_green",
        "allows_code_edit": True
    },
    11: {
        "name": "Debug Loop",
        "required_artifacts": [],
        "gate": "none",
        "allows_code_edit": True
    },
    12: {
        "name": "Human Review",
        "required_artifacts": [],
        "gate": "human_approval",
        "allows_code_edit": False
    },
    13: {
        "name": "Second Model Review",
        "required_artifacts": [],
        "gate": "none",
        "allows_code_edit": False
    },
    14: {
        "name": "Commit",
        "required_artifacts": [],
        "gate": "human_approval_verified",
        "allows_code_edit": False
    },
    15: {
        "name": "Loop or Merge",
        "required_artifacts": [],
        "gate": "none",
        "allows_code_edit": False
    }
}

# Temporal constraints (must happen before)
TEMPORAL_CONSTRAINTS = {
    "edit_code": {"min_step": 8, "requires": ["context_pack_exists"]},
    "commit": {"min_step": 14, "requires": ["tests_passed", "human_approved"]},
    "push": {"min_step": 15, "requires": ["committed"]},
    "implement": {"min_step": 8, "requires": ["context_pack_exists", "task_selected"]}
}

# Default state template
DEFAULT_STATE = {
    "current_step": 0,
    "current_bead_id": None,
    "problem_statement": "",
    "status": "initialized",
    "verification": {
        "tests_passed": False,
        "lint_passed": False,
        "last_check": None
    },
    "approvals": {
        "spec_md": False,
        "plan_md": False,
        "human_review": False
    },
    "context": {
        "context_pack_exists": False,
        "task_selected": False
    },
    "session": {
        "started_at": None,
        "last_activity": None,
        "context_percentage": 0
    },
    "history": []
}
