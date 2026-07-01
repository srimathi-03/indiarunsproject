const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeWeights = (weights) => {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (total === 0) return weights;
  return Object.fromEntries(Object.entries(weights).map(([key, value]) => [key, Number(((value / total) * 100).toFixed(2))]));
};

module.exports = { clamp, normalizeWeights };
