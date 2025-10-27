"use client";

import { useEffect, useState } from "react";
import supabase from "@/supabase/supabase_client";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const syncUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (user) {
        // user info into custom userss table
        const { error: insertError } = await supabase.from("users").upsert({
          user_id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
        });

        if (insertError) {
          console.error("Error inserting user:", insertError.message);
        } else {
          console.log("User synced to 'users' table");
        }

        setUser(user);
      }
    };

    syncUser();
  }, []);

  return (
    <div className="p-10">
      {user ? (
        <>
          <h1 className="text-2xl font-bold text-green-700">
            Welcome, {user.user_metadata.full_name || "User"}!
          </h1>
          <p className="mt-2 text-gray-600">You’re now logged in to PaceWise.</p>
        </>
      ) : (
        <p>Loading your dashboard...</p>
      )}
    </div>
  );
}
