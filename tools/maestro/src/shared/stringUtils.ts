/**
 * Shared string utility functions
 *
 * This module provides string manipulation utilities used across
 * multiple parts of the application (main, renderer, web).
 */

/**
 * Strip ANSI escape codes from text
 *
 * Web interfaces don't render terminal colors, so we remove ANSI codes
 * for clean display. This handles standard SGR (Select Graphic Rendition)
 * escape sequences commonly used for terminal coloring.
 *
 * @param text - The input text potentially containing ANSI escape codes
 * @returns The text with all ANSI escape sequences removed
 *
 * @example
 * ```typescript
 * // Remove color codes from terminal output
 * const clean = stripAnsiCodes('\x1b[31mError:\x1b[0m Something went wrong');
 * // Returns: 'Error: Something went wrong'
 *
 * // Handle complex sequences
 * const text = stripAnsiCodes('\x1b[1;32mSuccess\x1b[0m');
 * // Returns: 'Success'
 * ```
 */
export function stripAnsiCodes(text: string): string {
  // Matches ANSI escape sequences: ESC[ followed by params and command letter
  // ESC is \x1b (decimal 27), followed by [ and then zero or more params
  // (digits or semicolons) ending with a letter command
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
}
