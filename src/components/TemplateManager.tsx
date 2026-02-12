import { useState } from 'react';
import type { Template } from '../types';

interface Props {
  templates: Template[];
  onAdd: (name: string, header: string, footer: string) => void;
  onUpdate: (id: string, name: string, header: string, footer: string) => void;
  onDelete: (id: string) => void;
}

export default function TemplateManager({ templates, onAdd, onUpdate, onDelete }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [header, setHeader] = useState('');
  const [footer, setFooter] = useState('');

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setName('');
    setHeader('');
    setFooter('');
  };

  const handleStartEdit = (t: Template) => {
    setEditingId(t.id);
    setIsAdding(false);
    setName(t.name);
    setHeader(t.header);
    setFooter(t.footer);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (!header.trim() && !footer.trim()) return;
    if (editingId) {
      onUpdate(editingId, name.trim(), header.trim(), footer.trim());
    } else {
      onAdd(name.trim(), header.trim(), footer.trim());
    }
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setHeader('');
    setFooter('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setHeader('');
    setFooter('');
  };

  const isEditing = isAdding || editingId !== null;
  const canSave = name.trim() && (header.trim() || footer.trim());

  return (
    <div className="template-manager">
      <div className="template-manager-header">
        <h3 className="template-manager-title">📄 テンプレート</h3>
        {!isEditing && (
          <button className="template-add-btn" onClick={handleStartAdd}>
            ＋ 新規
          </button>
        )}
      </div>

      {isEditing && (
        <div className="template-form">
          <input
            type="text"
            className="form-input"
            placeholder="テンプレート名（例: 会社紹介）"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <div className="template-field-label">📌 ヘッダー（記事の先頭に挿入）</div>
          <textarea
            className="template-textarea"
            placeholder="例:&#10;こんにちは！○○です。&#10;今日は△△について解説します。"
            value={header}
            onChange={e => setHeader(e.target.value)}
            rows={4}
          />

          <div className="template-field-label">📎 フッター（記事の末尾に挿入）</div>
          <textarea
            className="template-textarea"
            placeholder="例:&#10;---&#10;この記事を書いた人&#10;株式会社○○&#10;お問い合わせはこちら"
            value={footer}
            onChange={e => setFooter(e.target.value)}
            rows={4}
          />

          <div className="template-form-actions">
            <button className="template-save-btn" onClick={handleSave} disabled={!canSave}>
              {editingId ? '更新' : '保存'}
            </button>
            <button className="template-cancel-btn" onClick={handleCancel}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      {templates.length === 0 && !isEditing && (
        <div className="template-empty">
          <div className="template-empty-text">テンプレートがありません</div>
          <div className="template-empty-hint">ヘッダー・フッターをセットで保存できます</div>
        </div>
      )}

      {templates.length > 0 && !isEditing && (
        <div className="template-list">
          {templates.map(t => (
            <div key={t.id} className="template-item">
              <div className="template-item-name">{t.name}</div>
              {t.header && (
                <div className="template-item-section">
                  <span className="template-item-badge">ヘッダー</span>
                  <span className="template-item-preview-text">
                    {t.header.length > 40 ? t.header.slice(0, 40) + '…' : t.header}
                  </span>
                </div>
              )}
              {t.footer && (
                <div className="template-item-section">
                  <span className="template-item-badge">フッター</span>
                  <span className="template-item-preview-text">
                    {t.footer.length > 40 ? t.footer.slice(0, 40) + '…' : t.footer}
                  </span>
                </div>
              )}
              <div className="template-item-actions">
                <button className="template-edit-btn" onClick={() => handleStartEdit(t)}>編集</button>
                <button className="template-delete-btn" onClick={() => onDelete(t.id)}>削除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
