import type { GitHubRepo, GitHubUser } from "./github";

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function askGroq(prompt: string): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || '429')
  return data.choices[0].message.content
}

export async function analyzeDeveloper(data: {
  user: GitHubUser
  repos: GitHubRepo[]
  languages: Record<string, number>
  totalStars: number
  contributions: number
}) {
  const topLanguages = Object.entries(data.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang)

  const prompt = `
You are a witty, insightful developer analyst. Analyze this GitHub profile and write a fun, honest developer personality report.

Developer: ${data.user.name || data.user.login}
Bio: ${data.user.bio || 'No bio'}
Public Repos: ${data.user.public_repos}
Followers: ${data.user.followers}
Total Stars: ${data.totalStars}
Top Languages: ${topLanguages.join(', ')}
Recent Repos: ${data.repos.slice(0, 10).map((r) => r.name).join(', ')}
Account created: ${new Date(data.user.created_at).getFullYear()}

Write a personality report with these sections (use these exact headings):
**Developer Archetype:** (give them a fun title like "The Midnight Hacker" or "The Clean Code Evangelist")
**Your Coding DNA:** (2-3 sentences about their style based on languages and repos)
**Strengths:** (3 bullet points)
**Blind Spots:** (2 honest but kind observations)
**Your Vibe:** (one punchy sentence summary)

Keep it fun, specific, and under 200 words.
`
  return askGroq(prompt)
}

export async function roastDeveloper(data: {
  user: GitHubUser
  repos: GitHubRepo[]
  languages: Record<string, number>
  totalStars: number
}) {
  const topLanguages = Object.entries(data.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang)

  const prompt = `
You are a savage but loveable tech roast comedian. Roast this GitHub profile brutally but keep it fun and not mean-spirited.

Developer: ${data.user.name || data.user.login}
Public Repos: ${data.user.public_repos}
Followers: ${data.user.followers}
Total Stars: ${data.totalStars}
Top Languages: ${topLanguages.join(', ')}
Oldest repo: ${data.repos[data.repos.length - 1]?.name || 'unknown'}

Write a 4-5 sentence roast. Be specific, clever, and funny. End with a backhanded compliment.
`
  return askGroq(prompt)
}

export async function chatWithDeveloper(
  message: string,
  context: {
    user: GitHubUser
    repos: GitHubRepo[]
    languages: Record<string, number>
    totalStars: number
  }
) {
  const topLanguages = Object.entries(context.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang)

  const systemPrompt = `You are an expert developer analyst with access to a GitHub profile's data. Answer questions about this developer concisely and insightfully using the data provided.

Developer Profile:
- Name: ${context.user.name || context.user.login}
- Username: ${context.user.login}
- Bio: ${context.user.bio || 'No bio'}
- Public Repos: ${context.user.public_repos}
- Followers: ${context.user.followers}
- Following: ${context.user.following}
- Total Stars: ${context.totalStars}
- Top Languages: ${topLanguages.join(', ')}
- Member since: ${new Date(context.user.created_at).getFullYear()}
- Location: ${context.user.location || 'Unknown'}
- Top Repos: ${context.repos.slice(0, 8).map((r) => `${r.name}(⭐${r.stargazers_count})`).join(', ')}

Answer the user's question about this developer. Be specific, data-driven, and insightful. Keep answers under 150 words.`

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 300
    })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Groq error')
  return data.choices[0].message.content
}