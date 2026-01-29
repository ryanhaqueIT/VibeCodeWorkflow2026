#!/usr/bin/env python3
"""
VibeCode CLI

Command-line interface for manually managing VibeCode workflow state.
Use this for debugging, testing, or manual overrides.

Usage:
    python vibe-cli.py status          # Show current state
    python vibe-cli.py set-step N      # Set current step to N
    python vibe-cli.py approve         # Grant human approval
    python vibe-cli.py revoke          # Revoke human approval
    python vibe-cli.py tests-pass      # Mark tests as passed
    python vibe-cli.py tests-fail      # Mark tests as failed
    python vibe-cli.py context-pack    # Mark context pack as complete
    python vibe-cli.py select-task ID  # Select task/bead by ID
    python vibe-cli.py reset           # Reset to initial state
    python vibe-cli.py backup          # Create manual backup
"""

import sys
import os
import argparse

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from state_manager import get_manager
from config import DEFAULT_STATE


def cmd_status(args):
    """Show current workflow state."""
    manager = get_manager()
    print(manager.get_state_summary())

    # Show recent history
    history = manager.state.get("history", [])[-5:]
    if history:
        print("\n[Recent History]")
        for entry in history:
            ts = entry.get("timestamp", "")[:19]
            msg = entry.get("message", "")
            print(f"   {ts} | {msg}")


def cmd_set_step(args):
    """Set current workflow step."""
    manager = get_manager()
    try:
        step = int(args.step)
        if 0 <= step <= 15:
            manager.set_current_step(step)
            print(f"[OK] Step set to {step}")
            print(manager.get_state_summary())
        else:
            print("[ERROR] Step must be between 0 and 15")
            sys.exit(1)
    except ValueError:
        print("[ERROR] Invalid step number")
        sys.exit(1)


def cmd_approve(args):
    """Grant human approval."""
    manager = get_manager()
    manager.set_human_approval(True)
    print("[OK] Human approval granted")


def cmd_revoke(args):
    """Revoke human approval."""
    manager = get_manager()
    manager.set_human_approval(False)
    print("[OK] Human approval revoked")


def cmd_tests_pass(args):
    """Mark tests as passed."""
    manager = get_manager()
    manager.set_tests_passed(True)
    print("[OK] Tests marked as passed")


def cmd_tests_fail(args):
    """Mark tests as failed."""
    manager = get_manager()
    manager.set_tests_passed(False)
    print("[OK] Tests marked as failed")


def cmd_context_pack(args):
    """Mark context pack as complete."""
    manager = get_manager()
    manager.set_context_pack_exists(True)
    print("[OK] Context pack marked as complete")


def cmd_select_task(args):
    """Select a task/bead."""
    manager = get_manager()
    manager.set_task_selected(True, bead_id=args.task_id)
    print(f"[OK] Task {args.task_id} selected")


def cmd_reset(args):
    """Reset workflow state to initial."""
    manager = get_manager()

    # Backup first
    backup = manager.backup(reason="pre_reset")
    print(f"[BACKUP] Created: {backup}")

    # Reset state
    manager.state = DEFAULT_STATE.copy()
    manager.save()
    print("[OK] Workflow state reset to initial")


def cmd_backup(args):
    """Create manual backup."""
    manager = get_manager()
    backup = manager.backup(reason="manual")
    print(f"[OK] Backup created: {backup}")


def main():
    parser = argparse.ArgumentParser(
        description="VibeCode Workflow CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # status
    subparsers.add_parser("status", help="Show current state")

    # set-step
    sp = subparsers.add_parser("set-step", help="Set current step")
    sp.add_argument("step", help="Step number (0-15)")

    # approve/revoke
    subparsers.add_parser("approve", help="Grant human approval")
    subparsers.add_parser("revoke", help="Revoke human approval")

    # tests
    subparsers.add_parser("tests-pass", help="Mark tests as passed")
    subparsers.add_parser("tests-fail", help="Mark tests as failed")

    # context-pack
    subparsers.add_parser("context-pack", help="Mark context pack complete")

    # select-task
    sp = subparsers.add_parser("select-task", help="Select a task/bead")
    sp.add_argument("task_id", help="Task/bead ID")

    # reset
    subparsers.add_parser("reset", help="Reset workflow state")

    # backup
    subparsers.add_parser("backup", help="Create manual backup")

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
        sys.exit(1)

    # Dispatch to command handlers
    commands = {
        "status": cmd_status,
        "set-step": cmd_set_step,
        "approve": cmd_approve,
        "revoke": cmd_revoke,
        "tests-pass": cmd_tests_pass,
        "tests-fail": cmd_tests_fail,
        "context-pack": cmd_context_pack,
        "select-task": cmd_select_task,
        "reset": cmd_reset,
        "backup": cmd_backup,
    }

    handler = commands.get(args.command)
    if handler:
        handler(args)
    else:
        print(f"Unknown command: {args.command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
