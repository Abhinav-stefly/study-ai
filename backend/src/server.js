import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/document.routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cloudinary from "./config/cloudinary.js";
import { ENV } from "./config/env.js";

const app = express();

// Connect DB
connectDB();

// Enable CORS
app.use(cors());

// ❗ Only enables JSON parsing AFTER Multer routes
// app.use(express.json()); ❌ REMOVE FROM HERE

// Test Cloudinary
cloudinary.api
  .ping()
  .then(() => console.log("Cloudinary Connected"))
  .catch(err => console.error("Cloudinary Error:", err));

//
// ✅ ROUTES
//


// ------------------------------
// 🟢 AUTH ROUTES (needs JSON)
// ------------------------------
app.use("/api/auth", express.json(), authRoutes);

// ------------------------------
// 🟢 DOCUMENT ROUTES (Multer upload)
// DO NOT put express.json() before these
// ------------------------------
app.use("/api/documents", documentRoutes);


// Now general middlewares
app.use(express.json()); // safe, will not affect Multer

app.use(notFound);
app.use(errorHandler);

app.listen(ENV.PORT, () =>
  console.log(`Server running on port ${ENV.PORT}`)
);
