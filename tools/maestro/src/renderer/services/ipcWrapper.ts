/**
 * IPC Wrapper Utility
 *
 * Provides a utility for wrapping IPC calls with consistent error handling patterns.
 * Reduces boilerplate in service files by abstracting try-catch patterns.
 *
 * Used by: git.ts, process.ts
 *
 * @example
 * // For methods that return a default value on error (swallow errors):
 * const getStatus = createIpcMethod({
 *   call: () => window.maestro.git.status(cwd),
 *   errorContext: 'Git status',
 *   defaultValue: { files: [] },
 * });
 *
 * @example
 * // For methods that rethrow errors (propagate errors):
 * const spawn = createIpcMethod({
 *   call: () => window.maestro.process.spawn(config),
 *   errorContext: 'Process spawn',
 *   rethrow: true,
 * });
 */

/**
 * Options for createIpcMethod when errors should be swallowed
 * and a default value returned instead.
 */
export interface IpcMethodOptionsWithDefault<T> {
  /** The IPC call to execute */
  call: () => Promise<T>;
  /** Context string for error logging (e.g., 'Git status', 'Process spawn') */
  errorContext: string;
  /** Default value to return on error */
  defaultValue: T;
  /** Optional transform function to process the result */
  transform?: (result: T) => T;
  rethrow?: false;
}

/**
 * Options for createIpcMethod when errors should be rethrown.
 */
export interface IpcMethodOptionsRethrow<T> {
  /** The IPC call to execute */
  call: () => Promise<T>;
  /** Context string for error logging (e.g., 'Git status', 'Process spawn') */
  errorContext: string;
  /** Set to true to rethrow errors after logging */
  rethrow: true;
  /** Optional transform function to process the result */
  transform?: (result: T) => T;
  defaultValue?: never;
}

export type IpcMethodOptions<T> =
  | IpcMethodOptionsWithDefault<T>
  | IpcMethodOptionsRethrow<T>;

/**
 * Creates an IPC method with standardized error handling.
 *
 * Two modes of operation:
 * 1. With `defaultValue`: Errors are logged and swallowed, returning the default value.
 *    Use this for read operations where failures can be gracefully handled.
 *
 * 2. With `rethrow: true`: Errors are logged and rethrown.
 *    Use this for write operations where callers need to know about failures.
 *
 * @param options - Configuration for the IPC method
 * @returns Promise resolving to the result or default value
 *
 * @example
 * // Swallow errors, return default
 * const branches = await createIpcMethod({
 *   call: () => window.maestro.git.branches(cwd),
 *   errorContext: 'Git branches',
 *   defaultValue: [],
 * });
 *
 * @example
 * // Rethrow errors to caller
 * await createIpcMethod({
 *   call: () => window.maestro.process.kill(sessionId),
 *   errorContext: 'Process kill',
 *   rethrow: true,
 * });
 */
export async function createIpcMethod<T>(options: IpcMethodOptions<T>): Promise<T> {
  try {
    const result = await options.call();
    return options.transform ? options.transform(result) : result;
  } catch (error) {
    console.error(`${options.errorContext} error:`, error);
    if (options.rethrow) {
      throw error;
    }
    return options.defaultValue as T;
  }
}

