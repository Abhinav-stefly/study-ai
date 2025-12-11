import Document from "../models/Document.js";
import { extractTextFromImage, extractTextFromPDF } from "../ai/ocr.js";
import { summarizeText } from "../ai/summarizer.js";
import { v2 as cloudinary } from "cloudinary"; 

// --- FS Import Fix ---
import * as fs from "fs"; // Base module for streams (e.g., createWriteStream)
import fsp from "fs/promises"; // Promises API for async operations (e.g., unlink)
import path from "path";
import axios from "axios"; 

// This helper is necessary because fs.createWriteStream uses classic streams/events
const streamPipeline = (stream, writable) => {
    return new Promise((resolve, reject) => {
        stream.pipe(writable);
        stream.on('end', resolve);
        stream.on('error', reject);
        writable.on('error', reject);
    });
};

/**
 * Handles document upload, local PDF processing, OCR, summarization, and database saving.
 */
export const uploadDocument = async (req, res) => {
  let localFilePath = null;

  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = req.file.path;
    const mime = req.file.mimetype;

    console.log(`[Processor] Uploaded: ${mime}`);

    let extractedText = "";

    // --- 1. Text Extraction Pipeline ---
    try {
      if (mime.includes("image")) {
        // Case 1: Standard Image OCR (Uses Cloudinary URL + Tesseract via axios)
        console.log("Starting Image OCR...");
        extractedText = await extractTextFromImage(fileUrl);
        
      } else if (mime.includes("pdf")) {
        // Case 2: PDF Text Extraction (Download file locally for pdf-parse)
        console.log("Starting Local PDF Text Extraction...");
        
        // Define a unique temporary file path (in the OS temp directory or project root)
        // Using cwd() is safer than assuming a 'tmp' folder exists.
        const tempFileName = `tmp_${req.file.filename}`;
        localFilePath = path.join(process.cwd(), tempFileName); 

        // a) Download the file from Cloudinary to the local server
        const response = await axios({
            method: 'get',
            url: fileUrl, 
            responseType: 'stream'
        });

        // Use 'fs' (base module) for createWriteStream
        const writer = fs.createWriteStream(localFilePath); 
        await streamPipeline(response.data, writer);
        console.log(`PDF temporarily saved to: ${localFilePath}`);

        // b) Run local pdf-parse on the downloaded file
        extractedText = await extractTextFromPDF(localFilePath);

      } else {
         console.log(`Unsupported file type (${mime}). Skipping extraction.`);
         extractedText = `Extraction skipped for file type: ${mime}`;
      }
    } catch (err) {
      console.error("[Extraction Pipeline] Major Error:", err);
      extractedText = "An error occurred during text extraction.";
    }

    // --- 2. Summarization ---
    let summary = "";
    if (extractedText && extractedText.length > 50 && !extractedText.includes("Extraction skipped")) {
      try {
        console.log("Starting text summarization...");
        summary = await summarizeText(extractedText);
      } catch (err) {
        console.error("Summarization Error:", err);
      }
    }

    // --- 3. Database Save ---
    const doc = await Document.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileUrl,
      fileType: mime,
      aiText: extractedText,
      summary,
    });

    res.status(201).json({ message: "Document uploaded and processed", doc });

  } catch (error) {
    console.error("FATAL UPLOAD ERROR:", error);
    res.status(500).json({ message: error.message });
  } finally {
    // --- 4. Cleanup Local File (using fsp for promise-based unlink) ---
    if (localFilePath) {
        try {
            await fsp.unlink(localFilePath);
            console.log(`Cleaned up temp file: ${localFilePath}`);
        } catch (e) {
            console.warn(`Could not delete temp file ${localFilePath}:`, e.message);
        }
    }
  }
};

/**
 * Handles fetching documents for the authenticated user.
 */
export const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ user: req.user._id })
            .select('-aiText -summary') 
            .lean();
        
        res.status(200).json({ documents });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: "Failed to retrieve documents." });
    }
};