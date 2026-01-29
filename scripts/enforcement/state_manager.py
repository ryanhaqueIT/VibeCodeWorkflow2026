"""
VibeCode State Manager

Handles reading, writing, and validating workflow state.
"""
from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple
import shutil

from config import (
    STATE_FILE, HISTORY_FILE, BACKUP_DIR, DEFAULT_STATE,
    STEPS, TEMPORAL_CONSTRAINTS, CONTEXT_PACK_FILE
)


class StateManager:
    """Manages persistent workflow state for VibeCode Lifecycle."""

    def __init__(self):
        self._ensure_directories()
        self.state = self._load_state()

    def _ensure_directories(self):
        """Create necessary directories if they don't exist."""
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    def _load_state(self) -> dict:
        """Load state from file or create default."""
        if STATE_FILE.exists():
            try:
                with open(STATE_FILE, 'r') as f:
                    state = json.load(f)
                # Merge with defaults to handle new fields
                merged = {**DEFAULT_STATE, **state}
                return merged
            except json.JSONDecodeError:
                return DEFAULT_STATE.copy()
        return DEFAULT_STATE.copy()

    def save(self):
        """Save current state to file."""
        self.state["session"]["last_activity"] = datetime.now().isoformat()
        with open(STATE_FILE, 'w') as f:
            json.dump(self.state, f, indent=2)

    def backup(self, reason: str = "manual"):
        """Create a backup of current state."""
        if STATE_FILE.exists():
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = BACKUP_DIR / f"vibe-state_{timestamp}_{reason}.json"
            shutil.copy(STATE_FILE, backup_path)
            return backup_path
        return None

    def get_current_step(self) -> int:
        """Get the current workflow step."""
        return self.state.get("current_step", 0)

    def set_current_step(self, step: int):
        """Set the current workflow step."""
        if 0 <= step <= 15:
            old_step = self.state.get("current_step", 0)
            self.state["current_step"] = step
            self._log_history(f"Step changed: {old_step} -> {step}")
            self.save()

    def get_step_info(self, step: Optional[int] = None) -> dict:
        """Get information about a specific step."""
        step = step if step is not None else self.get_current_step()
        return STEPS.get(step, STEPS[0])

    def can_edit_code(self) -> tuple[bool, str]:
        """Check if code editing is allowed in current step."""
        step = self.get_current_step()
        step_info = self.get_step_info(step)

        if not step_info.get("allows_code_edit", False):
            return False, f"Step {step} ({step_info['name']}) does not allow code editing. Must be Step 8+ (Implementation)."

        # Check temporal constraints
        constraints = TEMPORAL_CONSTRAINTS.get("edit_code", {})
        min_step = constraints.get("min_step", 0)

        if step < min_step:
            return False, f"Code editing requires Step {min_step}+. Current: Step {step}"

        # Check required conditions
        for requirement in constraints.get("requires", []):
            if requirement == "context_pack_exists":
                if not self.state.get("context", {}).get("context_pack_exists", False):
                    # Also check if file actually exists
                    if not CONTEXT_PACK_FILE.exists():
                        return False, "context-pack.md must exist before code editing (Step 7)"

        return True, "OK"

    def can_commit(self) -> tuple[bool, str]:
        """Check if committing is allowed."""
        step = self.get_current_step()

        constraints = TEMPORAL_CONSTRAINTS.get("commit", {})
        min_step = constraints.get("min_step", 14)

        if step < min_step:
            return False, f"Commit requires Step {min_step}+. Current: Step {step}"

        # Check tests passed
        if not self.state.get("verification", {}).get("tests_passed", False):
            return False, "Tests must pass before commit (Step 9)"

        # Check human approval
        if not self.state.get("approvals", {}).get("human_review", False):
            return False, "Human review approval required before commit (Step 12)"

        return True, "OK"

    def can_push(self) -> tuple[bool, str]:
        """Check if pushing is allowed."""
        step = self.get_current_step()

        constraints = TEMPORAL_CONSTRAINTS.get("push", {})
        min_step = constraints.get("min_step", 15)

        if step < min_step:
            return False, f"Push requires Step {min_step}. Current: Step {step}"

        return True, "OK"

    def set_tests_passed(self, passed: bool):
        """Update test verification status."""
        if "verification" not in self.state:
            self.state["verification"] = {}
        self.state["verification"]["tests_passed"] = passed
        self.state["verification"]["last_check"] = datetime.now().isoformat()
        self.save()

    def set_human_approval(self, approved: bool):
        """Update human review approval status."""
        if "approvals" not in self.state:
            self.state["approvals"] = {}
        self.state["approvals"]["human_review"] = approved
        self._log_history(f"Human approval: {'granted' if approved else 'revoked'}")
        self.save()

    def set_context_pack_exists(self, exists: bool):
        """Update context pack existence status."""
        if "context" not in self.state:
            self.state["context"] = {}
        self.state["context"]["context_pack_exists"] = exists
        self.save()

    def set_task_selected(self, selected: bool, bead_id: Optional[str] = None):
        """Update task selection status."""
        if "context" not in self.state:
            self.state["context"] = {}
        self.state["context"]["task_selected"] = selected
        if bead_id:
            self.state["current_bead_id"] = bead_id
        self.save()

    def _log_history(self, message: str):
        """Add entry to history."""
        if "history" not in self.state:
            self.state["history"] = []

        entry = {
            "timestamp": datetime.now().isoformat(),
            "message": message
        }
        self.state["history"].append(entry)

        # Also append to JSONL file for durability
        with open(HISTORY_FILE, 'a') as f:
            f.write(json.dumps(entry) + "\n")

    def get_state_summary(self) -> str:
        """Get a human-readable state summary."""
        step = self.get_current_step()
        step_info = self.get_step_info(step)

        ctx_pack = "YES" if self.state.get('context', {}).get('context_pack_exists') else "NO"
        tests = "YES" if self.state.get('verification', {}).get('tests_passed') else "NO"
        approval = "YES" if self.state.get('approvals', {}).get('human_review') else "NO"
        code_edit = "YES" if step >= 8 else "NO"

        summary = f"""
================================================================
                  VIBECODE WORKFLOW STATE
================================================================
Current Step: {step} - {step_info['name']}
Bead ID: {self.state.get('current_bead_id', 'None')}
----------------------------------------------------------------
GATES:
  - Context Pack:     {ctx_pack}
  - Tests Passed:     {tests}
  - Human Approval:   {approval}
  - Code Edit Allowed: {code_edit}
----------------------------------------------------------------
Problem: {self.state.get('problem_statement', 'Not defined')[:50]}
================================================================
"""
        return summary


# Singleton instance
_manager: Optional[StateManager] = None

def get_manager() -> StateManager:
    """Get or create the singleton StateManager instance."""
    global _manager
    if _manager is None:
        _manager = StateManager()
    return _manager
