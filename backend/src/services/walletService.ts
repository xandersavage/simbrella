// src/services/walletService.ts

// Business logic for wallet operations, balance management, and wallet-related validations

import {
  PrismaClient,
  Prisma,
  TransactionType,
  TransactionStatus,
} from "../../generated/prisma";
import { log } from "../utils/logger";

export type PrismaTransactionalClient = Prisma.TransactionClient;
const prisma = new PrismaClient();

// Helper function to generate a unique transaction reference number
function generateTransactionReference() {
  return `TRX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export async function transferMoney(
  fromWalletId: string,
  toWalletId: string,
  userId: string,
  amount: number
) {
  if (amount <= 0) {
    log.error(
      `Transfer failed: Invalid amount (${amount}) for user ${userId} from ${fromWalletId} to ${toWalletId}.`
    );
    throw new Error("Transfer amount must be greater than zero.");
  }

  try {
    const result = await prisma.$transaction(
      async (tx: PrismaTransactionalClient) => {
        // 1. Decrement sender's balance
        const senderWallet = await tx.wallet.update({
          where: { id: fromWalletId },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });

        // 2. Verify sender has enough funds
        if (senderWallet.balance.toNumber() < 0) {
          log.warn(
            `Transfer failed for user ${userId}: Insufficient balance in wallet ${fromWalletId}. Balance: ${
              senderWallet.balance.toNumber() + amount
            }, Attempted debit: ${amount}.`
          );
          throw new Error("Insufficient balance in sender's wallet.");
        }

        // 3. Increment receiver's balance
        const receiverWallet = await tx.wallet.update({
          where: { id: toWalletId },
          data: {
            balance: {
              increment: amount,
            },
          },
        });

        // 4. Create the Transaction record for the audit trail.
        const transactionRecord = await tx.transaction.create({
          data: {
            type: TransactionType.WALLET_TRANSFER,
            amount,
            reference: generateTransactionReference(),
            status: TransactionStatus.COMPLETED,
            fromWalletId,
            toWalletId,
            userId,
          },
        });

        log.debug(
          `Transaction record created for transfer from ${fromWalletId} to ${toWalletId} by user ${userId}.`
        );

        return { senderWallet, receiverWallet, transactionRecord };
      }
    );

    log.info(
      `Money transferred successfully: User ${userId} transferred ${amount} from ${fromWalletId} to ${toWalletId}. Transaction Ref: ${result.transactionRecord.reference}`
    );
    return result;
  } catch (error: any) {
    log.error(
      `Database transaction failed during transfer from ${fromWalletId} to ${toWalletId} for user ${userId}:`,
      error
    );
    throw error;
  }
}
