import { chromium, type BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const COOKIE_PATH = path.resolve('server/.x-cookies.json');
const DEBUG_DIR = path.resolve('server/.x-debug');

// Set DEBUG_SCRAPER=true in .env to see the browser
const IS_DEBUG = process.env.DEBUG_SCRAPER === 'true';

export interface XPost {
  text: string;
  author: string;
  likes: number;
  reposts: number;
  url: string;
}

interface SavedCookies {
  authToken: string;
  ct0?: string;
  savedAt: string;
}

/**
 * Save auth cookies provided by the user.
 * The user copies these from their browser's DevTools.
 */
export function saveAuthCookies(authToken: string, ct0?: string): void {
  const data: SavedCookies = {
    authToken,
    ct0: ct0 || '',
    savedAt: new Date().toISOString(),
  };
  fs.writeFileSync(COOKIE_PATH, JSON.stringify(data, null, 2));
  console.log('✅ Cookieを保存しました');
}

/**
 * Check if we have saved auth cookies.
 */
export function isLoggedIn(): boolean {
  if (!fs.existsSync(COOKIE_PATH)) return false;
  try {
    const data = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf-8')) as SavedCookies;
    return !!data.authToken;
  } catch {
    return false;
  }
}

/**
 * Clear saved cookies.
 */
export function clearLoginState(): void {
  if (fs.existsSync(COOKIE_PATH)) {
    fs.unlinkSync(COOKIE_PATH);
    console.log('🗑️ Cookieを削除しました');
  }
}

/**
 * Create an authenticated browser context using saved cookies.
 */
async function createAuthContext(): Promise<{ context: BrowserContext; close: () => Promise<void> }> {
  if (!isLoggedIn()) {
    throw new Error('Cookieが設定されていません。先にauth_tokenを入力してください。');
  }

  const data = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf-8')) as SavedCookies;

  const browser = await chromium.launch({ headless: !IS_DEBUG });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });

  // Inject cookies
  const cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Lax' | 'None' | 'Strict';
  }> = [
      {
        name: 'auth_token',
        value: data.authToken,
        domain: '.x.com',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      },
    ];

  if (data.ct0) {
    cookies.push({
      name: 'ct0',
      value: data.ct0,
      domain: '.x.com',
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    });
  }

  await context.addCookies(cookies);

  return {
    context,
    close: async () => {
      await context.close();
      await browser.close();
    },
  };
}

/**
 * Search X for posts matching a keyword.
 */
