import mongoose from "mongoose";

<<<<<<< HEAD
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
=======

const docSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
originalName: { type: String, required: true },
fileUrl: { type: String, required: true },
fileType: { type: String, required: true },
aiText: { type: String },
summary: { type: String },
metadata: { type: Object },
>>>>>>> f1aafe2c642ebc316db08a8e77517dcc6925771e
},
{ timestamps: true }
);

<<<<<<< HEAD
export default mongoose.model("Document", docSchema);
=======

export default mongoose.model("Document", docSchema);
>>>>>>> f1aafe2c642ebc316db08a8e77517dcc6925771e
