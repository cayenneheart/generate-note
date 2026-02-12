import { useState } from 'react';
import type { HistoryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export default function HistorySidebar({ isOpen, onClose, history, onSelect, onDelete, onClearAll }: Props) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearAll = () => {
    if (confirmClear) {
      onClearAll();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`history-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">📋 プロジェクト履歴</h2>
          <button className="sidebar-close" onClick={onClose} aria-label="閉じる">✕</button>
        </div>

        {history.length === 0 ? (
          <div className="sidebar-empty">
            <div className="sidebar-empty-icon">📝</div>
            <div className="sidebar-empty-text">まだ履歴がありません</div>
            <div className="sidebar-empty-hint">記事を生成すると自動で保存されます</div>
          </div>
        ) : (
          <>
            <div className="sidebar-actions">
              <span className="sidebar-count">{history.length}件の記録</span>
              <button
                className={`sidebar-clear-btn ${confirmClear ? 'confirm' : ''}`}
                onClick={handleClearAll}
              >
                {confirmClear ? '本当に全削除？' : '全て削除'}
              </button>
            </div>

            <div className="sidebar-list">
              {history.map(item => (
                <div
                  key={item.id}
                  className="history-card"
                  onClick={() => { onSelect(item); onClose(); }}
                >
                  <div className="history-card-header">
                    <span className="history-keyword">{item.keyword}</span>
                    <span className="history-date">{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="history-title">
                    {truncate(item.result.article.title, 60)}
                  </div>
                  <div className="history-meta">
                    <span className="history-tag">{item.settings.tone === 'friendly' ? 'フレンドリー' : item.settings.tone === 'polite' ? '丁寧' : '専門的'}</span>
                    <span className="history-tag">{item.settings.readerLevel === 'beginner' ? '初心者' : item.settings.readerLevel === 'intermediate' ? '中級者' : '上級者'}</span>
                    <span className="history-tag">{item.settings.wordCount.toLocaleString()}文字</span>
                  </div>
                  <button
                    className="history-delete-btn"
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    aria-label="削除"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
