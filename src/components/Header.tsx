export default function Header() {
  return (
    <header className="header">
      <div>
        <div className="header-title">note記事自動生成エージェント</div>
        <div className="header-subtitle">noteの記事作成をAIで自動化し、あなたの執筆活動をサポートします</div>
      </div>
      <div className="header-actions">
        <button className="header-btn primary" title="音声入力">
          🎤 音声入力
        </button>
      </div>
    </header>
  );
}
