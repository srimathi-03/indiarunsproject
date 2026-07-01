const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const scoreMarginalValue = (candidate, teamMembers = [], parsedJD = {}) => {
  const candidateSkills = new Set((candidate.skills || []).map((skill) => skill.toLowerCase()));
  const teamSkills = new Set((teamMembers || []).flatMap((member) => (member.skills || []).map((skill) => skill.toLowerCase())));

  const uniqueSkillsAdded = [...candidateSkills].filter((skill) => !teamSkills.has(skill));
  const baseScore = (uniqueSkillsAdded.length / Math.max(candidate.skills.length, 1)) * 100;

  let jdGapBonus = 0;
  const requiredSkills = parsedJD.requiredSkills || [];
  requiredSkills.forEach((skill) => {
    const skillName = skill.toLowerCase();
    if (!teamSkills.has(skillName) && candidateSkills.has(skillName)) {
      jdGapBonus += 15;
    }
  });

  const finalScore = clamp(baseScore + Math.min(jdGapBonus, 30), 0, 100);

  return {
    marginalTeamValue: finalScore,
    uniqueSkillsAdded,
    teamCoveragePercent: Math.round((1 - uniqueSkillsAdded.length / Math.max(candidate.skills.length, 1)) * 100)
  };
};

const scoreAll = (candidates, teamMembers = [], parsedJD = {}) => {
  return candidates.map((candidate) => {
    const teamValueData = scoreMarginalValue(candidate, teamMembers, parsedJD);
    return {
      ...candidate,
      marginalTeamValue: teamValueData.marginalTeamValue,
      teamValueData
    };
  });
};

module.exports = { scoreMarginalValue, scoreAll };
