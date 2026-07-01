const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const buildCandidateFacts = (candidate, scores) => {
  return [
    `Name: ${candidate.name}`,
    `Headline: ${candidate.headline}`,
    `Experience: ${candidate.totalExperienceYears} years`,
    `Skills: ${candidate.skills.join(', ')}`,
    `Top roles: ${candidate.workHistory.slice(0, 3).map((role) => `${role.title} at ${role.company}`).join(', ')}`,
    `Final score: ${scores.finalScore.toFixed(1)}`
  ].join(' | ');
};

const runSingleDebate = async (candidate, jobTitle, scores) => {
  const facts = buildCandidateFacts(candidate, scores);

  if (!openai) {
    return {
      advocateCase: `Strong evidence of experience in ${candidate.skills.slice(0, 4).join(', ')} and a clear growth path.`,
      skepticCase: `Potential risk is depth in the most specialized stack if the role demands deeper expertise.`,
      verdict: 'MODERATE FIT',
      confidence: 0.5,
      reasoning: 'Fallback reasoning based on profile strength and role fit.'
    };
  }

  try {
    const [advocateResponse, skepticResponse] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a hiring advocate. Respond in 3–4 sentences max.' },
          { role: 'user', content: `Using ONLY these facts about the candidate: ${facts}\nBuild the strongest case for why they are an excellent fit for: ${jobTitle}.\nBe specific. Cite exact skills or experiences from their profile. No fabrication.` }
        ],
        temperature: 0.2,
        max_tokens: 400
      }),
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a rigorous hiring skeptic. Respond in 2–3 sentences max.' },
          { role: 'user', content: `Using ONLY these facts: ${facts}\nIdentify the 2 most significant risks or gaps for this role: ${jobTitle}.\nBe specific and evidence-based. No fabrication.` }
        ],
        temperature: 0.2,
        max_tokens: 400
      })
    ]);

    const advocateCase = advocateResponse.choices?.[0]?.message?.content?.trim() || 'No advocate case generated.';
    const skepticCase = skepticResponse.choices?.[0]?.message?.content?.trim() || 'No skeptic case generated.';

    const judgeResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an objective hiring judge. Respond in exactly this format:\nVERDICT: [STRONG FIT|GOOD FIT|MODERATE FIT|WEAK FIT]\nCONFIDENCE: [0.0–1.0]\nREASONING: [one sentence]' },
        { role: 'user', content: `Advocate: ${advocateCase}\nSkeptic: ${skepticCase}\nCandidate: ${candidate.name} applying for ${jobTitle}.\nDeliver your verdict.` }
      ],
      temperature: 0.1,
      max_tokens: 300
    });

    const content = judgeResponse.choices?.[0]?.message?.content?.trim() || '';
    const verdictMatch = content.match(/VERDICT:\s*(STRONG FIT|GOOD FIT|MODERATE FIT|WEAK FIT)/i);
    const confidenceMatch = content.match(/CONFIDENCE:\s*([0-9.]+)/i);
    const reasoningMatch = content.match(/REASONING:\s*(.+)/i);

    return {
      advocateCase,
      skepticCase,
      verdict: verdictMatch?.[1]?.toUpperCase() || 'MODERATE FIT',
      confidence: Number(confidenceMatch?.[1] || 0.5),
      reasoning: reasoningMatch?.[1] || 'Balanced review based on the advocate and skeptic arguments.'
    };
  } catch (error) {
    return {
      advocateCase: `Strong evidence of experience in ${candidate.skills.slice(0, 4).join(', ')}.`,
      skepticCase: 'Some role-specific specialization may still be missing.',
      verdict: 'MODERATE FIT',
      confidence: 0.5,
      reasoning: 'Fallback reasoning due to service interruption.'
    };
  }
};

const runDebates = async (candidates, jobDescription) => {
  const results = await Promise.all(candidates.map((candidate) => runSingleDebate(candidate, jobDescription.title || 'this role', candidate.scores)));
  return candidates.map((candidate, index) => ({
    ...candidate,
    verdict: results[index]
  }));
};

module.exports = { buildCandidateFacts, runSingleDebate, runDebates };
