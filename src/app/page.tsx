import { Metadata } from "next";
import Index from "@/components/landing";

export const metadata: Metadata = {
  title: "Welcome to Pacewise",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Your smarter way to learn",
};

export default function Home() {
  return <Index />;
}
