"use client";
import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/app/lib/database.types"; // Adjust this import path as needed
import Loading from "./Loading";

export function Greeting() {
  const [user, setUser] = useState<{
    email?: string | null;
    name?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile, error } = await supabase
          .from("users")
          .select("name")
          .eq("id", authUser.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
        }

        if (profile) {
          setUser({
            email: authUser.email,
            name: profile.name,
          });
        } else {
          console.log("No profile found for user");
          setUser({
            email: authUser.email,
            name: authUser.user_metadata?.name || null,
          });
        }
      } else {
        console.log("No authenticated user found");
      }
      setLoading(false);
    };

    fetchUser();
  }, [supabase]);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getFirstName = () => {
    if (user?.name) {
      return user.name.split(" ")[0];
    }
    return "User";
  };
  return (
    <div>
      <h2 className="text-lg mt-8 font-semibold text-gray-800 text-center sm:text-left">
        {getGreeting()}, {getFirstName()}
      </h2>
    </div>
  );
}

export default Greeting;
