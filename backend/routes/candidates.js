const express = require('express');
const protect = require('../middleware/auth');
const Candidate = require('../models/Candidate');
const seedCandidates = require('../utils/seedCandidates');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [candidates, total] = await Promise.all([
      Candidate.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Candidate.countDocuments()
    ]);

    res.json({ success: true, data: { candidates, page, limit, total } });
  } catch (error) {
    next(error);
  }
});

router.post('/seed', protect, async (req, res, next) => {
  try {
    const result = await seedCandidates();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
