import DOMPurify from 'isomorphic-dompurify';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

/**
 * Validates and sanitizes a chat message
 * @param message The message to validate
 * @returns Validation result with sanitized value
 */
export function validateChatMessage(message: string): ValidationResult {
  // Check if message is empty or only whitespace
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return {
      isValid: false,
      error: 'Message cannot be empty',
    };
  }

  // Check message length (prevent extremely long messages)
  if (message.length > 2000) {
    return {
      isValid: false,
      error: 'Message too long (max 2000 characters)',
    };
  }

  // Check for potentially harmful content (basic XSS prevention)
  if (containsHarmfulContent(message)) {
    return {
      isValid: false,
      error: 'Message contains invalid content',
    };
  }

  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: [], // No HTML tags allowed in chat messages
    ALLOWED_ATTR: [], // No attributes allowed
  });

  return {
    isValid: true,
    sanitizedValue: sanitizedMessage,
  };
}

/**
 * Checks if the message contains potentially harmful content
 * @param message The message to check
 * @returns True if harmful content is detected
 */
function containsHarmfulContent(message: string): boolean {
  const harmfulPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
    /javascript:/gi, // JavaScript URLs
    /on\w+\s*=/gi, // Event handlers (onclick, onload, etc.)
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // Iframe tags
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, // Object tags
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, // Embed tags
  ];

  return harmfulPatterns.some(pattern => pattern.test(message));
}