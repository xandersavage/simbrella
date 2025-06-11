// Handles wallet-related HTTP requests (create, get, update, delete wallets)

import { Request, Response } from "express";
import { transferMoney } from "../services/walletService";
import { User } from "../types/auth";
import { log } from "../utils/logger";
import { validateTransferInput, ValidationError } from "../utils/validation";

/**
 * Handles the HTTP request for transferring money between wallets.
 * This function extracts data from the request, calls the business logic service,
 * and sends back an appropriate HTTP response.
 *
 * This controller expects the 'authenticateUser' middleware to run before it,
 * populating 'req.user' with the authenticated User object.
 */
export async function transferController(req: Request, res: Response) {
  try {
    // 1. Extract data from the request body
    const { fromWalletId, toWalletId, amount: amountString } = req.body;

    const amount = parseFloat(amountString);

    // 2. Use the validation utility for input checks
    validateTransferInput(fromWalletId, toWalletId, amount);

    // 3. Obtain the userId from the request context (populated by authentication middleware)
    if (!req.user || !req.user.id) {
      log.warn(
        "Authentication issue: User ID not found in request context for transfer attempt."
      );
      return res
        .status(401)
        .json({ message: "Authentication required: User ID not found." });
    }
    const userId: string = req.user.id;

    // 4. Call the transferMoney service function
    await transferMoney(fromWalletId, toWalletId, userId, amount);

    // 5. Handle successful transfer
    log.info(
      `Money transfer successful: User ${userId} transferred ${amount} from ${fromWalletId} to ${toWalletId}.`
    );
    return res
      .status(200)
      .json({
        message: "Money transfer successful!",
        data: { fromWalletId, toWalletId, amount, userId },
      });
  } catch (error: any) {
    // 6. Handle errors using the logger and specific validation error handling
    log.error("Transfer error occurred in controller:", error);

    // Handle Validation Errors specifically
    if (error instanceof ValidationError) {
      // For client-side validation errors, return 400 Bad Request
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "Insufficient balance in sender's wallet.") {
      return res.status(400).json({ message: error.message });
    }

    // Generic error for any unexpected issues, return 500 Internal Server Error
    return res.status(500).json({
      message: "An unexpected internal server error occurred during transfer.",
      error: error.message,
    });
  }
}
