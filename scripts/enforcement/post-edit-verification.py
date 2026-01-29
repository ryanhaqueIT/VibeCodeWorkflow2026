#!/usr/bin/env python3
"""
VibeCode Post-Edit Verification Hook

PostToolUse hook that runs after code edits to:
1. Log the edit in history
2. Reset test verification status (tests need to be re-run)
3. Remind about verification requirements
"""

import sys
import os
import json
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from state_manager import get_manager


def main():
    manager = get_manager()

    # Read tool input from stdin (Claude Code passes this as JSON)
    try:
        tool_input = json.loads(sys.stdin.read())
        file_path = tool_input.get("file_path", "unknown")
    except (json.JSONDecodeError, Exception):
        file_path = "unknown"

    # Reset test verification since code changed
    if manager.state.get("verification", {}).get("tests_passed", False):
        manager.set_tests_passed(False)
        print(f"[WARNING] Tests invalidated by code edit. Must re-run verification (Step 9).")

    # Log the edit
    manager._log_history(f"Code edited: {file_path}")
    manager.save()

    # Remind about verification if in implementation phase
    step = manager.get_current_step()
    if step in [8, 9, 10, 11]:
        print("""
[EDIT RECORDED] Remember:
   - Step 9: Run tests/checks to verify changes
   - Step 10: All tests must pass before human review
   - Step 12: Human must understand and approve code
""")

    sys.exit(0)


if __name__ == "__main__":
    main()
