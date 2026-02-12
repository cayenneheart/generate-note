import type { ArticleSettings as Settings, Tone, ReaderLevel, Category } from '../types';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: 'friendly', label: 'フレンドリーで親しみやすい' },
  { value: 'polite', label: '丁寧で分かりやすい' },
  { value: 'professional', label: '専門的で論理的' },
];

const READER_OPTIONS: { value: ReaderLevel; label: string }[] = [
  { value: 'beginner', label: '初心者向け' },
  { value: 'intermediate', label: '中級者向け' },
  { value: 'advanced', label: '上級者向け' },
];

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'business', label: 'ビジネス・副業' },
  { value: 'technology', label: 'テクノロジー' },
  { value: 'lifestyle', label: 'ライフスタイル' },
  { value: 'education', label: '教育・学習' },
  { value: 'entertainment', label: 'エンタメ' },
];

export default function ArticleSettingsPanel({ settings, onChange, onGenerate, isGenerating }: Props) {
  const update = (field: keyof Settings, value: string | number) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="settings-section">
      <div className="card">
        <div className="card-header">
          <h2>記事設定</h2>
        </div>
        <div className="card-body">
          <div className="settings-group">
            <div className="settings-group-header">
              <div className="settings-group-title">
                🎯 基本設定
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                記事のテーマ・キーワード <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="例: Obsidian、副業 始め方"
                value={settings.keyword}
                onChange={(e) => update('keyword', e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">文体（トーン）</label>
                <select
                  className="form-select"
                  value={settings.tone}
                  onChange={(e) => update('tone', e.target.value)}
                  disabled={isGenerating}
                >
                  {TONE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">想定する読者層</label>
                <select
                  className="form-select"
                  value={settings.readerLevel}
                  onChange={(e) => update('readerLevel', e.target.value)}
                  disabled={isGenerating}
                >
                  {READER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">カテゴリー</label>
                <select
                  className="form-select"
                  value={settings.category}
                  onChange={(e) => update('category', e.target.value)}
                  disabled={isGenerating}
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">目安文字数</label>
                <input
                  type="number"
                  className="form-input"
                  value={settings.wordCount}
                  onChange={(e) => update('wordCount', parseInt(e.target.value) || 5000)}
                  disabled={isGenerating}
                  min={1000}
                  max={20000}
                  step={500}
                />
              </div>
            </div>


          </div>
        </div>
      </div>

      <button
        className={`generate-btn ${isGenerating ? 'generating' : ''}`}
        onClick={onGenerate}
        disabled={isGenerating || !settings.keyword.trim()}
      >
        {isGenerating ? (
          <>
            <span className="spinner" />
            生成中...
          </>
        ) : (
          <>記事を生成する ✨</>
        )}
      </button>
    </div>
  );
}
