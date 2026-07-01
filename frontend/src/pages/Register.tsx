import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { register, seedCandidates } from '../api/client';
import { useStore } from '../store/useStore';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await register({ name, email, password, company });
      setAuth(response.data.data.token, response.data.data.user);
      await seedCandidates();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-dark to-brand-card px-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-3xl border border-brand-border/70 bg-brand-card/80 p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan text-xl font-bold text-white">N</div>
        </div>
        <h2 className="mb-2 text-center text-3xl font-semibold text-white">Create Account</h2>
        <p className="mb-6 text-center text-sm text-brand-muted">Start orchestrating smarter candidate reviews.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-brand-border bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-purple" placeholder="Name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-brand-border bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-purple" placeholder="Email" />
          <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-2xl border border-brand-border bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-purple" placeholder="Company (optional)" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-brand-border bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-purple" placeholder="Password" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-2xl border border-brand-border bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-purple" placeholder="Confirm Password" />
          {error ? <p className="text-sm text-brand-danger">{error}</p> : null}
          <button className="w-full rounded-2xl bg-gradient-to-r from-brand-purple to-brand-cyan px-4 py-3 font-semibold text-white">Create Account</button>
        </form>
        <p className="mt-5 text-center text-sm text-brand-muted">
          Already have an account? <Link to="/login" className="text-brand-cyan">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
