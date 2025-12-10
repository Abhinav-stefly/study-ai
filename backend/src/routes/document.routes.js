import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { uploadDocument, getDocuments } from "../controllers/documentController.js";

const router = express.Router();

// Wrap multer to catch Multer errors and return JSON instead of crashing
router.post(
  "/upload",
  protect,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        // Multer error
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message, code: err.code });
        }
        // Other errors (cloudinary, etc.)
        return res.status(500).json({ message: err.message });
      }
      next();
    });
  },
  uploadDocument
);

// GET /api/documents/
router.get("/", protect, getDocuments);

export default router;