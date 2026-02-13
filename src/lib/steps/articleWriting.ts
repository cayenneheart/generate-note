import { chatCompletion } from '../openai';
import type { ArticleSettings, ArticleStructure, ArticleBody, WebResearchResult } from '../../types';

export async function runArticleBody(
  settings: ArticleSettings,
  structure: ArticleStructure,
  research: WebResearchResult
): Promise<ArticleBody> {
  const headingsText = structure.headings.map(h => `${'#'.repeat(h.level)} ${h.text}`).join('\n');
  const findingsText = research.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n');
  const sourcesText = research.sources.slice(0, 8).map(s => `- [${s.title}](${s.url})`).join('\n');

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

# ★ Web検索で得られたリサーチ結果（これを必ず記事に反映すること）
${findingsText}

# 参考情報源
${sourcesText}

# リサーチの全体まとめ
${research.rawSummary.slice(0, 2000)}

# 厳守する文章ルール
- **リサーチ結果の具体的な情報を記事に反映する**。上記の要点にある数字・事例・データを積極的に引用すること
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
    '日本語のプロ編集者兼ライターです。Web検索で得たリサーチ結果を元に、AIっぽさのない自然な日本語で執筆します。JSON形式で回答してください。',
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
