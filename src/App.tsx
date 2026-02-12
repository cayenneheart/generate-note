import { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import ArticleSettingsPanel from './components/ArticleSettings';
import GenerationStatus from './components/GenerationStatus';
import ArticlePreview from './components/ArticlePreview';

import DiagramPreview from './components/DiagramPreview';
import FactCheckResults from './components/FactCheckResults';
import XPostSuggestions from './components/XPostSuggestions';
import { PIPELINE_STEPS } from './mockData';
import { runFullPipeline } from './lib/pipeline';
import type { ArticleSettings, PipelineStep, GenerationResult } from './types';

type AppState = 'idle' | 'generating' | 'complete' | 'error';

const DEFAULT_SETTINGS: ArticleSettings = {
  keyword: '',
  tone: 'friendly',
  readerLevel: 'beginner',
  category: 'business',
  wordCount: 5000,
  imageTheme: '',
};

export default function App() {
  const [settings, setSettings] = useState<ArticleSettings>(DEFAULT_SETTINGS);
  const [appState, setAppState] = useState<AppState>('idle');
  const [steps, setSteps] = useState<PipelineStep[]>(PIPELINE_STEPS.map(s => ({ ...s })));
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const handleGenerate = useCallback(async () => {
    if (!settings.keyword.trim()) return;
    cancelRef.current = false;
    setAppState('generating');
    setResult(null);
    setError(null);
    setProgress(0);

    const freshSteps = PIPELINE_STEPS.map(s => ({ ...s, status: 'waiting' as const }));
    setSteps(freshSteps);

    const totalSteps = PIPELINE_STEPS.length;

    try {
      const generationResult = await runFullPipeline(settings, (stepIndex, status, message) => {
        if (cancelRef.current) return;

        setSteps(prev => prev.map((s, idx) => {
          if (idx === stepIndex) return { ...s, status };
          if (idx < stepIndex && s.status !== 'done') return { ...s, status: 'done' };
          return s;
        }));

        if (message) setCurrentMessage(message);

        if (status === 'done') {
          setProgress(((stepIndex + 1) / totalSteps) * 100);
        }
      });

      if (!cancelRef.current) {
        setResult(generationResult);
        setCurrentMessage('');
        setProgress(100);
        setAppState('complete');
      }
    } catch (err) {
      console.error('Pipeline error:', err);
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setAppState('error');
      setCurrentMessage('');
    }
  }, [settings]);

  return (
    <div>
      <Header />

      <div className="main-layout">
        {/* Left Panel: Settings */}
        <div>
          <ArticleSettingsPanel
            settings={settings}
            onChange={setSettings}
            onGenerate={handleGenerate}
            isGenerating={appState === 'generating'}
          />
        </div>

        {/* Right Panel: Status & Results */}
        <div className="status-panel">
          {appState === 'idle' ? (
            <div className="empty-state">
              <div className="empty-icon">✍️</div>
              <div className="empty-text">キーワードを入力して「記事を生成する」を押してください</div>
              <div className="empty-hint">GPT-4oが約60秒で記事・図解・SNS告知文まで一括生成</div>
            </div>
          ) : (
            <>
              <GenerationStatus
                steps={steps}
                progress={progress}
                currentMessage={currentMessage}
              />

              {appState === 'error' && error && (
                <div style={{
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: 12,
                  padding: '20px 24px',
                  color: '#991b1b',
                  fontSize: '0.9rem',
                }}>
                  <strong>⚠️ エラー:</strong> {error}
                  <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#b91c1c' }}>
                    APIキーが正しく設定されているか確認してください。
                    <br />
                    .env.local に VITE_OPENAI_API_KEY を設定後、開発サーバーを再起動してください。
                  </div>
                </div>
              )}

              {appState === 'complete' && result && (
                <div className="results-container">
                  <ArticlePreview
                    article={result.article}
                    metaDescription={result.structure.metaDescription}
                  />

                  <DiagramPreview diagrams={result.diagrams} />
                  <FactCheckResults result={result.factCheck} />
                  <XPostSuggestions posts={result.xPosts} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
