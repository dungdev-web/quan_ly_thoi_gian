import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import AiController from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai/suggest-subtasks   { title, description }
router.post("/suggest-subtasks", protect, AiController.suggestSubtasks);

// POST /api/ai/analyze-time       { timeLogs: [...] }
router.post("/analyze-time", protect, AiController.analyzeTimeHabits);

// POST /api/ai/prioritize         { todos: [...] }
router.post("/prioritize", protect, AiController.prioritizeTodos);

// POST /api/ai/chat               { message, context? }
router.post("/chat", protect, AiController.chat);
router.get("/analyze-productivity", protect, AiController.analyzeProductivity);

export default router;