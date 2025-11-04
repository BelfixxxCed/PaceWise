"use client";

import { useRouter } from "next/navigation";

interface ContentCardProps {
  variant?: "desktop" | "mobile";
}

export default function ContentCard({ variant = "desktop" }: ContentCardProps) {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/signin");
  };

  const isDesktop = variant === "desktop";

  return (
    <div
      className={`bg-white border-2 border-green-200 rounded-3xl shadow-[10px_10px_30px_rgba(113,210,133,0.3)] ${
        isDesktop ? "p-10 mb-8" : "p-6 mb-6"
      }`}
    >
      <h1
        className={`font-bold text-black mb-3 ${
          isDesktop ? "text-6xl md:text-8xl mb-3" : "text-4xl"
        }`}
      >
        Hello!
      </h1>

      <p
        className={`text-black mb-3 font-bold ${
          isDesktop ? "text-[16px] mb-3" : "text-base"
        }`}
      >
        Welcome to Pacewise — your smarter way to learn.
      </p>

      <p
        className={`text-gray-700 leading-relaxed mb-6 ${
          isDesktop ? "text-[14px] mb-8" : "text-sm"
        }`}
      >
        Pacewise is a spaced learning app that helps you study smarter by
        reminding you when to review—not just what to study. No more cramming.
        Just consistent, effective learning. Built by students, for students.
      </p>

      <button
        onClick={handleGetStarted}
        className={`bg-[rgb(113,210,133)] hover:bg-green-500 text-white font-semibold rounded-[15px] text-base border-2 border-green-700 transition-colors ${
          isDesktop ? "px-8 py-3" : "w-full px-6 py-3"
        }`}
      >
        Get started
      </button>
    </div>
  );
}
