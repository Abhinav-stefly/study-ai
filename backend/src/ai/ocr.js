// ...existing code...
import fetch from "node-fetch";

// This module uses OCR.space API as the default OCR engine.
// If you prefer Google Vision / AWS Textract / tesseract.js you can replace this implementation.

export const runOCR = async (fileUrl) => {
  const OCR_API_KEY = process.env.OCR_SPACE_API_KEY; // put in .env
  if (!OCR_API_KEY) throw new Error("OCR_SPACE_API_KEY not set in .env");

  const formData = new URLSearchParams();
  formData.append("apikey", OCR_API_KEY);
  formData.append("url", fileUrl);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
    // node-fetch will set the appropriate headers for URLSearchParams
  });

  if (!res.ok) {
    throw new Error(`OCR API request failed: ${res.status} ${res.statusText}`);
  }

  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error("Failed to parse OCR API response as JSON");
  }

  if (!json || json.OCRExitCode !== 1) {
    const errorMessage = Array.isArray(json?.ErrorMessage)
      ? json.ErrorMessage.join(", ")
      : json?.ErrorMessage || JSON.stringify(json);
    throw new Error("OCR failed: " + errorMessage);
  }

  const parsed = (json.ParsedResults?.map((p) => p.ParsedText).join("\n")) || "";
  return parsed.trim();
};
// ...existing code...