import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { RankedCandidate } from '../../types';

interface ScoreRadarProps {
  candidate: RankedCandidate;
}

const ScoreRadar: React.FC<ScoreRadarProps> = ({ candidate }) => {
  const data = [
    { subject: 'Semantic', value: candidate.scores.semanticFit },
    { subject: 'Experience', value: candidate.scores.experienceMatch },
    { subject: 'Trajectory', value: candidate.scores.trajectoryScore },
    { subject: 'Behavior', value: candidate.scores.behavioralScore },
    { subject: 'Team', value: candidate.scores.marginalTeamValue }
  ];

  return (
    <div className="h-80 rounded-3xl border border-brand-border/70 bg-brand-card/70 p-4">
      <h3 className="mb-3 text-lg font-semibold text-white">Score Radar</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart data={data}>
          <PolarGrid stroke="#2A2A45" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#8B8BA7', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar name="Score" dataKey="value" stroke="#7D45E0" fill="rgba(125,69,224,0.3)" fillOpacity={0.7} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreRadar;
