// Routes for wallet management endpoints

import { Router } from "express";
import {
  transferController,
  servicePaymentController,
  createWalletController,
  fundWalletController,
  getUserWalletsController,
} from "../controllers/walletController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.use(authenticateUser);

router.get("/", getUserWalletsController);

router.post("/", createWalletController);
router.post("/service-payment", servicePaymentController);
router.post("/transfer", transferController);
router.post("/fund", fundWalletController);

export default router;
