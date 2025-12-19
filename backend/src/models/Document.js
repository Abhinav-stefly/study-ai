import mongoose from "mongoose";

const docSchema = new mongoose.Schema(
{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },

    aiText: { type: String },
    cleanedText: { type: String },       // ⬅ ADD THIS
    headings: { type: Array, default: [] }, // ⬅ ADD THIS

    summary: { type: String },

    // Structured QA object created at upload: { mcq: [], fillUps: [], trueFalse: [], shortQA: [], longQA: [] }
    qa: {
      type: Object,
      default: {}
    },
chunks: [
  {
    text: String,
    embedding: [Number]
  }
],
flashcards: [
  {
    front: { type: String },
    back: { type: String }
  }
],
    metadata: { type: Object }
},
{ timestamps: true }
);

export default mongoose.model("Document", docSchema);
