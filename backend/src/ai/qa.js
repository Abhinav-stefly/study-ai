import { generateWithHF } from "./chat.js";

/* -------------------- UTILITIES -------------------- */

function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

function sentencesOf(text) {
  return clean(text)
    .split(/[.?!]/)
    .map(s => s.trim())
    .filter(s => s.length > 15);
}

function keywords(text, limit = 10) {
  const stop = new Set([
    "the","is","are","was","were","and","or","to","of","in","for","with",
    "that","this","it","as","on","by","an","be","from"
  ]);

  const freq = {};
  text.toLowerCase().split(/\W+/).forEach(w => {
    if (w.length > 4 && !stop.has(w)) freq[w] = (freq[w] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(x => x[0]);
}

/* -------------------- SUMMARY -------------------- */

export function summarize(text) {
  const s = sentencesOf(text);
  const keys = keywords(text, 5);

  const scored = s.map(line => ({
    line,
    score: keys.reduce((a, k) => a + (line.toLowerCase().includes(k) ? 1 : 0), 0)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(x => x.line)
    .join(". ") + ".";
}

/* -------------------- MCQ -------------------- */

export function generateMCQ(text, count = 5) {
  const s = sentencesOf(text);
  return s.slice(0, count).map((x, i) => ({
    id: i + 1,
    question: `What does the following statement imply?\n"${x}"`,
    options: [
      "It explains a key concept discussed in the text",
      "It contradicts the main idea of the topic",
      "It is unrelated background information",
      "It represents an incorrect interpretation"
    ],
    answer: 0
  }));
}

/* -------------------- FILL UPS -------------------- */

export function generateFillUps(text, count = 5) {
  const keys = keywords(text, count);
  return keys.map((k, i) => ({
    id: i + 1,
    question: `The term "________" plays an important role in the given topic.`,
    answer: k
  }));
}

/* -------------------- TRUE / FALSE -------------------- */

export function generateTrueFalse(text, count = 5) {
  const s = sentencesOf(text);
  return s.slice(0, count).map((x, i) => ({
    id: i + 1,
    statement: x,
    answer: "True"
  }));
}

/* -------------------- SHORT ANSWER -------------------- */

export function generateShortQA(text, count = 5) {
  const s = sentencesOf(text);
  return s.slice(0, count).map((x, i) => ({
    id: i + 1,
    question: `Why is the following idea important?\n"${x}"`,
    answer: `This idea is important because it contributes to the understanding of the topic by explaining its role, purpose, or effect within the system discussed.`
  }));
}

/* -------------------- LONG ANSWER -------------------- */

export async function generateLongQA(text, count = 5) {
  const model = process.env.HF_MODEL || "google/flan-t5-large";

  if (process.env.HF_API_KEY) {
    try {
      const prompt = `
Generate ${count} deep, exam-level long-answer questions and answers.
Questions must ask WHY, HOW, IMPACT, or COMPARISON.
Answers must be detailed, structured, and explanatory.

TEXT:
${text.slice(0, 2500)}

Return JSON only:
[{ "question": "...", "answer": "..." }]
`;

      const out = await generateWithHF(model, prompt, 700);
      const json = out.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (json) {
        return JSON.parse(json[0]).slice(0, count).map((x, i) => ({
          id: i + 1,
          question: x.question,
          answer: x.answer
        }));
      }
    } catch {}
  }

  const s = sentencesOf(text);

  return s.slice(0, count).map((x, i) => ({
    id: i + 1,
    question: `Discuss the significance and implications of:\n"${x}"`,
    answer:
      `This statement highlights an important aspect of the topic. A detailed discussion should include its meaning, how it works, why it matters, real-world implications, and how it connects with related concepts.`
  }));
}

/* -------------------- FINAL EXPORT -------------------- */

export async function generateQA(text) {
  return {
    summary: summarize(text),
    questions: {
      mcq: generateMCQ(text, 5),
      fillUps: generateFillUps(text, 5),
      trueFalse: generateTrueFalse(text, 5),
      shortQA: generateShortQA(text, 5),
      longQA: await generateLongQA(text, 5)
    }
  };
}
