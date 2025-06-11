// Routes for wallet management endpoints

import { Router } from "express";
import { transferController } from "../controllers/walletController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.post("/transfer", authenticateUser, transferController);

export default router;
