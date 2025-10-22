import { Metadata } from "next";
import DesktopLayout from "@/components/signin/desktopLayout";
import MobileLayout from "@/components/signin/mobileLayout";

export const metadata: Metadata = {
  title: "Sign in",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Sign in to your Pacewise account",
};

export default function SignIn() {
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
