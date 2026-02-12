import { chatCompletion } from './openai';
import type {
  ArticleSettings,
  SeoAnalysis,
  ArticleStructure,
  ArticleBody,
  Diagram,
  FactCheckResult,

  XPostSuggestions,
  GenerationResult,
} from '../types';

// ===== Step 1: SEO Analysis =====
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

// ===== Step 2: Article Structure =====
export async function runArticleStructure(
  settings: ArticleSettings,
  seo: SeoAnalysis
): Promise<ArticleStructure> {
  const prompt = `あなたはnoteの人気ライターです。以下の情報を元に、SEO最適化された記事の構成を作成してください。

キーワード: ${settings.keyword}
トーン: ${settings.tone === 'friendly' ? 'フレンドリーで親しみやすい' : settings.tone === 'polite' ? '丁寧で分かりやすい' : '専門的で論理的'}
読者層: ${settings.readerLevel === 'beginner' ? '初心者' : settings.readerLevel === 'intermediate' ? '中級者' : '上級者'}
目安文字数: ${settings.wordCount}文字
検索意図: ${seo.searchIntent}
関連キーワード: ${seo.relatedKeywords.join(', ')}

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
    {"question": "質問1", "answer": "回答1"},
    {"question": "質問2", "answer": "回答2"},
    {"question": "質問3", "answer": "回答3"}
  ],
  "metaDescription": "メタディスクリプション（120-160文字）"
}`;
  return chatCompletion<ArticleStructure>('あなたはnoteの人気ライターです。JSON形式で回答してください。', prompt);
}

// ===== Step 3: Article Body =====
export async function runArticleBody(
  settings: ArticleSettings,
  structure: ArticleStructure
): Promise<ArticleBody> {
  const headingsText = structure.headings.map(h => `${'#'.repeat(h.level)} ${h.text}`).join('\n');

  const prompt = `# 役割
あなたは日本語のプロ編集者兼ライターです。読者が「人が書いた」と感じる自然な日本語で、noteの記事を執筆してください。

# 記事情報
タイトル: ${structure.title}
キーワード: ${settings.keyword}
読者層: ${settings.readerLevel === 'beginner' ? '初心者' : settings.readerLevel === 'intermediate' ? '中級者' : '上級者'}
目安文字数: ${settings.wordCount}文字
トーン: ${settings.tone === 'friendly' ? 'フレンドリーで親しみやすい' : settings.tone === 'polite' ? '丁寧で分かりやすい' : '専門的で論理的'}

# 記事構成
${headingsText}

# FAQ
${structure.faq.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}

# 厳守する文章ルール
- AIっぽさを完全に消すこと。テンプレ感、説明書感、記号過多、過剰な丁寧さ、逃げ文句、抽象語の空回りを排除
- 完璧すぎる構成を少し崩す。「会話→説明→共感」という自然なリズムを優先
- 感情の起伏を作る。失敗談・驚き・発見といった感情の変化を意図的に混ぜる
- リズムを変える。短文と長文を混ぜ、均一な文長を避ける
- 体験談・具体例を盛り込む。一人称視点での実体験を交える
- 「本記事では」「以下で解説します」などの前置き宣言は入れない
- 「一般的に」「多くの場合」などの安全クッション表現は削除
- 「重要」「効果的」「最適」などの抽象語だけで押し切らない
- 同義語の言い換え連打はやめ、1回で言い切る
- 締めの定型句を入れない

# 出力形式
以下のJSON形式で回答してください:
{
  "content": "HTMLタグ(<h1>,<h2>,<h3>,<p>,<strong>)を使った記事本文。見出し構成に沿って書く。",
  "contentMarkdown": "Markdown形式の記事本文。同じ内容をMarkdownで書く。"
}`;

  const result = await chatCompletion<{ content: string; contentMarkdown: string }>(
    '日本語のプロ編集者兼ライターです。AIっぽさのない自然な日本語で執筆します。JSON形式で回答してください。',
    prompt
  );

  return {
    title: structure.title,
    author: '執筆者',
    date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
    readingTime: `${Math.ceil(settings.wordCount / 500)}分`,
    heroImage: '',
    content: result.content,
    contentMarkdown: result.contentMarkdown,
  };
}

