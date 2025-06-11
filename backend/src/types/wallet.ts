// Types for wallet operations
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  type: "PERSONAL" | "BUSINESS" | "SAVINGS";
  isActive: boolean;
}
