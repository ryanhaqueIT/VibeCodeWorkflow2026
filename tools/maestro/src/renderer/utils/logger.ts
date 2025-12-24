/**
 * Structured logging utility for the renderer process
 * Sends logs to the main process via IPC
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class RendererLogger {
  debug(message: string, context?: string, data?: unknown): void {
    window.maestro?.logger?.log('debug', message, context, data);
  }

  info(message: string, context?: string, data?: unknown): void {
    window.maestro?.logger?.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: unknown): void {
    window.maestro?.logger?.log('warn', message, context, data);
  }

  error(message: string, context?: string, data?: unknown): void {
    window.maestro?.logger?.log('error', message, context, data);
  }
}

// Export singleton instance
export const logger = new RendererLogger();
