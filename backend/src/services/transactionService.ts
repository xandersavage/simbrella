// src/services/transactionService.ts

import { PrismaClient } from "../../generated/prisma";
import { log } from "../utils/logger";
import { ValidationError } from "../utils/validation";

const prisma = new PrismaClient();

export async function getTransactionsByUserId(userId: string) {
  // 1. Basic input validation for userId.
  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    log.warn("Transaction history retrieval failed: Invalid userId.");
    throw new ValidationError("User ID must be a non-empty string.");
  }

  // 2. Fetch transactions related to the user.
  // This includes transactions where the user is the initiator (userId field matches),
  // and potentially transactions where one of their wallets is involved (fromWalletId or toWalletId is one of their wallets).
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      fromWallet: {
        select: {
          id: true,
          name: true,
          type: true,
          currency: true,
        },
      },
      toWallet: {
        select: {
          id: true,
          name: true,
          type: true,
          currency: true,
        },
      },
    },
  });

  if (transactions.length === 0) {
    log.info(`No transactions found for user: ${userId}`);
    // Returning an empty array is generally more user-friendly for "no results found".
    return [];
  }

  log.info(`Retrieved ${transactions.length} transactions for user ${userId}.`);
  return transactions;
}
