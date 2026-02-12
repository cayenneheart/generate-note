import { chatCompletion } from '../openai';
import type { ArticleSettings, ArticleStructure, XPostSuggestions } from '../../types';

export async function runXPostGeneration(
  settings: ArticleSettings,
  structure: ArticleStructure
): Promise<XPostSuggestions> {
  const prompt = `あなたはSNSマーケティングの専門家です。以下のnote記事のX（Twitter）投稿案を作成してください。

記事タイトル: ${structure.title}
キーワード: ${settings.keyword}
メタディスクリプション: ${structure.metaDescription}

以下のJSON形式で回答してください:
{
  "recommendedTime": "${new Date().toLocaleDateString('ja-JP')} 12:00",
  "recommendedReason": "投稿時間の推奨理由（例：火曜・ランチタイム・エンゲージメント率高）",
  "shortPosts": [
    {
      "id": "sp-1",
      "target": "初心者",
      "content": "140文字以内の投稿（絵文字含む、ハッシュタグは含めない）",
      "hashtags": ["#タグ1", "#タグ2", "#タグ3"],
      "tags": ["タグ1", "タグ2", "タグ3"],
      "charCount": 135,
      "maxChars": 140,
      "engagement": "medium"
    },
    {
      "id": "sp-2",
      "target": "中級者",
      "content": "...",
      "hashtags": ["#タグ1", "#タグ2", "#タグ3"],
      "tags": ["タグ1", "タグ2", "タグ3"],
      "charCount": 138,
      "maxChars": 140,
      "engagement": "medium"
    },
    {
      "id": "sp-3",
      "target": "ビジネスパーソン",
      "content": "...",
      "hashtags": ["#タグ1", "#タグ2", "#タグ3"],
      "tags": ["タグ1", "タグ2", "タグ3"],
      "charCount": 140,
      "maxChars": 140,
      "engagement": "medium"
    },
    {
      "id": "sp-4",
      "target": "主婦・主夫",
      "content": "...",
      "hashtags": ["#タグ1", "#タグ2", "#タグ3"],
      "tags": ["タグ1", "タグ2", "タグ3"],
      "charCount": 139,
      "maxChars": 140,
      "engagement": "medium"
    }
  ],
  "longPosts": [
    {
      "id": "lp-1",
      "type": "ストーリー型",
      "content": "300-500文字の長文投稿（体験談ベース、ハッシュタグ末尾に含む）",
      "hashtags": ["#タグ1", "#タグ2", "#タグ3", "#タグ4", "#タグ5"],
      "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"],
      "charCount": 480,
      "engagement": "high"
    }
  ],
  "thread": {
    "totalTweets": 7,
    "totalChars": 1100,
    "posts": [
      {
        "id": "th-1",
        "number": 1,
        "content": "スレッドの1つ目（導入、読者の興味を引く）",
        "charCount": 160
      },
      {
        "id": "th-2",
        "number": 2,
        "content": "スレッドの2つ目（結論・要点）",
        "charCount": 150
      },
      {
        "id": "th-3",
        "number": 3,
        "content": "スレッドの3つ目（具体例・注意点）",
        "charCount": 145
      },
      {
        "id": "th-4",
        "number": 4,
        "content": "スレッドの4つ目（実践方法）",
        "charCount": 130
      },
      {
        "id": "th-5",
        "number": 5,
        "content": "スレッドの5つ目（体験談）",
        "charCount": 140
      },
      {
        "id": "th-6",
        "number": 6,
        "content": "スレッドの6つ目（デメリット・正直な感想）",
        "charCount": 135
      },
      {
        "id": "th-7",
        "number": 7,
        "content": "スレッドの7つ目（まとめ、記事リンクへの誘導、ハッシュタグ）",
        "charCount": 160
      }
    ]
  }
}

重要:
- shortPostsのcontentは必ず140文字以内
- charCountは実際の文字数と一致させること
- 各投稿にはターゲットに合わせたトーンで書くこと`;
  return chatCompletion<XPostSuggestions>('SNSマーケティング専門家です。X(Twitter)の投稿案を作成します。JSON形式で回答してください。', prompt);
}
