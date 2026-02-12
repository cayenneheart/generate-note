import { chatCompletion } from '../openai';
import type { ArticleSettings, ArticleBody, Diagram } from '../../types';

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
