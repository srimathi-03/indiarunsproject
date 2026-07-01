import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
  { title: 'Trajectory Intelligence', description: 'Ranks where candidates are headed, not just where they have been.' },
  { title: 'Adversarial Explainability', description: 'Every rank backed by an Advocate vs Skeptic AI debate.' },
  { title: 'Team Gap Radar', description: 'Rewards candidates who fill your team’s actual skill gaps.' }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-brand-dark via-brand-card to-brand-dark px-6 py-24 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float absolute left-1/4 top-20 h-64 w-64 rounded-full bg-brand-purple/30 blur-3xl" />
        <div className="animate-float absolute right-1/4 top-32 h-72 w-72 rounded-full bg-brand-cyan/30 blur-3xl" />
        <div className="animate-float absolute bottom-10 left-1/2 h-56 w-56 rounded-full bg-brand-purple/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-black leading-tight md:text-8xl">
          The AI Recruiter
          <span className="gradient-text block">That Thinks</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 max-w-2xl text-lg text-brand-muted md:text-xl">
          NeuroRank goes beyond keywords — modeling trajectory, team fit, and producing an argued verdict for every candidate.
        </motion.p>

        <motion.button initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onClick={() => navigate('/register')} className="mt-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan px-8 py-4 font-semibold text-white shadow-lg glow-purple">
          Start Ranking Now →
        </motion.button>

        <p className="mt-3 text-sm text-brand-muted">Already have an account? <button onClick={() => navigate('/login')} className="text-brand-cyan">Login</button></p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.12 }} className="rounded-3xl border border-brand-border/70 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-brand-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
