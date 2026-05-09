"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import supabase from "@/supabase/supabase_client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

function Sidebar() {
  const [title, setTitle] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (path.startsWith("/main/notes")) {
      setTitle(2);
    } else if (path.startsWith("/main/schedule")) {
      setTitle(1);
    } else if (path.startsWith("/main/flashcards")) {
      setTitle(3);
    }
  }, [path]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      const res = await fetch("/api/auth/signout", { method: "GET" });
      const data = await res.json();

      if (res.ok) {
        router.push("/signin");
      } else {
        console.error(data.error);
        alert("Sign-out failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-20 hover:w-64 bg-[#71D285] z-50 group flex flex-col justify-between transition-all duration-300 ease-in-out">
      {/* This is for the upper sections */}
      <div className="flex flex-col items-center pt-6">
        <div className="flex items-center px-4 w-full">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Image
              src={"/reusable_ui_images/pacewise_logo.svg"}
              alt="pacewise logo"
              width={40}
              height={40}
              className="flex-shrink-0"
            />
          </div>

          <div className="poppins-bold text-2xl text-white ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            PaceWise
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 w-full px-2">
          <Link
            href="/main/dashboard"
            className={`rounded-lg transition-all duration-200 py-2 px-3 ${
              title == 0
                ? "bg-[#E9F5FE] font-bold"
                : "hover:bg-[#E9F5FE] hover:font-bold"
            }  flex items-center gap-3 font-normal  group/item`}
          >
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/reusable_ui_images/dashboard.svg"
                alt="dashboard page button"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="text-[#3E6E48] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Dashboard
            </p>
          </Link>

          <Link
            href="/main/schedule"
            className={`${
              title == 1
                ? "bg-[#E9F5FE] font-bold"
                : "hover:bg-[#E9F5FE] hover:font-bold"
            } rounded-lg transition-all duration-200 py-2 px-3 hover:bg-[#E9F5FE] flex items-center gap-3 font-normal hover:font-bold group/item`}
          >
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/reusable_ui_images/study_schedule.svg"
                alt="study schedule button"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="text-[#3E6E48] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Study Schedule
            </p>
          </Link>

          <Link
            href="/main/notes"
            className={`${
              title == 2
                ? "bg-[#E9F5FE] font-bold"
                : "hover:bg-[#E9F5FE] hover:font-bold"
            } rounded-lg transition-all duration-200 py-2 px-3 hover:bg-[#E9F5FE] flex items-center gap-3 font-normal hover:font-bold group/item`}
          >
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/reusable_ui_images/notes.svg"
                alt="notes button"
                width={23}
                height={23}
                className="object-contain"
              />
            </div>
            <p className="text-[#3E6E48] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Notes
            </p>
          </Link>

          <Link
            href="/main/flashcards"
            className={`${
              title == 3
                ? "bg-[#E9F5FE] font-bold"
                : "hover:bg-[#E9F5FE] hover:font-bold"
            } rounded-lg transition-all duration-200 py-2 px-3 hover:bg-[#E9F5FE] flex items-center gap-3 font-normal hover:font-bold group/item`}
          >
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/reusable_ui_images/flashcards.svg"
                alt="flashcards button"
                width={29}
                height={29}
                className="object-contain"
              />
            </div>
            <p className="text-[#3E6E48] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Flashcards
            </p>
          </Link>
        </div>
      </div>

      {/* This is for the logout button */}
      <div className="mb-5 mx-2 rounded-md bg-[#3E6E48] hover:bg-[#5d9068] flex items-center py-2 px-3 cursor-pointer transition-colors duration-200">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <Image
            src={"/reusable_ui_images/logout.svg"}
            width={40}
            height={40}
            alt="logout button"
            className="object-contain"
          />
        </div>

        <button
          className={`text-white poppins-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden ml-2 ${
            isSigningOut ? "opacity-50 pointer-events-none disabled" : ""
          }`}
          onClick={handleSignOut}
        >
          {isSigningOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
