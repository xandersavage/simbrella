"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  Shield,
  Zap,
  BarChart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 opacity-75 blur"></div>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                <Wallet className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Simbrella Vault
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/25 transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors hover:bg-muted/50 mb-4">
              <Sparkles className="mr-2 h-4 w-4 text-indigo-600" />
              <span className="text-muted-foreground">
                The Future of Digital Payments
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:leading-[1.1]">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Secure, Fast, and Reliable
              </span>
              <br className="hidden sm:inline" />
              Digital Wallet Solution
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Manage your finances with ease. Send money, pay bills, and track
              your spending all in one place.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row mt-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12 px-8 border-2 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background -z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card className="flex flex-col group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Secure Transactions
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Bank-grade security for all your transactions and personal
                  information.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Instant Transfers
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Send money instantly to anyone, anywhere, at any time.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 group-hover:scale-110 transition-transform duration-300">
                  <BarChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Smart Analytics</h3>
                <p className="mt-2 text-muted-foreground">
                  Track your spending patterns and get insights into your
                  finances.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Get Started?
              </span>
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Join thousands of users who trust Simbrella Vault for their
              financial needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row mt-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12 px-8 border-2 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20 -z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 opacity-75 blur"></div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                  <Wallet className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Simbrella Vault
              </span>
            </div>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with ❤️ by Simbrella Team. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
