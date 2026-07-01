import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';

const steps = ['Capture role context', 'Surface team needs', 'Rank talent'] as const;

const JDInputPanel: React.FC = () => {
  const jdText = useStore((state) => state.jdText);
  const jobTitle = useStore((state) => state.jobTitle);
  const setJdText = useStore((state) => state.setJdText);
  const setJobTitle = useStore((state) => state.setJobTitle);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-border/70 bg-brand-card/70 p-4">
        <label className="mb-2 block text-sm font-medium text-brand-muted">Role Title</label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-4 py-3 text-white outline-none ring-0 focus:border-brand-purple"
          placeholder="e.g. Senior ML Platform Engineer"
        />
      </div>

      <div className="rounded-2xl border border-brand-border/70 bg-brand-card/70 p-4">
        <label className="mb-2 block text-sm font-medium text-brand-muted">Job Description</label>
        <textarea
          rows={10}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-brand-purple"
          placeholder="Paste the full job description here — the more detail you provide, the more accurate the ranking..."
        />
        <div className={`mt-2 text-right text-sm ${jdText.length > 8000 ? 'text-brand-danger' : 'text-brand-muted'}`}>
          {jdText.length} / 10,000
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={jdText.length > 200 ? 'ready' : 'draft'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="rounded-2xl border border-brand-border/70 bg-slate-950/60 p-4"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-brand-cyan">
            <Sparkles size={16} />
            Current step
          </div>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 text-sm text-brand-muted">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${index <= (jdText.length > 200 ? 2 : 0) ? 'bg-brand-success/20 text-brand-success' : 'bg-brand-border text-brand-muted'}`}>
                  {index <= (jdText.length > 200 ? 2 : 0) ? '✓' : index + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default JDInputPanel;
