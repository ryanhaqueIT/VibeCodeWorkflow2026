import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execFileAsync = promisify(execFile);

// Maximum buffer size for command output (10MB)
const EXEC_MAX_BUFFER = 10 * 1024 * 1024;

export interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Determine if a command needs shell execution on Windows
 * - Batch files (.cmd, .bat) always need shell
 * - Commands without extensions need PATHEXT resolution via shell
 * - Executables (.exe, .com) can run directly
 */
function needsWindowsShell(command: string): boolean {
  const lowerCommand = command.toLowerCase();

  // Batch files always need shell
  if (lowerCommand.endsWith('.cmd') || lowerCommand.endsWith('.bat')) {
    return true;
  }

  // Known executables don't need shell
  if (lowerCommand.endsWith('.exe') || lowerCommand.endsWith('.com')) {
    return false;
  }

  // Commands without extension need shell for PATHEXT resolution
  const hasExtension = path.extname(command).length > 0;
  return !hasExtension;
}

/**
 * Safely execute a command without shell injection vulnerabilities
 * Uses execFile instead of exec to prevent shell interpretation
 *
 * On Windows, batch files and commands without extensions are handled
 * by enabling shell mode, since execFile cannot directly execute them.
 */
export async function execFileNoThrow(
  command: string,
  args: string[] = [],
  cwd?: string,
  env?: NodeJS.ProcessEnv
): Promise<ExecResult> {
  try {
    // On Windows, some commands need shell execution
    // This is safe because we're executing a specific file path, not user input
    const isWindows = process.platform === 'win32';
    const useShell = isWindows && needsWindowsShell(command);

    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd,
      env,
      encoding: 'utf8',
      maxBuffer: EXEC_MAX_BUFFER,
      shell: useShell,
    });

    return {
      stdout,
      stderr,
      exitCode: 0,
    };
  } catch (error: any) {
    // execFile throws on non-zero exit codes
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || error.message || '',
      exitCode: error.code || 1,
    };
  }
}
