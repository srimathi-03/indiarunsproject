import { useEffect } from 'react';
import { initializeAuth, useStore } from '../store/useStore';

export const useAuth = () => {
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);

  useEffect(() => {
    initializeAuth();
  }, []);

  return { token, user, isAuthenticated: Boolean(token) };
};
