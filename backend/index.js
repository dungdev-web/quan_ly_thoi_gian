import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import todoRoutes from "./src/routes/todoRoutes.js";
import subtaskRoutes from "./src/routes/subtaskRoutes.js";
import timeLogRoutes from "./src/routes/timeLog.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// 1️⃣ Phải để express.json() lên đầu
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2️⃣ Cookie phải parse trước khi xử lý route
app.use(cookieParser());

// 3️⃣ CORS phải đặt sau express.json và cookieParser
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 4️⃣ Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/subtasks", subtaskRoutes);  // ❗ Đã sửa
app.use("/api/time-logs", timeLogRoutes);
// 5️⃣ Start server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
