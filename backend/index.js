import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// 1️⃣ LOAD ENV TRƯỚC TIÊN — phải là dòng đầu tiên
dotenv.config();

import authRoutes from "./src/routes/authRoutes.js";
import todoRoutes from "./src/routes/todoRoutes.js";
import subtaskRoutes from "./src/routes/subtaskRoutes.js";
import timeLogRoutes from "./src/routes/timeLog.routes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js"
const app = express();
const PORT = process.env.PORT || 3000;

// Kiểm tra env đã load chưa
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅" : "❌ MISSING");
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY ? "✅" : "❌ MISSING");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://quan-ly-thoi-gian.vercel.app"
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/subtasks", subtaskRoutes);
app.use("/api/time-logs", timeLogRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});