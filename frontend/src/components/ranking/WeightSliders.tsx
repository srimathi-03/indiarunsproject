import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { WeightConfig } from '../../types';

const weightMeta: Array<{ key: keyof WeightConfig; label: string; tooltip: string }> = [
  { key: 'semantic', label: 'Semantic Fit', tooltip: 'How well the candidate’s profile aligns semantically with the role.' },
  { key: 'experience', label: 'Experience Match', tooltip: 'How well their tenure matches expected seniority.' },
  { key: 'trajectory', label: 'Career Trajectory', tooltip: 'Whether their career path is growing into the next level.' },
  { key: 'behavioral', label: 'Behavioral Signals', tooltip: 'Completeness, recency, and consistency of application behavior.' },
  { key: 'teamValue', label: 'Team Gap Value', tooltip: 'Whether they fill real gaps versus duplicating current strengths.' }
];

const WeightSliders: React.FC = () => {
  const weights = useStore((state) => state.weights);
  const setWeights = useStore((state) => state.setWeights);
  const normalizeWeights = useStore((state) => state.normalizeWeights);
  const [autoNormalize, setAutoNormalize] = React.useState(true);

  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);

  const handleWeightChange = (key: keyof WeightConfig, value: number) => {
    setWeights({ [key]: value });
    if (autoNormalize) normalizeWeights();
  };

  return (
    <div className="space-y-4 rounded-2xl border border-brand-border/70 bg-brand-card/70 p-4">
      {weightMeta.map(({ key, label, tooltip }) => (
        <div key={key}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white">
              {label}
              <span className="text-brand-muted" title={tooltip}><HelpCircle size={14} /></span>
            </div>
            <span className="text-brand-cyan">{weights[key]}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights[key]}
            onChange={(e) => handleWeightChange(key, Number(e.target.value))}
            className="w-full"
          />
        </div>
      ))}

      <div className="flex items-center justify-between rounded-xl border border-brand-border/70 bg-slate-950/60 px-3 py-2 text-sm">
        <span className={total === 100 ? 'text-brand-success' : 'text-brand-warning'}>Total: {total}%</span>
        <label className="flex items-center gap-2 text-brand-muted">
          <input type="checkbox" checked={autoNormalize} onChange={() => setAutoNormalize((prev) => !prev)} />
          Auto-normalize
        </label>
      </div>
    </div>
  );
};

export default WeightSliders;