// ===== Step 4: Diagram Generation =====
export async function runDiagramGeneration(
  settings: ArticleSettings,
  article: ArticleBody
): Promise<Diagram[]> {
  const prompt = `あなたはデータビジュアライゼーションの専門家です。以下のnote記事の内容を分析し、読者の理解を助けるMermaid図解を2つ生成してください。

記事タイトル: ${article.title}
キーワード: ${settings.keyword}
記事の概要（先頭1000文字）: ${article.contentMarkdown.slice(0, 1000)}

以下のJSON形式で回答してください:
[
  {
    "id": "diagram-1",
    "title": "図解のタイトル（例：プロセスフロー）",
    "type": "図解の種類の説明（例：フローチャート・手順を視覚的に表現したフローチャート）",
    "description": "この図解の説明",
    "mermaidCode": "Mermaid記法のコード（flowchart TD, graph LR などを使用。ノードのラベルには必ずダブルクォートを使う。日本語対応。スタイル定義も含む。）",
    "insertAfterParagraph": 8
  },
  {
    "id": "diagram-2",
    "title": "図解のタイトル",
    "type": "図解の種類の説明",
    "description": "この図解の説明",
    "mermaidCode": "Mermaid記法のコード",
    "insertAfterParagraph": 15
  }
]

重要: mermaidCodeでノードラベルにはダブルクォートを使うこと。例: A["ステップ1"]
回答はJSON配列で返してください。トップレベルを {"diagrams": [...]} としてください。`;
  const res = await chatCompletion<{ diagrams: Diagram[] }>('データビジュアライゼーション専門家です。Mermaid図解を生成します。JSON形式で回答してください。', prompt);
  return res.diagrams;
}

// ===== Step 5: Fact Check =====
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



// ===== Step 7: X Posts =====
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

// ===== Full Pipeline =====
export type StepCallback = (stepIndex: number, status: 'running' | 'done', message: string) => void;

export async function runFullPipeline(
  settings: ArticleSettings,
  onStep: StepCallback
): Promise<GenerationResult> {
  // Step 1: SEO Analysis
  onStep(0, 'running', 'キーワード調査・検索意図分析...');
  const seoAnalysis = await runSeoAnalysis(settings);
  onStep(0, 'done', '');

  // Step 2: SEO (same as step1 result)
  onStep(1, 'running', 'SEO最適化分析中...');
  await new Promise(r => setTimeout(r, 500)); // brief pause
  onStep(1, 'done', '');

  // Step 3: Article Structure
  onStep(2, 'running', '記事構成を作成中...');
  const structure = await runArticleStructure(settings, seoAnalysis);
  onStep(2, 'done', '');

  // Step 4: Article Body
  onStep(3, 'running', '自然な日本語で記事を執筆中...');
  const article = await runArticleBody(settings, structure);
  onStep(3, 'done', '');

  // Step 5: Fact Check
  onStep(4, 'running', '事実情報を検証中...');
  const factCheck = await runFactCheck(article);
  onStep(4, 'done', '');

  // Step 6: Diagrams
  onStep(5, 'running', 'Mermaid図解を生成中...');
  const diagrams = await runDiagramGeneration(settings, article);
  onStep(5, 'done', '');

  // Step 7: X Posts
  onStep(6, 'running', 'X投稿文を作成中...');
  const xPosts = await runXPostGeneration(settings, structure);
  onStep(6, 'done', '');

  // Step 8: Output integration
  onStep(7, 'running', '全データを統合中...');
  await new Promise(r => setTimeout(r, 500));
  onStep(7, 'done', '');

  return {
    seoAnalysis,
    structure,
    article,
    diagrams,
    factCheck,
    images: [],
    xPosts,
  };
}
