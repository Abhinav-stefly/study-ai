// ai/preprocess.js

// Remove page numbers, fix spacing, merge broken lines
export function cleanText(text) {
    return text
        .replace(/page\s*\d+/gi, "")   // remove 'page 1'
        .replace(/\n{2,}/g, "\n")      // remove double newlines
        .replace(/\n/g, " ")           // convert all newlines to spaces
        .replace(/\s{2,}/g, " ")       // remove multiple spaces
        .trim();
}

// Extract possible headings (H1 / H2 style)
export function extractHeadings(text) {
    const lines = text.split("\n");
    const headings = [];

    for (const line of lines) {
        const trimmed = line.trim();

        // UPPERCASE headings
        if (trimmed === trimmed.toUpperCase() && trimmed.length > 4) {
            headings.push(trimmed);
        }

        // Title Case headings
        if (/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/.test(trimmed)) {
            headings.push(trimmed);
        }
    }

    return [...new Set(headings)];
}

// Main function used in controller
export function preprocessOCRText(raw) {
    return {
        cleanedText: cleanText(raw),
        headings: extractHeadings(raw),
    };
}
