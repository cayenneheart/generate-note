import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config(); // also load .env as fallback
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { saveAuthCookies, isLoggedIn, clearLoginState, searchPosts, getTrends } from './xScraper.js';
import { analyzeTopics } from './topicAnalyzer.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, loggedIn: isLoggedIn() });
});

// Save auth cookies (replaces browser-based login)
app.post('/api/x-login', async (req: Request, res: Response) => {
  try {
    const { authToken, ct0 } = req.body as { authToken: string; ct0?: string };

    if (!authToken || !authToken.trim()) {
      res.status(400).json({ ok: false, error: 'auth_tokenが必要です' });
      return;
    }

    saveAuthCookies(authToken.trim(), ct0?.trim());
    res.json({ ok: true, message: 'Cookie保存完了' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ ok: false, error: message });
  }
});

// Clear login state
app.post('/api/x-logout', (_req: Request, res: Response) => {
  clearLoginState();
  res.json({ ok: true, message: 'ログアウト完了' });
});

// Collect topics from X
app.post('/api/x-collect', async (req: Request, res: Response) => {
  try {
    const { strategy, keywords } = req.body as {
      strategy: string;
      keywords: string[];
    };

    if (!strategy) {
      res.status(400).json({ ok: false, error: '方針が指定されていません' });
      return;
    }

    if (!isLoggedIn()) {
      res.status(401).json({ ok: false, error: 'auth_tokenを入力してください' });
      return;
    }

    console.log(`🔍 ネタ収集開始: ${keywords.join(', ')}`);

    // Search posts for each keyword
    const allPosts = [];
    for (const kw of keywords) {
      console.log(`  検索中: ${kw}`);
      const posts = await searchPosts(kw, 10);
      allPosts.push(...posts);
    }

    // Get trends
    console.log('  トレンド取得中...');
    const trends = await getTrends();

    console.log(`  投稿 ${allPosts.length} 件、トレンド ${trends.length} 件を取得`);

    // Analyze with GPT
    console.log('  GPT分析中...');
    const candidates = await analyzeTopics(strategy, allPosts, trends);

    console.log(`✅ ネタ候補 ${candidates.length} 件を抽出`);

    res.json({ ok: true, candidates, postsCount: allPosts.length, trendsCount: trends.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ エラー:', message);
    res.status(500).json({ ok: false, error: message });
  }
});

// Web Research via Tavily
app.post('/api/web-research', async (req: Request, res: Response) => {
  try {
    const { keyword, category, readerLevel } = req.body as {
      keyword: string;
      category: string;
      readerLevel: string;
    };

    if (!keyword) {
      res.status(400).json({ ok: false, error: 'キーワードが必要です' });
      return;
    }

    const tavilyKey = process.env.TAVILY_API_KEY;
    if (!tavilyKey || tavilyKey === 'ここにTavily APIキーを貼り付け') {
      res.status(500).json({ ok: false, error: 'TAVILY_API_KEY が .env.local に設定されていません' });
      return;
    }

    console.log(`🔍 Tavilyリサーチ開始: "${keyword}"`);

    // Tavily Search API
    const tavilyRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: `${keyword} ${category} 最新情報 事例`,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
        max_results: 10,
        include_domains: [],
        exclude_domains: [],
      }),
    });

    if (!tavilyRes.ok) {
      const err = await tavilyRes.text();
      throw new Error(`Tavily API error: ${tavilyRes.status} ${err}`);
    }

    const tavilyData = await tavilyRes.json() as {
      answer?: string;
      results: Array<{
        title: string;
        url: string;
        content: string;
        score: number;
      }>;
    };

    console.log(`  ✅ ${tavilyData.results.length} 件の検索結果を取得`);

    res.json({
      ok: true,
      answer: tavilyData.answer || '',
      results: tavilyData.results.map(r => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ リサーチエラー:', message);
    res.status(500).json({ ok: false, error: message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 APIサーバー起動: http://localhost:${PORT}`);
  console.log(`   Xログイン状態: ${isLoggedIn() ? '✅ ログイン済み' : '❌ 未ログイン'}`);
  console.log(`   Tavily: ${process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY !== 'ここにTavily APIキーを貼り付け' ? '✅ 設定済み' : '❌ 未設定'}`);
});
