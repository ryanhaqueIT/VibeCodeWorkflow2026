#!/usr/bin/env python3
"""
VibeCode State Reload Hook

SessionStart hook that reloads workflow state and prints summary.
This ensures Claude always knows the current workflow position.
"""

import sys
import os
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from state_manager import get_manager
from config import CONTEXT_PACK_FILE


def main():
    manager = get_manager()

    # Update session start time
    manager.state["session"]["started_at"] = datetime.now().isoformat()

    # Check if context-pack.md actually exists
    if CONTEXT_PACK_FILE.exists():
        manager.set_context_pack_exists(True)

    manager.save()

    # Print state summary for Claude's context
    print(manager.get_state_summary())

    # Print guidance based on current step
    step = manager.get_current_step()
    step_info = manager.get_step_info(step)

    print(f"""
[CURRENT TASK] Step {step} - {step_info['name']}
   Gate: {step_info['gate']}
   Code editing: {'ALLOWED' if step_info['allows_code_edit'] else 'NOT ALLOWED'}

[TIP] Use TaskList to see all workflow tasks and their status.
""")

    sys.exit(0)


if __name__ == "__main__":
    main()
