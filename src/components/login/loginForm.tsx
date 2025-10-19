"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-900">
          Email
        </label>
        <div className="relative">
          <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="janedoe1999@email.com"
            className="pl-8 border-0 border-b-2 border-[#a8d5a8] rounded-none focus-visible:ring-0 focus-visible:border-[#2d4a3e] bg-transparent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-900">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••••••"
            className="pl-8 pr-10 border-0 border-b-2 border-[#a8d5a8] rounded-none focus-visible:ring-0 focus-visible:border-[#2d4a3e] bg-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <label
            htmlFor="remember"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Remember Me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#2d4a3e] hover:bg-[#3d5a4e] text-white rounded-lg h-12 text-base font-medium"
      >
        Log In
      </Button>

      <div className="text-center">
        <span className="text-gray-600">or </span>
        <Link
          href="/signup"
          className="text-gray-900 font-medium relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-[#a8d5a8]"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}
