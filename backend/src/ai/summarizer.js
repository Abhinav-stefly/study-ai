<<<<<<< HEAD
// ai/summarizer.js
import { pipeline } from "@xenova/transformers";

let summarizer = null;

// Load once (cached)
async function loadSummarizer() {
    if (!summarizer) {
        summarizer = await pipeline(
            "summarization",
            "Xenova/distilbart-cnn-12-6"
        );
    }
    return summarizer;
}

// Split long text into chunks
function chunkText(text, chunkSize = 600) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}

export async function generateSummary(text) {
    try {
        if (!text || typeof text !== "string" || text.length < 40) {
            return "Not enough text to summarize.";
        }

        const model = await loadSummarizer();
        const chunks = chunkText(text);

        let finalSummary = "";

        for (const chunk of chunks) {
            const res = await model(chunk, {
                max_length: 120,
                min_length: 40,
            });

            if (Array.isArray(res) && res[0]?.summary_text) {
                finalSummary += res[0].summary_text + " ";
            }
        }

        return finalSummary.trim();
    } catch (err) {
        console.error("Summarization Error:", err);
        return "Error generating summary.";
    }
}
=======
// ...existing code...
export const summarizeText = async (text) => {
  if (!text) return "";
  const lines = text.trim().split(/\r?\n+/).filter(Boolean);
  return lines.slice(0, 3).join(' ');
};
// ...existing code...
>>>>>>> f1aafe2c642ebc316db08a8e77517dcc6925771e
