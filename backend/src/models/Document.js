import mongoose from "mongoose";


const docSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
originalName: { type: String, required: true },
fileUrl: { type: String, required: true },
fileType: { type: String, required: true },
aiText: { type: String },
summary: { type: String },
metadata: { type: Object },
},
{ timestamps: true }
);


export default mongoose.model("Document", docSchema);