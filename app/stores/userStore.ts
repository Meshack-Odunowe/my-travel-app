// File: stores/userStore.ts
import { create } from 'zustand';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/app/lib/database.types";

interface UserData {
  firstName: string;
  lastName: string;
  id: string;
  email: string;
  merchantname: string | null;
  company_id: string | null;
  role: string;
  name: string | null;
  phone_number: string | null;
  address: string | null;

  latitude: number;
  longitude: number;
}

interface UserStore {
  user: UserData | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

const supabase = createClientComponentClient<Database>();

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  fetchUser: async () => {
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        set({ user: null, loading: false });
      } else {
        set({
          user: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            id: userData.id,
            email: userData.email,
            merchantname: userData.merchantname,
            company_id: userData.company_id,
            role: userData.role,
            name: userData.name,
            phone_number: userData.phone_number,
            address: userData.address,
          
            latitude: userData.latitude,
            longitude: userData.longitude,
          },
          loading: false,
        });
      }
    } else {
      set({ user: null, loading: false });
    }
  },
}));