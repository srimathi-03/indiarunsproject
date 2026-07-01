const SENIORITY_MAP = {
  intern: 1,
  junior: 2,
  associate: 2,
  mid: 3,
  engineer: 3,
  developer: 3,
  analyst: 3,
  senior: 4,
  lead: 5,
  staff: 5,
  principal: 6,
  architect: 6,
  director: 7,
  manager: 6,
  head: 6,
  vp: 7
};

const inferSeniority = (title) => {
  const lower = (title || '').toLowerCase();
  const match = Object.keys(SENIORITY_MAP).find((key) => lower.includes(key));
  return match ? SENIORITY_MAP[match] : 3;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const computeTrajectory = (candidate) => {
  const history = [...(candidate.workHistory || [])].sort((a, b) => a.year - b.year);
  const uniqueSkills = new Set();
  let previousSkills = new Set();
  let skillGrowthRate = 0;

  history.forEach((role) => {
    const currentSkills = new Set((role.skills || []).map((s) => s.toLowerCase()));
    const gained = [...currentSkills].filter((skill) => !previousSkills.has(skill));
    gained.forEach((skill) => uniqueSkills.add(skill));
    previousSkills = currentSkills;
    skillGrowthRate += gained.length;
  });

  const totalYears = Math.max(1, history.length);
  const earliest = history[0] ? inferSeniority(history[0].title) : 3;
  const latest = history[history.length - 1] ? inferSeniority(history[history.length - 1].title) : 3;
  const seniorityVelocity = (latest - earliest) / Math.max(1, totalYears);
  const seniorityVelocityNormalized = clamp(seniorityVelocity * 20, 0, 100);

  const recencyBoost = Math.max(0, 1 - (candidate.behavioral?.activityRecencyDays || 180) / 365) * 20;
  const trajectoryScore = clamp(skillGrowthRate * 12 + seniorityVelocityNormalized * 0.6 + recencyBoost, 0, 100);
  const trendLabel = trajectoryScore > 75 ? 'Rapidly Accelerating' : trajectoryScore > 50 ? 'Steady Growth' : trajectoryScore > 25 ? 'Stable' : 'Needs Momentum';

  return {
    trajectoryScore,
    trendLabel,
    skillGrowthRate: Number(skillGrowthRate.toFixed(2))
  };
};

const scoreAll = (candidates) => {
  return candidates.map((candidate) => {
    const trajectoryData = computeTrajectory(candidate);
    return {
      ...candidate,
      trajectoryScore: trajectoryData.trajectoryScore,
      trajectoryData
    };
  });
};

module.exports = { SENIORITY_MAP, inferSeniority, computeTrajectory, scoreAll };
