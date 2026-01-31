import { describe, it, expect } from 'vitest';
import { validateChatMessage } from './inputValidation';

describe('inputValidation', () => {
  describe('validateChatMessage', () => {
    it('should return valid for a normal message', () => {
      const result = validateChatMessage('Hello, this is a normal message.');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for an empty string', () => {
      const result = validateChatMessage('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message cannot be empty');
    });

    it('should return invalid for a string with only whitespace', () => {
      const result = validateChatMessage('   \t\n  ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message cannot be empty');
    });

    it('should return invalid for a message exceeding max length', () => {
      const longMessage = 'A'.repeat(1001); // 1001 characters, max is 1000
      const result = validateChatMessage(longMessage);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message exceeds maximum length of 1000 characters');
    });

    it('should return valid for a message exactly at max length', () => {
      const maxLengthMessage = 'A'.repeat(1000); // Exactly 1000 characters
      const result = validateChatMessage(maxLengthMessage);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for a message containing control characters', () => {
      const messageWithControlChar = 'Hello\x00World'; // Null byte
      const result = validateChatMessage(messageWithControlChar);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Message contains invalid control characters');
    });

    it('should return valid for a message with common whitespace characters', () => {
      const messageWithWhitespace = 'Hello\n\tWorld\r'; // Newline, tab, carriage return (if not excluded)
      // Note: Our regex excludes \x0B (vertical tab) and \x0C (form feed) but allows \n and \t
      const result = validateChatMessage(messageWithWhitespace);
      // This test depends on the exact regex. \n and \t are allowed, \r is allowed, \x0B/\x0C are not.
      // Let's test specifically with \n and \t which should be allowed
      expect(result.isValid).toBe(true); // Assuming \n and \t are okay based on the original regex
    });

    it('should return invalid for a message with specific disallowed control characters', () => {
      // Test individual disallowed control characters
      const disallowedChars = ['\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07', '\x08', '\x0B', '\x0C', '\x0E', '\x0F', '\x10', '\x11', '\x12', '\x13', '\x14', '\x15', '\x16', '\x17', '\x18', '\x19', '\x1A', '\x1B', '\x1C', '\x1D', '\x1E', '\x1F', '\x7F'];

      for (const char of disallowedChars) {
        const message = `Hello${char}World`;
        const result = validateChatMessage(message);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Message contains invalid control characters');
      }
    });
  });
});