import api from "@/lib/api";

// Define interfaces for the data shapes from backend
// This is crucial for TypeScript to understand the data you're working with.

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  isActive: boolean;
  userId?: string;
  serviceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description?: string;
  reference: string;
  status: string;
  fromWalletId?: string;
  toWalletId?: string;
  userId: string; // User who initiated/is associated with the transaction
  serviceType?: string;
  serviceProvider?: string;
  serviceDetails?: object;
  createdAt: string;
  updatedAt: string;
  fromWallet?: {
    name: string;
    type: string;
    currency: string;
  };
  toWallet?: {
    name: string;
    type: string;
    currency: string;
  };
}

export async function fetchUserProfile(): Promise<UserProfile> {
  // Specify the expected response structure: an object with a 'user' key
  const response = await api.get<{ message: string; user: UserProfile }>(
    "/auth/me"
  );
  return response.data.user;
}

export async function fetchUserWallets(): Promise<Wallet[]> {
  // Specify the expected response structure: an object with a 'wallets' key
  const response = await api.get<{ message: string; wallets: Wallet[] }>(
    "/wallets"
  );
  return response.data.wallets;
}

export async function fetchUserTransactions(): Promise<Transaction[]> {
  const response = await api.get<{
    message: string;
    transactions: Transaction[];
  }>("/transactions");

  return response.data.transactions; // Access the 'transactions' array from the response
}

// You can add more API service functions here as needed (e.g., for creating wallets, funding, etc.)
