/**
 * Web Logger Utility
 *
 * Provides structured logging for the web interface (PWA).
 * All logs are prefixed with [WebUI] to distinguish them from main process logs.
 *
 * Log levels:
 * - debug: Detailed debugging information (disabled by default)
 * - info: General informational messages
 * - warn: Warning conditions that should be noted
 * - error: Error conditions that need attention
 *
 * Usage:
 *   import { webLogger } from '../utils/logger';
 *   webLogger.info('Connected to server', 'WebSocket');
 *   webLogger.error('Failed to connect', 'WebSocket', errorData);
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  /** Minimum log level to display */
  minLevel: LogLevel;
  /** Whether logging is enabled */
  enabled: boolean;
  /** Prefix for all log messages */
  prefix: string;
}

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Default config - only show warnings and errors
const defaultConfig: LoggerConfig = {
  minLevel: 'warn',
  enabled: true,
  prefix: '[WebUI]',
};

let config: LoggerConfig = { ...defaultConfig };

/**
 * Check if we should log at the given level
 */
function shouldLog(level: LogLevel): boolean {
  if (!config.enabled) return false;
  return levelPriority[level] >= levelPriority[config.minLevel];
}

/**
 * Format the log message with prefix and context
 */
function formatMessage(level: LogLevel, message: string, context?: string): string {
  const contextStr = context ? ` [${context}]` : '';
  return `${config.prefix}${contextStr} ${message}`;
}

/**
 * Web logger instance
 */
export const webLogger = {
  /**
   * Log a debug message (only shown when minLevel is 'debug')
   */
  debug(message: string, context?: string, data?: unknown): void {
    if (!shouldLog('debug')) return;
    const formatted = formatMessage('debug', message, context);
    if (data !== undefined) {
      console.debug(formatted, data);
    } else {
      console.debug(formatted);
    }
  },

  /**
   * Log an info message
   */
  info(message: string, context?: string, data?: unknown): void {
    if (!shouldLog('info')) return;
    const formatted = formatMessage('info', message, context);
    if (data !== undefined) {
      console.info(formatted, data);
    } else {
      console.info(formatted);
    }
  },

  /**
   * Log a warning message
   */
  warn(message: string, context?: string, data?: unknown): void {
    if (!shouldLog('warn')) return;
    const formatted = formatMessage('warn', message, context);
    if (data !== undefined) {
      console.warn(formatted, data);
    } else {
      console.warn(formatted);
    }
  },

  /**
   * Log an error message
   */
  error(message: string, context?: string, data?: unknown): void {
    if (!shouldLog('error')) return;
    const formatted = formatMessage('error', message, context);
    if (data !== undefined) {
      console.error(formatted, data);
    } else {
      console.error(formatted);
    }
  },

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    config.minLevel = level;
  },

  /**
   * Get the current minimum log level
   */
  getLevel(): LogLevel {
    return config.minLevel;
  },

  /**
   * Enable or disable logging
   */
  setEnabled(enabled: boolean): void {
    config.enabled = enabled;
  },

  /**
   * Check if logging is enabled
   */
  isEnabled(): boolean {
    return config.enabled;
  },

  /**
   * Enable debug logging (convenience method)
   */
  enableDebug(): void {
    config.minLevel = 'debug';
  },

  /**
   * Reset to default configuration
   */
  reset(): void {
    config = { ...defaultConfig };
  },
};

// Expose logger config in development for debugging
if (typeof window !== 'undefined') {
  (window as any).__webLogger = webLogger;
}

export default webLogger;
