import { Router } from "express";
import { getUserTransactionsController } from "../controllers/transactionController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.use(authenticateUser);
router.get("/", getUserTransactionsController);

export default router;