export async function searchPosts(keyword: string, maxResults = 15): Promise<XPost[]> {
  const { context, close } = await createAuthContext();

  try {
    const page = await context.newPage();
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://x.com/search?q=${encodedKeyword}&src=typed_query&f=top`;
    console.log(`    📄 ページ遷移: ${url}`);

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });

    console.log(`    ⏳ ツイート要素を待機中...`);

    // Wait for tweets to appear (or detect login redirect)
    try {
      await page.waitForSelector('article[data-testid="tweet"]', { timeout: 15_000 });
      console.log(`    ✅ ツイートが見つかりました`);
    } catch {
      // Check if we were redirected to login
      const currentUrl = page.url();
      console.log(`    ⚠️ ツイートが見つかりません。現在のURL: ${currentUrl}`);

      // Save debug screenshot
      if (!fs.existsSync(DEBUG_DIR)) fs.mkdirSync(DEBUG_DIR, { recursive: true });
      const ssPath = path.join(DEBUG_DIR, `search-${Date.now()}.png`);
      await page.screenshot({ path: ssPath, fullPage: false });
      console.log(`    📸 スクリーンショット保存: ${ssPath}`);

      if (currentUrl.includes('/login')) {
        throw new Error('Cookieの認証が切れています。auth_tokenを再設定してください。');
      }

      // Page might have loaded but no results
      const bodyText = await page.textContent('body') || '';
      console.log(`    📝 ページ内容（先頭200文字）: ${bodyText.slice(0, 200)}`);
      return [];
    }

    // Wait a bit more for content to fully render
    await page.waitForTimeout(2000);

    // Scroll a bit to load more tweets
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(1000);
    }

    // Extract tweet data
    const posts = await page.evaluate(() => {
      const articles = document.querySelectorAll('article[data-testid="tweet"]');
      const results: Array<{
        text: string;
        author: string;
        likes: number;
        reposts: number;
        url: string;
      }> = [];

      articles.forEach((article) => {
        try {
          const textEl = article.querySelector('[data-testid="tweetText"]');
          const text = textEl?.textContent || '';

          const authorLink = article.querySelector('a[role="link"][href*="/"]');
          const author = authorLink?.getAttribute('href')?.replace('/', '') || '';

          const ariaLabels = article.querySelectorAll('[aria-label]');
          let likes = 0;
          let reposts = 0;
          ariaLabels.forEach((el) => {
            const label = el.getAttribute('aria-label') || '';
            const likeMatch = label.match(/(\d+)\s*(いいね|Like|like)/);
            const repostMatch = label.match(/(\d+)\s*(リポスト|Repost|repost|リツイート)/);
            if (likeMatch) likes = parseInt(likeMatch[1], 10);
            if (repostMatch) reposts = parseInt(repostMatch[1], 10);
          });

          const timeEl = article.querySelector('time');
          const tweetLink = timeEl?.closest('a');
          const url = tweetLink
            ? `https://x.com${tweetLink.getAttribute('href')}`
            : '';

          if (text.trim()) {
            results.push({ text: text.trim(), author, likes, reposts, url });
          }
        } catch {
          // skip malformed tweet
        }
      });

      return results;
    });

    console.log(`    📊 ${posts.length} 件のツイートを抽出`);
    return posts.slice(0, maxResults);
  } finally {
    await close();
  }
}

/**
 * Get trending topics from X.
 */
export async function getTrends(): Promise<string[]> {
  const { context, close } = await createAuthContext();

  try {
    const page = await context.newPage();
    console.log(`    📄 トレンドページ遷移中...`);

    await page.goto('https://x.com/explore/tabs/trending', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });

    // Wait for trend elements
    try {
      await page.waitForSelector('[data-testid="trend"]', { timeout: 15_000 });
      console.log(`    ✅ トレンド要素が見つかりました`);
    } catch {
      const currentUrl = page.url();
      console.log(`    ⚠️ トレンドが見つかりません。URL: ${currentUrl}`);

      if (!fs.existsSync(DEBUG_DIR)) fs.mkdirSync(DEBUG_DIR, { recursive: true });
      const ssPath = path.join(DEBUG_DIR, `trends-${Date.now()}.png`);
      await page.screenshot({ path: ssPath, fullPage: false });
      console.log(`    📸 スクリーンショット保存: ${ssPath}`);

      if (currentUrl.includes('/login')) {
        throw new Error('Cookieの認証が切れています。auth_tokenを再設定してください。');
      }
      return [];
    }

    await page.waitForTimeout(2000);

    const trends = await page.evaluate(() => {
      const items: string[] = [];
      const trendCells = document.querySelectorAll('[data-testid="trend"]');
      trendCells.forEach((cell) => {
        const spans = cell.querySelectorAll('span');
        spans.forEach((span) => {
          const text = span.textContent?.trim();
          if (
            text &&
            text.length > 1 &&
            !text.includes('トレンド') &&
            !text.includes('Trending') &&
            !text.match(/^\d/) &&
            !text.includes('件のポスト') &&
            !text.includes('posts')
          ) {
            items.push(text);
          }
        });
      });
      return [...new Set(items)];
    });

    console.log(`    📊 ${trends.length} 件のトレンドを取得`);
    return trends.slice(0, 20);
  } finally {
    await close();
  }
}
