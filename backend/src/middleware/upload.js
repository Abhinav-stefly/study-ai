import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype?.startsWith?.("image/");
    return {
      folder: "doc-ai/uploads",
      resource_type: isImage ? "image" : "raw",
      public_id: `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, "")}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  if (/^(image\/|application\/pdf)/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "file"));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter,
});

export const uploadSingle = upload.single("file");