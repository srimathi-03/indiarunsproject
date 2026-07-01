const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const scoreSemanticFit = (semanticSimilarity) => clamp(semanticSimilarity * 100, 0, 100);

const scoreExperienceMatch = (candidate, parsedJD) => {
  const requiredYears = parsedJD.minExperienceYears || 0;
  if (requiredYears <= 0) return 100;
  const ratio = candidate.totalExperienceYears / requiredYears;
  return clamp(ratio * 100, 0, 100);
};

const scoreBehavioral = (candidate) => {
  const completeness = candidate.behavioral?.profileCompleteness || 0.5;
  const recency = Math.max(0, 1 - (candidate.behavioral?.activityRecencyDays || 180) / 365);
  const responseRate = candidate.behavioral?.responseRate || 0.5;
  const consistency = candidate.behavioral?.applicationConsistency || 0.5;
  return clamp(completeness * 40 + recency * 30 + responseRate * 20 + consistency * 10, 0, 100);
};

const computeFinalScore = (scores, weights) => {
  const totalWeight = weights.semantic + weights.experience + weights.trajectory + weights.behavioral + weights.teamValue;
  if (totalWeight === 0) return 0;
  return (
    (weights.semantic * scores.semanticFit +
      weights.experience * scores.experienceMatch +
      weights.trajectory * scores.trajectoryScore +
      weights.behavioral * scores.behavioralScore +
      weights.teamValue * scores.marginalTeamValue) / totalWeight
  );
};

const scoreAll = (candidates, parsedJD, weightOverrides = {}) => {
  const defaultWeights = { semantic: 35, experience: 25, trajectory: 20, behavioral: 10, teamValue: 10 };
  const weights = { ...defaultWeights, ...weightOverrides };

  return candidates.map((candidate) => {
    const semanticFit = scoreSemanticFit(candidate.semanticSimilarity || 0.5);
    const experienceMatch = scoreExperienceMatch(candidate, parsedJD);
    const trajectoryScore = candidate.trajectoryScore || 50;
    const behavioralScore = scoreBehavioral(candidate);
    const marginalTeamValue = candidate.marginalTeamValue || 50;

    const scores = {
      semanticFit,
      experienceMatch,
      trajectoryScore,
      behavioralScore,
      marginalTeamValue,
      finalScore: computeFinalScore({
        semanticFit,
        experienceMatch,
        trajectoryScore,
        behavioralScore,
        marginalTeamValue
      }, weights)
    };

    return { ...candidate, scores };
  });
};

module.exports = {
  scoreSemanticFit,
  scoreExperienceMatch,
  scoreBehavioral,
  computeFinalScore,
  scoreAll
};
