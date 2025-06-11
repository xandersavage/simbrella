// Handles user authentication and authorization HTTP requests (login, register, forgot password, etc.)

import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import { log } from "../utils/logger";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  ValidationError,
} from "../utils/validation";

export async function signupController(req: Request, res: Response) {
  try {
    // 1. Extract data from the request body.
    const {
      email,
      password,
      passwordConfirm,
      firstName,
      lastName,
      phoneNumber,
    } = req.body;

    // 2. Perform input validation using validation utilities.
    // Check for presence of required fields first
    if (!email || !password || !passwordConfirm || !firstName || !lastName) {
      log.warn("Signup attempt with missing required fields.");
      res.status(400).json({
        message:
          "All required fields (email, password, passwordConfirm, firstName, lastName) must be provided.",
      });
      return;
    }

    // Validate formats
    try {
      validateEmail(email);
      validatePassword(password);
      if (phoneNumber) {
        // Only validate if provided
        validatePhoneNumber(phoneNumber);
      }
    } catch (validationError: any) {
      if (validationError instanceof ValidationError) {
        log.warn(
          `Signup validation failed: ${validationError.message}, email: ${email}`
        );
        res.status(400).json({ message: validationError.message });
        return;
      }
      throw validationError; // Re-throw any other unexpected errors
    }

    if (password !== passwordConfirm) {
      log.warn("Signup failed: Password confirmation does not match.");
      res
        .status(400)
        .json({ message: "Password and password confirmation do not match." });
      return;
    }

    // 3. Call the registerUser service function.
    const newUser = await registerUser(
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    );
    log.info(`New user registered: ${newUser.email} (ID: ${newUser.id})`);

    // 4. Automatically log in the user after successful registration.
    const token = await loginUser(email, password);
    log.info(
      `User ${newUser.email} automatically logged in after registration.`
    );

    // 5. Handle successful registration AND login.
    res.status(201).json({
      message: "User registered and logged in successfully!",
      token,
    });
    return;
  } catch (error: any) {
    // 5. Handle errors
    log.error("Registration error occurred:", error);

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    } else {
      res.status(500).json({
        message:
          "An unexpected internal server error occurred during registration.",
        error: error.message,
      });
      return;
    }
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    // 1. Extract data from the request body.
    const { email, password } = req.body;

    // 2. Perform input validation
    if (!email || !password) {
      log.warn("Login attempt with missing credentials.");
      res
        .status(400)
        .json({ message: "Email and password are required for login." });
      return;
    }
    // Re-validate email format for login for robustness at the API boundary
    try {
      validateEmail(email);
    } catch (validationError: any) {
      if (validationError instanceof ValidationError) {
        log.warn(
          `Login validation failed (email format): ${validationError.message}, email: ${email}`
        );
        res.status(400).json({ message: "Invalid email or password." });
        return;
      }
      throw validationError; // Re-throw other unexpected errors
    }

    // 3. Call the loginUser service function.
    const { user, token } = await loginUser(email, password);

    // 4. Handle successful login.
    log.info(`User ${email} logged in successfully.`);
    res.status(200).json({ message: "Login successful!", token, user });
    return;
  } catch (error: any) {
    // 5. Handle errors
    log.error("Login error occurred:", error);
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    } else {
      res.status(500).json({
        message: "An unexpected internal server error occurred during login.",
        error: error.message,
      });
      return;
    }
  }
}
