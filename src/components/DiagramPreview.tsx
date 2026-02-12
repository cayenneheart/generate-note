import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import type { Diagram } from '../types';

interface Props {
  diagrams: Diagram[];
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Noto Sans JP, sans-serif',
});

function DiagramCard({ diagram, index }: { diagram: Diagram; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return;
      try {
        const id = `mermaid-${diagram.id}-${index}`;
        const { svg } = await mermaid.render(id, diagram.mermaidCode);
        setSvgContent(svg);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e) {
        console.error('Mermaid render error:', e);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre style="color:#999;font-size:0.8rem;">${diagram.mermaidCode}</pre>`;
        }
      }
    };
    renderDiagram();
  }, [diagram, index]);

  const handleCopy = useCallback((text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    });
  }, []);

  return (
    <div className="diagram-card">
      <div className="diagram-header">
        <div className="diagram-info">
          <span className="icon">📊</span>
          <div>
            <div className="diagram-title">{diagram.title}</div>
            <div className="diagram-type">{diagram.type}</div>
            <div className="diagram-insert-hint">
              段落 {diagram.insertAfterParagraph} の後に挿入推奨
            </div>
          </div>
        </div>
        <div className="diagram-actions">
          <button
            className={`copy-btn ${copiedCode ? 'copied' : ''}`}
            onClick={() => handleCopy(diagram.mermaidCode, setCopiedCode)}
          >
            {copiedCode ? '✅ 済' : 'コードをコピー'}
          </button>
          <button
            className={`copy-btn ${copiedSvg ? 'copied' : ''}`}
            onClick={() => handleCopy(svgContent, setCopiedSvg)}
          >
            {copiedSvg ? '✅ 済' : 'SVGをコピー'}
          </button>
        </div>
      </div>
      <div className="diagram-body" ref={containerRef} />
    </div>
  );
}

export default function DiagramPreview({ diagrams }: Props) {
  return (
    <div className="result-section">
      <div className="result-section-header">
        <div className="result-section-title">
          <span className="icon">📈</span>
          生成された図解 ({diagrams.length}件)
        </div>
        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          記事内容から自動生成
        </span>
      </div>
      <div className="result-section-body">
        {diagrams.map((diagram, i) => (
          <DiagramCard key={diagram.id} diagram={diagram} index={i} />
        ))}
      </div>
    </div>
  );
}
