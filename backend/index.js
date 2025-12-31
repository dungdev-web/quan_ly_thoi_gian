import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/authRoutes.js";
import todoRoutes from "./src/routes/todoRoutes.js";
import subtaskRoutes from "./src/routes/subtaskRoutes.js";
import timeLogRoutes from "./src/routes/timeLog.routes.js";
const datbase_url = process.env.DATABASE_URL;
console.log(datbase_url);

// 1️⃣ LOAD ENV TRƯỚC TIÊN
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 2️⃣ Middleware cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3️⃣ CORS — CHUẨN CHO VERCEL + LOCAL
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://quan-ly-thoi-gian.vercel.app"
    ],
    credentials: true,
  })
);

// 4️⃣ Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/subtasks", subtaskRoutes);
app.use("/api/time-logs", timeLogRoutes);

// 5️⃣ Start server
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
