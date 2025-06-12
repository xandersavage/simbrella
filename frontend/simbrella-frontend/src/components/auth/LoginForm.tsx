"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from "zod";

import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { CustomFormField } from "@/components/forms/AuthFormFields";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await api.post("/auth/login", values);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccessMessage("Login successful! Redirecting to dashboard...");
        console.log("Login successful:", response.data);
        router.push("/dashboard");
      } else {
        setErrorMessage(
          response.data.message || "Login failed. No token received."
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Display messages */}
      {successMessage && (
        <div className="p-4 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg backdrop-blur-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <CustomFormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
          />

          <CustomFormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            type="password"
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer link */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
