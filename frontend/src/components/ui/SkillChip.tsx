import React from 'react';

interface SkillChipProps {
  skill: string;
  variant?: 'default' | 'highlight' | 'muted' | 'gap';
}

const SkillChip: React.FC<SkillChipProps> = ({ skill, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-800 text-white',
    highlight: 'bg-brand-purple text-white',
    muted: 'bg-slate-900/70 text-brand-muted opacity-70',
    gap: 'border border-brand-cyan/40 text-brand-cyan'
  };

  return <span className={`rounded-full px-3 py-1 text-xs ${styles[variant]}`}>{skill}</span>;
};

export default SkillChip;
