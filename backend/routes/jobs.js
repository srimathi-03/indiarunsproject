const express = require('express');
const protect = require('../middleware/auth');
const JobDescription = require('../models/JobDescription');
const jdParser = require('../services/jdParser');
const embedder = require('../services/embedder');

const router = express.Router();

router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, teamMembers = [], weightOverrides } = req.body;
    const parsed = await jdParser.parseJD(description || '');
    const jdEmbedding = await embedder.embedText(description || '');

    const job = await JobDescription.create({
      recruiter: req.user._id,
      title,
      rawText: description,
      parsed,
      jdEmbedding,
      teamMembers,
      weightOverrides
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const jobs = await JobDescription.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
