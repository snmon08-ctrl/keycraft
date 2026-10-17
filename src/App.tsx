import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { TypingCanvas } from './components/TypingCanvas';
import { ResultView } from './components/ResultView';
import { WeakKeysView } from './components/WeakKeysView';
import { HistoryView } from './components/HistoryView';
import { CustomTextModal } from './components/CustomTextModal';
import {
  TestMode,
  TimeOption,
  WordCountOption,
  QuoteLengthOption,
  TestResult,
  WpmSample,
} from './types/typing';
import {
  getRandomWords,
  CURATED_QUOTES,
  generateWeakKeyDrill,
} from './data/wordBank';
import {
  getStoredResults,
  saveTestResult,
  getAggregatedWeakKeys,
  getPersonalBests,
  getUserPreferences,
  saveUserPreferences,
  clearAllStoredData,
} from './utils/storage';

export default function App() {
  // Navigation / Active View
  const [activeView, setActiveView] = useState<'test' | 'weakKeys' | 'history'>('test');

  // Mode and Configuration
  const [mode, setMode] = useState<TestMode>('time');
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [wordCountOption, setWordCountOption] = useState<WordCountOption>(25);
  const [quoteLength, setQuoteLength] = useState<QuoteLengthOption>('medium');
  const [punctuation, setPunctuation] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<boolean>(false);

  // Custom text state
  const [customText, setCustomText] = useState<string>('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Weak keys drill target
  const [activeDrillKeys, setActiveDrillKeys] = useState<string[]>([]);

  // Generated words for current session
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [quoteAuthor, setQuoteAuthor] = useState<string | undefined>(undefined);

  // Test status & results
  const [completedResult, setCompletedResult] = useState<TestResult | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [testCycle, setTestCycle] = useState(0); // increment to force fresh mount/reset

  // Stored state
  const [results, setResults] = useState<TestResult[]>([]);
  const [weakKeys, setWeakKeys] = useState(getAggregatedWeakKeys());
  const [personalBests, setPersonalBests] = useState<Record<string, number>>({});
  const [preferences, setPreferences] = useState(getUserPreferences());

  // Load storage on mount
  useEffect(() => {
    setResults(getStoredResults());
    setWeakKeys(getAggregatedWeakKeys());
    setPersonalBests(getPersonalBests());
    setPreferences(getUserPreferences());
  }, []);

  // Generate words based on current mode configuration
  const generateNewTestWords = useCallback(() => {
    if (mode === 'time') {
      // 90 words is plenty for a 15-60s sprint; words scroll naturally
      const count = timeOption >= 60 ? 120 : 75;
      setCurrentWords(getRandomWords(count, punctuation, numbers));
      setQuoteAuthor(undefined);
    } else if (mode === 'words') {
      setCurrentWords(getRandomWords(wordCountOption, punctuation, numbers));
      setQuoteAuthor(undefined);
    } else if (mode === 'quote') {
      const eligible = CURATED_QUOTES.filter((q) => q.length === quoteLength);
      const picked = eligible.length > 0
        ? eligible[Math.floor(Math.random() * eligible.length)]
        : CURATED_QUOTES[0];
      setCurrentWords(picked.text.split(' '));
      setQuoteAuthor(picked.author);
    } else if (mode === 'custom') {
      if (customText.trim()) {
        setCurrentWords(customText.trim().split(/\s+/).filter(Boolean));
      } else {
        // Fallback default custom text
        setCurrentWords('Clean design is not just what it looks like and feels like. Design is how it works.'.split(' '));
      }
      setQuoteAuthor(undefined);
    } else if (mode === 'weak') {
      const drillWords = generateWeakKeyDrill(activeDrillKeys, 30);
      setCurrentWords(drillWords);
      setQuoteAuthor(undefined);
    }

    setCompletedResult(null);
    setIsNewBest(false);
    setTestCycle((prev) => prev + 1);
  }, [mode, timeOption, wordCountOption, quoteLength, punctuation, numbers, customText, activeDrillKeys]);

  // Re-generate text whenever configuration changes
  useEffect(() => {
    generateNewTestWords();
  }, [generateNewTestWords]);

  // Handle completion of a typing session
  const handleFinishTest = (metrics: {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    consistency: number;
    duration: number;
    correctChars: number;
    errorChars: number;
    extraChars: number;
    missedChars: number;
    wpmSamples: WpmSample[];
    keyErrors: Record<string, number>;
    keyAttempts: Record<string, number>;
  }) => {
    let modeConfig = '';
    if (mode === 'time') modeConfig = `${timeOption}s`;
    else if (mode === 'words') modeConfig = `${wordCountOption} words`;
    else if (mode === 'quote') modeConfig = `${quoteLength} quote`;
    else if (mode === 'custom') modeConfig = 'custom';
    else if (mode === 'weak') modeConfig = activeDrillKeys.join(', ');

    const newResult: TestResult = {
      id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      mode,
      modeConfig,
      wpm: metrics.wpm,
      rawWpm: metrics.rawWpm,
      accuracy: metrics.accuracy,
      consistency: metrics.consistency,
      duration: metrics.duration,
      correctChars: metrics.correctChars,
      errorChars: metrics.errorChars,
      extraChars: metrics.extraChars,
      missedChars: metrics.missedChars,
      wpmSamples: metrics.wpmSamples,
      keyErrors: metrics.keyErrors,
      keyAttempts: metrics.keyAttempts,
    };

    // Check for personal record
    const pbKey = `${mode}_${modeConfig}`;
    const previousBest = personalBests[pbKey] || 0;
    const isPB = metrics.wpm > previousBest && metrics.wpm > 10;

    // Save
    saveTestResult(newResult);
    setResults(getStoredResults());
    setWeakKeys(getAggregatedWeakKeys());
    setPersonalBests(getPersonalBests());

    setCompletedResult(newResult);
    setIsNewBest(isPB);
  };

  // Repeat the exact same test text
  const handleRepeatTest = () => {
    setCompletedResult(null);
    setIsNewBest(false);
    setTestCycle((prev) => prev + 1);
  };

  // Launch a targeted weak keys drill
  const handleStartWeakKeysDrill = (keys: string[]) => {
    setActiveDrillKeys(keys);
    setMode('weak');
    setActiveView('test');
    setCompletedResult(null);
  };

  // Toggle mechanical key audio sound
  const handleToggleSound = () => {
    const updated = { ...preferences, soundEnabled: !preferences.soundEnabled };
    setPreferences(updated);
    saveUserPreferences(updated);
  };

  // Reset / Clear history
  const handleClearHistory = () => {
    clearAllStoredData();
    setResults([]);
    setWeakKeys([]);
    setPersonalBests({});
  };

  // Best WPM overall
  const topOverallWpm = results.length > 0 ? Math.max(...results.map((r) => r.wpm)) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 font-sans selection:bg-amber-500/25 selection:text-amber-200">
      {/* Top Bar Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        bestWpm={topOverallWpm}
        preferences={preferences}
        onToggleSound={handleToggleSound}
        onResetTest={generateNewTestWords}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-12 py-8 flex flex-col justify-start">
        {activeView === 'test' && (
          <div className="space-y-8 my-auto">
            {!completedResult ? (
              <>
                {/* Mode Selector Toolbar */}
                <ModeSelector
                  mode={mode}
                  setMode={(m) => {
                    setMode(m);
                    setCompletedResult(null);
                  }}
                  timeOption={timeOption}
                  setTimeOption={setTimeOption}
                  wordCountOption={wordCountOption}
                  setWordCountOption={setWordCountOption}
                  quoteLength={quoteLength}
                  setQuoteLength={setQuoteLength}
                  punctuation={punctuation}
                  setPunctuation={setPunctuation}
                  numbers={numbers}
                  setNumbers={setNumbers}
                  onOpenCustomModal={() => setIsCustomModalOpen(true)}
                />

                {/* Interactive Typing Canvas */}
                <TypingCanvas
                  key={`test-${testCycle}`}
                  words={currentWords}
                  mode={mode}
                  timeLimit={timeOption}
                  targetWordCount={wordCountOption}
                  quoteAuthor={quoteAuthor}
                  soundEnabled={preferences.soundEnabled}
                  soundVolume={preferences.soundVolume}
                  smoothCaret={preferences.smoothCaret}
                  liveStats={preferences.liveStats}
                  onFinishTest={handleFinishTest}
                  onRestart={generateNewTestWords}
                />
              </>
            ) : (
              /* Post-Test Scorecard & Telemetry View */
              <ResultView
                result={completedResult}
                isNewBest={isNewBest}
                onNextTest={generateNewTestWords}
                onRepeatTest={handleRepeatTest}
                onPracticeWeakKeys={handleStartWeakKeysDrill}
                onOpenWeakKeysView={() => setActiveView('weakKeys')}
              />
            )}
          </div>
        )}

        {/* Weak Keys & Mistake Diagnostics View */}
        {activeView === 'weakKeys' && (
          <WeakKeysView
            stats={weakKeys}
            onStartDrill={handleStartWeakKeysDrill}
            onClearWeakKeys={() => {
              clearAllStoredData();
              setWeakKeys([]);
            }}
            onBackToPractice={() => {
              setActiveView('test');
              setCompletedResult(null);
            }}
          />
        )}

        {/* History and Records View */}
        {activeView === 'history' && (
          <HistoryView
            results={results}
            onClearHistory={handleClearHistory}
            onBackToPractice={() => {
              setActiveView('test');
              setCompletedResult(null);
            }}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="py-5 px-6 border-t border-[#162030] text-center text-xs text-slate-500 font-mono">
        <div className="flex items-center justify-center gap-4">
          <span>KeyCraft Precision Typing</span>
          <span aria-hidden="true">·</span>
          <span>Zero Lag</span>
          <span aria-hidden="true">·</span>
          <span>Tab + Enter to restart</span>
        </div>
      </footer>

      {/* Custom Text Modal */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        initialText={customText}
        onSubmit={(text) => {
          setCustomText(text);
          setMode('custom');
          setCompletedResult(null);
          generateNewTestWords();
        }}
      />
    </div>
  );
}
