import type React from "react";

import LoginForm from "@/components/login/loginForm";
import { User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Log in to your account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 pt-20 relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center">
              <User className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
