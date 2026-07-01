import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ score, size = 64, strokeWidth = 6 }) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = score >= 70 ? '#00E59B' : score >= 40 ? '#FFB800' : '#FF4D6D';

  useEffect(() => {
    setProgress((score / 100) * circumference);
  }, [circumference, score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#2A2A45" strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDasharray: circumference, strokeDashoffset: circumference - progress }}
          transition={{ duration: 1 }}
        />
      </svg>
      <div className="absolute text-sm font-semibold text-white">{Math.round(score)}</div>
    </div>
  );
};

export default ScoreRing;
