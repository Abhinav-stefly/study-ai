// ---------------------------------------
// FREE NLP SUMMARY + QUESTION GENERATOR
// ---------------------------------------

export function summarize(text) {
  const sentences = text
    .split(/[.?!]/)
    .filter(s => s.trim().length > 0);

  return sentences.slice(0, 3).join(". ") + ".";
}

// ---------------------------------------
// Generate MCQs (5)
// ---------------------------------------
export function generateMCQ(text, count = 5) {
  const sentences = text
    .split(/[.?!]/)
    .filter(s => s.trim().length > 10);

  return sentences.slice(0, count).map((s, i) => ({
    id: i + 1,
    question: `Which of the following is correct about: "${s.substring(0, 40)}..."?`,
    options: [
      s.trim(),
      "This statement is incorrect.",
      "This information is irrelevant.",
      "None of the above."
    ],
    answer: 0
  }));
}

// ---------------------------------------
// Fill-in-the-blanks (5)
// ---------------------------------------
export function generateFillUps(text, count = 5) {
  const words = text.split(" ").filter(w => w.length > 5);

  return words.slice(0, count).map((word, i) => ({
    id: i + 1,
    question: `Fill in the blank: ______ (${word.length} letters)`,
    answer: word
  }));
}

// ---------------------------------------
// True / False Questions (5)
// ---------------------------------------
export function generateTrueFalse(text, count = 5) {
  const sentences = text
    .split(/[.?!]/)
    .filter(s => s.trim().length > 10);

  return sentences.slice(0, count).map((s, i) => ({
    id: i + 1,
    statement: s.trim(),
    answer: Math.random() > 0.5 ? "True" : "False"
  }));
}

// ---------------------------------------
// Short Answer Questions (5)
// ---------------------------------------
export function generateShortQA(text, count = 5) {
  const sentences = text
    .split(/[.?!]/)
    .filter(s => s.trim().length > 20);

  return sentences.slice(0, count).map((s, i) => ({
    id: i + 1,
    question: `Explain: ${s.substring(0, 60)}...?`,
    answer: s.trim()
  }));
}

// ---------------------------------------
// Long Answer Questions (5)
// ---------------------------------------
export function generateLongQA(text, count = 5) {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    question: `Write a detailed explanation about concept ${i + 1}.`,
    answer: `Detailed explanation required for concept ${i + 1}.`
  }));
}

// ---------------------------------------
// FINAL COMBINED EXPORT (easy for frontend)
// ---------------------------------------
export function generateQA(text) {
  return {
    summary: summarize(text),

    questions: {
      mcq: generateMCQ(text, 5),
      fillUps: generateFillUps(text, 5),
      trueFalse: generateTrueFalse(text, 5),
      shortQA: generateShortQA(text, 5),
      longQA: generateLongQA(text, 5)
    }
  };
}
