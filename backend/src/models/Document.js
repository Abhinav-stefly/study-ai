const documentSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
originalName: { type: String, required: true },
fileUrl: { type: String, required: true },
extractedText: { type: String },
summary: { type: String },
category: { type: String },
},
{ timestamps: true }
);


export const Document = mongoose.model("Document", documentSchema);