'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Search from "./Search";
import { Database } from "@/app/lib/database.types"; // Adjust this import path as needed
import Loading from "./Loading";

function TopNav() {
  const [user, setUser] = useState<{
    email?: string | null;
    name?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: profile, error } = await supabase
          .from('users')
          .select('name')
          .eq('id', authUser.id)
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
        }

        if (profile) {
          setUser({
            email: authUser.email,
            name: profile.name
          });
        } else {
          console.log("No profile found for user");
          setUser({
            email: authUser.email,
            name: authUser.user_metadata?.name || null
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
    return <div><Loading/></div>;
  }

  const getInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      } else {
        return user.name[0].toUpperCase();
      }
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  

  return (
    <div className="w-full lg:w-[calc(100%-275px)] flex flex-row sm:flex-row justify-between items-center mx-auto mt-4 sm:mt-8 px-4 sm:px-0">
      <div className="flex flex-row items-center w-full sm:w-auto mb-4 sm:mb-0">
        
        <div className="w-full sm:w-auto">
          <Search />
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <Image
          width={20}
          height={20}
          src="/notification_outline.svg"
          alt="Notification icon"
        />
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm sm:text-lg">
          {getInitials()}
        </div>
      </div>
    </div>
  );
}

export default TopNav;