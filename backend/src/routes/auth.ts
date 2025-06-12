// Routes for authentication endpoints (login, register, password reset, etc.)
import { Router } from "express";
import {
  loginController,
  signupController,
  getMeController,
} from "../controllers/authController";
import { authenticateUser } from "../middleware/auth";
const router = Router();

router.post("/login", loginController);
router.post("/signup", signupController);

router.get("/me", authenticateUser, getMeController);

export default router;
