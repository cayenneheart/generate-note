import type { GeneratedImage } from '../types';

interface Props {
  images: GeneratedImage[];
}

export default function ImageGallery({ images }: Props) {
  const inlineImages = images.filter(img => img.type === 'inline');

  return (
    <div className="result-section">
      <div className="result-section-header">
        <div className="result-section-title">
          <span className="icon">🖼️</span>
          記事内画像（{inlineImages.length}枚）
        </div>
      </div>
      <div className="result-section-body">
        <div className="image-gallery">
          {inlineImages.map((img) => (
            <div key={img.id} className="image-card">
              <div className="image-placeholder">
                🎨
              </div>
              <div className="image-info">
                <div className="image-title">{img.title}</div>
                <div className="image-desc">{img.description}</div>
                <button className="download-btn">
                  ⬇ ダウンロード
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
