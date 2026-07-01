import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import RankBadge from '../components/ranking/RankBadge';
import ScoreRing from '../components/ui/ScoreRing';
import SkillChip from '../components/ui/SkillChip';
import ScoreRadar from '../components/analysis/ScoreRadar';
import TrajectoryChart from '../components/analysis/TrajectoryChart';
import DebateVerdict from '../components/analysis/DebateVerdict';
import TeamGapChart from '../components/analysis/TeamGapChart';
import { RankedCandidate } from '../types';

const tabs = ['Overview', 'Score Breakdown', 'AI Debate', 'Team Fit'] as const;

type TabKey = (typeof tabs)[number];

const CandidateDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const rankingResult = useStore((state) => state.rankingResult);
  const selectedCandidate = useStore((state) => state.selectedCandidate);
  const [activeTab, setActiveTab] = useState<TabKey>('Overview');

  const candidate = useMemo(() => {
    if (selectedCandidate && selectedCandidate.candidateId === id) return selectedCandidate;
    return rankingResult?.rankedCandidates.find((item) => item.candidateId === id);
  }, [id, rankingResult, selectedCandidate]) as RankedCandidate | undefined;

  if (!candidate) {
    return <div className="flex min-h-screen items-center justify-center bg-brand-dark text-white">Candidate not found.</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <button onClick={() => navigate('/results')} className="flex items-center gap-2 text-brand-cyan">
          <ArrowLeft size={16} /> Results
        </button>

        <div className="rounded-3xl border border-brand-border/70 bg-brand-card/80 p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <RankBadge rank={candidate.rank} size={60} />
              <div>
                <h2 className="text-3xl font-semibold">{candidate.name}</h2>
                <p className="text-brand-muted">{candidate.headline}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ScoreRing score={candidate.scores.finalScore} size={100} strokeWidth={8} />
              <div className="rounded-full border border-brand-border/70 px-4 py-2 text-sm text-brand-cyan">{candidate.verdict.verdict}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-b border-brand-border/70 pb-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-sm ${activeTab === tab ? 'border-b-2 border-brand-purple text-white' : 'text-brand-muted'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-brand-border/70 bg-brand-card/70 p-6">
              <h3 className="text-xl font-semibold">Work History</h3>
              <div className="mt-4 space-y-4">
                {candidate.candidate?.workHistory?.map((role, index) => (
                  <div key={`${role.company}-${index}`} className="rounded-2xl border border-brand-border/70 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{role.title}</div>
                        <div className="text-sm text-brand-muted">{role.company}</div>
                      </div>
                      <div className="text-sm text-brand-muted">{role.year}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {role.skills.map((skill) => <SkillChip key={skill} skill={skill} variant="default" />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-brand-border/70 bg-brand-card/70 p-6">
              <h3 className="text-xl font-semibold">Skills</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {candidate.candidate?.skills?.map((skill) => <SkillChip key={skill} skill={skill} variant="highlight" />)}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'Score Breakdown' ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <ScoreRadar candidate={candidate} />
            <TrajectoryChart candidate={candidate} />
            <div className="lg:col-span-2 rounded-3xl border border-brand-border/70 bg-brand-card/70 p-6">
              <h3 className="text-xl font-semibold">Score Breakdown</h3>
              <div className="mt-4 space-y-3 text-sm text-brand-muted">
                {Object.entries(candidate.scores).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded-2xl border border-brand-border/70 bg-slate-950/60 px-4 py-3">
                    <span>{key}</span>
                    <span className="text-white">{Math.round(value)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'AI Debate' ? (
          <DebateVerdict candidate={candidate} />
        ) : null}

        {activeTab === 'Team Fit' ? (
          <div className="space-y-6">
            <TeamGapChart candidate={candidate} />
            <div className="rounded-3xl border border-brand-border/70 bg-brand-card/70 p-6">
              <h3 className="text-xl font-semibold">Skills You'd Add</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {(candidate.teamValueData?.uniqueSkillsAdded || []).map((skill) => <SkillChip key={skill} skill={skill} variant="gap" />)}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CandidateDetail;
