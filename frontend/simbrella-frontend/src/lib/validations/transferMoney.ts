import { z } from "zod";

export const transferMoneySchema = z
  .object({
    fromWalletId: z.string({
      required_error: "Please select a source wallet",
    }),
    toWalletId: z.string({
      required_error: "Please select a destination wallet",
    }),
    amount: z.coerce
      .number()
      .min(0.01, { message: "Amount must be greater than 0" })
      .transform((val) => Number(val.toFixed(2))),
    description: z
      .string({
        required_error: "Description is required",
      })
      .min(1, { message: "Description cannot be empty" }),
  })
  .refine((data) => data.fromWalletId !== data.toWalletId, {
    message: "Source and destination wallets must be different",
    path: ["toWalletId"],
  });

export type TransferMoneyInput = z.infer<typeof transferMoneySchema>;
