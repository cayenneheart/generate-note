interface Props {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: Props) {
  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="hamburger-btn" onClick={onMenuClick} aria-label="メニュー">
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
        <div>
          <div className="header-title">note記事自動生成エージェント</div>
          <div className="header-subtitle">noteの記事作成をAIで自動化し、あなたの執筆活動をサポートします</div>
        </div>
      </div>
    </header>
  );
}
