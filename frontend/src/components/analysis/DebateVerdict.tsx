import React from 'react';
import { motion } from 'framer-motion';
import { RankedCandidate } from '../../types';

interface DebateVerdictProps {
  candidate: RankedCandidate;
}

const DebateVerdict: React.FC<DebateVerdictProps> = ({ candidate }) => {
  return (
    <div className="rounded-3xl border border-brand-border/70 bg-brand-card/80 p-6">
      <div className="mb-4 text-center text-lg font-semibold text-white">⚖ AI Hiring Debate</div>
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="rounded-2xl border border-brand-success/20 bg-brand-success/10 p-4">
          <div className="mb-2 text-sm font-semibold text-brand-success">🟢 The Case For</div>
          <p className="text-sm text-white">{candidate.verdict.advocateCase}</p>
        </motion.div>
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="rounded-2xl border border-brand-danger/20 bg-brand-danger/10 p-4">
          <div className="mb-2 text-sm font-semibold text-brand-danger">🔴 The Case Against</div>
          <p className="text-sm text-white">{candidate.verdict.skepticCase}</p>
        </motion.div>
      </div>
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-5 rounded-2xl border border-brand-border/70 bg-slate-950/60 p-4 text-center">
        <div className="mb-2 text-sm font-semibold text-brand-muted">Verdict</div>
        <div className="text-2xl font-semibold text-white">{candidate.verdict.verdict}</div>
        <div className="mt-2 text-sm text-brand-muted">{candidate.verdict.confidence * 100}% confidence</div>
        <p className="mt-3 text-sm text-brand-muted">{candidate.verdict.reasoning}</p>
      </motion.div>
    </div>
  );
};

export default DebateVerdict;
