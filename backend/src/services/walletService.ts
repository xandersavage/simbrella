// Business logic for wallet operations, balance management, and wallet-related validations

import {
  PrismaClient,
  Prisma,
  TransactionType,
  TransactionStatus,
} from "../../generated/prisma";
import { getServiceById, getServiceSystemWallet } from "./serviceManagement";
import { ValidationError } from "../utils/validation";
import { WalletType } from "../../generated/prisma";

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

export async function processServicePayment(
  fromWalletId: string,
  serviceId: string,
  userId: string,
  amount: number
) {
  // 1. Basic Input Validation
  if (
    !fromWalletId ||
    typeof fromWalletId !== "string" ||
    fromWalletId.trim().length === 0
  ) {
    log.warn(
      `Service payment failed for user ${userId}: Invalid fromWalletId provided.`
    );
    throw new ValidationError("Invalid sender wallet ID.");
  }
  if (
    !serviceId ||
    typeof serviceId !== "string" ||
    serviceId.trim().length === 0
  ) {
    log.warn(
      `Service payment failed for user ${userId}: Invalid serviceId provided.`
    );
    throw new ValidationError("Invalid service ID.");
  }
  if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
    log.warn(
      `Service payment failed for user ${userId}: Invalid amount (${amount}).`
    );
    throw new ValidationError("Payment amount must be a positive number.");
  }
  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    log.warn(`Service payment failed: User ID is missing.`);
    throw new ValidationError("User ID is required for payment processing.");
  }

  try {
    // 2. Retrieve Service Details and System Wallet
    const service = await getServiceById(serviceId);
    if (!service) {
      log.warn(
        `Service payment failed for user ${userId}: Service with ID ${serviceId} not found.`
      );
      throw new ValidationError("Service not found.");
    }

    const serviceSystemWallet = await getServiceSystemWallet(serviceId);
    if (!serviceSystemWallet) {
      log.warn(
        `Service payment failed for user ${userId}: System wallet not configured for service ${serviceId}.`
      );
      throw new ValidationError(
        "Service provider's system wallet not found. Contact support."
      );
    }

    // 3. Perform the atomic payment transaction
    const result = await prisma.$transaction(
      async (tx: PrismaTransactionalClient) => {
        // a. Fetch the user's wallet AND verify ownership/activity within the transaction
        const userWallet = await tx.wallet.findUnique({
          where: { id: fromWalletId },
          select: { id: true, userId: true, isActive: true, balance: true },
        });

        if (
          !userWallet ||
          userWallet.userId !== userId ||
          !userWallet.isActive
        ) {
          log.warn(
            `Service payment failed for user ${userId}: Wallet ${fromWalletId} not found, inactive, or does not belong to user.`
          );
          throw new ValidationError(
            "Sender wallet not found, inactive, or unauthorized."
          );
        }

        // b. Check for sufficient funds
        if (userWallet.balance.toNumber() < amount) {
          // Convert Decimal to number for comparison
          log.warn(
            `Service payment failed for user ${userId}: Insufficient balance in wallet ${fromWalletId}. Current: ${userWallet.balance}, Attempted: ${amount}.`
          );
          throw new ValidationError("Insufficient balance in sender's wallet.");
        }

        // c. Decrement user's wallet balance
        const debitedWallet = await tx.wallet.update({
          where: { id: fromWalletId },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });
        log.debug(
          `Debited ${amount} from user wallet ${fromWalletId}. New balance: ${debitedWallet.balance}.`
        );

        // d. Increment service provider's system wallet balance
        const creditedSystemWallet = await tx.wallet.update({
          where: { id: serviceSystemWallet.id },
          data: {
            balance: {
              increment: amount,
            },
          },
        });
        log.debug(
          `Credited ${amount} to service system wallet ${serviceSystemWallet.id}. New balance: ${creditedSystemWallet.balance}.`
        );

        // e. Create Transaction record
        const transactionRef = generateTransactionReference();
        const transactionRecord = await tx.transaction.create({
          data: {
            type: TransactionType.SERVICE_PAYMENT,
            amount,
            reference: transactionRef,
            status: TransactionStatus.COMPLETED,
            fromWalletId,
            toWalletId: serviceSystemWallet.id,
            userId,
            serviceType: service.type,
            serviceProvider: service.name,
          },
        });
        log.debug(
          `Transaction record created for service payment (Ref: ${transactionRef}) from ${fromWalletId} to service ${service.name}.`
        );

        // f. (Optional) Simulate external service call here if applicable
        // For now, we'll assume the payment is 'completed' internally.
        // If external call is asynchronous and can fail, you'd mark status as PENDING here,
        // and have a callback/webhook update it to COMPLETED/FAILED later.

        return { transactionRecord };
      }
    );

    log.info(
      `Service payment of ${amount} to ${service.name} (Service ID: ${serviceId}) successful for user ${userId}. Transaction Ref: ${result.transactionRecord.reference}`
    );
    return result.transactionRecord;
  } catch (error: any) {
    log.error(
      `Service payment transaction failed for user ${userId} to service ${serviceId}:`,
      error
    );
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new Error(
      "An internal server error occurred during service payment processing."
    );
  }
}

