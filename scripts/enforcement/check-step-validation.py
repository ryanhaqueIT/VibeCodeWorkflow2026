#!/usr/bin/env python3
"""
VibeCode Step Validation Hook

PreToolUse hook that validates whether the current action is allowed
based on the workflow step and temporal constraints.

Exit codes:
  0 = Action allowed
  1 = Action blocked (hook prevents tool execution)
"""

import sys
import argparse
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from state_manager import get_manager


def main():
    parser = argparse.ArgumentParser(description="Validate VibeCode step constraints")
    parser.add_argument(
        "--action",
        choices=["edit", "commit", "push", "implement"],
        required=True,
        help="The action being validated"
    )
    args = parser.parse_args()

    manager = get_manager()

    # Dispatch to appropriate validation
    if args.action == "edit":
        allowed, reason = manager.can_edit_code()
    elif args.action == "commit":
        allowed, reason = manager.can_commit()
    elif args.action == "push":
        allowed, reason = manager.can_push()
    elif args.action == "implement":
        allowed, reason = manager.can_edit_code()
    else:
        allowed, reason = False, f"Unknown action: {args.action}"

    if allowed:
        # Action is allowed
        print(f"[OK] VibeCode: {args.action} allowed at Step {manager.get_current_step()}")
        sys.exit(0)
    else:
        # Action is blocked - print error and exit with code 1
        step = manager.get_current_step()
        step_info = manager.get_step_info(step)

        print(f"""
================================================================
           [BLOCKED] VIBECODE WORKFLOW GATE
================================================================
Action: {args.action}
Current Step: {step} - {step_info['name']}
----------------------------------------------------------------
REASON: {reason}
----------------------------------------------------------------
To proceed, complete the required workflow steps first.
Use TaskList to check current progress.
================================================================
""")
        sys.exit(1)


if __name__ == "__main__":
    main()
