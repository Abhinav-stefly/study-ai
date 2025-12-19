// ai/summarizer.js
let summarizer = null;

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

        const hfModel = process.env.HF_MODEL || "google/flan-t5-large";
        const chunks = chunkText(text);

        let finalSummary = "";
        try {
            const { generateWithHF } = await import("./chat.js");
            for (const chunk of chunks) {
                const prompt = `Summarize the following text in 2-3 concise sentences:\n\n${chunk}`;
                try {
                    const out = await generateWithHF(hfModel, prompt, 120);
                    if (out && String(out).trim()) {
                        finalSummary += String(out).trim() + " ";
                    }
                } catch (errChunk) {
                    console.warn("Summarizer chunk HF error:", errChunk?.message || errChunk);
                    // continue with other chunks
                }
            }
        } catch (err) {
            console.error("Summarizer HF error:", err);
        }

        finalSummary = String(finalSummary).trim();

        // Fallback: if HF didn't produce anything, derive a simple summary
        if (!finalSummary) {
            try {
                const sentences = String(text).split(/[.?!]\s+/).filter(s => s.trim().length > 20);
                finalSummary = sentences.slice(0, 3).join('. ') + (sentences.length ? '.' : '');
            } catch (err) {
                console.error('Summarizer fallback error:', err);
                finalSummary = 'Summary generation failed.';
            }
        }

        return finalSummary.trim();
    } catch (err) {
        console.error("Summarization Error:", err);
        return "Error generating summary.";
    }
}