export async function createUserWallet(
  userId: string,
  name: string,
  type: WalletType,
  currency: string = "NGN"
) {
  // 1. Validate inputs (userId, name, type, currency)
  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    log.warn("Wallet creation failed: Invalid userId.");
    throw new ValidationError("User ID must be a non-empty string.");
  }
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    log.warn("Wallet creation failed: Invalid wallet name.");
    throw new ValidationError("Wallet name must be a non-empty string.");
  }
  if (!type || !Object.values(WalletType).includes(type)) {
    log.warn("Wallet creation failed: Invalid wallet type.");
    throw new ValidationError(
      "Wallet type must be a valid WalletType enum value."
    );
  }
  if (
    !currency ||
    typeof currency !== "string" ||
    currency.trim().length === 0
  ) {
    log.warn("Wallet creation failed: Invalid currency.");
    throw new ValidationError("Currency must be a non-empty string.");
  }

  // 2. Verify that the userId corresponds to an existing User.
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!existingUser) {
    log.warn(`Wallet creation failed: User with ID ${userId} not found.`);
    throw new ValidationError("User not found.");
  }

  // 3. Prevent creation of 'SYSTEM' type wallets by regular users.
  if (type === WalletType.SYSTEM) {
    log.warn(
      `Wallet creation failed: Attempt to create SYSTEM wallet by user ${userId}.`
    );
    throw new ValidationError("Cannot create a system-type wallet directly.");
  }

  // 4. Create the new Wallet record.
  const newWallet = await prisma.wallet.create({
    data: {
      userId,
      name,
      type,
      currency,
      balance: 0,
      isActive: true,
    },
  });

  // 5. Log success and return the created wallet.
  log.info(
    `Wallet '${newWallet.name}' created successfully for user ${userId}. Wallet ID: ${newWallet.id}`
  );
  return newWallet;
}

export async function fundWallet(
  walletId: string,
  userId: string,
  amount: number,
  externalReference: string
) {
  // 1. Basic Input Validation
  if (
    !walletId ||
    typeof walletId !== "string" ||
    walletId.trim().length === 0
  ) {
    log.warn(
      `Wallet funding failed for user ${userId}: Invalid walletId provided.`
    );
    throw new ValidationError("Invalid wallet ID for funding.");
  }
  if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
    log.warn(
      `Wallet funding failed for user ${userId}: Invalid amount (${amount}).`
    );
    throw new ValidationError("Funding amount must be a positive number.");
  }
  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    log.warn(`Wallet funding failed: User ID is missing.`);
    throw new ValidationError("User ID is required for wallet funding.");
  }
  if (
    !externalReference ||
    typeof externalReference !== "string" ||
    externalReference.trim().length === 0
  ) {
    log.warn(
      `Wallet funding failed for user ${userId}: Missing or invalid external reference.`
    );
    throw new ValidationError("External reference is required for funding.");
  }

  try {
    const result = await prisma.$transaction(
      async (tx: PrismaTransactionalClient) => {
        // 2. Fetch the user's wallet AND verify ownership/activity within the transaction
        const userWallet = await tx.wallet.findUnique({
          where: { id: walletId },
          select: { id: true, userId: true, isActive: true, balance: true },
        });

        if (
          !userWallet ||
          userWallet.userId !== userId ||
          !userWallet.isActive
        ) {
          log.warn(
            `Wallet funding failed for user ${userId}: Wallet ${walletId} not found, inactive, or does not belong to user.`
          );
          throw new ValidationError(
            "Wallet not found, inactive, or unauthorized for funding."
          );
        }

        // 3. Increment user's wallet balance
        const fundedWallet = await tx.wallet.update({
          where: { id: walletId },
          data: {
            balance: {
              increment: amount,
            },
          },
        });
        log.debug(
          `Credited ${amount} to user wallet ${walletId}. New balance: ${fundedWallet.balance}.`
        );

        // 4. Create Transaction record for funding
        // Note: For funding, fromWalletId is null (money comes from outside the system)
        // and toWalletId is the funded wallet.
        const transactionRecord = await tx.transaction.create({
          data: {
            type: TransactionType.WALLET_FUNDING,
            amount,
            reference: externalReference, // Use the external reference here
            status: TransactionStatus.COMPLETED,
            toWalletId: walletId, // Funds go INTO this wallet
            userId,
            description: `Wallet funding from external source (Ref: ${externalReference})`,
          },
        });
        log.debug(
          `Transaction record created for wallet funding (Ref: ${externalReference}) for wallet ${walletId}.`
        );

        return transactionRecord;
      }
    );

    log.info(
      `Wallet ${walletId} funded successfully with ${amount} for user ${userId}. External Ref: ${externalReference}`
    );
    return result;
  } catch (error: any) {
    log.error(
      `Wallet funding transaction failed for user ${userId} on wallet ${walletId}:`,
      error
    );
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new Error(
      "An internal server error occurred during wallet funding processing."
    );
  }
}

export async function getUserWallets(userId: string) {
  // Basic validation for userId
  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    log.warn("Wallet retrieval failed: Invalid userId provided.");
    throw new ValidationError("User ID must be a non-empty string.");
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      type: true,
      balance: true,
      currency: true,
      isActive: true,
      userId: true,
      serviceId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  log.info(`Retrieved ${wallets.length} wallets for user ${userId}.`);
  return wallets;
}
