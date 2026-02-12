import { chatCompletion } from '../openai';
import type { ArticleSettings, SeoAnalysis } from '../../types';

export async function runSeoAnalysis(settings: ArticleSettings): Promise<SeoAnalysis> {
  const prompt = `あなたはSEO専門家です。以下のキーワードについてSEO分析を行ってください。

キーワード: ${settings.keyword}
カテゴリー: ${settings.category}
読者層: ${settings.readerLevel}

以下のJSON形式で回答してください:
{
  "searchIntent": "このキーワードの検索意図の説明（200文字程度）",
  "relatedKeywords": ["関連キーワード1", "関連キーワード2", "関連キーワード3", "関連キーワード4", "関連キーワード5"],
  "competitorInsights": "上位記事の傾向分析（200文字程度）"
}`;
  return chatCompletion<SeoAnalysis>('あなたはSEO専門家です。JSON形式で回答してください。', prompt);
}
