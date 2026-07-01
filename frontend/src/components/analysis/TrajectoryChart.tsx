import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RankedCandidate } from '../../types';

interface TrajectoryChartProps {
  candidate: RankedCandidate;
}

const TrajectoryChart: React.FC<TrajectoryChartProps> = ({ candidate }) => {
  const data = (candidate.candidate?.workHistory || []).map((item, index) => ({
    year: item.year,
    skills: index + 1,
    newSkills: index + 1
  }));

  return (
    <div className="h-80 rounded-3xl border border-brand-border/70 bg-brand-card/70 p-4">
      <h3 className="mb-3 text-lg font-semibold text-white">Career Trajectory</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid stroke="#2A2A45" />
          <XAxis dataKey="year" stroke="#8B8BA7" />
          <YAxis stroke="#8B8BA7" />
          <Tooltip />
          <Line type="monotone" dataKey="skills" stroke="#7D45E0" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="newSkills" stroke="#00D4FF" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrajectoryChart;
