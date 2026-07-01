const express = require('express');
const protect = require('../middleware/auth');
const JobDescription = require('../models/JobDescription');
const Candidate = require('../models/Candidate');
const RankingResult = require('../models/RankingResult');
const embedder = require('../services/embedder');
const scorer = require('../services/scorer');
const trajectoryEngine = require('../services/trajectoryEngine');
const teamValueEngine = require('../services/teamValueEngine');
const debateEngine = require('../services/debateEngine');

const router = express.Router();

router.post('/run', protect, async (req, res, next) => {
  try {
    const { jobId, weightOverrides = {} } = req.body;
    const start = Date.now();

    const jobDescription = await JobDescription.findById(jobId);
    if (!jobDescription) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const candidates = await Candidate.find();
    const rankedBySemantic = embedder.rankBySimilarity(jobDescription.jdEmbedding || [], candidates, 30);
    const scored = scorer.scoreAll(rankedBySemantic, jobDescription.parsed || {}, weightOverrides);
    const withTrajectory = trajectoryEngine.scoreAll(scored);
    const withTeamValue = teamValueEngine.scoreAll(withTrajectory, jobDescription.teamMembers || [], jobDescription.parsed || {});

    const sorted = [...withTeamValue].sort((a, b) => (b.scores?.finalScore || 0) - (a.scores?.finalScore || 0)).slice(0, 10);
    const debated = await debateEngine.runDebates(sorted, jobDescription);

    const rankingResult = await RankingResult.create({
      recruiter: req.user._id,
      jobDescription: jobDescription._id,
      jobTitle: jobDescription.title,
      rankedCandidates: debated.map((candidate, index) => ({
        candidateId: candidate._id,
        name: candidate.name,
        headline: candidate.headline,
        rank: index + 1,
        scores: candidate.scores,
        verdict: candidate.verdict,
        matchHighlights: [candidate.headline, candidate.skills[0]].filter(Boolean),
        riskFlags: candidate.scores?.finalScore < 60 ? ['Limited domain depth'] : [],
        trajectoryData: candidate.trajectoryData,
        teamValueData: candidate.teamValueData
      })),
      weights: {
        semantic: weightOverrides.semantic || 35,
        experience: weightOverrides.experience || 25,
        trajectory: weightOverrides.trajectory || 20,
        behavioral: weightOverrides.behavioral || 10,
        teamValue: weightOverrides.teamValue || 10
      },
      processingTimeMs: Date.now() - start,
      totalCandidatesScanned: candidates.length
    });

    const populated = await RankingResult.findById(rankingResult._id).populate('rankedCandidates.candidateId');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const result = await RankingResult.findById(req.params.id).populate('rankedCandidates.candidateId');
    if (!result) {
      return res.status(404).json({ success: false, message: 'Ranking result not found' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const results = await RankingResult.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    const summary = results.map((item) => ({
      _id: item._id,
      jobTitle: item.jobTitle,
      createdAt: item.createdAt,
      topCandidate: item.rankedCandidates[0] || null,
      count: item.rankedCandidates.length
    }));
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
