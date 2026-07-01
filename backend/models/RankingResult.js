const mongoose = require('mongoose');

const rankingResultSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobDescription: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescription' },
  jobTitle: String,
  rankedCandidates: [{
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    name: String,
    headline: String,
    rank: Number,
    scores: {
      semanticFit: Number,
      experienceMatch: Number,
      trajectoryScore: Number,
      behavioralScore: Number,
      marginalTeamValue: Number,
      finalScore: Number
    },
    verdict: {
      advocateCase: String,
      skepticCase: String,
      verdict: String,
      confidence: Number,
      reasoning: String
    },
    matchHighlights: [String],
    riskFlags: [String],
    trajectoryData: {
      trajectoryScore: Number,
      trendLabel: String,
      skillGrowthRate: Number
    },
    teamValueData: {
      uniqueSkillsAdded: [String],
      teamCoveragePercent: Number
    }
  }],
  weights: {
    semantic: Number,
    experience: Number,
    trajectory: Number,
    behavioral: Number,
    teamValue: Number
  },
  processingTimeMs: Number,
  totalCandidatesScanned: Number,
  createdAt: { type: Date, default: Date.now }
});

rankingResultSchema.index({ recruiter: 1 });

module.exports = mongoose.model('RankingResult', rankingResultSchema);
