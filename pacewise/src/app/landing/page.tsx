import { Metadata } from "next";
import DesktopLayout from "@/components/landing/desktopLayout";
import MobileLayout from "@/components/landing/mobileLayout";

export const metadata: Metadata = {
  title: "Welcome to Pacewise",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Your smarter way to learn",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-8 overflow-x-hidden">
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
