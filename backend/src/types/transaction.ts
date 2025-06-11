// Types for transactions
export interface Transaction {
  id: string;
  type: "WALLET_TRANSFER" | "WALLET_FUNDING" | "SERVICE_PAYMENT" | "WITHDRAWAL";
  amount: number;
  fromWalletId?: string;
  toWalletId?: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
  reference: string;
}
