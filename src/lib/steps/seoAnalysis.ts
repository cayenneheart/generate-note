import { chatCompletion } from '../openai';
import type { ArticleSettings, SeoAnalysis, WebResearchResult } from '../../types';

export async function runSeoAnalysis(settings: ArticleSettings, research: WebResearchResult): Promise<SeoAnalysis> {
  const findingsText = research.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n');
  const sourcesText = research.sources.slice(0, 5).map(s => `- ${s.title}: ${s.url}`).join('\n');

  const prompt = `あなたはSEO専門家です。以下のキーワードとリサーチ結果をもとにSEO分析を行ってください。

キーワード: ${settings.keyword}
カテゴリー: ${settings.category}
読者層: ${settings.readerLevel}

## Web検索で得られた情報
${findingsText}

## 参考URL
${sourcesText}

## 競合記事の傾向
${research.competitorSummary}

以下のJSON形式で回答してください:
{
  "searchIntent": "このキーワードの検索意図の説明（リサーチ結果を踏まえて200文字程度）",
  "relatedKeywords": ["関連キーワード1", "関連キーワード2", "関連キーワード3", "関連キーワード4", "関連キーワード5"],
  "competitorInsights": "上位記事の傾向分析（リサーチ結果に基づいて200文字程度）"
}`;
  return chatCompletion<SeoAnalysis>('あなたはSEO専門家です。JSON形式で回答してください。', prompt);
}
