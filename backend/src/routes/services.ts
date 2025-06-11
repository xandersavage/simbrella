// Routes for service related endpoints (airtime, utilities, etc.)
import { Router } from "express";
import {
  listServicesController,
  createServiceController,
  getServiceByIdController,
} from "../controllers/serviceController";
import { authenticateUser, authorizeRoles } from "../middleware/auth";
const router = Router();

router.use(authenticateUser);

router.get("/", listServicesController);

router.post("/", authorizeRoles(["ADMIN"]), createServiceController);
router.get("/:id", authorizeRoles(["ADMIN"]), getServiceByIdController);

export default router;
