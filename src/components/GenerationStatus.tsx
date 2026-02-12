import type { PipelineStep } from '../types';

interface Props {
  steps: PipelineStep[];
  progress: number;
  currentMessage: string;
}

export default function GenerationStatus({ steps, progress, currentMessage }: Props) {
  return (
    <div className="card">
      <div className="card-body" style={{ padding: '24px' }}>
        <div className="status-header">
          <div className="status-title">生成ステータス</div>
          {progress > 0 && progress < 100 && (
            <div className="status-badge">
              <span className="dot" />
              進行中 {Math.round(progress)}%
            </div>
          )}
          {progress >= 100 && (
            <div className="status-badge" style={{ background: '#d1fae5', color: '#065f46' }}>
              ✅ 完了
            </div>
          )}
        </div>

        {progress > 0 && (
          <div className="progress-container" style={{ marginTop: 16 }}>
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="step-grid" style={{ marginTop: 20 }}>
          {steps.map((step) => (
            <div key={step.id} className={`step-item ${step.status}`}>
              <div className={`step-icon ${step.status}`}>
                {step.icon}
              </div>
              <div className="step-label">{step.name}</div>
            </div>
          ))}
        </div>

        {currentMessage && (
          <div className="progress-message">
            {currentMessage}
          </div>
        )}
      </div>
    </div>
  );
}
