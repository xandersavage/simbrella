// Business logic for user authentication

import { PrismaClient, Prisma } from "../../generated/prisma";
import { log } from "../utils/logger";
import { UserRole } from "../../generated/prisma";
import {
  ValidationError,
  validatePassword,
  validateEmail,
  validatePhoneNumber,
} from "../utils/validation";
import { hashPassword } from "../utils/security";

const prisma = new PrismaClient();

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber?: string
) {
  // Validate input
  if (!validateEmail(email)) {
    log.error(`Invalid email format: ${email}`);
    throw new ValidationError("Invalid email format.");
  }
  if (!validatePassword(password)) {
    log.error(`Invalid password format.`);
    throw new ValidationError(
      "Password does not meet complexity requirements."
    );
  }

  if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
    log.error(`Invalid phone number format: ${phoneNumber}`);
    throw new ValidationError("Invalid phone number format.");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new ValidationError("User with this email already exists.");
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.USER,
    },
  });

  log.info(`User registered successfully: ${user.email}`);
  return user;
}
