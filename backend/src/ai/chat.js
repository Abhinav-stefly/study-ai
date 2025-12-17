import { pipeline } from "@xenova/transformers";
import { getEmbedding } from "./embeddings.js";
import { findBestChunk } from "./vectorSearch.js";

let qaModel;

async function loadQA() {
  if (!qaModel) {
    qaModel = await pipeline("text2text-generation", "Xenova/t5-small");
  }
  return qaModel;
}

export async function chatWithNotes(question, chunks) {
  const qEmbedding = await getEmbedding(question);
  const context = findBestChunk(qEmbedding, chunks);

  const prompt = `
Answer the question strictly from the context below.

Context:
${context}

Question:
${question}
`;

  const model = await loadQA();
  const res = await model(prompt, { max_length: 150 });

  return {
  answer: res[0].generated_text
};

}
