/**
 * Tests for error-patterns.ts
 *
 * Tests the error pattern matching and registry functionality
 * for detecting agent errors from output text.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getErrorPatterns,
  matchErrorPattern,
  registerErrorPatterns,
  clearPatternRegistry,
  CLAUDE_ERROR_PATTERNS,
  OPENCODE_ERROR_PATTERNS,
  CODEX_ERROR_PATTERNS,
  type AgentErrorPatterns,
} from '../../../main/parsers/error-patterns';

describe('error-patterns', () => {
  describe('CLAUDE_ERROR_PATTERNS', () => {
    it('should define auth_expired patterns', () => {
      expect(CLAUDE_ERROR_PATTERNS.auth_expired).toBeDefined();
      expect(CLAUDE_ERROR_PATTERNS.auth_expired?.length).toBeGreaterThan(0);
    });

    it('should define token_exhaustion patterns', () => {
      expect(CLAUDE_ERROR_PATTERNS.token_exhaustion).toBeDefined();
      expect(CLAUDE_ERROR_PATTERNS.token_exhaustion?.length).toBeGreaterThan(0);
    });

    it('should define rate_limited patterns', () => {
      expect(CLAUDE_ERROR_PATTERNS.rate_limited).toBeDefined();
      expect(CLAUDE_ERROR_PATTERNS.rate_limited?.length).toBeGreaterThan(0);
    });

    it('should define network_error patterns', () => {
      expect(CLAUDE_ERROR_PATTERNS.network_error).toBeDefined();
      expect(CLAUDE_ERROR_PATTERNS.network_error?.length).toBeGreaterThan(0);
    });

    it('should define permission_denied patterns', () => {
      expect(CLAUDE_ERROR_PATTERNS.permission_denied).toBeDefined();
      expect(CLAUDE_ERROR_PATTERNS.permission_denied?.length).toBeGreaterThan(0);
    });

    it('should define agent_crashed patterns', () => {
      expect(CLAUDE_ERROR_PATTERNS.agent_crashed).toBeDefined();
      expect(CLAUDE_ERROR_PATTERNS.agent_crashed?.length).toBeGreaterThan(0);
    });
  });

  describe('OPENCODE_ERROR_PATTERNS', () => {
    it('should define patterns for opencode', () => {
      expect(OPENCODE_ERROR_PATTERNS).toBeDefined();
      expect(Object.keys(OPENCODE_ERROR_PATTERNS).length).toBeGreaterThan(0);
    });

    describe('network_error patterns', () => {
      it('should match "connection failed"', () => {
        const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, 'connection failed');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should match "connection refused"', () => {
        const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, 'connection refused');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should match "connection error"', () => {
        const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, 'connection error');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should match "connection timed out"', () => {
        const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, 'connection timed out');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should match "ECONNREFUSED"', () => {
        const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, 'Error: ECONNREFUSED');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should match "ETIMEDOUT"', () => {
        const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, 'Error: ETIMEDOUT');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should match "request timed out"', () => {
        const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, 'request timed out');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should match "network error"', () => {
        const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, 'network error occurred');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should NOT match normal text containing "connection" as part of a word or phrase', () => {
        // These are false positive cases that should NOT trigger errors
        const falsePositives = [
          'Retry Connection',
          'I will establish a connection',
          'the connection is healthy',
          'check the connection string',
          'database connection pool',
        ];

        for (const text of falsePositives) {
          const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, text);
          expect(result).toBeNull();
        }
      });

      it('should NOT match normal text containing "timeout" as part of a phrase', () => {
        // These are false positive cases that should NOT trigger errors
        const falsePositives = [
          'set timeout to 30',
          'the timeout value is',
          'default timeout setting',
          'with a timeout of 5 seconds',
        ];

        for (const text of falsePositives) {
          const result = matchErrorPattern(OPENCODE_ERROR_PATTERNS, text);
          expect(result).toBeNull();
        }
      });
    });
  });

  describe('CODEX_ERROR_PATTERNS', () => {
    it('should define auth_expired patterns', () => {
      expect(CODEX_ERROR_PATTERNS.auth_expired).toBeDefined();
      expect(CODEX_ERROR_PATTERNS.auth_expired?.length).toBeGreaterThan(0);
    });

    it('should define token_exhaustion patterns', () => {
      expect(CODEX_ERROR_PATTERNS.token_exhaustion).toBeDefined();
      expect(CODEX_ERROR_PATTERNS.token_exhaustion?.length).toBeGreaterThan(0);
    });

    it('should define rate_limited patterns', () => {
      expect(CODEX_ERROR_PATTERNS.rate_limited).toBeDefined();
      expect(CODEX_ERROR_PATTERNS.rate_limited?.length).toBeGreaterThan(0);
    });

    it('should define network_error patterns', () => {
      expect(CODEX_ERROR_PATTERNS.network_error).toBeDefined();
      expect(CODEX_ERROR_PATTERNS.network_error?.length).toBeGreaterThan(0);
    });

    it('should define permission_denied patterns', () => {
      expect(CODEX_ERROR_PATTERNS.permission_denied).toBeDefined();
      expect(CODEX_ERROR_PATTERNS.permission_denied?.length).toBeGreaterThan(0);
    });

    it('should define agent_crashed patterns', () => {
      expect(CODEX_ERROR_PATTERNS.agent_crashed).toBeDefined();
      expect(CODEX_ERROR_PATTERNS.agent_crashed?.length).toBeGreaterThan(0);
    });
  });

  describe('getErrorPatterns', () => {
    it('should return claude-code patterns', () => {
      const patterns = getErrorPatterns('claude-code');
      expect(patterns).toBe(CLAUDE_ERROR_PATTERNS);
    });

    it('should return opencode patterns', () => {
      const patterns = getErrorPatterns('opencode');
      expect(patterns).toBe(OPENCODE_ERROR_PATTERNS);
    });

    it('should return codex patterns', () => {
      const patterns = getErrorPatterns('codex');
      expect(patterns).toBe(CODEX_ERROR_PATTERNS);
    });

    it('should return empty object for unknown agent', () => {
      const patterns = getErrorPatterns('unknown-agent');
      expect(patterns).toEqual({});
    });
  });

  describe('matchErrorPattern', () => {
    describe('auth_expired patterns', () => {
      it('should match "Invalid API key"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Error: Invalid API key');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('auth_expired');
        expect(result?.recoverable).toBe(true);
      });

      it('should match "Authentication failed"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Authentication failed');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('auth_expired');
      });

      it('should match "please run claude login"', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'Session expired. Please run `claude login` to authenticate.'
        );
        expect(result).not.toBeNull();
        expect(result?.type).toBe('auth_expired');
      });

      it('should match "unauthorized" case-insensitively', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'UNAUTHORIZED');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('auth_expired');
      });
    });

    describe('token_exhaustion patterns', () => {
      it('should match "context too long"', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'Error: The context is too long for the model.'
        );
        expect(result).not.toBeNull();
        expect(result?.type).toBe('token_exhaustion');
        expect(result?.recoverable).toBe(true);
      });

      it('should match "maximum tokens"', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'Exceeded maximum tokens allowed.'
        );
        expect(result).not.toBeNull();
        expect(result?.type).toBe('token_exhaustion');
      });

      it('should match "context window"', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'Context window limit exceeded.'
        );
        expect(result).not.toBeNull();
        expect(result?.type).toBe('token_exhaustion');
      });
    });

    describe('rate_limited patterns', () => {
      it('should match "rate limit"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Rate limit exceeded');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('rate_limited');
        expect(result?.recoverable).toBe(true);
      });

      it('should match "too many requests"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Too many requests');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('rate_limited');
      });

      it('should match "overloaded"', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'The service is overloaded. Please try again.'
        );
        expect(result).not.toBeNull();
        expect(result?.type).toBe('rate_limited');
      });

      it('should match "529" (overloaded status)', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'Error 529: Service overloaded'
        );
        expect(result).not.toBeNull();
        expect(result?.type).toBe('rate_limited');
      });

      it('should mark quota exceeded as not recoverable', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'quota exceeded');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('rate_limited');
        expect(result?.recoverable).toBe(false);
      });
    });

    describe('network_error patterns', () => {
      it('should match "connection failed"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Connection failed');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
        expect(result?.recoverable).toBe(true);
      });

      it('should match "timeout"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Request timeout');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should match "ECONNREFUSED"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Error: ECONNREFUSED');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });

      it('should match "ENOTFOUND"', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'getaddrinfo ENOTFOUND api.anthropic.com'
        );
        expect(result).not.toBeNull();
        expect(result?.type).toBe('network_error');
      });
    });

    describe('permission_denied patterns', () => {
      it('should match "permission denied"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Permission denied');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('permission_denied');
        expect(result?.recoverable).toBe(false);
      });

      it('should match "not allowed"', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'This operation is not allowed.'
        );
        expect(result).not.toBeNull();
        expect(result?.type).toBe('permission_denied');
      });

      it('should match "403 forbidden"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, '403 Forbidden');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('permission_denied');
      });
    });

    describe('agent_crashed patterns', () => {
      it('should match "unexpected error"', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'An unexpected error occurred'
        );
        expect(result).not.toBeNull();
        expect(result?.type).toBe('agent_crashed');
        expect(result?.recoverable).toBe(true);
      });

      it('should match "internal error"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Internal error');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('agent_crashed');
      });

      it('should match "fatal error"', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, 'Fatal error');
        expect(result).not.toBeNull();
        expect(result?.type).toBe('agent_crashed');
      });
    });

    describe('non-matching lines', () => {
      it('should return null for normal output', () => {
        const result = matchErrorPattern(
          CLAUDE_ERROR_PATTERNS,
          'Hello, how can I help you today?'
        );
        expect(result).toBeNull();
      });

      it('should return null for empty string', () => {
        const result = matchErrorPattern(CLAUDE_ERROR_PATTERNS, '');
        expect(result).toBeNull();
      });

      it('should return null for empty patterns', () => {
        const result = matchErrorPattern({}, 'rate limit exceeded');
        expect(result).toBeNull();
      });
    });

    describe('Codex-specific patterns', () => {
      describe('auth_expired patterns', () => {
        it('should match "invalid api key"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'invalid api key');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('auth_expired');
        });

        it('should match "authentication failed"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'authentication failed');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('auth_expired');
        });

        it('should match "unauthorized"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'unauthorized');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('auth_expired');
        });
      });

      describe('rate_limited patterns', () => {
        it('should match "rate limit"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'rate limit exceeded');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('rate_limited');
        });

        it('should match "too many requests"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'too many requests');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('rate_limited');
        });

        it('should match "429" (HTTP status code)', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'Error 429: Rate limited');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('rate_limited');
        });

        it('should match "quota exceeded"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'quota exceeded');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('rate_limited');
          expect(result?.recoverable).toBe(false);
        });
      });

      describe('token_exhaustion patterns', () => {
        it('should match "context length"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'context length exceeded');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('token_exhaustion');
        });

        it('should match "maximum tokens"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'maximum tokens reached');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('token_exhaustion');
        });

        it('should match "token limit"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'token limit exceeded');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('token_exhaustion');
        });
      });

      describe('network_error patterns', () => {
        it('should match "connection failed"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'connection failed');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('network_error');
        });

        it('should match "timeout"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'request timeout');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('network_error');
        });

        it('should match "ECONNREFUSED"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'ECONNREFUSED');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('network_error');
        });
      });

      describe('permission_denied patterns', () => {
        it('should match "permission denied"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'permission denied');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('permission_denied');
          expect(result?.recoverable).toBe(false);
        });

        it('should match "access denied"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'access denied');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('permission_denied');
        });
      });

      describe('agent_crashed patterns', () => {
        it('should match "unexpected error"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'unexpected error');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('agent_crashed');
        });

        it('should match "internal error"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'internal error');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('agent_crashed');
        });

        it('should match "fatal"', () => {
          const result = matchErrorPattern(CODEX_ERROR_PATTERNS, 'fatal error occurred');
          expect(result).not.toBeNull();
          expect(result?.type).toBe('agent_crashed');
        });
      });
    });
  });

  describe('registerErrorPatterns', () => {
    afterEach(() => {
      clearPatternRegistry();
      // Re-register default patterns
      registerErrorPatterns('claude-code', CLAUDE_ERROR_PATTERNS);
      registerErrorPatterns('opencode', OPENCODE_ERROR_PATTERNS);
      registerErrorPatterns('codex', CODEX_ERROR_PATTERNS);
    });

    it('should register custom patterns', () => {
      const customPatterns: AgentErrorPatterns = {
        auth_expired: [
          {
            pattern: /custom auth error/i,
            message: 'Custom auth error',
            recoverable: true,
          },
        ],
      };

      registerErrorPatterns('aider', customPatterns);
      const patterns = getErrorPatterns('aider');
      expect(patterns).toBe(customPatterns);
    });

    it('should override existing patterns', () => {
      const newPatterns: AgentErrorPatterns = {
        auth_expired: [
          {
            pattern: /new pattern/i,
            message: 'New pattern',
            recoverable: true,
          },
        ],
      };

      registerErrorPatterns('claude-code', newPatterns);
      const patterns = getErrorPatterns('claude-code');
      expect(patterns).toBe(newPatterns);
    });
  });

  describe('clearPatternRegistry', () => {
    afterEach(() => {
      // Re-register default patterns
      registerErrorPatterns('claude-code', CLAUDE_ERROR_PATTERNS);
      registerErrorPatterns('opencode', OPENCODE_ERROR_PATTERNS);
      registerErrorPatterns('codex', CODEX_ERROR_PATTERNS);
    });

    it('should clear all registered patterns', () => {
      clearPatternRegistry();
      expect(getErrorPatterns('claude-code')).toEqual({});
      expect(getErrorPatterns('opencode')).toEqual({});
    });
  });
});
