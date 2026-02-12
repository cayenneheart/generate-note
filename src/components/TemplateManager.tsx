import { useState } from 'react';
import type { Template } from '../types';

interface Props {
  templates: Template[];
  onAdd: (name: string, content: string) => void;
  onUpdate: (id: string, name: string, content: string) => void;
  onDelete: (id: string) => void;
}

export default function TemplateManager({ templates, onAdd, onUpdate, onDelete }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setName('');
    setContent('');
  };

  const handleStartEdit = (t: Template) => {
    setEditingId(t.id);
    setIsAdding(false);
    setName(t.name);
    setContent(t.content);
  };

  const handleSave = () => {
    if (!name.trim() || !content.trim()) return;
    if (editingId) {
      onUpdate(editingId, name.trim(), content.trim());
    } else {
      onAdd(name.trim(), content.trim());
    }
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setContent('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setContent('');
  };

  const isEditing = isAdding || editingId !== null;

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
            placeholder="テンプレート名（例: 会社紹介フッター）"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <textarea
            className="template-textarea"
            placeholder="記事の末尾に追加するテキストを入力&#10;&#10;例:&#10;---&#10;この記事を書いた人&#10;株式会社○○ ..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
          />
          <div className="template-form-actions">
            <button className="template-save-btn" onClick={handleSave} disabled={!name.trim() || !content.trim()}>
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
          <div className="template-empty-hint">挨拶文や会社情報を定型文として保存できます</div>
        </div>
      )}

      {templates.length > 0 && !isEditing && (
        <div className="template-list">
          {templates.map(t => (
            <div key={t.id} className="template-item">
              <div className="template-item-name">{t.name}</div>
              <div className="template-item-preview">
                {t.content.length > 80 ? t.content.slice(0, 80) + '…' : t.content}
              </div>
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
