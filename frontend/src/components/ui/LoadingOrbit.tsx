import React from 'react';

const LoadingOrbit: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl border border-brand-border/60 bg-brand-card/50 p-8">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border border-brand-cyan/40" />
        <div className="animate-orbit absolute h-16 w-16 rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan" />
        <div className="absolute h-32 w-32 rounded-full border border-brand-purple/20" />
      </div>
    </div>
  );
};

export default LoadingOrbit;
