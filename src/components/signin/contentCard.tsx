"use client";

import supabase from "@/supabase/supabase_client";

interface ContentCardProps {
  variant?: "desktop" | "mobile";
}

export default function ContentCard({ variant = "desktop" }: ContentCardProps) {
  // this handles Google Sign-In blabla
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/main/dashboard`, // redirect after login
        },
      });

      if (error) {
        console.error("Error signing in:", error.message);
        alert("Failed to sign in. Please try again.");
      } else {
        console.log("Redirecting to Google Auth...");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const isDesktop = variant === "desktop";

  return (
    <div
      className={`flex flex-col text-center bg-white border-2 border-green-200 rounded-3xl shadow-[10px_10px_30px_rgba(113,210,133,0.3)] ${
        isDesktop ? "p-15 pt-10 pb-10 ml-40 mb-50" : "p-4 mb-6"
      }`}
    >
      <h1
        className={`font-bold text-black mb-3 ${
          isDesktop ? "text-l md:text-2xl mb-4" : "text-xl"
        }`}
      >
        Create Account
      </h1>

      <p className={`text-gray-700 leading-relaxed mb-3 text-sm`}>
        Access your personalized learning space with just one click.
      </p>

      <p
        className={`text-gray-700 leading-relaxed mb-6 ${
          isDesktop ? "text-sm mb-8" : "text-sm"
        }`}
      >
        Log in using your Google account to start creating, learning, and
        mastering your notes effortlessly.
      </p>

      <button
        onClick={handleGoogleSignIn}
        className={`bg-[rgb(113,210,133)] hover:bg-green-500 text-white font-semibold rounded-[15px] text-base border-2 border-green-700 flex items-center justify-center gap-2 transition-colors ${
          isDesktop ? "px-8 py-3 w-auto" : "px-6 py-3 w-full"
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
          >
            G
          </text>
        </svg>
        Sign in with Google
      </button>
    </div>
  );
}
