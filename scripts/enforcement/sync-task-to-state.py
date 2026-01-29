#!/usr/bin/env python3
"""
VibeCode Task-to-State Sync Hook

PostToolUse hook for TaskUpdate that syncs Claude Code's native
Task system with VibeCode's workflow state.
"""

import sys
import os
import json
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from state_manager import get_manager


# Mapping of task subjects to workflow steps
TASK_TO_STEP = {
    "problem": 0,
    "discovery": 1,
    "spec": 2,
    "plan": 3,
    "critique": 4,
    "rules": 5,
    "select": 6,
    "context": 7,
    "implement": 8,
    "test": 9,
    "verify": 9,
    "green": 10,
    "debug": 11,
    "review": 12,
    "human": 12,
    "second": 13,
    "commit": 14,
    "loop": 15,
    "merge": 15,
}


def infer_step_from_task(task_subject: str) -> int:
    """Infer the workflow step from task subject."""
    subject_lower = task_subject.lower()

    for keyword, step in TASK_TO_STEP.items():
        if keyword in subject_lower:
            return step

    # Check for "Step N" pattern
    import re
    match = re.search(r'step\s*(\d+)', subject_lower)
    if match:
        return int(match.group(1))

    return -1  # Unknown


def main():
    manager = get_manager()

    # Read tool input from stdin
    try:
        tool_input = json.loads(sys.stdin.read())
        task_id = tool_input.get("taskId", "")
        new_status = tool_input.get("status", "")
        subject = tool_input.get("subject", "")
    except (json.JSONDecodeError, Exception):
        # Can't parse input, just exit
        sys.exit(0)

    # If task was completed, check if it advances the workflow
    if new_status == "completed":
        inferred_step = infer_step_from_task(subject)
        current_step = manager.get_current_step()

        if inferred_step > current_step:
            manager.set_current_step(inferred_step)
            print(f"[OK] VibeCode: Advanced to Step {inferred_step} based on task completion")

        # Handle specific step completions
        if inferred_step == 7:
            manager.set_context_pack_exists(True)
            print("[OK] Context pack marked as complete")
        elif inferred_step == 9:
            manager.set_tests_passed(True)
            print("[OK] Tests marked as passed")
        elif inferred_step == 12:
            manager.set_human_approval(True)
            print("[OK] Human review marked as approved")

    # If task started, mark it as selected
    elif new_status == "in_progress":
        manager.set_task_selected(True, bead_id=task_id)

        inferred_step = infer_step_from_task(subject)
        if inferred_step >= 0:
            manager.set_current_step(inferred_step)
            print(f"[OK] VibeCode: Now on Step {inferred_step}")

    manager.save()
    sys.exit(0)


if __name__ == "__main__":
    main()
