import express from "express";
import { chatWithNotes } from "../ai/chat.js";
import Document from "../models/Document.js";


const router = express.Router();

router.post("/chat/:docId", async (req, res) => {
  try {
    const { docId } = req.params;
    console.log("/chat request for docId:", docId);
    console.log("request body:", req.body);

    const doc = await Document.findById(docId);
    if (!doc) {
      console.warn("Document not found for", docId);
      return res.status(404).json({ message: "Document not found" });
    }

    console.log("CHUNKS:", doc?.chunks?.length);
    const answer = await chatWithNotes(req.body.question, doc.chunks);

    console.log("Answer generated (truncated):", String(answer).slice(0, 300));
    return res.json({ answer });
  } catch (err) {
    console.error("/chat error:", err);
    return res.status(500).json({ message: "Chat failed", error: err.message });
  }
});

export default router;
