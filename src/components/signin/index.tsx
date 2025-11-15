"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/supabase/supabase_client";
import DesktopLayout from "@/components/signin/desktopLayout";
import MobileLayout from "@/components/signin/mobileLayout";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user && data.user.aud === "authenticated") {
        router.replace("/main/dashboard");
        console.log("Authenticated user found, redirecting to /main/dashboard");
      } else {
        console.log("No authenticated user found");
      }
    };
    checkAuth();
  }, [router]);
    
  return (
    <main className="min-h-screen bg-white flex items-center justify-center overflow-x-clip">
      <div className="w-full max-w-7xl">
        {/* Desktop / Tablet */}
        <div className="hidden md:block">
          <DesktopLayout />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <MobileLayout />
        </div>
      </div>
    </main>
  );
}
