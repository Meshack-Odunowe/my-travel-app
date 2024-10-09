'use client'

import React, { useEffect } from 'react';
import { useUserStore } from '../stores/userStore';

export function Greeting() {
  const { user, loading, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Welcome, Guest!</div>;
  }

  return <div>Welcome, {user.firstName || 'User'}!</div>;
}

export default Greeting;