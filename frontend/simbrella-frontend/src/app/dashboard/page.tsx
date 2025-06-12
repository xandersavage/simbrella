"use client";

import { useState } from "react";
import Link from "next/link";
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
  Plus,
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
} from "lucide-react";

// Mock data
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  totalBalance: 12450.75,
  currency: "USD",
};

const mockWallets = [
  {
    id: "1",
    name: "Personal Savings",
    type: "PERSONAL",
    balance: 8500.25,
    currency: "USD",
    isActive: true,
  },
  {
    id: "2",
    name: "Business Account",
    type: "BUSINESS",
    balance: 3950.5,
    currency: "USD",
    isActive: true,
  },
  {
    id: "3",
    name: "Investment Fund",
    type: "PERSONAL",
    balance: 0.0,
    currency: "USD",
    isActive: false,
  },
];

const mockTransactions = [
  {
    id: "1",
    type: "WALLET_FUNDING",
    amount: 500.0,
    description: "Bank Transfer - Chase",
    timestamp: "2 hours ago",
    isCredit: true,
  },
  {
    id: "2",
    type: "SERVICE_PAYMENT",
    amount: -25.99,
    description: "Netflix Subscription",
    timestamp: "1 day ago",
    isCredit: false,
  },
  {
    id: "3",
    type: "WALLET_TRANSFER",
    amount: -200.0,
    description: "Transfer to Business Account",
    timestamp: "2 days ago",
    isCredit: false,
  },
  {
    id: "4",
    type: "WALLET_FUNDING",
    amount: 1000.0,
    description: "Direct Deposit - Salary",
    timestamp: "3 days ago",
    isCredit: true,
  },
  {
    id: "5",
    type: "SERVICE_PAYMENT",
    amount: -45.0,
    description: "Uber Ride",
    timestamp: "4 days ago",
    isCredit: false,
  },
];

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

const getWalletIcon = (type: string) => {
  return type === "BUSINESS" ? (
    <Building2 className="h-5 w-5 text-blue-600" />
  ) : (
    <User className="h-5 w-5 text-indigo-600" />
  );
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">
                Simbrella Vault
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/placeholder-avatar.jpg"
                alt={mockUser.firstName}
              />
              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                {mockUser.firstName[0]}
                {mockUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200 
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-medium"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/wallets"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Wallet className="h-5 w-5" />
                <span>My Wallets</span>
              </Link>
              <Link
                href="/transactions"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Activity className="h-5 w-5" />
                <span>Transactions</span>
              </Link>
              <Link
                href="/services"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Zap className="h-5 w-5" />
                <span>Services</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {mockUser.firstName}! 👋
              </h1>
              <p className="text-slate-600">
                Here&apos;s what&apos;s happening with your finances today.
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">
                        Total Balance
                      </p>
                      <p className="text-2xl font-bold">
                        ${mockUser.totalBalance.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-indigo-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">
                        Active Wallets
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {mockWallets.filter((w) => w.isActive).length}
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">
                        This Month
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        +$1,500
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">
                        Transactions
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {mockTransactions.length}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* My Wallets Section */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-900">
                      My Wallets
                    </CardTitle>
                    <Link href="/create-wallet">
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Wallet
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockWallets.map((wallet) => (
                      <Link key={wallet.id} href={`/wallets/${wallet.id}`}>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer group">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                              {getWalletIcon(wallet.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {wallet.name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    wallet.type === "BUSINESS"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {wallet.type}
                                </Badge>
                                <Badge
                                  variant={
                                    wallet.isActive ? "default" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {wallet.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">
                              ${wallet.balance.toLocaleString()}
                            </p>
                            <p className="text-sm text-slate-500">
                              {wallet.currency}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions Section */}
              <div>
                <Card className="shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-900">
                      Recent Activity
                    </CardTitle>
                    <Link href="/transactions">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-4">
                        {mockTransactions.map((transaction, index) => (
                          <div key={transaction.id}>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-slate-100">
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {transaction.description}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {transaction.timestamp}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-semibold ${
                                    transaction.isCredit
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {transaction.isCredit ? "+" : ""}$
                                  {Math.abs(transaction.amount).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {index < mockTransactions.length - 1 && (
                              <Separator className="my-4" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link href="/fund-wallet">
                      <Button className="w-full h-16 bg-green-600 hover:bg-green-700 flex-col space-y-2">
                        <ArrowDownLeft className="h-5 w-5" />
                        <span>Fund Wallet</span>
                      </Button>
                    </Link>
                    <Link href="/transfer">
                      <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 flex-col space-y-2">
                        <Send className="h-5 w-5" />
                        <span>Transfer Money</span>
                      </Button>
                    </Link>
                    <Link href="/pay-service">
                      <Button className="w-full h-16 bg-purple-600 hover:bg-purple-700 flex-col space-y-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Pay for Service</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
