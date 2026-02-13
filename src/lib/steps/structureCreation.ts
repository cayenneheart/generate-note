import { chatCompletion } from '../openai';
import type { ArticleSettings, SeoAnalysis, ArticleStructure, WebResearchResult } from '../../types';

export async function runArticleStructure(
  settings: ArticleSettings,
  seo: SeoAnalysis,
  research: WebResearchResult
): Promise<ArticleStructure> {
  const findingsText = research.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n');

  const prompt = `あなたはnoteの人気ライターです。以下の情報を元に、SEO最適化された記事の構成を作成してください。

キーワード: ${settings.keyword}
トーン: ${settings.tone === 'friendly' ? 'フレンドリーで親しみやすい' : settings.tone === 'polite' ? '丁寧で分かりやすい' : '専門的で論理的'}
読者層: ${settings.readerLevel === 'beginner' ? '初心者' : settings.readerLevel === 'intermediate' ? '中級者' : '上級者'}
目安文字数: ${settings.wordCount}文字
検索意図: ${seo.searchIntent}
関連キーワード: ${seo.relatedKeywords.join(', ')}

## リサーチで判明した重要ポイント
${findingsText}

## 競合記事の傾向
${research.competitorSummary}

上記のリサーチ結果を活かした構成にしてください。検索で得られた具体的な情報を各セクションに盛り込めるよう設計してください。

以下のJSON形式で回答してください:
{
  "title": "【2025年最新】を含む魅力的なタイトル（60文字以内）",
  "headings": [
    {"level": 2, "text": "大見出し1"},
    {"level": 3, "text": "小見出し1-1"},
    {"level": 3, "text": "小見出し1-2"},
    {"level": 2, "text": "大見出し2"},
    {"level": 3, "text": "小見出し2-1"},
    {"level": 2, "text": "大見出し3"},
    {"level": 2, "text": "よくある質問"}
  ],
  "faq": [
    {"question": "質問1", "answer": "回答1（リサーチ結果に基づいた具体的な回答）"},
    {"question": "質問2", "answer": "回答2"},
    {"question": "質問3", "answer": "回答3"}
  ],
  "metaDescription": "メタディスクリプション（120-160文字）"
}`;
  return chatCompletion<ArticleStructure>('あなたはnoteの人気ライターです。JSON形式で回答してください。', prompt);
}
