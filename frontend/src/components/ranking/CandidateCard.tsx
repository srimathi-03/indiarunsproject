import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RankedCandidate } from '../../types';
import RankBadge from './RankBadge';
import ScoreRing from '../ui/ScoreRing';
import SkillChip from '../ui/SkillChip';
import { useStore } from '../../store/useStore';

interface CandidateCardProps {
  candidate: RankedCandidate;
  index: number;
}

const verdictColors = {
  'STRONG FIT': 'bg-brand-success/15 text-brand-success',
  'GOOD FIT': 'bg-brand-purple/20 text-brand-purple',
  'MODERATE FIT': 'bg-brand-warning/20 text-brand-warning',
  'WEAK FIT': 'bg-brand-danger/20 text-brand-danger'
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index }) => {
  const navigate = useNavigate();
  const setSelectedCandidate = useStore((state) => state.setSelectedCandidate);

  const openCandidate = () => {
    setSelectedCandidate(candidate);
    navigate(`/candidate/${candidate.candidateId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={openCandidate}
      className="cursor-pointer rounded-3xl border border-brand-border/70 bg-brand-card/80 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-brand-purple/70"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <RankBadge rank={candidate.rank} size={44} />
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-white">{candidate.name}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${verdictColors[candidate.verdict.verdict]}`}>
                {candidate.verdict.verdict}
              </span>
            </div>
            <p className="mt-1 text-sm text-brand-muted">{candidate.headline}</p>
          </div>
        </div>
        <ScoreRing score={candidate.scores.finalScore} size={64} strokeWidth={6} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
        <div>
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-brand-muted">Semantic Fit</div>
          <div className="h-2 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-brand-cyan" style={{ width: `${candidate.scores.semanticFit}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-brand-muted">Trajectory</div>
          <div className="h-2 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-brand-purple" style={{ width: `${candidate.scores.trajectoryScore}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-brand-muted">Team Value</div>
          <div className="h-2 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-brand-success" style={{ width: `${candidate.scores.marginalTeamValue}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {candidate.matchHighlights.slice(0, 3).map((highlight) => (
          <SkillChip key={highlight} skill={highlight} variant="highlight" />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {candidate.riskFlags.slice(0, 2).map((flag) => (
          <div key={flag} className="flex items-center gap-2 rounded-full border border-brand-warning/30 bg-brand-warning/10 px-3 py-1 text-sm text-brand-warning">
            <AlertTriangle size={14} />
            {flag}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-brand-muted">{candidate.verdict.reasoning}</div>
        <button onClick={openCandidate} className="rounded-full border border-brand-purple/40 px-4 py-2 text-sm text-brand-purple hover:bg-brand-purple/10">
          View Full Analysis <Sparkles size={14} className="ml-2 inline" />
        </button>
      </div>
    </motion.div>
  );
};

export default CandidateCard;
