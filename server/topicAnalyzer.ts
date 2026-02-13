import type { XPost } from './xScraper.js';

const API_BASE = 'https://api.openai.com/v1';

function getApiKey(): string {
  const key = process.env.VITE_OPENAI_API_KEY;
  if (!key) {
    throw new Error('VITE_OPENAI_API_KEY が .env.local に設定されていません');
  }
  return key;
}

async function chatCompletion<T>(
  systemPrompt: string,
  userPrompt: string,
  jsonMode = true,
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
      temperature: 0.7,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err?.error?.message || `OpenAI API error: ${res.status}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const text = data.choices[0].message.content;
  return jsonMode ? JSON.parse(text) : (text as T);
}

export interface TopicCandidate {
  title: string;
  keyword: string;
  summary: string;
  relevance: number; // 1-10
  source: string; // tweet URL or "trend"
}

/**
 * Analyze collected posts and trends, extract topic candidates
 * that match the user's content strategy.
 */
export async function analyzeTopics(
  strategy: string,
  posts: XPost[],
  trends: string[],
): Promise<TopicCandidate[]> {
  const postsText = posts
    .map((p, i) => `[${i + 1}] @${p.author}: ${p.text} (♡${p.likes} 🔁${p.reposts}) URL: ${p.url}`)
    .join('\n');

  const trendsText = trends.map((t, i) => `[T${i + 1}] ${t}`).join('\n');

  const systemPrompt = `あなたはnote記事のネタ探しを支援するアシスタントです。
ユーザーの方針に合った記事ネタ候補を、収集したXの投稿とトレンドから抽出してください。

出力フォーマット（JSON）:
{
  "candidates": [
    {
      "title": "記事タイトル案",
      "keyword": "記事生成に使うキーワード（短く）",
      "summary": "このネタの概要・なぜ書くべきか（1-2文）",
      "relevance": 8,
      "source": "情報元のURL or トレンド名"
    }
  ]
}

ルール:
- 方針との関連度(relevance)が高い順に並べる
- 最大10件まで
- 実際の投稿内容やトレンドに基づいた具体的なネタにする
- キーワードは記事生成に使える簡潔なものにする`;

  const userPrompt = `## ユーザーの方針
${strategy}

## 収集した投稿
${postsText || '（投稿なし）'}

## トレンド
${trendsText || '（トレンドなし）'}`;

  const result = await chatCompletion<{ candidates: TopicCandidate[] }>(
    systemPrompt,
    userPrompt,
  );

  return result.candidates;
}
