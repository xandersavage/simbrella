"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from "zod";
import axios from "axios";

import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { CustomFormField } from "@/components/forms/AuthFormFields";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(values: SignupInput) {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordConfirm, ...dataToSend } = values;
      const response = await api.post("/auth/signup", dataToSend);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccessMessage(
          "Account created successfully! Redirecting to dashboard..."
        );
        console.log("Signup successful:", response.data);
        router.push("/dashboard");
      } else {
        setErrorMessage(
          response.data.message || "Signup failed. No token received."
        );
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          typeof error.response.data.message === "string"
        ) {
          setErrorMessage(error.response.data.message);
        } else if (error.message) {
          setErrorMessage("API Error: " + error.message);
        } else {
          setErrorMessage("An unknown API error occurred.");
        }
      } else if (error instanceof Error) {
        setErrorMessage("An unexpected error occurred: " + error.message);
      } else {
        setErrorMessage("An unknown error occurred during signup.");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name fields in a row */}
          <div className="grid grid-cols-2 gap-4">
            <CustomFormField
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="John"
            />
            <CustomFormField
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="Doe"
            />
          </div>

          <CustomFormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
          />

          <CustomFormField
            control={form.control}
            name="phoneNumber"
            label="Phone Number (Optional)"
            placeholder="+2348012345678"
            type="tel"
          />

          <CustomFormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            type="password"
          />

          <CustomFormField
            control={form.control}
            name="passwordConfirm"
            label="Confirm Password"
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
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer link */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
