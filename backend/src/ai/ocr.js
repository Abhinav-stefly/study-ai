import Tesseract from "tesseract.js";
import axios from "axios";
import fsp from "fs/promises";
import { createRequire } from 'module'; 

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = await fsp.readFile(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text || "";
    } catch (err) {
        console.error("Local PDF Text Extraction Error:", err.message);
        return "";
    }
};

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
    return ""; 
  }
};

export const extractTextFromMultipleImages = async (imageUrls) => {
  let combinedText = "";
  for (const url of imageUrls) {
    console.log(`[Tesseract] Processing page: ${url}`);
    const text = await extractTextFromImage(url);
    combinedText += text + "\n\n";
  }
  return combinedText;
};