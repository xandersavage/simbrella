// src/controllers/transactionController.ts

import { Request, Response } from "express";
import { getTransactionsByUserId } from "../services/transactionService";
import { log } from "../utils/logger";
import { ValidationError } from "../utils/validation";

export async function getUserTransactionsController(
  req: Request,
  res: Response
) {
  try {
    // 1. Get the authenticated user's ID from req.user.
    if (!req.user || !req.user.id) {
      log.warn(
        "Transaction history retrieval failed: User ID not found in request context."
      );
      res
        .status(401)
        .json({ message: "Authentication required: User ID not found." });
      return;
    }
    const userId = req.user.id;

    // 2. Call the getTransactionsByUserId service function.
    const transactions = await getTransactionsByUserId(userId);

    // 3. Handle successful retrieval.
    log.info(
      `Retrieved ${transactions.length} transactions for user ${userId}.`
    );
    res.status(200).json({
      message: "Transaction history retrieved successfully.",
      // Map the transactions to exclude sensitive or unnecessary fields from the API response
      transactions: transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        reference: tx.reference,
        status: tx.status,
        // Include only necessary wallet details
        fromWallet: tx.fromWallet
          ? {
              id: tx.fromWallet.id,
              name: tx.fromWallet.name,
              type: tx.fromWallet.type,
              currency: tx.fromWallet.currency,
            }
          : null,
        toWallet: tx.toWallet
          ? {
              id: tx.toWallet.id,
              name: tx.toWallet.name,
              type: tx.toWallet.type,
              currency: tx.toWallet.currency,
            }
          : null,
        serviceType: tx.serviceType,
        serviceProvider: tx.serviceProvider,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      })),
    });
    return;
  } catch (error: any) {
    // 4. Handle errors.
    log.error(
      "Transaction history retrieval error occurred in controller:",
      error
    );

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({
      message:
        "An unexpected error occurred during transaction history retrieval.",
      error: error.message,
    });
    return;
  }
}
