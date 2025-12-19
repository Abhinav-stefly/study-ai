import fetch from "node-fetch";

let embedder = null;

// Prefer HF embeddings if HF_API_KEY is set, otherwise fall back to Xenova pipeline when available
export async function getEmbedding(text) {
  if (!text) return [];

  const hfKey = process.env.HF_API_KEY;
  if (hfKey) {
    try {
      const model = process.env.HF_EMBED_MODEL || "sentence-transformers/all-MiniLM-L6-v2";
      const url = `https://router.huggingface.co/models/${model}`;

      // retry with backoff
      const attempts = 3;
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      let lastErr = null;
      let data = null;

      for (let i = 0; i < attempts; i++) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${hfKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: text }),
          });
          if (!res.ok) {
            const t = await res.text();
            throw new Error(`HF embed failed: ${res.status} ${t}`);
          }
          data = await res.json();
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          const backoff = 400 * Math.pow(2, i);
          console.warn(`HF embed attempt ${i + 1} failed, retrying in ${backoff}ms`, err.message || err);
          await sleep(backoff);
        }
      }
      if (lastErr) throw lastErr;
      // Handle shapes: { embedding: [...] } or { data: [{embedding: [...]}] }
      if (Array.isArray(data?.data) && data.data[0]?.embedding) return data.data[0].embedding;
      if (data.embedding) return data.embedding;
      // Some models return raw array
      if (Array.isArray(data)) return data.flat();
      throw new Error("Unexpected HF embed response");
    } catch (err) {
      console.warn("HF embedding failed, falling back if available:", err.message || err);
    }
  }

  // Fallback to Xenova embedder if available
  try {
    if (!embedder) {
      const { pipeline } = await import("@xenova/transformers");
      embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    const output = await embedder(text, { pooling: "mean", normalize: true });
    return Array.from(output.data || output[0]);
  } catch (err) {
    console.error("Embedding failed:", err);
    return [];
  }
}
