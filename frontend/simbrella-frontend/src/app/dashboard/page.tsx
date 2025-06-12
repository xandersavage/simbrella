// src/app/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Wallet,
  CreditCard,
  ArrowDownLeft,
  Send,
  Smartphone,
  Building2,
  User,
  Menu,
  X,
  TrendingUp,
  Activity,
  DollarSign,
  Zap,
  LogOut,
  Settings,
  CircleDashed, // For loading states
  TriangleAlert, // For error states
} from "lucide-react";

// Import your custom React Query hooks
import {
  useUserProfile,
  useUserWallets,
  useUserTransactions,
} from "@/hooks/useUserData";
// Import your Zustand auth store
import { useAuthStore } from "@/store/authStore";
import { CreateWalletDialog } from "@/components/wallets/CreateWalletDialog";

// Helper function to get transaction icon based on type
const getTransactionIcon = (type: string) => {
  switch (type) {
    case "WALLET_FUNDING":
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
    case "SERVICE_PAYMENT":
      return <Smartphone className="h-4 w-4 text-blue-600" />;
    case "WALLET_TRANSFER":
      return <Send className="h-4 w-4 text-purple-600" />;
    default:
      return <Activity className="h-4 w-4 text-gray-600" />;
  }
};

// Helper function to get wallet icon based on type
const getWalletIcon = (type: string) => {
  return type === "BUSINESS" ? (
    <Building2 className="h-5 w-5 text-blue-600" />
  ) : (
    <User className="h-5 w-5 text-indigo-600" />
  );
};

