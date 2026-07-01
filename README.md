# NeuroRank — Intelligent AI Recruiting Engine

> Built for The Data & AI Challenge by Redrob × H2S

## What It Does

NeuroRank ranks job candidates using a 5-stage AI pipeline:

1. **JD Parsing** — GPT-4o extracts structured requirements from any job description
2. **Semantic Retrieval** — OpenAI embeddings + cosine similarity surfaces the most relevant candidates
3. **Multi-Signal Scoring** — Weighted scoring across semantic fit, experience, trajectory, behavioral signals, and marginal team value
4. **Trajectory Modeling** — Models career momentum (skill growth rate + seniority velocity) to rank where candidates are *heading*
5. **Adversarial Debate** — Advocate vs Skeptic LLM agents produce a grounded verdict card for every candidate

## Setup

### Backend
cd backend
npm install
npm run dev
npm run seed

### Frontend
cd frontend
npm install
npm run dev

### Requirements
- Node.js 18+
- MongoDB running locally (or set MONGODB_URI to Atlas)
- OpenAI API key with access to gpt-4o and text-embedding-3-small
