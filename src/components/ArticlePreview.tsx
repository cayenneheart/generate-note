import { useState, useCallback } from 'react';
import type { ArticleBody } from '../types';

interface Props {
  article: ArticleBody;
  metaDescription: string;
}

export default function ArticlePreview({ article, metaDescription }: Props) {
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');
  const [copiedArticle, setCopiedArticle] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);

  const handleCopy = useCallback((text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    });
  }, []);

  return (
    <>
      {/* Article Section */}
      <div className="result-section">
        <div className="result-section-header">
          <div className="result-section-title">
            <span className="icon">👍</span>
            記事本文
          </div>
          <button
            className={`copy-btn ${copiedArticle ? 'copied' : ''}`}
            onClick={() => handleCopy(article.contentMarkdown, setCopiedArticle)}
          >
            {copiedArticle ? '✅ コピー済み' : '📋 記事本文をコピー'}
          </button>
        </div>

        <div className="result-section-body">
          <div className="tab-nav">
            <button
              className={`tab-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              🍎 note風プレビュー
            </button>
            <button
              className={`tab-btn ${viewMode === 'markdown' ? 'active' : ''}`}
              onClick={() => setViewMode('markdown')}
            >
              📝 Markdown
            </button>
          </div>

          {viewMode === 'preview' ? (
            <div className="article-preview">
              <div className="article-title">{article.title}</div>
              <div className="article-meta">
                <span>{article.author}</span>
                <span>•</span>
                <span>{article.date}</span>
                <span>•</span>
                <span>📖 {article.readingTime}で読めます</span>
              </div>
              <div className="hero-image">
                <div className="hero-stars" />
              </div>
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          ) : (
            <div className="markdown-view">
              {article.contentMarkdown}
            </div>
          )}
        </div>
      </div>

      {/* Meta Description Section */}
      <div className="result-section">
        <div className="result-section-header">
          <div className="result-section-title">
            <span className="icon">📋</span>
            メタディスクリプション
          </div>
          <button
            className={`copy-btn ${copiedMeta ? 'copied' : ''}`}
            onClick={() => handleCopy(metaDescription, setCopiedMeta)}
          >
            {copiedMeta ? '✅ コピー済み' : '📋 メタディスクリプションをコピー'}
          </button>
        </div>
        <div className="result-section-body">
          <div className="meta-card">
            <div className="meta-label">■ メタディスクリプション</div>
            <div className="meta-text">{metaDescription}</div>
          </div>
        </div>
      </div>
    </>
  );
}
