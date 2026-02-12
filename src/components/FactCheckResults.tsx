import { useState, useCallback } from 'react';
import type { FactCheckResult, FactCheckItem } from '../types';

interface Props {
  result: FactCheckResult;
}

function AccuracyIcon({ accuracy }: { accuracy: string }) {
  const map: Record<string, { icon: string; label: string }> = {
    accurate: { icon: '✓', label: '正確' },
    inaccurate: { icon: '✗', label: '不正確' },
    partial: { icon: '△', label: '部分的' },
    unverified: { icon: '?', label: '未検証' },
  };
  const { icon } = map[accuracy] || map.unverified;
  return <div className={`accuracy-icon ${accuracy}`}>{icon}</div>;
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const labels: Record<string, string> = { high: '信頼度: high', medium: '信頼度: medium', low: '信頼度: low' };
  return <span className={`confidence-badge ${confidence}`}>{labels[confidence]}</span>;
}

function FactCheckItemCard({ item }: { item: FactCheckItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="factcheck-item">
      <div className="factcheck-item-header" onClick={() => setExpanded(!expanded)}>
        <div className="factcheck-item-status">
          <AccuracyIcon accuracy={item.accuracy} />
          <div className="factcheck-claim">{item.claim}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ConfidenceBadge confidence={item.confidence} />
          <button className="factcheck-toggle">
            {expanded ? '▼ 閉じる' : '▶ 参照ソース'}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="factcheck-detail">
          <div className="factcheck-explanation">{item.explanation}</div>
          {item.sources.length > 0 && (
            <>
              <div className="factcheck-sources-title">参照ソース ({item.sources.length}件)</div>
              {item.sources.map((src, i) => (
                <div key={i} className="factcheck-source">
                  <div className="factcheck-source-header">
                    <span className="factcheck-source-title">{src.title}</span>
                    <span className="factcheck-source-relevance">関連度: {src.relevance}%</span>
                  </div>
                  <div className="factcheck-source-url">{src.url} • {src.date}</div>
                </div>
              ))}
            </>
          )}
          {item.suggestion && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: '0.85rem' }}>
              💡 修正提案: {item.suggestion}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FactCheckResults({ result }: Props) {
  const confidenceLabel = useCallback((c: string) => {
    return { high: '高', medium: '中', low: '低' }[c] || c;
  }, []);

  return (
    <div className="result-section">
      <div className="result-section-header">
        <div className="result-section-title">
          <span className="icon">✅</span>
          ファクトチェック結果
        </div>
      </div>
      <div className="result-section-body">
        {/* Summary */}
        <div className={`factcheck-summary ${result.overallConfidence}`}>
          <div style={{ flex: 1 }}>
            <div className="factcheck-title">
              ⚠ ファクトチェック結果
              <span className={`factcheck-confidence ${result.overallConfidence}`}>
                信頼度: {confidenceLabel(result.overallConfidence)}
              </span>
            </div>
            <div className="factcheck-stats">
              <div className="factcheck-stat">
                <div className="value">{result.totalChecked}</div>
                <div className="label">総チェック数</div>
              </div>
              <div className="factcheck-stat">
                <div className="value green">{result.verified}</div>
                <div className="label">検証済み</div>
              </div>
              <div className="factcheck-stat">
                <div className="value red">{result.inaccurate}</div>
                <div className="label">不正確</div>
              </div>
              <div className="factcheck-stat">
                <div className="value orange">{result.unverified}</div>
                <div className="label">未検証</div>
              </div>
            </div>
            {(result.unverified > 0 || result.inaccurate > 0) && (
              <div className="factcheck-warning">
                ⚠ レビュー推奨: 不正確または未検証の主張が含まれています。公開前に内容を確認してください。
              </div>
            )}
          </div>
        </div>

        {/* Detail Items */}
        <div className="factcheck-items-title">詳細チェック結果</div>
        {result.items.map((item) => (
          <FactCheckItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
