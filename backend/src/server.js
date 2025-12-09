import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { ENV } from "./config/env.js";


const app = express();
connectDB();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);


app.use(notFound);
app.use(errorHandler);


app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));