const API_BASE = 'https://api.openai.com/v1';

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key || key === 'ここにOpenAI APIキーを貼り付け') {
    throw new Error('VITE_OPENAI_API_KEY が .env.local に設定されていません');
  }
  return key;
}

export async function chatCompletion<T>(
  systemPrompt: string,
  userPrompt: string,
  jsonMode = true
): Promise<T> {
  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices[0].message.content;
  return jsonMode ? JSON.parse(text) : (text as T);
}

export async function generateText(systemPrompt: string, userPrompt: string): Promise<string> {
  return chatCompletion<string>(systemPrompt, userPrompt, false);
}

export async function generateImage(prompt: string): Promise<string> {
  const res = await fetch(`${API_BASE}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      response_format: 'b64_json',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `DALL-E API error: ${res.status}`);
  }

  const data = await res.json();
  return `data:image/png;base64,${data.data[0].b64_json}`;
}
