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

    qa: [
        {
            question: { type: String },
            answer: { type: String }
        }
    ], // ⬅ ADD THIS

    metadata: { type: Object }
},
{ timestamps: true }
);

export default mongoose.model("Document", docSchema);
