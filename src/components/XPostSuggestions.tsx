import { useState, useCallback } from 'react';
import type { XPostSuggestions as XPosts } from '../types';

interface Props {
  posts: XPosts;
}

export default function XPostSuggestions({ posts }: Props) {
  const [activeTab, setActiveTab] = useState<'short' | 'long' | 'thread'>('short');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const handleCopyAll = useCallback(() => {
    let text = '';
    if (activeTab === 'short') {
      text = posts.shortPosts.map(p => p.content + '\n' + p.hashtags.join(' ')).join('\n\n---\n\n');
    } else if (activeTab === 'long') {
      text = posts.longPosts.map(p => p.content + '\n' + p.hashtags.join(' ')).join('\n\n---\n\n');
    } else {
      text = posts.thread.posts.map(p => `[${p.number}/${posts.thread.totalTweets}]\n${p.content}`).join('\n\n');
    }
    handleCopy(text, 'all');
  }, [activeTab, posts, handleCopy]);

  const engagementEmoji = (e: string) => {
    return { low: '👍', medium: '👍', high: '🔥' }[e] || '👍';
  };

  return (
    <div className="result-section">
      <div className="result-section-header">
        <div className="result-section-title">
          <span className="icon">𝕏</span>
          X（Twitter）投稿案
        </div>
      </div>
      <div className="result-section-body">
        {/* Recommend Time */}
        <div className="recommend-time">
          <span className="icon">⏰</span>
          <div>
            <div className="label">おすすめ投稿時間</div>
            <div className="value">{posts.recommendedTime} ({posts.recommendedReason})</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav">
          <button
            className={`tab-btn ${activeTab === 'short' ? 'active' : ''}`}
            onClick={() => setActiveTab('short')}
          >
            📱 短文ポスト
          </button>
          <button
            className={`tab-btn ${activeTab === 'long' ? 'active' : ''}`}
            onClick={() => setActiveTab('long')}
          >
            📝 長文ポスト
          </button>
          <button
            className={`tab-btn ${activeTab === 'thread' ? 'active' : ''}`}
            onClick={() => setActiveTab('thread')}
          >
            🧵 スレッド
          </button>
        </div>

        {/* Short Posts */}
        {activeTab === 'short' && (
          <>
            <div className="post-type-label">
              <h4>📱 短文ポスト（140文字以内）</h4>
              <button className="copy-all-btn" onClick={handleCopyAll}>
                全てコピー
              </button>
            </div>
            <div className="posts-grid">
              {posts.shortPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-card-header">
                    <span className="post-target">{post.target}</span>
                    <span className={`post-char-count ${post.charCount >= post.maxChars ? 'at-limit' : post.charCount >= post.maxChars - 5 ? 'near-limit' : ''}`}>
                      {post.charCount}/{post.maxChars}
                    </span>
                  </div>
                  <div className="post-content">{post.content}</div>
                  <div className="post-hashtags">{post.hashtags.join(' ')}</div>
                  <div className="post-tags">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="post-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="post-footer">
                    <span className={`engagement ${post.engagement}`}>
                      エンゲージメント予測: {post.engagement === 'high' ? '高' : post.engagement === 'medium' ? '中' : '低'} {engagementEmoji(post.engagement)}
                    </span>
                    <button
                      className="post-copy-btn"
                      onClick={() => handleCopy(post.content + '\n' + post.hashtags.join(' '), post.id)}
                    >
                      {copiedId === post.id ? '✅' : 'コピー'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Long Posts */}
        {activeTab === 'long' && (
          <>
            <div className="post-type-label">
              <h4>📝 長文ポスト（300-500文字）</h4>
              <button className="copy-all-btn" onClick={handleCopyAll}>
                全てコピー
              </button>
            </div>
            {posts.longPosts.map((post) => (
              <div key={post.id} className="post-card" style={{ maxWidth: 680 }}>
                <div className="post-card-header">
                  <span className="post-target">{post.type}</span>
                  <span className="post-char-count">{post.charCount}文字</span>
                </div>
                <div className="post-content">{post.content}</div>
                <div className="post-tags">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="post-tag">{tag}</span>
                  ))}
                </div>
                <div className="post-footer">
                  <span className={`engagement ${post.engagement}`}>
                    エンゲージメント予測: {post.engagement === 'high' ? '高' : post.engagement === 'medium' ? '中' : '低'} {engagementEmoji(post.engagement)}
                  </span>
                  <button
                    className="post-copy-btn"
                    onClick={() => handleCopy(post.content + '\n' + post.hashtags.join(' '), post.id)}
                  >
                    {copiedId === post.id ? '✅' : 'コピー'}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Thread */}
        {activeTab === 'thread' && (
          <>
            <div className="post-type-label">
              <h4>🧵 スレッド形式（連続投稿）</h4>
              <button className="copy-all-btn" onClick={handleCopyAll}>
                スレッド全体をコピー
              </button>
            </div>
            <div className="thread-header">
              <span className="thread-stat">{posts.thread.totalTweets}ツイート</span>
              <span className="thread-stat">合計: {posts.thread.totalChars}文字</span>
            </div>
            <div className="thread-posts">
              {posts.thread.posts.map((post) => (
                <div key={post.id} className="thread-post">
                  <div className="thread-number">{post.number}</div>
                  <div className="thread-content">{post.content}</div>
                  <div className="thread-chars">{post.charCount}文字</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
