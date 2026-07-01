const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  rawText: String,
  parsed: {
    requiredSkills: [String],
    niceToHaveSkills: [String],
    minExperienceYears: Number,
    seniorityLevel: String,
    domain: String,
    cultureCues: [String]
  },
  jdEmbedding: [Number],
  teamMembers: [{ role: String, skills: [String] }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
