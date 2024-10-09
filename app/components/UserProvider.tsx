'use client'

import React, { useEffect } from 'react';
import { useUserStore } from '../stores/userStore';

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useUserStore(state => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <>{children}</>;
}