import Document from "../models/Document.js";
import { runOCR } from "../ai/ocr.js";
import { summarizeText } from "../ai/summarizer.js"; // optional summarizer


export const uploadDocument = async (req, res) => {
try {
//if (!req.file) return res.status(400).json({ message: "No file uploaded" });
console.log("REQ.FILE =", req.file);
console.log("REQ.BODY =", req.body);


// file.path is Cloudinary URL when using multer-storage-cloudinary
const fileUrl = req.file.path || req.file.location || req.file.url;


const doc = await Document.create({
user: req.user._id,
originalName: req.file.originalname,
fileUrl,
fileType: req.file.mimetype,
});


// Run OCR (extract text)
let extractedText = "";
try {
extractedText = await runOCR(fileUrl);
} catch (ocrErr) {
console.error("OCR error:", ocrErr.message);
}


// Optionally run summarizer if available
let summary = "";
if (extractedText) {
try {
summary = await summarizeText(extractedText);
} catch (sumErr) {
console.error("Summarizer error:", sumErr.message);
}
}


doc.aiText = extractedText;
doc.summary = summary;
await doc.save();


res.status(201).json({ message: "Document uploaded and processed", doc });
} catch (err) {
console.error(err);
res.status(500).json({ message: err.message });
}
};


export const getDocuments = async (req, res) => {
try {
const docs = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
res.json(docs);
} catch (err) {
res.status(500).json({ message: err.message });
}
};