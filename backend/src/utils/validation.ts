// Utility functions for data validation

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validates the input parameters for a money transfer operation.
 *
 * @param fromWalletId The ID of the wallet to transfer money from.
 * @param toWalletId The ID of the wallet to transfer money to.
 * @param amount The amount of money to transfer.
 * @throws {ValidationError} If any of the inputs are invalid.
 */
export const validateTransferInput = (
  fromWalletId: string,
  toWalletId: string,
  amount: number
): void => {
  // 1. Validate fromWalletId
  if (
    !fromWalletId ||
    typeof fromWalletId !== "string" ||
    fromWalletId.trim().length === 0
  ) {
    throw new ValidationError(
      "Invalid 'fromWalletId'. It must be a non-empty string."
    );
  }

  // 2. Validate toWalletId
  if (
    !toWalletId ||
    typeof toWalletId !== "string" ||
    toWalletId.trim().length === 0
  ) {
    throw new ValidationError(
      "Invalid 'toWalletId'. It must be a non-empty string."
    );
  }

  // Ensure sender and receiver wallets are not the same
  if (fromWalletId === toWalletId) {
    throw new ValidationError("Cannot transfer money to the same wallet.");
  }

  // 3. Validate amount
  if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
    throw new ValidationError(
      "Invalid 'amount'. It must be a positive number."
    );
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number, one special char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
