import fetch from "node-fetch";
import { getEmbedding } from "./embeddings.js";
import { findTopKChunks } from "./vectorSearch.js";


// Generate text using Hugging Face Inference API when configured.
export async function generateWithHF(modelName, prompt, maxTokens = 150, fallbackModels = []) {
  const key = process.env.HF_API_KEY;
  if (!key) throw new Error("HF_API_KEY not set");

  const temperature = Number(process.env.HF_TEMPERATURE ?? 0.0);
  const top_k = Number(process.env.HF_TOP_K ?? 0) || undefined;

  const defaultFallback = (process.env.HF_FALLBACK_MODELS || "sshleifer/distilbart-cnn-12-6,gpt2").split(",").map(s=>s.trim()).filter(Boolean);
  const modelsToTry = Array.from(new Set([modelName, ...fallbackModels, ...defaultFallback]));

  const params = { max_new_tokens: maxTokens, return_full_text: false };
  if (!Number.isNaN(temperature)) params.temperature = temperature;
  if (top_k) params.top_k = top_k;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Try each candidate model until one succeeds
  let lastError = null;
  for (const model of modelsToTry) {
    const url = `https://router.huggingface.co/models/${model}`;
    const body = {
      inputs: prompt,
      parameters: params,
      options: { wait_for_model: true }
    };

    const attempts = 3;
    let data = null;
    lastError = null;

    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body),
          timeout: 120000
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HF inference failed: ${res.status} ${txt}`);
        }

        data = await res.json();
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        const backoff = 500 * Math.pow(2, i);
        console.warn(`HF request attempt ${i + 1} for model ${model} failed, retrying in ${backoff}ms`, err.message || err);
        await sleep(backoff);
      }
    }

    if (!lastError && data) {
      // Success — normalize output
      if (Array.isArray(data) && data[0] && data[0].generated_text) return data[0].generated_text;
      if (data.generated_text) return data.generated_text;
      if (typeof data === "string") return data;
      return JSON.stringify(data);
    }

    // If we received a 404 for this model, try next model. Otherwise we'll continue trying other models as well.
    console.warn(`Model ${model} failed:`, lastError?.message || lastError);
  }

  // If we reach here, all models failed
  throw new Error(`HF inference failed for all models tried: ${modelsToTry.join(", ")}. Last error: ${lastError?.message || lastError}`);
}

export async function chatWithNotes(question, chunks) {
  const qEmbedding = await getEmbedding(question);
  const topK = Number(process.env.HF_TOP_K) || 3;
  const context = findTopKChunks(qEmbedding, chunks, topK); // use top-k chunks for richer context

  const prompt = `
Answer the question strictly from the context below. ONLY output the answer; do NOT repeat the question or any instructions. If the answer is not contained in the context, reply: No answer in context.

Context:
${context}

Question:
${question}
`;

    // Debug: log the prompt and a short preview of the context so we can compare
    try {
      console.debug("PROMPT length:", String(prompt).length);
      console.debug("Context preview:", String(context).slice(0, 400));
    } catch (e) {
      console.debug("Could not stringify prompt/context", e);
    }

  // Choose provider: 'hf' uses Hugging Face Inference API (requires HF_API_KEY), otherwise local pipeline
  const provider = (process.env.CHAT_PROVIDER || "local").toLowerCase();
  let generated = "";

  if (provider === "hf" && process.env.HF_API_KEY) {
    const hfModel = process.env.HF_MODEL || "google/flan-t5-large";
    try {
      const out = await generateWithHF(hfModel, prompt, 256);
      generated = String(out ?? "").trim();
      console.debug("HF generated text length:", generated.length);
    } catch (err) {
      console.error("HF generation error:", err);
      generated = "";
    }
  } else {
    // No HF provider configured and local models were removed — skip generation
    console.debug("CHAT_PROVIDER not set to 'hf' or HF_API_KEY missing; skipping generation");
    generated = "";
  }

  function sanitize(text) {
    if (!text) return "";
    let t = String(text).trim();

    // Remove instruction prefix if model echoed it
    t = t.replace(/^Answer the question strictly from the context below\.\s*/i, "");

    // If there's an explicit 'Answer:' label, use the text after the last 'Answer:'
    const lastAnswerIdx = t.toLowerCase().lastIndexOf("answer:");
    if (lastAnswerIdx !== -1) {
      t = t.slice(lastAnswerIdx + "answer:".length).trim();
      return t;
    }

    // If the model echoed the entire prompt, try to remove everything up to the
    // question and then take what's after the question (commonly the answer).
    const qLower = "question:";
    const qIdx = t.toLowerCase().indexOf(qLower);
    if (qIdx !== -1) {
      const after = t.slice(qIdx + qLower.length).trim();

      // If there's a double newline, assume answer follows after the blank line
      const nl = after.indexOf("\n\n");
      if (nl !== -1) {
        t = after.slice(nl + 2).trim();
        return t;
      }

      // Otherwise if the question text is included, try to remove the question content
      // by splitting on the question string itself and taking the last part.
      const parts = t.split(/Question:/i);
      if (parts.length > 1) {
        t = parts[parts.length - 1].trim();
        // If there's still 'Context:' or other labels, try to remove them
        t = t.replace(/^(Context:|Question:)/i, "").trim();
        return t;
      }
    }

    // As a last resort, if there are multiple blank-line-separated blocks, take the last block
    const blocks = t.split(/\n\s*\n/);
    if (blocks.length > 1) {
      return blocks[blocks.length - 1].trim();
    }

    return t;
  }

  let answerText = sanitize(generated);

  // If model just echoed the instruction or returned an instruction-like response,
  // fall back to an explicit 'No answer in context' marker so frontend can display it.
  const echoPattern = /\banswer the question\b|\bcontext below\b|\bquestion below\b|do not repeat/i;
  if (!answerText || echoPattern.test(answerText) || answerText.length < 20) {
    answerText = "No answer in context.";
  }

  // Debug derived answer
  console.debug("derived answerText:", answerText);

  // If we couldn't get a generated answer but we do have context, return a short
  // excerpt from the best-matching chunk as a fallback so frontend displays useful info.
  if (answerText === "No answer in context." && context) {
    const excerpt = String(context).trim().slice(0, 400);
    const fallback = excerpt.length ? `Context excerpt: ${excerpt}` : answerText;
    console.debug("using fallback excerpt:", fallback);
    return fallback;
  }

  return answerText;

}
