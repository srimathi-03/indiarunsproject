export interface User {
  _id: string;
  name: string;
  email: string;
  company: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface WorkHistory {
  title: string;
  company: string;
  durationMonths: number;
  skills: string[];
  year: number;
}

export interface BehavioralSignals {
  profileCompleteness: number;
  activityRecencyDays: number;
  responseRate: number;
  applicationConsistency: number;
}

export interface Candidate {
  _id: string;
  name: string;
  headline: string;
  location: string;
  totalExperienceYears: number;
  skills: string[];
  workHistory: WorkHistory[];
  education: string;
  behavioral: BehavioralSignals;
}

export interface TeamMember {
  role: string;
  skills: string[];
}

export interface ParsedJD {
  requiredSkills: string[];
  niceToHaveSkills: string[];
  minExperienceYears: number;
  seniorityLevel: string;
  domain: string;
  cultureCues: string[];
}

export interface JobDescription {
  _id: string;
  title: string;
  rawText: string;
  parsed: ParsedJD;
  teamMembers: TeamMember[];
  createdAt: string;
}

export interface ScoreBreakdown {
  semanticFit: number;
  experienceMatch: number;
  trajectoryScore: number;
  behavioralScore: number;
  marginalTeamValue: number;
  finalScore: number;
}

export interface DebateVerdict {
  advocateCase: string;
  skepticCase: string;
  verdict: 'STRONG FIT' | 'GOOD FIT' | 'MODERATE FIT' | 'WEAK FIT';
  confidence: number;
  reasoning: string;
}

export interface RankedCandidate {
  candidateId: string;
  name: string;
  headline: string;
  rank: number;
  scores: ScoreBreakdown;
  verdict: DebateVerdict;
  matchHighlights: string[];
  riskFlags: string[];
  trajectoryData?: {
    trajectoryScore: number;
    trendLabel: string;
    skillGrowthRate: number;
  };
  teamValueData?: {
    uniqueSkillsAdded: string[];
    teamCoveragePercent: number;
  };
  candidate?: Candidate;
}

export interface RankingResult {
  _id: string;
  jobTitle: string;
  rankedCandidates: RankedCandidate[];
  weights: { semantic: number; experience: number; trajectory: number; behavioral: number; teamValue: number };
  processingTimeMs: number;
  totalCandidatesScanned: number;
  createdAt: string;
}

export interface WeightConfig {
  semantic: number;
  experience: number;
  trajectory: number;
  behavioral: number;
  teamValue: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
