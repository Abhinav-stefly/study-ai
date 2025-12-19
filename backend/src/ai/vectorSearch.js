function cosineSimilarity(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

export function findBestChunk(queryEmbedding, chunks) {
  let bestScore = -1;
  let bestChunk = "";

  for (const c of chunks) {
    const score = cosineSimilarity(queryEmbedding, c.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestChunk = c.text;
    }
  }

  return bestChunk;
}

export function findTopKChunks(queryEmbedding, chunks, k = 3) {
  if (!chunks || !chunks.length) return "";

  const scored = chunks.map(c => ({ text: c.text, score: cosineSimilarity(queryEmbedding, c.embedding) }));
  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, k).map(s => s.text.trim()).filter(Boolean);
  return top.join("\n\n");
}
