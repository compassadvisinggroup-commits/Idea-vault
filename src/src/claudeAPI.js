const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function generateSummary(title, description) {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: `Create a concise one-sentence summary of this idea. Be brief and punchy.\n\nTitle: ${title}\nDescription: ${description}`
          }
        ]
      })
    });

    if (!response.ok) throw new Error('Claude API error');
    const data = await response.json();
    return data.content[0].text;
  } catch (err) {
    console.error('Error generating summary:', err);
    return null;
  }
}

export async function generateTags(title, description) {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: `Generate 3-5 relevant tags for this idea. Return as comma-separated list.\n\nTitle: ${title}\nDescription: ${description}`
          }
        ]
      })
    });

    if (!response.ok) throw new Error('Claude API error');
    const data = await response.json();
    return data.content[0].text;
  } catch (err) {
    console.error('Error generating tags:', err);
    return null;
  }
}

export async function getVettingInsights(title, description) {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `Provide brief vetting insights for this idea. Consider: feasibility, potential impact, resource requirements, and risks. Be concise (2-3 sentences).\n\nTitle: ${title}\nDescription: ${description}`
          }
        ]
      })
    });

    if (!response.ok) throw new Error('Claude API error');
    const data = await response.json();
    return data.content[0].text;
  } catch (err) {
    console.error('Error getting insights:', err);
    return null;
  }
}