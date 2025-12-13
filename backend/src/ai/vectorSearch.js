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
