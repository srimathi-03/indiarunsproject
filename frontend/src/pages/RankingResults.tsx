import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import CandidateCard from '../components/ranking/CandidateCard';
import FilterSidebar from '../components/ranking/FilterSidebar';
import { RankedCandidate } from '../types';

type FilterState = {
  scoreRange: number;
  verdicts: Record<string, boolean>;
  experienceMin: number;
  experienceMax: number;
  sortBy: string;
};

const RankingResults: React.FC = () => {
  const navigate = useNavigate();
  const rankingResult = useStore((state) => state.rankingResult);
  const [filters, setFilters] = useState<FilterState>({
    scoreRange: 0,
    verdicts: { 'STRONG FIT': true, 'GOOD FIT': true, 'MODERATE FIT': true, 'WEAK FIT': true },
    experienceMin: 0,
    experienceMax: 20,
    sortBy: 'final'
  });

  const filteredCandidates = useMemo(() => {
    if (!rankingResult) return [] as RankedCandidate[];
    const list = rankingResult.rankedCandidates.filter((candidate) => {
      const scoreOk = candidate.scores.finalScore >= filters.scoreRange;
      const verdictOk = filters.verdicts[candidate.verdict.verdict];
      return scoreOk && verdictOk;
    });

    return [...list].sort((a, b) => {
      if (filters.sortBy === 'trajectory') return (b.scores.trajectoryScore || 0) - (a.scores.trajectoryScore || 0);
      if (filters.sortBy === 'team') return (b.scores.marginalTeamValue || 0) - (a.scores.marginalTeamValue || 0);
      if (filters.sortBy === 'semantic') return (b.scores.semanticFit || 0) - (a.scores.semanticFit || 0);
      return (b.scores.finalScore || 0) - (a.scores.finalScore || 0);
    });
  }, [filters, rankingResult]);

  if (!rankingResult) {
    return <div className="flex min-h-screen items-center justify-center bg-brand-dark text-white">No ranking available yet.</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-brand-border/70 bg-brand-card/80 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">{rankingResult.jobTitle}</h2>
              <p className="mt-2 text-sm text-brand-muted">{new Date(rankingResult.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm text-white">
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
              <button className="flex items-center gap-2 rounded-full bg-brand-purple px-4 py-2 text-sm text-white">
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-brand-muted">
            <div className="rounded-full border border-brand-border/70 bg-slate-950/50 px-3 py-2">{rankingResult.totalCandidatesScanned} scanned</div>
            <div className="rounded-full border border-brand-border/70 bg-slate-950/50 px-3 py-2">{rankingResult.rankedCandidates.length} shortlisted</div>
            <div className="rounded-full border border-brand-border/70 bg-slate-950/50 px-3 py-2">{rankingResult.processingTimeMs}ms</div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar candidates={filteredCandidates} filters={filters} onFiltersChange={(updates) => setFilters((prev) => ({ ...prev, ...updates }))} />
          <div className="space-y-4">
            {filteredCandidates.map((candidate, index) => (
              <CandidateCard key={candidate.candidateId} candidate={candidate} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingResults;
