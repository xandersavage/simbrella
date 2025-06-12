// src/app/auth/login/page.tsx

"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useEffect, useState } from "react";

/**
 * Renders a visually stunning Login page for Simbrella Vault.
 * Features static animations, glassmorphism effects, and immersive design.
 */
export default function LoginPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs - fixed positions */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-indigo-500/25 to-purple-500/25 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />

        {/* Geometric patterns */}
        <div
          className="absolute top-10 left-10 w-32 h-32 border border-white/10 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="absolute bottom-10 right-10 w-24 h-24 border border-purple-400/20 rotate-12 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
                 linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
               `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main content container */}
      <div
        className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ease-out ${
          isLoaded
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        {/* Glassmorphism container */}
        <div className="relative group">
          {/* Glowing border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 animate-tilt"></div>

          {/* Main form container */}
          <div className="relative bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

            {/* Content area with reduced padding */}
            <div className="p-6 sm:p-8">
              {/* Header section */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-3 shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                  Welcome Back
                </h1>
                <p className="text-gray-300/80 text-sm font-medium">
                  Enter your credentials to access Simbrella Vault
                </p>
              </div>

              {/* Form wrapper with subtle animation */}
              <div className="transform transition-all duration-300">
                <LoginForm />
              </div>
            </div>

            {/* Bottom decorative element */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>

        {/* Floating particles effect - static positions */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
            style={{
              left: "20%",
              top: "30%",
              animationDelay: "0s",
              animationDuration: "2s",
            }}
          />
          <div
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
            style={{
              left: "80%",
              top: "20%",
              animationDelay: "1s",
              animationDuration: "3s",
            }}
          />
          <div
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
            style={{
              left: "60%",
              top: "70%",
              animationDelay: "2s",
              animationDuration: "2.5s",
            }}
          />
          <div
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
            style={{
              left: "15%",
              top: "80%",
              animationDelay: "0.5s",
              animationDuration: "3.5s",
            }}
          />
          <div
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
            style={{
              left: "90%",
              top: "60%",
              animationDelay: "1.5s",
              animationDuration: "2.8s",
            }}
          />
          <div
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
            style={{
              left: "40%",
              top: "15%",
              animationDelay: "2.5s",
              animationDuration: "3.2s",
            }}
          />
        </div>
      </div>

      {/* Bottom accent text */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-gray-400/60 text-sm font-medium tracking-wide">
          Secure • Private • Reliable
        </p>
      </div>

      <style jsx>{`
        @keyframes tilt {
          0%,
          50%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }
        .animate-tilt {
          animation: tilt 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