// Helper function to format dates for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get authentication state from Zustand store
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
    initializeAuth,
  } = useAuthStore();

  // Initialize auth state when component mounts
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Fetch data using React Query hooks
  const {
    data: userProfile,
    isError: isProfileError,
    error: profileError,
  } = useUserProfile();
  const {
    data: userWallets,
    isLoading: isWalletsLoading,
    isError: isWalletsError,
    error: walletsError,
  } = useUserWallets();
  const {
    data: userTransactions,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
    error: transactionsError,
  } = useUserTransactions();

  // Calculate total balance from active wallets
  const totalBalance =
    userWallets?.reduce((sum, wallet) => {
      // Ensure balance is treated as a number and only sum active wallets
      return sum + (wallet.isActive ? Number(wallet.balance) : 0);
    }, 0) || 0;

  // Determine the primary currency, or default to USD
  const primaryCurrency =
    userWallets?.find((w) => w.isActive)?.currency || "USD";

  // Redirect if not authenticated after initial loading
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Handle logout
  const handleLogout = () => {
    logout(); // Use the logout action from Zustand
    router.push("/auth/login"); // Redirect to login page
  };

  // Show loading or error states for the entire dashboard
  if (isAuthLoading || !isAuthenticated) {
    // Show a minimal loading screen or redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-800 text-slate-700 dark:text-slate-300">
        <div className="flex flex-col items-center space-y-4">
          <CircleDashed className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-lg font-semibold">Loading Simbrella Vault...</p>
        </div>
      </div>
    );
  }

  if (isProfileError || isWalletsError || isTransactionsError) {
    // Centralized error display
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-800 text-red-800 dark:text-red-200 p-4 text-center">
        <TriangleAlert className="h-12 w-12 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Dashboard</h1>
        <p className="text-lg">
          {profileError?.message ||
            walletsError?.message ||
            transactionsError?.message ||
            "An unexpected error occurred while fetching your data."}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white"
        >
          Try Again
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="mt-2 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700"
        >
          Logout
        </Button>
      </div>
    );
  }

  // Once data is loaded and no errors, render the main dashboard
  const displayUserFirstName = userProfile?.firstName || "User";
  const displayUserLastNameInitial = userProfile?.lastName
    ? userProfile.lastName[0]
    : "";

  return (
    // Main container with a subtle gradient background and Inter font
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 font-inter text-slate-800 dark:text-slate-100">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            {/* App Logo and Name */}
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white">
                Simbrella Vault
              </span>
            </Link>
          </div>
          {/* User Avatar and Logout */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9 border-2 border-indigo-300">
              <AvatarImage
                src={
                  userProfile?.email
                    ? `https://ui-avatars.com/api/?name=${displayUserFirstName}+${displayUserLastNameInitial}&background=random&color=fff&size=128`
                    : "/placeholder-avatar.jpg"
                }
                alt={displayUserFirstName}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-avatar.jpg"; // Fallback to a static image
                }}
              />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-700 dark:text-indigo-100 font-semibold">
                {displayUserFirstName[0]}
                {displayUserLastNameInitial}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-slate-200 dark:border-gray-700
            transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            pt-16 lg:pt-0 pb-4
          `}
        >
          <div className="flex flex-col h-full">
            <nav className="flex-1 px-4 py-6 space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold transition-colors shadow-sm hover:shadow-md"
                onClick={() => setSidebarOpen(false)}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/wallets"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Wallet className="h-5 w-5" />
                <span>My Wallets</span>
              </Link>
              <Link
                href="/transactions"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Activity className="h-5 w-5" />
                <span>Transactions</span>
              </Link>
              <Link
                href="/services"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Zap className="h-5 w-5" />
                <span>Services</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
            <div className="mt-auto px-4 py-4 text-xs text-slate-500 dark:text-gray-400 border-t border-slate-200 dark:border-gray-700">
              © {new Date().getFullYear()} Simbrella Vault.
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                Welcome back, {displayUserFirstName}! 👋
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Here&apos;s what&apos;s happening with your finances today.
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Balance Card */}
              <Card className="rounded-xl shadow-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">
                      Total Balance
                    </p>
                    <DollarSign className="h-8 w-8 text-indigo-200 opacity-80" />
                  </div>
                  {isWalletsLoading ? (
                    <div className="h-10 bg-indigo-400/50 rounded animate-pulse w-3/4"></div>
                  ) : (
                    <p className="text-4xl font-extrabold">
                      {primaryCurrency}{" "}
                      {totalBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Active Wallets Card */}
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 transform hover:scale-[1.02] cursor-pointer dark:bg-gray-700 dark:border-gray-600">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium uppercase tracking-wider">
                      Active Wallets
                    </p>
                    <Wallet className="h-8 w-8 text-indigo-600 dark:text-indigo-400 opacity-80" />
                  </div>
                  {isWalletsLoading ? (
                    <div className="h-10 bg-slate-300/50 rounded animate-pulse w-1/2"></div>
                  ) : (
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">
                      {userWallets?.filter((w) => w.isActive).length || 0}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* This Month (Placeholder) Card */}
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 transform hover:scale-[1.02] cursor-pointer dark:bg-gray-700 dark:border-gray-600">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium uppercase tracking-wider">
                      Income (This Month)
                    </p>
                    <TrendingUp className="h-8 w-8 text-green-600 opacity-80" />
                  </div>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                    + $1,500 {/* Placeholder for future implementation */}
                  </p>
                </CardContent>
              </Card>

              {/* Transactions Count Card */}
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 transform hover:scale-[1.02] cursor-pointer dark:bg-gray-700 dark:border-gray-600">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium uppercase tracking-wider">
                      Total Transactions
                    </p>
                    <Activity className="h-8 w-8 text-blue-600 opacity-80" />
                  </div>
                  {isTransactionsLoading ? (
                    <div className="h-10 bg-slate-300/50 rounded animate-pulse w-1/2"></div>
                  ) : (
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">
                      {userTransactions?.length || 0}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* My Wallets Section */}
              <div className="lg:col-span-2">
                <Card className="rounded-xl shadow-lg dark:bg-gray-700 dark:border-gray-600">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                      My Wallets
                    </CardTitle>
                    <CreateWalletDialog />
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    {isWalletsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-gray-600 animate-pulse"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-gray-600"></div>
                              <div className="space-y-1">
                                <div className="h-4 bg-slate-200 dark:bg-gray-600 rounded w-32"></div>
                                <div className="h-3 bg-slate-200/50 dark:bg-gray-600/50 rounded w-24"></div>
                              </div>
                            </div>
                            <div className="h-6 bg-slate-200 dark:bg-gray-600 rounded w-20"></div>
                          </div>
                        ))}
                      </div>
                    ) : userWallets && userWallets.length > 0 ? (
                      userWallets.map((wallet) => (
                        <Link key={wallet.id} href={`/wallets/${wallet.id}`}>
                          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-gray-600/50 transition-all duration-200 cursor-pointer group">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-gray-600 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-700 transition-colors">
                                {getWalletIcon(wallet.type)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                  {wallet.name}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge
                                    variant={
                                      wallet.type === "BUSINESS"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs font-medium rounded-full px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                                  >
                                    {wallet.type}
                                  </Badge>
                                  <Badge
                                    variant={
                                      wallet.isActive ? "default" : "secondary"
                                    }
                                    className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                                      wallet.isActive
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                    }`}
                                  >
                                    {wallet.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900 dark:text-white text-lg">
                                {wallet.currency}{" "}
                                {Number(wallet.balance).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-center text-slate-500 dark:text-gray-400 py-8">
                        No wallets found. Click &quot;New Wallet&quot; to get
                        started!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions Section */}
              <div>
                <Card className="rounded-xl shadow-lg dark:bg-gray-700 dark:border-gray-600">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                      Recent Activity
                    </CardTitle>
                    <Link href="/transactions">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-slate-300 dark:border-gray-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-600 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        View All
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ScrollArea className="h-80 pr-4">
                      {isTransactionsLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between space-x-3 animate-pulse"
                            >
                              <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-gray-600"></div>
                              <div className="flex-1 space-y-1">
                                <div className="h-4 bg-slate-200 dark:bg-gray-600 rounded w-48"></div>
                                <div className="h-3 bg-slate-200/50 dark:bg-gray-600/50 rounded w-32"></div>
                              </div>
                              <div className="h-6 bg-slate-200 dark:bg-gray-600 rounded w-20"></div>
                            </div>
                          ))}
                        </div>
                      ) : userTransactions && userTransactions.length > 0 ? (
                        <div className="space-y-3">
                          {userTransactions.slice(0, 5).map(
                            (
                              transaction,
                              index // Show only top 5-7
                            ) => (
                              <div key={transaction.id}>
                                <div className="flex items-center justify-between space-x-3">
                                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-gray-600">
                                    {getTransactionIcon(transaction.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                      {transaction.description ||
                                        transaction.type
                                          .replace(/_/g, " ")
                                          .toLowerCase()}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                                      {formatDate(transaction.createdAt)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p
                                      className={`font-semibold text-base ${
                                        transaction.type === "WALLET_FUNDING" ||
                                        transaction.type === "DEPOSIT" // Adjust based on your TransactionType enum
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {/* Determine if credit or debit based on type or amount sign */}
                                      {transaction.type === "WALLET_FUNDING" ||
                                      transaction.type === "DEPOSIT"
                                        ? "+"
                                        : "-"}
                                      {primaryCurrency}{" "}
                                      {Math.abs(
                                        Number(transaction.amount)
                                      ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </p>
                                  </div>
                                </div>
                                {index <
                                  userTransactions.slice(0, 5).length - 1 && (
                                  <Separator className="my-3 bg-slate-200 dark:bg-gray-600" />
                                )}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-center text-slate-500 dark:text-gray-400 py-8">
                          No recent transactions.
                        </p>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Card className="rounded-xl shadow-lg dark:bg-gray-700 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <Link href="/wallets/fund">
                      <Button className="w-full h-20 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold flex flex-col items-center justify-center space-y-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.03]">
                        <ArrowDownLeft className="h-6 w-6" />
                        <span>Fund Wallet</span>
                      </Button>
                    </Link>
                    <Link href="/wallets/transfer">
                      <Button className="w-full h-20 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold flex flex-col items-center justify-center space-y-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.03]">
                        <Send className="h-6 w-6" />
                        <span>Transfer Money</span>
                      </Button>
                    </Link>
                    <Link href="/services/pay">
                      <Button className="w-full h-20 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold flex flex-col items-center justify-center space-y-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.03]">
                        <CreditCard className="h-6 w-6" />
                        <span>Pay for Service</span>
                      </Button>
                    </Link>
                    <Link href="/reports">
                      <Button className="w-full h-20 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white font-semibold flex flex-col items-center justify-center space-y-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.03]">
                        <Activity className="h-6 w-6" />
                        <span>View Reports</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar Backdrop (for mobile overlay) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
