#!/usr/bin/env python3
"""
VibeCode Current Step Injector

UserPromptSubmit hook that injects current workflow state into
every prompt, ensuring Claude never loses track of the current step.
"""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from state_manager import get_manager


def main():
    manager = get_manager()
    step = manager.get_current_step()
    step_info = manager.get_step_info(step)

    # Output a compact reminder that will be injected into context
    print(f"[VibeCode Step {step}: {step_info['name']}] Code edit: {'YES' if step_info['allows_code_edit'] else 'NO'}")

    sys.exit(0)


if __name__ == "__main__":
    main()
