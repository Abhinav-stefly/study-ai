import Tesseract from "tesseract.js";
import axios from "axios";
<<<<<<< HEAD
import fsp from "fs/promises";
import { createRequire } from 'module'; 

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromPDF = async (filePath) => {
    try {
=======
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
>>>>>>> f1aafe2c642ebc316db08a8e77517dcc6925771e
        const dataBuffer = await fsp.readFile(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text || "";
    } catch (err) {
        console.error("Local PDF Text Extraction Error:", err.message);
        return "";
    }
};

<<<<<<< HEAD
export const extractTextFromImage = async (imageUrl) => {
  try {
    console.log(`[Tesseract] Starting OCR for: ${imageUrl}`);
    
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
    });
    
    console.log(`[Tesseract] Image buffer size: ${response.data.length} bytes`);
    const imageBuffer = Buffer.from(response.data);

    const result = await Tesseract.recognize(imageBuffer, "eng");
    
    console.log(`[Tesseract] Result structure:`, Object.keys(result));
    console.log(`[Tesseract] Text length: ${result.data?.text?.length || 0}`);
    
    const extractedText = result.data.text || "";
    
    if (!extractedText || extractedText.length === 0) {
      console.warn(`[Tesseract] WARNING: No text extracted from image`);
    }
    
    return extractedText;
    
  } catch (err) {
    console.error(`[Tesseract] Image OCR Error for URL ${imageUrl}:`, err.message);
    console.error(`[Tesseract] Full error:`, err);
=======
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
>>>>>>> f1aafe2c642ebc316db08a8e77517dcc6925771e
    return ""; 
  }
};

<<<<<<< HEAD
export const extractTextFromMultipleImages = async (imageUrls) => {
  let combinedText = "";
  for (const url of imageUrls) {
    console.log(`[Tesseract] Processing page: ${url}`);
=======
/**
 * Helper to process multiple images (kept for potential future image processing).
 */
export const extractTextFromMultipleImages = async (imageUrls) => {
  let combinedText = "";
  for (const url of imageUrls) {
>>>>>>> f1aafe2c642ebc316db08a8e77517dcc6925771e
    const text = await extractTextFromImage(url);
    combinedText += text + "\n\n";
  }
  return combinedText;
};