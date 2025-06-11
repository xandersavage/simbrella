// Business logic for user authentication

import { PrismaClient, UserRole } from "../../generated/prisma";
import { log } from "../utils/logger";
import { ValidationError } from "../utils/validation";
import { hashPassword, comparePasswords } from "../utils/security";
import { User } from "../types/auth";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber?: string
) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    log.warn(`Registration attempt for existing email: ${email}`); // Added logger
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
      phoneNumber,
      role: UserRole.USER,
      isActive: true,
    },
  });

  log.info(`User registered successfully: ${user.email}`);
  return user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<{
  user: User;
  token: string;
}> {
  if (!email || !password) {
    log.warn("Login attempt with missing credentials.");
    throw new ValidationError("Email and password are required.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      password: true, // Temporarily include password to compare, but ensure it's not returned to client
    },
  });

  if (!user) {
    log.warn(`Login attempt for non-existent user: ${email}`);
    throw new ValidationError("Invalid email or password.");
  }

  // Check if user's account is active
  if (!user.isActive) {
    log.warn(`Login attempt for inactive user: ${email}`);
    throw new ValidationError(
      "Your account is currently inactive. Please contact support."
    );
  }

  const isPasswordValid = await comparePasswords(password, user.password); // Use the password field from the fetched user
  if (!isPasswordValid) {
    log.warn(
      `Failed login attempt for user: ${email} due to invalid password.`
    );
    throw new ValidationError("Invalid email or password.");
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    log.error(
      "JWT_SECRET environment variable is not set. Cannot generate token."
    );
    throw new Error("Internal server error: JWT secret not configured.");
  }

  const token = jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: "30d",
  });

  log.info(`User ${user.email} logged in successfully. Token generated.`);

  // Return the token and a subset of user data, excluding the password field
  const { password: _, ...userWithoutPassword } = user;
  const userForReturn = {
    ...userWithoutPassword,
    phoneNumber:
      userWithoutPassword.phoneNumber === null
        ? undefined
        : userWithoutPassword.phoneNumber,
  };
  return {
    token,
    user: userForReturn,
  };
}
