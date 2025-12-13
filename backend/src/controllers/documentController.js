import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import axios from "axios";
import { promisify } from "util";
import stream from "stream";
import Document from "../models/Document.js";

import { extractTextFromPDF, extractTextFromImage } from "../ai/ocr.js";
import { preprocessOCRText } from "../ai/preprocess.js";
import { generateSummary } from "../ai/summarizer.js";
import { generateQA } from "../ai/qa.js";
import { generateFlashcards } from "../ai/flashcards.js";
import { getEmbedding } from "../ai/embeddings.js";
import { chunkText } from "../utils/chunkText.js";

const streamPipeline = promisify(stream.pipeline);

// ---------------------------------------------------------
// Upload + OCR + NLP + AI Processing
// ---------------------------------------------------------
export const uploadDocument = async (req, res) => {
  let tempPDFPath = null;

  try {
    // 1️⃣ VALIDATION
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = req.file.path;
    const mime = req.file.mimetype;
    let extractedText = "";

    // 2️⃣ OCR
    try {
      if (mime.includes("image")) {
        extractedText = await extractTextFromImage(fileUrl);

      } else if (mime.includes("pdf")) {
        const tempName = `tmp_${req.file.filename}`;
        tempPDFPath = path.join(process.cwd(), tempName);

        const response = await axios({
          method: "get",
          url: fileUrl,
          responseType: "stream",
        });

        const writer = fs.createWriteStream(tempPDFPath);
        await streamPipeline(response.data, writer);

        extractedText = await extractTextFromPDF(tempPDFPath);
      }
    } catch (err) {
      console.error("OCR FAILURE:", err);
      extractedText = "";
    }

    // 3️⃣ PREPROCESSING
    const processed = preprocessOCRText(extractedText);
    const cleanedText = processed.cleanedText || "";
    const headings = processed.headings || [];

    // 4️⃣ SUMMARY
    let summary = "";
    try {
      summary = await generateSummary(cleanedText);
      summary = String(summary);
    } catch {
      summary = "Summary generation failed.";
    }

    // 5️⃣ Q&A (FIXED await bug)
     // 5️⃣ Q&A GENERATION
 let qa = [];
try {
    const generated = generateQA(cleanedText);
    const { questions } = generated;

    // Flatten all types into one array of { question, answer }
    qa = [
        ...questions.mcq.map(q => ({ question: q.question, answer: q.options[q.answer] })),
        ...questions.fillUps.map(q => ({ question: q.question, answer: q.answer })),
        ...questions.trueFalse.map(q => ({ question: q.statement, answer: q.answer })),
        ...questions.shortQA.map(q => ({ question: q.question, answer: q.answer })),
        ...questions.longQA.map(q => ({ question: q.question, answer: q.answer })),
    ];

} catch (err) {
    console.error("QA ERROR:", err);
    qa = [];
}


    // 6️⃣ FLASHCARDS
    let flashcards = [];
    try {
      flashcards = await generateFlashcards(cleanedText);
    } catch {
      flashcards = [];
    }

    // 7️⃣ VECTOR CHUNKS (for chat & semantic search)
    const chunks = [];
    try {
      const textChunks = chunkText(cleanedText, 400);

      for (const chunk of textChunks) {
        const embedding = await getEmbedding(chunk);
        chunks.push({ text: chunk, embedding });
      }
    } catch (err) {
      console.error("EMBEDDING ERROR:", err);
    }

    // 8️⃣ SAVE TO DB
    const document = await Document.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileUrl,
      fileType: mime,
      aiText: extractedText,
      cleanedText,
      headings,
      summary,
      qa,
      flashcards,
      chunks,
    });

    return res.status(201).json({
      message: "Document processed successfully",
      document,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });

  } finally {
    // 9️⃣ CLEAN TEMP FILE
    if (tempPDFPath) {
      try {
        await fsp.unlink(tempPDFPath);
      } catch {
        console.warn("TEMP FILE REMOVE FAILED:", tempPDFPath);
      }
    }
  }
};

// ---------------------------------------------------------
// Fetch Documents
// ---------------------------------------------------------
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id })
      .select("-aiText -chunks.embedding") // keep response light
      .lean();

    return res.status(200).json({ documents });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return res.status(500).json({ message: "Failed to retrieve documents." });
  }
};
