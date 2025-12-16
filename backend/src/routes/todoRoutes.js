import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import  TodoController from "../controllers/todoController.js";
const router = express.Router();

router.get("/user/:userId", protect, TodoController.getAll);
router.post("/", protect,  TodoController.create);
router.get("/:id",protect, TodoController.getById);
router.put("/:id", protect, TodoController.update);
router.delete("/:id", protect, TodoController.delete);
router.patch("/:id/position",protect, TodoController.updatePosition);
router.get("/user/archived/:userId", protect, TodoController.getAchievedTodos);
router.patch("/archive/:id", protect, TodoController.setArchivedTodo);

export default router;
