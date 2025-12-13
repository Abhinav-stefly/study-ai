import express from "express";
import { chatWithNotes } from "../ai/chat.js";
import Document from "../models/Document.js";


const router = express.Router();

router.post("/chat/:docId", async (req, res) => {
  const doc = await Document.findById(req.params.docId);
  const answer = await chatWithNotes(req.body.question, doc.chunks);

  res.json({ answer });
});

export default router;
