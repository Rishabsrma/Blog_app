'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';

export default function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
}
