export async function generateFlashcards(text) {
  if (!text || typeof text !== "string") return [];

  const prompt = `
Create 5 short study flashcards from the following text.
Each flashcard should explain one key concept clearly.

Text:
${text}
`;
  // Use Hugging Face Inference API for generation
  try {
    const hfModel = process.env.HF_MODEL || "google/flan-t5-large";
    // lazy-import generateWithHF to avoid circular dependency
    const { generateWithHF } = await import("./chat.js");
    const out = await generateWithHF(hfModel, prompt, 300);
    return smartParse(String(out ?? ""));
  } catch (err) {
    console.error("Flashcards HF generation error:", err);
    // Fallback: extract key sentences as flashcards
    try {
      const sentences = String(text)
        .replace(/\s+/g, ' ')
        .split(/[.?!]\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 40);

      const cards = sentences.slice(0, 5).map((s, i) => ({
        front: s.split(/,|;|:\s/)[0].slice(0, 80) + '...',
        back: s
      }));
      return cards;
    } catch (e) {
      console.error('Flashcards fallback failed:', e);
      return [];
    }
  }
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
