import React from 'react';

interface RankBadgeProps {
  rank: number;
  size?: number;
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 40 }) => {
  const isTop = rank === 1;
  const color = rank === 1 ? 'from-amber-400 to-yellow-500' : rank === 2 ? 'from-slate-300 to-slate-500' : rank === 3 ? 'from-orange-600 to-amber-700' : 'from-brand-purple to-brand-cyan';

  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br ${color} font-semibold text-white`} style={{ width: size, height: size }}>
      {rank}
    </div>
  );
};

export default RankBadge;
