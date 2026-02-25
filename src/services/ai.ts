export type AIProvider = 'openai' | 'anthropic'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
}

export class AIError extends Error {
  statusCode?: number
  provider?: AIProvider

  constructor(message: string, statusCode?: number, provider?: AIProvider) {
    super(message)
    this.name = 'AIError'
    this.statusCode = statusCode
    this.provider = provider
  }
}

const SAMPLE_ANSWERS = [
  'Yes.', 'No.', 'Absolutely.', 'Never.', 'It is certain.',
  'Without a doubt.', 'Don\'t count on it.', 'Follow your heart.',
  'Trust the process.', 'Let it go.', 'Not yet.', 'The time is right.',
  'Wait and see.', 'You already know the answer.', 'Take the risk.',
  'Be patient.', 'Look deeper.', 'Trust yourself.',
  'Proceed with caution.', 'Only if you truly want it.',
  'Yes, but not how you expect.', 'Embrace the uncertainty.',
  'The answer is love.', 'It\'s a blessing in disguise.',
]

const SYSTEM_PROMPT = `You are the Book of Answers. When someone asks a question, you give a single short oracle-like answer — just like a real Book of Answers.

Your answers must be:
- Very short: 1 to 8 words, rarely more. One brief phrase or sentence.
- End with a period.
- Wise, direct, and slightly mystical — like a fortune cookie or oracle.
- Relevant to what the person actually asked, but still feel like a universal truth.
- Never explain yourself. Never add context. Just the answer.
- Never use emojis, quotes, or punctuation other than a period.
- Never acknowledge being an AI.

Here are examples of the style and length to match:
${SAMPLE_ANSWERS.map(a => `"${a}"`).join(', ')}

The difference between you and a random answer is that yours should feel meaningfully connected to the question. But keep the same brevity and tone.`

async function callOpenAI(
  apiKey: string,
  question: string,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    signal,
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: question },
      ],
      max_tokens: 60,
      temperature: 0.9,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new AIError(
      errorBody?.error?.message || `OpenAI API error: ${response.status}`,
      response.status,
      'openai'
    )
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

async function callAnthropic(
  apiKey: string,
  question: string,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    signal,
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 60,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }],
      temperature: 0.9,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new AIError(
      errorBody?.error?.message || `Anthropic API error: ${response.status}`,
      response.status,
      'anthropic'
    )
  }

  const data = await response.json()
  return data.content?.[0]?.text?.trim() ?? ''
}

export async function getAIAnswer(
  config: AIConfig,
  question: string,
  signal?: AbortSignal
): Promise<string> {
  if (config.provider === 'openai') {
    return callOpenAI(config.apiKey, question, signal)
  }
  return callAnthropic(config.apiKey, question, signal)
}
