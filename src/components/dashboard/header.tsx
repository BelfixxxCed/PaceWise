"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import supabase from "@/supabase/supabase_client";

function Header() {
  const [title, setTitle] = useState("Dashboard");
  const path = usePathname();
  const router = useRouter();
  const [name, setName] = useState("Loading...");
  const [pfp, set_pfp] = useState("/blank-user-svgrepo-com.svg");

  useEffect(() => {
    if (path == "/main/notes") {
      setTitle("Notes");
    } else if (path == "/main/schedule") {
      setTitle("Study Schedule");
    } else if (path == "/main/practice_test") {
      setTitle("Practice Test");
    } else {
      setTitle("Dashboard");
    }

    const verifyUser = async () => {
      const { data, error } = await supabase.auth.getUser(); //This needs to be changed into getSession but in a way that it is not disruptive

      if (error) {
        console.log(
          "There was an error checking your authorization:",
          error.message,
        );
        alert("There was an error checking your authorization.");
        router.push("/");
        return;
      }

      if (!data.user || data.user.aud !== "authenticated") {
        router.push("/");
        return;
      }

      const pfp_link = data.user.identities?.[0]?.identity_data?.avatar_url;
      if (pfp_link) {
        set_pfp(pfp_link);
      }

      const fullName =
        data.user.user_metadata?.full_name ||
        data.user.identities?.[0]?.identity_data?.full_name ||
        data.user.identities?.[0]?.identity_data?.name ||
        "";
      setName(fullName);
    };

    verifyUser();
  }, [path, router]);

  return (
    <div className="flex flex-row justify-between h-20 p-5 shadow-sm shadow-gray-150 items-center">
      <div className="poppins-bold text-2xl ml-15">{title}</div>
      <div>
        <ul className="flex flex-row items-center gap-4">
          <li className="poppins-semibold">{name}</li>
          <li>
            {/* Insert profile pic here */}
            <div className="h-10 w-10">
              <Image
                src={pfp}
                alt="profile picture"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
