import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const Navbar: React.FC = () => {
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-brand-border/70 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan text-lg font-bold text-white">
            N
          </div>
          <span className="text-xl font-semibold text-white">NeuroRank</span>
        </button>

        {token ? (
          <div className="flex items-center gap-6 text-sm text-brand-muted">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'text-white underline decoration-brand-purple' : 'hover:text-white')}>
              Dashboard
            </NavLink>
            <NavLink to="/results" className={({ isActive }) => (isActive ? 'text-white underline decoration-brand-purple' : 'hover:text-white')}>
              History
            </NavLink>
            <span className="text-white">{user?.name || 'Recruiter'}</span>
            <button onClick={logout} className="rounded-full border border-brand-border px-3 py-1 text-white hover:border-brand-purple">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="rounded-full px-4 py-2 text-white hover:bg-white/10">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan px-4 py-2 font-medium text-white">
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
