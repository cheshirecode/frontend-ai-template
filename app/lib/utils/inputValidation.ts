/**
 * Validates user input for chat messages.
 * @param message The user-provided message string.
 * @returns An object containing isValid (boolean) and optionally an error message.
 */
export function validateChatMessage(message: string): { isValid: boolean; error?: string } {
  // Check if message is empty or only whitespace after trimming
  if (!message?.trim()) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  // Check message length (e.g., max 1000 characters)
  const maxLength = 1000;
  if (message.length > maxLength) {
    return { isValid: false, error: `Message exceeds maximum length of ${maxLength} characters` };
  }

  // Optional: Check for control characters (except common ones like \n, \t if needed)
  // For now, let's allow standard printable ASCII and common whitespace
  // Adjust the regex as needed based on requirements
  const controlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;
  if (controlCharRegex.test(message)) {
    return { isValid: false, error: 'Message contains invalid control characters' };
  }

  // If all checks pass
  return { isValid: true };
}