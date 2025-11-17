import SignInPage from "@/components/signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Sign in to your Pacewise account",
};

export default function SignIn() {
  return <SignInPage />;
}
