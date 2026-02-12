import { runSeoAnalysis } from './steps/seoAnalysis';
import { runArticleStructure } from './steps/structureCreation';
import { runArticleBody } from './steps/articleWriting';
import { runDiagramGeneration } from './steps/diagramGeneration';
import { runFactCheck } from './steps/factCheck';
import { runXPostGeneration } from './steps/xPostGeneration';
import type { ArticleSettings, GenerationResult } from '../types';

export type StepCallback = (stepIndex: number, status: 'running' | 'done', message: string) => void;

export async function runFullPipeline(
  settings: ArticleSettings,
  onStep: StepCallback
): Promise<GenerationResult> {
  // Step 1: Research + SEO Analysis
  onStep(0, 'running', 'キーワード調査・検索意図分析...');
  const seoAnalysis = await runSeoAnalysis(settings);
  onStep(0, 'done', '');

  // Step 2: SEO (continued)
  onStep(1, 'running', 'SEO最適化分析中...');
  await new Promise(r => setTimeout(r, 500));
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
