import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/client';
import { useStore } from '../store/useStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      setAuth(response.data.data.token, response.data.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-dark to-brand-card px-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-3xl border border-brand-border/70 bg-brand-card/80 p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan text-xl font-bold text-white">N</div>
        </div>
        <h2 className="mb-2 text-center text-3xl font-semibold text-white">Welcome Back</h2>
        <p className="mb-6 text-center text-sm text-brand-muted">Sign in to run your next ranking.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-brand-border bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-purple" placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-brand-border bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-purple" placeholder="Password" />
          {error ? <p className="text-sm text-brand-danger">{error}</p> : null}
          <button className="w-full rounded-2xl bg-gradient-to-r from-brand-purple to-brand-cyan px-4 py-3 font-semibold text-white">Sign In</button>
        </form>
        <p className="mt-5 text-center text-sm text-brand-muted">
          New here? <Link to="/register" className="text-brand-cyan">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
