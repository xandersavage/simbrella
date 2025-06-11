// Routes for wallet management endpoints

import { Router } from "express";
import {
  transferController,
  servicePaymentController,
  createWalletController,
  fundWalletController,
} from "../controllers/walletController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.use(authenticateUser);

router.post("/", createWalletController);
router.post("/service-payment", servicePaymentController);
router.post("/pay-service", transferController);
router.post("/fund", fundWalletController);

export default router;
