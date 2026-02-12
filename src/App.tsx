import { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import ArticleSettingsPanel from './components/ArticleSettings';
import GenerationStatus from './components/GenerationStatus';
import ArticlePreview from './components/ArticlePreview';
import ImageGallery from './components/ImageGallery';
import DiagramPreview from './components/DiagramPreview';
import FactCheckResults from './components/FactCheckResults';
import XPostSuggestions from './components/XPostSuggestions';
import { PIPELINE_STEPS, generateMockResult } from './mockData';
import type { ArticleSettings, PipelineStep, GenerationResult } from './types';

type AppState = 'idle' | 'generating' | 'complete';

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
  const cancelRef = useRef(false);

  const runPipeline = useCallback(async () => {
    cancelRef.current = false;
    setAppState('generating');
    setResult(null);
    setProgress(0);

    const freshSteps = PIPELINE_STEPS.map(s => ({ ...s, status: 'waiting' as const }));
    setSteps(freshSteps);

    const totalDuration = PIPELINE_STEPS.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      if (cancelRef.current) return;

      const step = PIPELINE_STEPS[i];

      // Update step to running
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'running' } : s
      ));
      setCurrentMessage(`${step.description}...`);

      // Simulate processing with faster timing (real async would call APIs)
      const simDuration = Math.min(step.duration * 100, 2500); // scale down for demo
      await new Promise(resolve => setTimeout(resolve, simDuration));

      elapsed += step.duration;
      setProgress((elapsed / totalDuration) * 100);

      // Update step to done
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'done' } : s
      ));
    }

    // Generate result
    const keyword = settings.keyword || 'Obsidian';
    const mockResult = generateMockResult(keyword);
    setResult(mockResult);
    setCurrentMessage('');
    setProgress(100);
    setAppState('complete');
  }, [settings.keyword]);

  const handleGenerate = useCallback(() => {
    if (!settings.keyword.trim()) return;
    runPipeline();
  }, [settings.keyword, runPipeline]);

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
              <div className="empty-hint">約75秒で記事・図解・画像・SNS告知文まで一括生成</div>
            </div>
          ) : (
            <>
              <GenerationStatus
                steps={steps}
                progress={progress}
                currentMessage={currentMessage}
              />

              {appState === 'complete' && result && (
                <div className="results-container">
                  {/* Step 4: 記事本文 + メタディスクリプション */}
                  <ArticlePreview
                    article={result.article}
                    metaDescription={result.structure.metaDescription}
                  />

                  {/* Step 5: 記事内画像 */}
                  <ImageGallery images={result.images} />

                  {/* Step 6: 図解 */}
                  <DiagramPreview diagrams={result.diagrams} />

                  {/* Step 7: ファクトチェック */}
                  <FactCheckResults result={result.factCheck} />

                  {/* Step 8: X投稿案 */}
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
