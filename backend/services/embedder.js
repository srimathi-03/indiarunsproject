const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const embedText = async (text) => {
  if (!openai) {
    return fallbackEmbedding(text);
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000)
    });
    return response.data[0].embedding;
  } catch (error) {
    return fallbackEmbedding(text);
  }
};

const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
};

const buildCandidateText = (candidate) => {
  const skills = candidate.skills.join(', ');
  const roles = candidate.workHistory.map((w) => `${w.title} at ${w.company}`).join('; ');
  return `${candidate.name}. ${candidate.headline}. Skills: ${skills}. Experience: ${roles}. Education: ${candidate.education}`;
};

const rankBySimilarity = (jdEmbedding, candidates, topK = 30) => {
  return candidates
    .filter((c) => c.embedding && c.embedding.length > 0)
    .map((c) => ({
      candidate: c,
      similarity: cosineSimilarity(jdEmbedding, c.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map((item) => ({ ...item.candidate.toObject(), semanticSimilarity: item.similarity }));
};

const fallbackEmbedding = (text) => {
  const vector = Array.from({ length: 64 }, (_, i) => {
    const token = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)[i % 10] || 'x';
    let hash = 0;
    for (let j = 0; j < token.length; j++) {
      hash = (hash << 5) - hash + token.charCodeAt(j);
      hash |= 0;
    }
    return ((hash % 1000) / 1000 + 0.5) % 1;
  });
  return vector;
};

module.exports = { embedText, cosineSimilarity, buildCandidateText, rankBySimilarity };
