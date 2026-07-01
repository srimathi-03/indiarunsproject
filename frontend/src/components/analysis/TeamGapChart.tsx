import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RankedCandidate } from '../../types';

interface TeamGapChartProps {
  candidate: RankedCandidate;
}

const TeamGapChart: React.FC<TeamGapChartProps> = ({ candidate }) => {
  const data = (candidate.teamValueData?.uniqueSkillsAdded || []).map((skill) => ({ skill, team: 1, candidate: 1 }));

  return (
    <div className="rounded-3xl border border-brand-border/70 bg-brand-card/70 p-4">
      <h3 className="mb-3 text-lg font-semibold text-white">Team Gap Coverage</h3>
      <div className="mb-4 flex items-center gap-6 text-sm text-brand-muted">
        <div>Gap Filled: {candidate.teamValueData?.teamCoveragePercent || 0}%</div>
        <div>{candidate.teamValueData?.uniqueSkillsAdded.length || 0} unique skills this candidate brings</div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid stroke="#2A2A45" />
          <XAxis dataKey="skill" stroke="#8B8BA7" />
          <YAxis stroke="#8B8BA7" />
          <Tooltip />
          <Bar dataKey="team" fill="#8B8BA7" />
          <Bar dataKey="candidate" fill="#7D45E0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamGapChart;
