import { chatCompletion } from '../openai';
import type { ArticleBody, FactCheckResult } from '../../types';

export async function runFactCheck(article: ArticleBody): Promise<FactCheckResult> {
  const prompt = `あなたはファクトチェッカーです。以下の記事から事実に基づく主張を最大5つ抽出し、あなたの知識に基づいて検証してください。

記事本文:
${article.contentMarkdown.slice(0, 3000)}

以下のJSON形式で回答してください:
{
  "totalChecked": 5,
  "verified": 2,
  "inaccurate": 0,
  "unverified": 3,
  "overallConfidence": "medium",
  "items": [
    {
      "id": "fc-1",
      "claim": "記事中の事実主張をそのまま引用",
      "accuracy": "accurate または inaccurate または partial または unverified",
      "confidence": "high または medium または low",
      "explanation": "判定理由の説明（100文字程度）",
      "sources": [
        {
          "title": "参考情報源のタイトル",
          "url": "https://example.com",
          "relevance": 80,
          "date": "2025-01-01"
        }
      ],
      "suggestion": "修正が必要な場合の修正提案（不要ならnull）"
    }
  ]
}

重要:
- verified + inaccurate + unverified が totalChecked と一致すること
- accuracyが "accurate" のものを verified としてカウント
- 確信が持てない場合は "unverified" とする
- overallConfidenceは全体のバランスで判定する`;
  return chatCompletion<FactCheckResult>('あなたはファクトチェッカーです。JSON形式で回答してください。', prompt);
}
