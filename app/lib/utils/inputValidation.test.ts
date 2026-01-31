import { describe, test, expect } from 'vitest';
import { validateChatMessage } from './inputValidation';

describe('Input Validation', () => {
  test('should validate non-empty messages', () => {
    const result = validateChatMessage('Hello world');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedValue).toBe('Hello world');
  });

  test('should reject empty messages', () => {
    const result = validateChatMessage('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot be empty');
  });

  test('should reject whitespace-only messages', () => {
    const result = validateChatMessage('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot be empty');
  });

  test('should reject overly long messages', () => {
    const longMessage = 'a'.repeat(2001);
    const result = validateChatMessage(longMessage);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('too long');
  });

  test('should sanitize script tags', () => {
    const result = validateChatMessage('<script>alert("test")</script>Hello');
    expect(result.isValid).toBe(false);
  });

  test('should sanitize javascript URLs', () => {
    const result = validateChatMessage('javascript:alert("test")');
    expect(result.isValid).toBe(false);
  });
});