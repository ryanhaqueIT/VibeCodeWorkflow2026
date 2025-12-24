/**
 * Tests for src/shared/synopsis.ts
 *
 * Coverage:
 * - parseSynopsis: Parse synopsis response into summary and full text
 * - ParsedSynopsis: Interface for parsed result
 */

import { describe, it, expect } from 'vitest';
import { parseSynopsis, ParsedSynopsis } from '../../shared/synopsis';

describe('synopsis', () => {
  describe('parseSynopsis', () => {
    describe('proper format parsing', () => {
      it('should parse response with Summary and Details sections', () => {
        const response = '**Summary:** Fixed the authentication bug\n\n**Details:** Updated the login handler to properly validate tokens and handle edge cases.';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Fixed the authentication bug');
        expect(result.fullSynopsis).toBe('Fixed the authentication bug\n\nUpdated the login handler to properly validate tokens and handle edge cases.');
      });

      it('should parse response with Summary only', () => {
        const response = '**Summary:** No changes made.';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('No changes made.');
        expect(result.fullSynopsis).toBe('No changes made.');
      });

      it('should handle case-insensitive section headers', () => {
        const response = '**SUMMARY:** All tests pass\n\n**DETAILS:** Ran full test suite.';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('All tests pass');
        expect(result.fullSynopsis).toBe('All tests pass\n\nRan full test suite.');
      });

      it('should handle multiline Details section', () => {
        const response = `**Summary:** Refactored component

**Details:** Made several changes:
- Updated state management
- Fixed prop types
- Added new tests`;

        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Refactored component');
        expect(result.fullSynopsis).toContain('Made several changes:');
        expect(result.fullSynopsis).toContain('- Updated state management');
      });
    });

    describe('ANSI code cleaning', () => {
      it('should strip ANSI color codes', () => {
        const response = '\x1b[32m**Summary:**\x1b[0m Test passed\n\n**Details:** All green.';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Test passed');
        expect(result.fullSynopsis).toBe('Test passed\n\nAll green.');
      });

      it('should handle multiple ANSI codes', () => {
        const response = '\x1b[1m\x1b[36m**Summary:**\x1b[0m \x1b[33mWarning handled\x1b[0m';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Warning handled');
      });

      it('should handle complex ANSI sequences', () => {
        const response = '\x1b[38;5;196m**Summary:**\x1b[0m Critical fix applied';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Critical fix applied');
      });
    });

    describe('box drawing character cleaning', () => {
      it('should strip horizontal box lines', () => {
        const response = '─────────────────\n**Summary:** Task complete\n─────────────────';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Task complete');
      });

      it('should strip vertical box characters', () => {
        const response = '│**Summary:** Task done│';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Task done');
      });

      it('should strip corner and junction box characters', () => {
        const response = '┌──────────┐\n│**Summary:** Test│\n└──────────┘';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Test');
      });

      it('should strip mixed box drawing characters', () => {
        const response = '├──┬──┤\n│**Summary:** Mixed box│\n├──┴──┤';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Mixed box');
      });
    });

    describe('combined ANSI and box character cleaning', () => {
      it('should clean both ANSI codes and box characters together', () => {
        const response = '\x1b[32m───────────────────\x1b[0m\n│**Summary:** Test summary│\n└──────────────────┘';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Test summary');
      });
    });

    describe('fallback behavior', () => {
      it('should use first line as summary when no format detected', () => {
        const response = 'Just a plain text response\nWith multiple lines.\nAnd more content.';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Just a plain text response');
        expect(result.fullSynopsis).toBe('Just a plain text response');
      });

      it('should handle single line without format', () => {
        const response = 'Single line response without format markers';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Single line response without format markers');
        expect(result.fullSynopsis).toBe('Single line response without format markers');
      });

      it('should return default message for empty string', () => {
        const response = '';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Task completed');
        expect(result.fullSynopsis).toBe('Task completed');
      });

      it('should return default message for whitespace-only string', () => {
        const response = '   \n\t\n   ';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Task completed');
        expect(result.fullSynopsis).toBe('Task completed');
      });

      it('should handle response with only box characters', () => {
        const response = '───────────────────\n│││\n───────────────────';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Task completed');
      });
    });

    describe('edge cases', () => {
      it('should handle Summary followed immediately by text (no newline before Details)', () => {
        const response = '**Summary:** Quick fix**Details:** No newline separator';
        const result = parseSynopsis(response);

        // Summary should capture up to Details marker
        expect(result.shortSummary).toBe('Quick fix');
      });

      it('should handle extra whitespace around sections', () => {
        const response = '**Summary:**   Lots of spaces   \n\n\n**Details:**   Also spaced   ';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Lots of spaces');
        expect(result.fullSynopsis).toContain('Also spaced');
      });

      it('should handle unicode in content', () => {
        const response = '**Summary:** Added emoji support 🎉\n\n**Details:** Now supports émojis and ünïcödë.';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Added emoji support 🎉');
        expect(result.fullSynopsis).toContain('émojis and ünïcödë');
      });

      it('should handle markdown formatting in content', () => {
        const response = '**Summary:** Updated `config.ts` file\n\n**Details:** Changed `timeout` from **500ms** to *1000ms*.';
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe('Updated `config.ts` file');
        expect(result.fullSynopsis).toContain('Changed `timeout`');
      });

      it('should handle very long summary text', () => {
        const longText = 'A'.repeat(500);
        const response = `**Summary:** ${longText}\n\n**Details:** Short details.`;
        const result = parseSynopsis(response);

        expect(result.shortSummary).toBe(longText);
        expect(result.fullSynopsis).toContain('Short details.');
      });

      it('should handle newlines within sections', () => {
        const response = `**Summary:** First line of summary
second line still summary

**Details:** Detail line one
detail line two`;

        const result = parseSynopsis(response);

        expect(result.shortSummary).toContain('First line of summary');
        expect(result.fullSynopsis).toContain('Detail line one');
      });
    });

    describe('return type validation', () => {
      it('should always return object with shortSummary and fullSynopsis', () => {
        const result = parseSynopsis('test');

        expect(result).toHaveProperty('shortSummary');
        expect(result).toHaveProperty('fullSynopsis');
        expect(typeof result.shortSummary).toBe('string');
        expect(typeof result.fullSynopsis).toBe('string');
      });

      it('should satisfy ParsedSynopsis interface', () => {
        const result: ParsedSynopsis = parseSynopsis('**Summary:** Test');

        // TypeScript ensures interface compliance at compile time
        // Runtime check that properties exist
        expect(result.shortSummary).toBeDefined();
        expect(result.fullSynopsis).toBeDefined();
      });
    });
  });
});
