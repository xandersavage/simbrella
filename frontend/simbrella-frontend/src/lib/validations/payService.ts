import { z } from "zod";

export const payServiceSchema = z.object({
  fromWalletId: z.string({
    required_error: "Please select a wallet to pay from",
  }),
  serviceId: z.string({
    required_error: "Please select a service to pay for",
  }),
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than 0" })
    .transform((val) => Number(val.toFixed(2))),
});

export type PayServiceInput = z.infer<typeof payServiceSchema>;
