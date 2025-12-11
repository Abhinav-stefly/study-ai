import Tesseract from "tesseract.js";
import axios from "axios";
import fsp from "fs/promises"; // Use fsp for promise-based file read in pdf-parse
import { createRequire } from 'module'; 

// Use createRequire to import CommonJS libraries like pdf-parse in ES Modules
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Extracts text directly from a PDF file using a local file path.
 * * @param {string} filePath - The local file path where the PDF is temporarily saved.
 * @returns {Promise<string>} - The extracted text.
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        // Use fsp (promises API) to read the file buffer
        const dataBuffer = await fsp.readFile(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text || "";
    } catch (err) {
        console.error("Local PDF Text Extraction Error:", err.message);
        return "";
    }
};

/**
 * Extracts text from a single image URL by fetching the image into a Buffer first.
 * (Used for image uploads only).
 */
export const extractTextFromImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    
    const imageBuffer = Buffer.from(response.data);

    const result = await Tesseract.recognize(imageBuffer, "eng");

    return result.data.text || "";
  } catch (err) {
    console.error(`Image OCR Error for URL ${imageUrl}:`, err.message);
    return ""; 
  }
};

/**
 * Helper to process multiple images (kept for potential future image processing).
 */
export const extractTextFromMultipleImages = async (imageUrls) => {
  let combinedText = "";
  for (const url of imageUrls) {
    const text = await extractTextFromImage(url);
    combinedText += text + "\n\n";
  }
  return combinedText;
};