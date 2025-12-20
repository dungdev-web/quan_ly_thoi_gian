import express from "express";
import UserController from "../controllers/authController.js";
const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/verify", UserController.verify);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/logout", UserController.logout);
export default router;
