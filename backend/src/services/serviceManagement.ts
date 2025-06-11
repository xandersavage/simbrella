import { PrismaClient } from "../../generated/prisma";
import { ServiceType } from "../../generated/prisma";
import { log } from "../utils/logger";
import { ValidationError } from "../utils/validation";

// Initialize PrismaClient.
const prisma = new PrismaClient();

export async function createService(
  name: string,
  type: ServiceType,
  description?: string
) {
  // Implement input validation for 'name' and 'type'.

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    log.warn("Service creation failed: Invalid service name.");
    throw new ValidationError("Service name must be a non-empty string.");
  }

  if (!type || !Object.values(ServiceType).includes(type)) {
    log.warn("Service creation failed: Invalid service type.");
    throw new ValidationError(
      "Service type must be a valid ServiceType enum value."
    );
  }

  // 4 Check if a service with the given name already exists in the database.
  const existingService = await prisma.service.findUnique({
    where: { name },
  });

  // 5 If the service already exists, log a warning and throw a ValidationError.
  if (existingService) {
    log.warn(
      `Service creation failed: Service with name "${name}" already exists.`
    );
    throw new ValidationError("Service with this name already exists.");
  }

  // 6 Create the new service in the database.
  const newService = await prisma.service.create({
    data: {
      name,
      type,
      description: description || null,
      isActive: true,
    },
  });

  // 7 Log success and return the created service object.
  log.info(`Service created successfully: ${newService.name}`);
  return newService;
}

export async function getServiceById(serviceId: string) {
  // 8 Implement logic to find a service by its ID.
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    log.warn(`Service not found: ${serviceId}`);
    throw new ValidationError("Service not found.");
  }

  return service;
}

export async function getAllActiveServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
  });

  if (services.length === 0) {
    log.info("No active services found.");
    return [];
  }

  log.info(`Retrieved ${services.length} active services.`);
  return services;
}
