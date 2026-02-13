import { useState, useEffect } from 'react';
import type { TopicStockItem } from '../hooks/useTopicStock';

interface Props {
  stock: TopicStockItem[];
  strategy: string;
  onStrategyChange: (value: string) => void;
  isCollecting: boolean;
  error: string;
  onCollect: () => void;
  onLogin: (authToken: string, ct0?: string) => Promise<void>;
  onUseKeyword: (keyword: string, topicId: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export default function TopicCollector({
  stock,
  strategy,
  onStrategyChange,
  isCollecting,
  error,
  onCollect,
  onLogin,
  onUseKeyword,
  onRemove,
  onClearAll,
}: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [authToken, setAuthToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showCookieHelp, setShowCookieHelp] = useState(false);

  // Check login status on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .then(data => setIsLoggedIn(data.loggedIn))
      .catch(() => setIsLoggedIn(null));
  }, []);

  const handleSaveCookie = async () => {
    if (!authToken.trim()) return;
    setIsSaving(true);
    try {
      await onLogin(authToken.trim());
      setIsLoggedIn(true);
      setAuthToken('');
    } catch {
      // error handled in parent
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/x-logout', { method: 'POST' });
      setIsLoggedIn(false);
    } catch { /* ignore */ }
  };

  const unusedTopics = stock.filter(t => !t.used);
  const usedTopics = stock.filter(t => t.used);

  return (
    <div className="topic-collector">
      {/* Server Status */}
      {isLoggedIn === null && (
        <div className="topic-server-warning">
          ⚠️ APIサーバーが起動していません
          <button
            className="topic-retry-btn"
            onClick={() => {
              fetch('http://localhost:3001/api/health')
                .then(res => res.json())
                .then(data => setIsLoggedIn(data.loggedIn))
                .catch(() => setIsLoggedIn(null));
            }}
          >
            🔄 再確認
          </button>
        </div>
      )}

      {/* Cookie Auth Section */}
      {isLoggedIn !== null && (
        <div className="topic-auth-section">
          {isLoggedIn ? (
            <div className="topic-auth-status">
              <span className="topic-auth-ok">✅ X認証済み</span>
              <button className="topic-auth-reset" onClick={handleLogout}>
                🔄 再設定
              </button>
            </div>
          ) : (
            <div className="topic-cookie-form">
              <div className="topic-cookie-header">
                <h3 className="topic-section-title">🔑 X認証設定</h3>
                <button
                  className="topic-help-btn"
                  onClick={() => setShowCookieHelp(!showCookieHelp)}
                >
                  {showCookieHelp ? '閉じる' : '取得方法'}
                </button>
              </div>

              {showCookieHelp && (
                <div className="topic-cookie-help">
                  <ol>
                    <li>ChromeでX.comにログイン</li>
                    <li>F12でDevToolsを開く</li>
                    <li>Application → Cookies → https://x.com</li>
                    <li><code>auth_token</code> の値をコピー</li>
                  </ol>
                </div>
              )}

              <input
                className="topic-cookie-input"
                type="password"
                placeholder="auth_token を貼り付け"
                value={authToken}
                onChange={e => setAuthToken(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveCookie()}
              />
              <button
                className="topic-login-btn"
                onClick={handleSaveCookie}
                disabled={isSaving || !authToken.trim()}
              >
                {isSaving ? '保存中...' : '🔐 認証を保存'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Strategy Input */}
      {isLoggedIn !== null && (
        <div className="topic-strategy-section">
          <h3 className="topic-section-title">📝 収集方針</h3>
          <textarea
            className="topic-strategy-input"
            placeholder={"記事のジャンルやキーワードを入力\n例: AI導入、DX推進、つくば市、副業"}
            value={strategy}
            onChange={e => onStrategyChange(e.target.value)}
            rows={3}
          />
          <button
            className="topic-collect-btn"
            onClick={onCollect}
            disabled={isCollecting || !strategy.trim() || !isLoggedIn}
          >
            {isCollecting ? (
              <>
                <span className="spinner" />
                収集中...
              </>
            ) : (
              <>🔍 ネタを収集</>
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && <div className="topic-error">{error}</div>}

      {/* Topic Cards */}
      {unusedTopics.length > 0 && (
        <div className="topic-results">
          <div className="topic-results-header">
            <h3 className="topic-section-title">💡 ネタ候補 ({unusedTopics.length})</h3>
            {stock.length > 0 && (
              <button className="topic-clear-btn" onClick={onClearAll}>全削除</button>
            )}
          </div>
          <div className="topic-card-list">
            {unusedTopics.map(topic => (
              <div key={topic.id} className="topic-card">
                <div className="topic-card-header">
                  <span className="topic-card-title">{topic.title}</span>
                  <span className="topic-card-relevance" data-score={topic.relevance >= 7 ? 'high' : topic.relevance >= 4 ? 'mid' : 'low'}>
                    {topic.relevance}/10
                  </span>
                </div>
                <p className="topic-card-summary">{topic.summary}</p>
                <div className="topic-card-keyword">
                  🔑 {topic.keyword}
                </div>
                <div className="topic-card-actions">
                  <button
                    className="topic-use-btn"
                    onClick={() => onUseKeyword(topic.keyword, topic.id)}
                  >
                    ✍️ この記事を書く
                  </button>
                  <button
                    className="topic-remove-btn"
                    onClick={() => onRemove(topic.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Used Topics */}
      {usedTopics.length > 0 && (
        <div className="topic-used-section">
          <h3 className="topic-section-title-muted">✅ 使用済み ({usedTopics.length})</h3>
          {usedTopics.map(topic => (
            <div key={topic.id} className="topic-card topic-card-used">
              <div className="topic-card-header">
                <span className="topic-card-title">{topic.title}</span>
              </div>
              <div className="topic-card-keyword">🔑 {topic.keyword}</div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {stock.length === 0 && !isCollecting && (
        <div className="topic-empty">
          <div className="topic-empty-text">ネタストックがありません</div>
          <div className="topic-empty-hint">方針を入力して「ネタを収集」を押してください</div>
        </div>
      )}
    </div>
  );
}
