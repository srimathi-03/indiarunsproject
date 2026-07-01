const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const parseJD = async (rawText) => {
  if (!openai) {
    return heuristicParse(rawText);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a precise job description parser. Extract structured information and return ONLY valid JSON with no markdown, no preamble. Return exactly this shape:{"requiredSkills":[],"niceToHaveSkills":[],"minExperienceYears":0,"seniorityLevel":"","domain":"","cultureCues":[]}`
        },
        {
          role: 'user',
          content: `Parse this job description:\n\n${rawText}`
        }
      ],
      temperature: 0.1,
      max_tokens: 800
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) return heuristicParse(rawText);
    const parsed = JSON.parse(content);
    return {
      requiredSkills: parsed.requiredSkills || [],
      niceToHaveSkills: parsed.niceToHaveSkills || [],
      minExperienceYears: parsed.minExperienceYears || 0,
      seniorityLevel: parsed.seniorityLevel || 'mid',
      domain: parsed.domain || 'software',
      cultureCues: parsed.cultureCues || []
    };
  } catch (error) {
    return heuristicParse(rawText);
  }
};

const heuristicParse = (rawText) => {
  const text = rawText.toLowerCase();
  const requiredSkills = [];
  const skillKeywords = ['react', 'node', 'typescript', 'javascript', 'python', 'aws', 'docker', 'kubernetes', 'mongodb', 'sql', 'data', 'machine learning', 'ml', 'backend', 'frontend', 'devops', 'product', 'agile', 'api', 'microservices'];
  skillKeywords.forEach((skill) => {
    if (text.includes(skill)) requiredSkills.push(skill);
  });

  const minExperienceYears = text.includes('senior') ? 5 : text.includes('lead') ? 7 : text.includes('junior') ? 1 : 3;
  const domain = text.includes('machine learning') || text.includes('ml') ? 'ML' : text.includes('frontend') ? 'Frontend' : text.includes('devops') ? 'DevOps' : 'Software';
  const seniorityLevel = text.includes('senior') ? 'senior' : text.includes('lead') ? 'lead' : text.includes('principal') ? 'principal' : 'mid';
  const cultureCues = ['collaborative', 'ownership', 'fast-paced'].filter((cue) => text.includes(cue));

  return {
    requiredSkills,
    niceToHaveSkills: [],
    minExperienceYears,
    seniorityLevel,
    domain,
    cultureCues
  };
};

module.exports = { parseJD };
