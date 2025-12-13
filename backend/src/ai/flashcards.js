import { pipeline } from "@xenova/transformers";

let model;

async function loadModel() {
  if (!model) {
    model = await pipeline("text2text-generation", "Xenova/t5-small");
  }
  return model;
}

export async function generateFlashcards(text) {
  if (!text || typeof text !== "string") return [];

  const prompt = `
Create 5 short study flashcards from the following text.
Each flashcard should explain one key concept clearly.

Text:
${text}
`;

  const t5 = await loadModel();
  const res = await t5(prompt, { max_length: 300 });

  return smartParse(res[0].generated_text);
}

function smartParse(output) {
  const sentences = output
    .split(/[\n\.]/)
    .map(s => s.trim())
    .filter(s => s.length > 25);

  const cards = [];

  for (let i = 0; i < sentences.length; i += 2) {
    cards.push({
      front: sentences[i],
      back: sentences[i + 1] || sentences[i],
    });
  }

  return cards.slice(0, 5);
}
//console.log("RAW FLASHCARD OUTPUT:\n", res[0].generated_text);
