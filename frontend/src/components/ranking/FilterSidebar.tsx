import React from 'react';
import { RankedCandidate } from '../../types';

interface FilterSidebarProps {
  candidates: RankedCandidate[];
  filters: {
    scoreRange: number;
    verdicts: Record<string, boolean>;
    experienceMin: number;
    experienceMax: number;
    sortBy: string;
  };
  onFiltersChange: (updates: Partial<FilterSidebarProps['filters']>) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ candidates, filters, onFiltersChange }) => {
  const verdictOptions = ['STRONG FIT', 'GOOD FIT', 'MODERATE FIT', 'WEAK FIT'] as const;

  return (
    <div className="rounded-3xl border border-brand-border/70 bg-brand-card/70 p-5">
      <h3 className="text-lg font-semibold text-white">Filters</h3>
      <div className="mt-4 space-y-6">
        <div>
          <label className="mb-2 block text-sm text-brand-muted">Final Score Range</label>
          <input type="range" min="0" max="100" value={filters.scoreRange} onChange={(e) => onFiltersChange({ scoreRange: Number(e.target.value) })} className="w-full" />
          <div className="mt-1 text-sm text-brand-cyan">{filters.scoreRange}%</div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-brand-muted">Verdict</label>
          <div className="space-y-2">
            {verdictOptions.map((verdict) => (
              <label key={verdict} className="flex items-center gap-2 text-sm text-brand-muted">
                <input type="checkbox" checked={filters.verdicts[verdict]} onChange={() => onFiltersChange({ verdicts: { ...filters.verdicts, [verdict]: !filters.verdicts[verdict] } })} />
                <span>{verdict}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-brand-muted">Experience</label>
          <div className="grid gap-3">
            <input type="range" min="0" max="20" value={filters.experienceMin} onChange={(e) => onFiltersChange({ experienceMin: Number(e.target.value) })} className="w-full" />
            <input type="range" min="0" max="20" value={filters.experienceMax} onChange={(e) => onFiltersChange({ experienceMax: Number(e.target.value) })} className="w-full" />
          </div>
          <div className="mt-1 text-sm text-brand-cyan">{filters.experienceMin}–{filters.experienceMax} years</div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-brand-muted">Sort By</label>
          <select value={filters.sortBy} onChange={(e) => onFiltersChange({ sortBy: e.target.value })} className="w-full rounded-xl border border-brand-border bg-slate-950/60 px-3 py-2 text-white">
            <option value="final">Final Score</option>
            <option value="trajectory">Trajectory</option>
            <option value="team">Team Value</option>
            <option value="semantic">Semantic Fit</option>
          </select>
        </div>
      </div>

      <div className="mt-6 text-sm text-brand-muted">Showing {candidates.length} candidates</div>
    </div>
  );
};

export default FilterSidebar;
