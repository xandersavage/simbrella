// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";
import { JwtPayload, User } from "../types/auth";
import { UserRole } from "../../generated/prisma";
import { log } from "../utils/logger";

const prisma = new PrismaClient();

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Use logger for authentication failures
    log.warn("Authentication failed: No token provided or malformed header.");
    res.status(401).json({
      message: "Authentication failed: No token provided or malformed header.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify the token
    const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // 3. Fetch the full User object from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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
      },
    });

    if (!user) {
      log.warn(
        `Authentication failed: User with ID ${decoded.id} not found in database.`
      );
      res
        .status(401)
        .json({ message: "Authentication failed: User not found." });
      return;
    }

    // 4. Attach the full User object to `req.user`
    req.user = user as User;

    // 5. Pass control to the next middleware or route handler
    next();
  } catch (error: any) {
    // 6. Handle token verification and database errors using the logger
    if (error.name === "TokenExpiredError") {
      log.warn("Authentication failed: Token has expired.", {
        error: error.message,
      });
      res
        .status(401)
        .json({ message: "Authentication failed: Token has expired." });
      return;
    }
    if (error.name === "JsonWebTokenError") {
      log.warn("Authentication failed: Invalid token.", {
        error: error.message,
      });
      res
        .status(401)
        .json({ message: "Authentication failed: Invalid token." });
      return;
    }
    log.error("An unexpected error occurred during authentication:", error);
    res
      .status(500)
      .json({ message: "An unexpected error occurred during authentication." });
    return;
  }
};

/**
 * A middleware for role-based authorization.
 * This checks if the authenticated user has the required role.
 * This middleware assumes that 'authenticateUser' has run successfully
 * and populated 'req.user' with the full User object, including the 'role'.
 *
 * @param allowedRoles An array of UserRole enums that are permitted to access the route.
 */
export const authorizeRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id || !req.user.role) {
      log.error(
        "Authorization failed: User not authenticated or role missing from req.user.",
        { userId: req.user?.id }
      );
      res.status(401).json({
        message:
          "Authorization failed: User not authenticated or role missing.",
      });
      return;
    }

    const userRole: UserRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      log.warn(
        `Access forbidden for user ${
          req.user.id
        }. Role: ${userRole}. Required roles: ${allowedRoles.join(", ")}.`
      );
      res.status(403).json({
        message: `Access forbidden: Required roles are ${allowedRoles.join(
          ", "
        )}. Your role is ${userRole}.`,
      });
      return;
    }

    next();
  };
};
