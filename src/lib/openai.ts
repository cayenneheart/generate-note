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
      model: 'gpt-4.1-mini',
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

/**
 * Web検索付きのCompletion — OpenAI Responses API を使用
 * リサーチ結果テキストと引用元URLリストを返す
 */
export interface WebSearchCitation {
  title: string;
  url: string;
  snippet?: string;
}

export interface WebSearchResponse {
  text: string;
  citations: WebSearchCitation[];
}

export async function webSearchCompletion(
  instructions: string,
  query: string,
): Promise<WebSearchResponse> {
  const res = await fetch(`${API_BASE}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      tools: [{ type: 'web_search_preview' }],
      instructions,
      input: query,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI Responses API error: ${res.status}`);
  }

  const data = await res.json();

  // Extract text and citations from the response output
  let text = '';
  const citations: WebSearchCitation[] = [];

  for (const item of data.output || []) {
    if (item.type === 'message') {
      for (const content of item.content || []) {
        if (content.type === 'output_text') {
          text += content.text;
          // Extract inline annotations/citations
          for (const annotation of content.annotations || []) {
            if (annotation.type === 'url_citation') {
              citations.push({
                title: annotation.title || '',
                url: annotation.url || '',
                snippet: '',
              });
            }
          }
        }
      }
    }
  }

  // Deduplicate citations by URL
  const seen = new Set<string>();
  const uniqueCitations = citations.filter(c => {
    if (seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });

  return { text, citations: uniqueCitations };
}
