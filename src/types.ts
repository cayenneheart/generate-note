// ===== 入力パラメータ =====
export type Tone = 'polite' | 'friendly' | 'professional';
export type ReaderLevel = 'beginner' | 'intermediate' | 'advanced';
export type Category = 'business' | 'technology' | 'lifestyle' | 'education' | 'entertainment';

export interface ArticleSettings {
  keyword: string;
  tone: Tone;
  readerLevel: ReaderLevel;
  category: Category;
  wordCount: number;
  imageTheme: string;
}

// ===== 生成パイプライン =====
export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type StepStatus = 'waiting' | 'running' | 'done' | 'error';

export interface PipelineStep {
  id: StepId;
  name: string;
  description: string;
  duration: number; // seconds
  status: StepStatus;
  icon: string;
}

// ===== SEO分析結果 =====
export interface SeoAnalysis {
  searchIntent: string;
  relatedKeywords: string[];
  competitorInsights: string;
}

// ===== 記事構成 =====
export interface ArticleStructure {
  title: string;
  headings: { level: number; text: string }[];
  faq: { question: string; answer: string }[];
  metaDescription: string;
}

// ===== 記事本文 =====
export interface ArticleBody {
  title: string;
  author: string;
  date: string;
  readingTime: string;
  heroImage: string;
  content: string;
  contentMarkdown: string;
}

// ===== 図解 =====
export interface Diagram {
  id: string;
  title: string;
  type: string;
  description: string;
  mermaidCode: string;
  insertAfterParagraph: number;
}

// ===== ファクトチェック =====
export type FactAccuracy = 'accurate' | 'inaccurate' | 'partial' | 'unverified';
export type FactConfidence = 'high' | 'medium' | 'low';

export interface FactSource {
  title: string;
  url: string;
  relevance: number;
  date: string;
}

export interface FactCheckItem {
  id: string;
  claim: string;
  accuracy: FactAccuracy;
  confidence: FactConfidence;
  explanation: string;
  sources: FactSource[];
  suggestion?: string;
}

export interface FactCheckResult {
  totalChecked: number;
  verified: number;
  inaccurate: number;
  unverified: number;
  overallConfidence: FactConfidence;
  items: FactCheckItem[];
}

// ===== 画像 =====
export interface GeneratedImage {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'eyecatch' | 'inline';
}

// ===== X投稿 =====
export interface XShortPost {
  id: string;
  target: string;
  content: string;
  hashtags: string[];
  tags: string[];
  charCount: number;
  maxChars: number;
  engagement: 'low' | 'medium' | 'high';
}

export interface XLongPost {
  id: string;
  type: string;
  content: string;
  hashtags: string[];
  tags: string[];
  charCount: number;
  engagement: 'low' | 'medium' | 'high';
}

export interface XThreadPost {
  id: string;
  number: number;
  content: string;
  charCount: number;
}

export interface XPostSuggestions {
  recommendedTime: string;
  recommendedReason: string;
  shortPosts: XShortPost[];
  longPosts: XLongPost[];
  thread: {
    totalTweets: number;
    totalChars: number;
    posts: XThreadPost[];
  };
}

// ===== 生成結果全体 =====
export interface GenerationResult {
  seoAnalysis: SeoAnalysis;
  structure: ArticleStructure;
  article: ArticleBody;
  diagrams: Diagram[];
  factCheck: FactCheckResult;
  images: GeneratedImage[];
  xPosts: XPostSuggestions;
}
