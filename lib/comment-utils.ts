/**
 * Process comment text to convert @mentions and #solution references into links
 * @param text The comment text to process
 * @returns HTML string with @mentions and #solution references converted to links
 */
export function processCommentText(text: string): string {
  if (!text) return "";

  // Step 1: Escape HTML to prevent XSS attacks
  let processedText = escapeHtml(text);

  // Step 2: Process @mentions - format: @username
  processedText = processedText.replace(
    /@(\w+)/g,
    '<a href="/users/$1" class="text-primary hover:underline font-medium">@$1</a>'
  );

  // Step 3: Process #solution references - format: #123 or #solution123
  processedText = processedText.replace(
    /#(?:solution)?(\d+)/g,
    '<a href="/challenges/solutions/$1" class="text-primary hover:underline font-medium">#$1</a>'
  );

  // Step 4: Convert newlines to <br> tags for proper display
  processedText = processedText.replace(/\n/g, "<br>");

  return processedText;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param unsafeText Text that might contain HTML special characters
 * @returns Escaped text safe for insertion into HTML
 */
function escapeHtml(unsafeText: string): string {
  return unsafeText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Extract mentions from comment text
 * @param text The comment text
 * @returns Array of usernames mentioned in the text
 */
export function extractMentions(text: string): string[] {
  const mentions: string[] = [];
  const mentionRegex = /@(\w+)/g;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
}

/**
 * Extract solution references from comment text
 * @param text The comment text
 * @returns Array of solution IDs referenced in the text
 */
export function extractSolutionReferences(text: string): number[] {
  const references: number[] = [];
  const referenceRegex = /#(?:solution)?(\d+)/g;
  let match;

  while ((match = referenceRegex.exec(text)) !== null) {
    references.push(parseInt(match[1], 10));
  }

  return references;
}

/**
 * Validate a comment for potential spam or abusive content
 * @param text The comment text to validate
 * @returns Object with validation result and optional error message
 */
export function validateCommentContent(text: any): {
  isValid: boolean;
  error?: string;
} {
  // Check if the input is not a string
  if (typeof text !== "string") {
    return { isValid: false, error: "Comment must be a text string" };
  }

  // Check if empty
  if (!text || text.trim() === "") {
    return { isValid: false, error: "Comment cannot be empty" };
  }

  // Check if too long (2000 characters max)
  if (text.length > 2000) {
    return {
      isValid: false,
      error: "Comment is too long (maximum 2000 characters)",
    };
  }

  // Check for too many mentions (potential spam)
  const mentions = extractMentions(text);
  if (mentions.length > 10) {
    return { isValid: false, error: "Too many @mentions (maximum 10)" };
  }

  // Check for too many solution references (potential spam)
  const references = extractSolutionReferences(text);
  if (references.length > 5) {
    return {
      isValid: false,
      error: "Too many #solution references (maximum 5)",
    };
  }

  // Check for repeated characters (potential spam)
  const repeatedCharRegex = /(.)\1{10,}/;
  if (repeatedCharRegex.test(text)) {
    return {
      isValid: false,
      error: "Comment contains too many repeated characters",
    };
  }

  // All checks passed
  return { isValid: true };
}
