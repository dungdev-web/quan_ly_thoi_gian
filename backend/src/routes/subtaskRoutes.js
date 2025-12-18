import express from "express";
import SubtaskController from "../controllers/subtaskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true }); 

router.use(protect);

// CRUD Subtask
router.post("/:todoId", SubtaskController.create);      
router.get("/", SubtaskController.getAll);       
router.put("/:id", SubtaskController.update);    
router.delete("/:id", SubtaskController.delete);  

export default router;
