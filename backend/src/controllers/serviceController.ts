// Handles service-related HTTP requests (airtime, data, utilities)

import { Request, Response } from "express";
import {
  createService,
  getServiceById,
  getAllActiveServices,
} from "../services/serviceManagement";
import { log } from "../utils/logger";
import { ValidationError } from "../utils/validation";
import { ServiceType } from "../../generated/prisma";

export async function createServiceController(req: Request, res: Response) {
  try {
    // 1. Extract data from the request body.
    const { name, type, description } = req.body;

    // 3. Call the createService function from serviceManagementService.
    const newService = await createService(name, type, description);

    // 4. Handle successful service creation.
    log.info(`Service created successfully: ${newService.name}`);
    res.status(201).json({
      message: "Service created successfully.",
      service: newService,
    });
    return;
  } catch (error: any) {
    // 5. Handle errors.
    log.error("Service creation error occurred:", error);
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Service creation failed." });
    return;
  }
}

export async function getServiceByIdController(req: Request, res: Response) {
  try {
    // 1. Extract the service ID from request parameters.
    const serviceId = req.params.id;
    if (
      !serviceId ||
      typeof serviceId !== "string" ||
      serviceId.trim().length === 0
    ) {
      log.warn("Service retrieval failed: Invalid service ID.");
      throw new ValidationError("Service ID must be a non-empty string.");
    }

    // 2. Call the getServiceById function from your serviceManagementService.
    const service = await getServiceById(serviceId);

    // 3. Handle successful service retrieval.
    log.info(`Service retrieved successfully: ${service.name}`);
    res.status(200).json({
      message: "Service retrieved successfully.",
      service,
    });
    return;
  } catch (error: any) {
    // 4. Handle errors.
    log.error("Service retrieval error occurred:", error);
    if (error instanceof ValidationError) {
      if (error.message === "Service not found.") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
      return;
    }
    res.status(500).json({ message: "Service retrieval failed." });
    return;
  }
}

export async function listServicesController(req: Request, res: Response) {
  try {
    // 1. Call the getAllActiveServices function serviceManagementService.
    const services = await getAllActiveServices();

    // 2. Handle successful service retrieval.
    log.info(`Retrieved ${services.length} active services.`);
    res.status(200).json({
      message: "Active services retrieved successfully.",
      services,
    });
    return;
  } catch (error: any) {
    // 3. Handle errors.
    log.error("Service listing error occurred:", error);
    res
      .status(500)
      .json({
        message: "An unexpected error occurred during service retrieval.",
      });
    return;
  }
}
