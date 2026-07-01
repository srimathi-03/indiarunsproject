import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { initializeAuth, useStore } from '../../store/useStore';
import LoadingOrbit from '../ui/LoadingOrbit';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useStore((state) => state.token);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const load = async () => {
      await initializeAuth();
      setChecking(false);
    };
    load();
  }, []);

  if (!token) return <Navigate to="/login" replace />;
  if (checking) return <div className="flex min-h-screen items-center justify-center"><LoadingOrbit /></div>;

  return <>{children}</>;
};

export default ProtectedRoute;
