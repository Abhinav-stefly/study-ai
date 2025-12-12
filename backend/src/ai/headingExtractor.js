/**
 * Extract headings from text using multiple strategies
 * - Markdown style (#, ##, ###)
 * - Numbered headings (1., 1.1, etc.)
 * - Lines in ALL CAPS
 * - Lines starting with capital letter followed by lowercase
 */
export const extractHeadings = (text) => {
  if (!text || typeof text !== "string") {
    console.warn("extractHeadings: input is not a valid string", typeof text);
    return [];
  }

  try {
    const lines = text.split("\n");
    const headings = new Set(); // Use Set to avoid duplicates

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Skip empty or very short lines
      if (!trimmed || trimmed.length < 3) return;

      // Strategy 1: Markdown headings (# ## ###)
      const markdownMatch = trimmed.match(/^#+\s+(.+)$/);
      if (markdownMatch) {
        headings.add(markdownMatch[1].trim());
        return;
      }

      // Strategy 2: Numbered headings (1. 1.1 2.3.4)
      const numberedMatch = trimmed.match(/^[\d.]+\s+(.+)$/);
      if (numberedMatch) {
        const heading = numberedMatch[1].trim();
        if (heading.length > 4 && !isAllNumbers(heading)) {
          headings.add(heading);
          return;
        }
      }

      // Strategy 3: ALL CAPS HEADINGS
      if (isAllCaps(trimmed) && trimmed.length > 5 && !endsWithPunctuation(trimmed)) {
        headings.add(trimmed);
        return;
      }

      // Strategy 4: Title case (First Word Capitalized Like This)
      if (isTitleCase(trimmed) && trimmed.length > 5 && !endsWithPunctuation(trimmed)) {
        headings.add(trimmed);
        return;
      }

      // Strategy 5: Single line with capital letter followed by text
      const singleLineMatch = trimmed.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/);
      if (singleLineMatch && trimmed.length > 5) {
        headings.add(trimmed);
      }
    });

    console.log(`[Headings] Extracted ${headings.size} unique headings`);
    return Array.from(headings);
  } catch (err) {
    console.error("Error in extractHeadings:", err.message);
    return [];
  }
};

/**
 * Helper: Check if string is all uppercase
 */
function isAllCaps(text) {
  return /^[A-Z\s\-.,0-9]+$/.test(text) && /[A-Z]/.test(text);
}

/**
 * Helper: Check if string is title case
 */
function isTitleCase(text) {
  // Each word starts with capital: "Word1 Word2 Word3"
  const words = text.split(/\s+/);
  return words.length >= 2 && words.every(word => /^[A-Z]/.test(word) && word.length > 1);
}

/**
 * Helper: Check if string ends with sentence-ending punctuation
 */
function endsWithPunctuation(text) {
  return /[.!?:,;]$/.test(text);
}

/**
 * Helper: Check if string is only numbers
 */
function isAllNumbers(text) {
  return /^\d+(\.\d+)*$/.test(text);
}

/**
 * Alternative: Extract headings using semantic analysis
 * (requires more text for context)
 */
export const extractHeadingsAdvanced = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  try {
    const lines = text.split("\n");
    const headings = [];
    const threshold = 40; // avg chars per line in document

    let totalChars = 0;
    let totalLines = 0;

    // Calculate average line length for context
    lines.forEach((line) => {
      if (line.trim().length > 0) {
        totalChars += line.trim().length;
        totalLines++;
      }
    });

    const avgLineLength = totalChars / totalLines || 40;

    // Extract lines that are significantly shorter (headings are usually shorter)
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 3) return;

      const isSignificantlyShorter = trimmed.length < avgLineLength * 0.6;
      const startsWithCaps = /^[A-Z]/.test(trimmed);
      const hasGoodSpacing = (idx > 0 && idx < lines.length - 1);
      const notFullSentence = !/[.!?]\s*$/.test(trimmed.slice(-10));

      if (
        isSignificantlyShorter &&
        startsWithCaps &&
        hasGoodSpacing &&
        notFullSentence &&
        trimmed.length > 5
      ) {
        headings.push(trimmed);
      }
    });

    console.log(`[Headings Advanced] Extracted ${headings.length} headings`);
    return headings;
  } catch (err) {
    console.error("Error in extractHeadingsAdvanced:", err.message);
    return [];
  }
};