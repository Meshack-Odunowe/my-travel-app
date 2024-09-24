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
    firstName?: string | null;
    lastName?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      

      if (authUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('firstName, lastName')
          .eq('id', authUser.id)
          .single();
        
       

        if (profile) {
          setUser({
            email: authUser.email,
            ...profile
          });
        } else {
          console.log("No profile found for user");
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
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="w-[calc(100%-275px)] flex justify-between items-center mx-auto">
      <Search />
      <div className="flex items-center justify-center gap-8">
        <Image
          width={20}
          height={20}
          src="/notification_outline.svg"
          alt="Notification icon"
        />
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
          {getInitials()}
        </div>
      </div>
    </div>
  );
}

export default TopNav;