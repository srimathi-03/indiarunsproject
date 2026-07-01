const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  headline: String,
  location: String,
  totalExperienceYears: Number,
  skills: [String],
  workHistory: [{
    title: String,
    company: String,
    durationMonths: Number,
    skills: [String],
    year: Number
  }],
  education: String,
  behavioral: {
    profileCompleteness: Number,
    activityRecencyDays: Number,
    responseRate: Number,
    applicationConsistency: Number
  },
  embedding: [Number],
  isSeeded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

candidateSchema.index({ embedding: 1 });

module.exports = mongoose.model('Candidate', candidateSchema);
