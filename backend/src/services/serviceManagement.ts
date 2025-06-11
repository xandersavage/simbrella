import { PrismaClient } from "../../generated/prisma";
import { ServiceType } from "../../generated/prisma";
import { log } from "../utils/logger";
import { ValidationError } from "../utils/validation";
import { WalletType } from "../../generated/prisma";

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

export async function createServiceSystemWallet(
  serviceId: string,
  currency: string = "NGN",
  initialBalance: number = 0
) {
  // 1. Validate serviceId input.
  if (
    !serviceId ||
    typeof serviceId !== "string" ||
    serviceId.trim().length === 0
  ) {
    log.warn("Service system wallet creation failed: Invalid serviceId.");
    throw new ValidationError(
      "Invalid serviceId. It must be a non-empty string."
    );
  }
  if (
    typeof initialBalance !== "number" ||
    isNaN(initialBalance) ||
    initialBalance < 0
  ) {
    log.warn("Service system wallet creation failed: Invalid initialBalance.");
    throw new ValidationError(
      "Invalid initialBalance. It must be a non-negative number."
    );
  }

  // 2. Find the service to ensure it exists.
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    log.warn(`Service not found: ${serviceId}`);
    throw new ValidationError("Service not found.");
  }

  // 3. Check if the service already has a system wallet.
  const existingWallet = await prisma.wallet.findFirst({
    where: { serviceId: serviceId },
  });

  if (existingWallet) {
    log.warn(`Service already has a system wallet: ${serviceId}`);
    throw new ValidationError("Service already has a system wallet.");
  }

  // 4. Create the new Wallet for the service.

  const newWallet = await prisma.wallet.create({
    data: {
      name: `${service.name} System Wallet`,
      type: WalletType.SYSTEM,
      balance: initialBalance,
      currency,
      isActive: true,
      serviceId,
    },
  });

  // 5. Log success and return the created wallet.
  log.info(
    `Service system wallet created successfully: ${newWallet.id} for service ${service.name}`
  );
  return newWallet;
}

export async function getServiceSystemWallet(serviceId: string) {
  // 1. Validate serviceId input.
  if (
    !serviceId ||
    typeof serviceId !== "string" ||
    serviceId.trim().length === 0
  ) {
    log.warn("Service system wallet retrieval failed: Invalid serviceId.");
    throw new ValidationError(
      "Invalid serviceId. It must be a non-empty string."
    );
  }

  // 2. Find the service's system wallet.
  const wallet = await prisma.wallet.findFirst({
    where: { serviceId, type: WalletType.SYSTEM },
  });

  if (!wallet) {
    log.warn(`Service system wallet not found for service: ${serviceId}`);
    throw new ValidationError("Service system wallet not found.");
  }

  return wallet;
}
