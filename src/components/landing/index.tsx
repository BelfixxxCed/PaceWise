"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DesktopLayout from "@/components/landing/desktopLayout";
import MobileLayout from "@/components/landing/mobileLayout";
import supabase from "@/supabase/supabase_client";

export default function Home() {
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
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-8 overflow-x-hidden">
      <div className="w-full max-w-7xl">
        <div className="hidden md:block">
          <DesktopLayout />
        </div>
        <div className="md:hidden">
          <MobileLayout />
        </div>
      </div>
    </main>
  );
}
