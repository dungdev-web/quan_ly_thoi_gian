import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import CategoryController from "../controllers/categoryController.js";
const router = express.Router();
router.get("/user", protect, CategoryController.getCategoriesByUser);
router.post("/", protect, CategoryController.createCategory);
router.get("/:id", protect, CategoryController.getCategoryById);
export default router;