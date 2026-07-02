import axios from 'axios';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const buildPrompt = (repoName, metrics) => {
  const { healthScore, commitFrequency, prMergeTime, issueResolution, codeChurn, contributors } = metrics;

  return `You are an engineering analytics assistant. Analyze this repository's metrics and generate 3-4 concise, specific insights a tech lead would find useful.

Repository: ${repoName}
Engineering Health Score: ${healthScore.score}/100
Commit frequency: ${commitFrequency.commitsPerDay} commits/day (${commitFrequency.totalCommits} total)
PR merge time: ${prMergeTime.avgMergeTimeHours} hours average (${prMergeTime.mergedCount} merged, ${prMergeTime.openCount} open)
Issue resolution time: ${issueResolution.avgResolutionTimeHours} hours average (${issueResolution.closedCount} closed, ${issueResolution.openCount} open)
Code churn: ${codeChurn.avgChurnPerCommit} lines changed per commit average
Contributors: ${contributors.count} active (${contributors.names.slice(0, 5).join(', ')})

Respond with ONLY a JSON array, no markdown formatting, no explanation. Each item must have exactly these fields:
- "type": one of "positive", "negative", "neutral"
- "title": a short 4-8 word headline
- "description": one sentence, specific, referencing actual numbers above

Example format:
[{"type":"negative","title":"PR merge time is elevated","description":"Pull requests are taking 52 hours to merge on average, well above the healthy 48-hour benchmark."}]`;
};

export const generateInsights = async (repoName, metrics) => {
  const prompt = buildPrompt(repoName, metrics);

  const { data } = await axios.post(
    GROQ_URL,
    {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, // low temperature: we want consistent, grounded output, not creative variation
      max_tokens: 500
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const raw = data.choices[0].message.content.trim();

  try {
    // Strip markdown code fences in case the model wraps the JSON anyway
    const cleaned = raw.replace(/^```json\s*|\s*```$/g, '');
    return JSON.parse(cleaned);
  } catch {
    // If parsing fails, fail gracefully rather than crashing the whole request
    return [
      {
        type: 'neutral',
        title: 'Insights unavailable',
        description: 'Could not generate insights this time. Try refreshing.'
      }
    ];
  }
};