import { z } from "zod";

export const fundWalletSchema = z.object({
  walletId: z.string({
    required_error: "Please select a wallet to fund",
  }),
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than 0" })
    .transform((val) => Number(val.toFixed(2))),
  externalReference: z
    .string({
      required_error: "External reference is required",
    })
    .min(1, { message: "External reference cannot be empty" }),
});

export type FundWalletInput = z.infer<typeof fundWalletSchema>;
