require('dotenv').config();
const connectDB = require('../config/db');
const Candidate = require('../models/Candidate');
const embedder = require('../services/embedder');

const archetypes = [
  {
    role: 'ML Engineer',
    levels: ['junior', 'mid', 'senior', 'staff', 'principal'],
    skills: [['python', 'pandas', 'scikit-learn'], ['python', 'pytorch', 'mlops'], ['python', 'tensorflow', 'keras'], ['python', 'pytorch', 'mlflow'], ['python', 'transformers', 'ray']]
  },
  {
    role: 'Full Stack Developer',
    levels: ['junior', 'mid', 'senior'],
    skills: [['react', 'node', 'mongodb'], ['react', 'typescript', 'express'], ['react', 'node', 'graphql']]
  },
  {
    role: 'Data Engineer',
    levels: ['associate', 'mid', 'lead'],
    skills: [['sql', 'spark', 'python'], ['airflow', 'dbt', 'bigquery'], ['spark', 'kafka', 'terraform']]
  },
  {
    role: 'DevOps / SRE',
    levels: ['mid', 'senior', 'director'],
    skills: [['aws', 'docker', 'linux'], ['kubernetes', 'terraform', 'monitoring'], ['aws', 'sre', 'incident response']]
  },
  {
    role: 'Frontend Specialist',
    levels: ['junior', 'mid', 'staff'],
    skills: [['react', 'css', 'figma'], ['react', 'typescript', 'design systems'], ['react', 'vite', 'performance']]
  },
  {
    role: 'Product Manager',
    levels: ['associate', 'senior', 'vp'],
    skills: [['roadmaps', 'analytics', 'jira'], ['strategy', 'execution', 'sql'], ['leadership', 'prioritization', 'go-to-market']]
  }
];

const createWorkHistory = (role, level, index) => {
  const baseYears = [2014, 2016, 2018, 2020, 2022, 2024];
  const titles = {
    'ML Engineer': ['Research Assistant', 'ML Engineer', 'Senior ML Engineer', 'Principal ML Engineer'],
    'Full Stack Developer': ['Software Engineer', 'Full Stack Developer', 'Senior Full Stack Developer'],
    'Data Engineer': ['Data Analyst', 'Data Engineer', 'Senior Data Engineer'],
    'DevOps / SRE': ['Systems Engineer', 'Site Reliability Engineer', 'Principal SRE'],
    'Frontend Specialist': ['Frontend Developer', 'Senior Frontend Engineer', 'Staff Frontend Engineer'],
    'Product Manager': ['Product Analyst', 'Product Manager', 'Senior Product Manager']
  };

  const companies = ['Acme', 'Northwind', 'Helio', 'Nova Labs', 'BrightPath', 'Crest'];
  const year = baseYears[index] + (level === 'director' || level === 'vp' ? 2 : 0);
  return {
    title: titles[role][index] || role,
    company: companies[(index + 2) % companies.length],
    durationMonths: 24 + index * 6,
    skills: archetypes.find((a) => a.role === role).skills[index % archetypes.find((a) => a.role === role).skills.length],
    year
  };
};

const buildCandidate = (index) => {
  const archetype = archetypes[index % archetypes.length];
  const level = archetype.levels[index % archetype.levels.length];
  const experienceYears = 2 + (index % 10) + (level === 'senior' ? 3 : level === 'staff' ? 6 : level === 'principal' ? 8 : level === 'director' ? 10 : level === 'vp' ? 12 : 0);
  const roles = Array.from({ length: 2 + (index % 3) }, (_, i) => createWorkHistory(archetype.role, level, i));
  const skills = Array.from(new Set((roles.flatMap((role) => role.skills)).concat(archetype.skills[index % archetype.skills.length]))).slice(0, 12);

  return {
    name: `${archetype.role.split(' ')[0]} Candidate ${index + 1}`,
    headline: `${archetype.role} with ${level} experience`,
    location: ['New York', 'London', 'Berlin', 'Remote', 'Singapore'][index % 5],
    totalExperienceYears: experienceYears,
    skills,
    workHistory: roles,
    education: ['BSc Computer Science', 'MSc Data Science', 'MBA', 'BEng Software'][index % 4],
    behavioral: {
      profileCompleteness: 0.7 + (index % 4) * 0.07,
      activityRecencyDays: 30 + (index % 6) * 20,
      responseRate: 0.6 + (index % 5) * 0.07,
      applicationConsistency: 0.7 + (index % 5) * 0.05
    },
    isSeeded: true
  };
};

const seedCandidates = async () => {
  await connectDB();
  const existing = await Candidate.find({ isSeeded: true }).countDocuments();
  if (existing >= 30) {
    console.log('Candidates already seeded.');
    return { message: '30 candidates seeded', count: existing };
  }

  const candidates = [];
  for (let i = 0; i < 30; i++) {
    const candidate = buildCandidate(i);
    console.log(`Seeding candidate ${i + 1}/30: ${candidate.name}...`);
    const embedding = await embedder.embedText(embedder.buildCandidateText(candidate));
    candidate.embedding = embedding;
    candidates.push(candidate);
  }

  await Candidate.deleteMany({ isSeeded: true });
  await Candidate.insertMany(candidates);
  console.log('Seeding complete.');
  return { message: '30 candidates seeded', count: candidates.length };
};

if (require.main === module) {
  seedCandidates()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedCandidates;
