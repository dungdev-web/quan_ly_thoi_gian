import express from "express";
import  TimeLogController  from "../controllers/timeLog.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/start", TimeLogController.start);
router.post("/stop", TimeLogController.stop);

router.get("/running", TimeLogController.running);
router.get("/overview", TimeLogController.overview);
router.get("/chart-7-days", TimeLogController.last7Days);
router.get("/category-stats", TimeLogController.categoryStats);
router.get("/today", TimeLogController.today);

export default router;
