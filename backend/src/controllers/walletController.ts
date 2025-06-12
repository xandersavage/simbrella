// Handles wallet-related HTTP requests (create, get, update, delete wallets)

import { Request, Response } from "express";
import { transferMoney } from "../services/walletService";
import { log } from "../utils/logger";
import { validateTransferInput, ValidationError } from "../utils/validation";
import {
  processServicePayment,
  fundWallet,
  getUserWallets,
} from "../services/walletService";
import { WalletType } from "../../generated/prisma";
import { createUserWallet } from "../services/walletService";

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
      res
        .status(401)
        .json({ message: "Authentication required: User ID not found." });
      return;
    }
    const userId: string = req.user.id;

    // 4. Call the transferMoney service function
    await transferMoney(fromWalletId, toWalletId, userId, amount);

    // 5. Handle successful transfer
    log.info(
      `Money transfer successful: User ${userId} transferred ${amount} from ${fromWalletId} to ${toWalletId}.`
    );
    res.status(200).json({
      message: "Money transfer successful!",
      data: { fromWalletId, toWalletId, amount, userId },
    });
    return;
  } catch (error: any) {
    // 6. Handle errors using the logger and specific validation error handling
    log.error("Transfer error occurred in controller:", error);

    // Handle Validation Errors specifically
    if (error instanceof ValidationError) {
      // For client-side validation errors, return 400 Bad Request
      res.status(400).json({ message: error.message });
      return;
    }

    if (error.message === "Insufficient balance in sender's wallet.") {
      res.status(400).json({ message: error.message });
      return;
    }

    // Generic error for any unexpected issues, return 500 Internal Server Error
    res.status(500).json({
      message: "An unexpected internal server error occurred during transfer.",
      error: error.message,
    });
    return;
  }
}

export async function servicePaymentController(req: Request, res: Response) {
  try {
    // 1. Extract data from the request body.
    const { fromWalletId, serviceId, amount: amountString } = req.body;

    // Convert amount to a number.
    const amount = parseFloat(amountString);

    // 2. Obtain the userId from the request context.
    if (!req.user || !req.user.id) {
      log.warn(
        "Authentication issue: User ID not found in request context for service payment attempt."
      );
      res
        .status(401)
        .json({ message: "Authentication required: User ID not found." });
      return;
    }
    const userId: string = req.user.id;

    // 3. Call the processServicePayment service function.
    const transaction = await processServicePayment(
      fromWalletId,
      serviceId,
      userId,
      amount
    );

    // 4. Handle successful service payment.
    log.info(
      `Service payment successful for user ${userId} to service ${serviceId}. Transaction Ref: ${transaction.reference}`
    );
    res.status(200).json({
      message: "Service payment processed successfully!",
      transaction: {
        id: transaction.id,
        reference: transaction.reference,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
      },
    });
    return;
  } catch (error: any) {
    // 5. Handle errors.
    log.error("Service payment error occurred in controller:", error);

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({
      message:
        "An unexpected error occurred during service payment processing.",
      error: error.message,
    });
    return;
  }
}

export async function createWalletController(req: Request, res: Response) {
  try {
    // 1. Extract data from the request body.
    const { name, type, currency } = req.body;

    // 2. Get the authenticated user's ID from req.user.
    if (!req.user || !req.user.id) {
      log.warn("Wallet creation failed: User ID not found in request context.");
      res
        .status(401)
        .json({ message: "Authentication required: User ID not found." });
      return;
    }
    const userId = req.user.id;

    // 3. Perform basic validation for type at the controller level
    // (service will do more robust validation, but catching obvious issues early is good)
    if (!type || !Object.values(WalletType).includes(type)) {
      log.warn("Wallet creation failed: Invalid wallet type provided.");
      res.status(400).json({
        message: "Invalid wallet type. Must be PERSONAL, BUSINESS, or SAVINGS.",
      });
      return;
    }

    // Prevent direct creation of SYSTEM wallets via this user endpoint
    if (type === WalletType.SYSTEM) {
      log.warn(
        `Wallet creation failed: Attempt to create SYSTEM wallet by user ${userId}.`
      );
      res.status(403).json({
        message: "Forbidden: Cannot create a system-type wallet directly.",
      });
      return;
    }

    // 4. Call the createUserWallet service function.
    const newWallet = await createUserWallet(userId, name, type, currency);

    // 5. Handle successful wallet creation.
    log.info(
      `Wallet '${newWallet.name}' (ID: ${newWallet.id}) created successfully for user ${userId}.`
    );
    res.status(201).json({
      message: "Wallet created successfully!",
      wallet: {
        id: newWallet.id,
        name: newWallet.name,
        type: newWallet.type,
        balance: newWallet.balance,
        currency: newWallet.currency,
        isActive: newWallet.isActive,
        createdAt: newWallet.createdAt,
      },
    });
    return;
  } catch (error: any) {
    // 6. Handle errors.
    log.error("Wallet creation error occurred in controller:", error);

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({
      message: "An unexpected error occurred during wallet creation.",
      error: error.message,
    });
    return;
  }
}

export async function fundWalletController(req: Request, res: Response) {
  try {
    // 1. Extract data from the request body.
    const { walletId, amount: amountString, externalReference } = req.body;

    // Convert amount to a number.
    const amount = parseFloat(amountString);

    // 2. Get the authenticated user's ID from req.user.
    if (!req.user || !req.user.id) {
      log.warn("Wallet funding failed: User ID not found in request context.");
      res
        .status(401)
        .json({ message: "Authentication required: User ID not found." });
      return;
    }
    const userId = req.user.id;

    // 3. Call the fundWallet service function.
    const transaction = await fundWallet(
      walletId,
      userId,
      amount,
      externalReference
    );

    // 4. Handle successful wallet funding.
    log.info(
      `Wallet ${walletId} funded successfully for user ${userId}. Transaction Ref: ${transaction.reference}`
    );
    res.status(200).json({
      message: "Wallet funded successfully!",
      transaction: {
        id: transaction.id,
        reference: transaction.reference,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        toWalletId: transaction.toWalletId, // Should be the funded walletId
      },
    });
    return;
  } catch (error: any) {
    // 5. Handle errors.
    log.error("Wallet funding error occurred in controller:", error);

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({
      message: "An unexpected error occurred during wallet funding.",
      error: error.message,
    });
    return;
  }
}

export async function getUserWalletsController(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.id) {
      log.warn(
        "Wallet retrieval failed: User ID not found in request context."
      );
      res
        .status(401)
        .json({ message: "Authentication required: User ID not found." });
      return;
    }
    const userId = req.user.id;

    // 2. Call the getUserWallets service function.
    const wallets = await getUserWallets(userId);

    // 3. Handle successful retrieval.
    log.info(`Retrieved ${wallets.length} wallets for user ${userId}.`);
    res.status(200).json({
      message: "User wallets retrieved successfully.",
      wallets: wallets,
    });
    return;
  } catch (error: any) {
    // 4. Handle errors.
    log.error("Error retrieving user wallets in controller:", error);

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({
      message: "An unexpected error occurred during wallet retrieval.",
      error: error.message,
    });
    return;
  }
}
