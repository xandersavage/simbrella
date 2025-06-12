"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchUserProfile,
  fetchUserWallets,
  fetchUserTransactions,
  UserProfile,
  Wallet,
  Transaction,
} from "@/services/dataService"; //API service functions and types

// --- Custom React Query Hooks ---

/**
 * Hook to fetch the authenticated user's profile.
 * Automatically handles loading, error, and caching.
 * @returns An object containing data, isLoading, isError, and error for the user profile.
 */
export function useUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"], // Unique key for this query
    queryFn: fetchUserProfile, // The function that fetches the data
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes (adjust as needed)
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2, // Retry failed queries 2 times
  });
}

export function useUserWallets() {
  return useQuery<Wallet[], Error>({
    queryKey: ["userWallets"], // Unique key for this query
    queryFn: fetchUserWallets, // The function that fetches the data
    staleTime: 1 * 60 * 1000, // Wallets might change more frequently, fresh for 1 minute
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

export function useUserTransactions() {
  return useQuery<Transaction[], Error>({
    queryKey: ["userTransactions"], // Unique key for this query
    queryFn: fetchUserTransactions, // The function that fetches the data
    staleTime: 30 * 1000, // Transactions can be very dynamic, fresh for 30 seconds
    refetchOnWindowFocus: true,
    retry: 2,
  });
}
