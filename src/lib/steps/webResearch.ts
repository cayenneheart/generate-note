import { chatCompletion } from '../openai';
import type { ArticleSettings, WebResearchResult } from '../../types';

/**
 * キーワードに基づいてTavily APIでWeb検索を実行し、リサーチ結果をまとめる
 */
export async function runWebResearch(settings: ArticleSettings): Promise<WebResearchResult> {
  // 1) サーバー経由でTavily検索
  const res = await fetch('http://localhost:3001/api/web-research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keyword: settings.keyword,
      category: settings.category,
      readerLevel: settings.readerLevel,
    }),
  });

  const data = await res.json() as {
    ok: boolean;
    error?: string;
    answer: string;
    results: Array<{
      title: string;
      url: string;
      content: string;
      score: number;
    }>;
  };

  if (!data.ok) {
    throw new Error(data.error || 'Web検索に失敗しました');
  }

  // 2) 検索結果をGPTで構造化
  const sourcesContext = data.results
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n内容: ${r.content}`)
    .join('\n\n');

  const structuredResult = await chatCompletion<{
    keyFindings: string[];
    competitorSummary: string;
  }>(
    'リサーチ結果を構造化してください。JSON形式で回答してください。',
    `以下のWeb検索結果を分析し、「${settings.keyword}」の記事を書くための要点を抽出してください。

## Tavily AI要約
${data.answer}

## 検索結果
${sourcesContext}

## 出力形式（JSON）
{
  "keyFindings": [
    "要点1: 具体的な情報・数字を含む（例: 市場規模は〇〇億円）",
    "要点2: ...",
    "要点3: ..."
  ],
  "competitorSummary": "上位記事の傾向をまとめた文章（200文字程度）"
}

ルール:
- keyFindingsは5-10個
- 各要点は具体的な情報・数字を含むこと
- 曖昧な表現は避け、検索で見つかった事実を正確に記述`
  );

  return {
    keyFindings: structuredResult.keyFindings,
    sources: data.results.map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.content.slice(0, 200),
    })),
    competitorSummary: structuredResult.competitorSummary,
    rawSummary: data.answer || sourcesContext.slice(0, 3000),
  };
}
