// Routes for admin dashboard and management

import { Router } from "express";
import { authenticateUser, authorizeRoles } from "../middleware/auth";
import { createServiceSystemWalletController } from "../controllers/serviceController";
import { UserRole } from "../../generated/prisma";

const router = Router();

router.use(authenticateUser);
router.use(authorizeRoles([UserRole.ADMIN]));

router.post(
  "/services/:serviceId/create-system-wallet",
  createServiceSystemWalletController
);

export default router;
