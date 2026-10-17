import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { TestMode, WpmSample } from '../types/typing';
import { playKeyClick } from '../utils/audio';

interface TypingCanvasProps {
  words: string[];
  mode: TestMode;
  timeLimit: number; // in seconds (for 'time' mode)
  targetWordCount: number; // (for 'words' mode)
  quoteAuthor?: string;
  soundEnabled: boolean;
  soundVolume: number;
  smoothCaret: boolean;
  liveStats: boolean;
  onFinishTest: (metrics: {
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
  }) => void;
  onRestart: () => void;
}

export const TypingCanvas: React.FC<TypingCanvasProps> = ({
  words,
  mode,
  timeLimit,
  targetWordCount,
  quoteAuthor,
  soundEnabled,
  soundVolume,
  smoothCaret,
  liveStats,
  onFinishTest,
  onRestart,
}) => {
  // Input state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedWordsHistory, setTypedWordsHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Time & progress state
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  // Metrics tracking state
  const [totalKeyStrokes, setTotalKeyStrokes] = useState(0);
  const [correctKeyStrokes, setCorrectKeyStrokes] = useState(0);
  const [errorKeyStrokes, setErrorKeyStrokes] = useState(0);
  const [wpmSamples, setWpmSamples] = useState<WpmSample[]>([]);
  const [keyErrors, setKeyErrors] = useState<Record<string, number>>({});
  const [keyAttempts, setKeyAttempts] = useState<Record<string, number>>({});

  // Keep refs in sync so the 1-second interval timer doesn't restart on every single keystroke
  const totalKeyStrokesRef = useRef(0);
  const correctKeyStrokesRef = useRef(0);
  const errorKeyStrokesRef = useRef(0);

  useEffect(() => {
    totalKeyStrokesRef.current = totalKeyStrokes;
  }, [totalKeyStrokes]);

  useEffect(() => {
    correctKeyStrokesRef.current = correctKeyStrokes;
  }, [correctKeyStrokes]);

  useEffect(() => {
    errorKeyStrokesRef.current = errorKeyStrokes;
  }, [errorKeyStrokes]);

  // DOM references
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const lineWrapperRef = useRef<HTMLDivElement>(null);

  // Caret positioning coordinates
  const [caretPos, setCaretPos] = useState<{ left: number; top: number; height: number }>({
    left: 0,
    top: 0,
    height: 32,
  });

  // Keep input focused
  const focusInput = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  useEffect(() => {
    focusInput();
  }, [words]);

  // Handle mode / props reset
  useEffect(() => {
    if (lineWrapperRef.current) {
      lineWrapperRef.current.scrollTop = 0;
    }
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedWordsHistory([]);
    setHasStarted(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setTimeRemaining(timeLimit);
    setTotalKeyStrokes(0);
    setCorrectKeyStrokes(0);
    setErrorKeyStrokes(0);
    setWpmSamples([]);
    setKeyErrors({});
    setKeyAttempts({});
  }, [words, timeLimit, mode]);

  // Update Caret Position
  const updateCaret = useCallback(() => {
    if (!activeWordRef.current || !lineWrapperRef.current) return;

    const wordEl = activeWordRef.current;
    const charEls = wordEl.querySelectorAll<HTMLSpanElement>('.char-span');
    const lineWrapperRect = lineWrapperRef.current.getBoundingClientRect();
    const scrollTop = lineWrapperRef.current.scrollTop;

    if (currentInput.length === 0) {
      // Caret at the beginning of the active word (align with first character if present)
      const firstChar = charEls[0];
      const targetRect = firstChar ? firstChar.getBoundingClientRect() : wordEl.getBoundingClientRect();
      const caretHeight = Math.min(32, Math.max(22, Math.round(targetRect.height * 0.62)));
      const verticalOffset = Math.max(0, Math.round((targetRect.height - caretHeight) / 2));

      setCaretPos({
        left: targetRect.left - lineWrapperRect.left,
        top: (targetRect.top - lineWrapperRect.top) + scrollTop + verticalOffset,
        height: caretHeight,
      });
    } else if (currentInput.length <= charEls.length) {
      // Caret after the last typed character
      const targetChar = charEls[currentInput.length - 1];
      const charRect = targetChar.getBoundingClientRect();
      const caretHeight = Math.min(32, Math.max(22, Math.round(charRect.height * 0.62)));
      const verticalOffset = Math.max(0, Math.round((charRect.height - caretHeight) / 2));

      setCaretPos({
        left: charRect.right - lineWrapperRect.left,
        top: (charRect.top - lineWrapperRect.top) + scrollTop + verticalOffset,
        height: caretHeight,
      });
    } else {
      // Extra characters beyond target word length
      const extraChars = wordEl.querySelectorAll<HTMLSpanElement>('.extra-char-span');
      const lastExtra = extraChars.length > 0 ? extraChars[extraChars.length - 1] : wordEl;
      const lastRect = lastExtra.getBoundingClientRect();
      const caretHeight = Math.min(32, Math.max(22, Math.round(lastRect.height * 0.62)));
      const verticalOffset = Math.max(0, Math.round((lastRect.height - caretHeight) / 2));

      setCaretPos({
        left: lastRect.right - lineWrapperRect.left,
        top: (lastRect.top - lineWrapperRect.top) + scrollTop + verticalOffset,
        height: caretHeight,
      });
    }

    // Scroll parent container if word moves into lower lines
    if (lineWrapperRef.current && wordEl) {
      const lineWrap = lineWrapperRef.current;
      const offsetTop = wordEl.offsetTop;
      const currentScroll = lineWrap.scrollTop;
      // Keep active line roughly on the 2nd line of display
      if (offsetTop - currentScroll > 80) {
        lineWrap.scrollTo({ top: offsetTop - 40, behavior: 'smooth' });
      } else if (offsetTop < currentScroll) {
        lineWrap.scrollTo({ top: Math.max(0, offsetTop - 40), behavior: 'smooth' });
      }
    }
  }, [currentInput, currentWordIndex]);

  useEffect(() => {
    // Schedule on animation frame so layout calculations reflect rendered DOM and fonts
    const frameId = requestAnimationFrame(() => {
      updateCaret();
    });
    const handleResize = () => updateCaret();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCaret]);

  // Compute live WPM and Accuracy
  const calculateLiveMetrics = useCallback(() => {
    if (!startTime) return { wpm: 0, rawWpm: 0, accuracy: 100 };
    const now = Date.now();
    const durationMin = Math.max((now - startTime) / 60000, 0.01);

    const wpm = Math.round((correctKeyStrokes / 5) / durationMin);
    const rawWpm = Math.round((totalKeyStrokes / 5) / durationMin);
    const accuracy = totalKeyStrokes > 0
      ? Math.round((correctKeyStrokes / totalKeyStrokes) * 100)
      : 100;

    return { wpm, rawWpm, accuracy };
  }, [startTime, correctKeyStrokes, totalKeyStrokes]);

  // Finalize Test Session
  const finishSession = useCallback(() => {
    if (!startTime) return;
    const finalDurationSec = (Date.now() - startTime) / 1000;
    const durationMin = Math.max(finalDurationSec / 60, 0.01);

    const finalWpm = Math.round((correctKeyStrokes / 5) / durationMin);
    const finalRawWpm = Math.round((totalKeyStrokes / 5) / durationMin);
    // Standard Accuracy: (correct / total) * 100, rounded to 1 decimal place
    const finalAccuracy = totalKeyStrokes > 0
      ? Math.round((correctKeyStrokes / totalKeyStrokes) * 1000) / 10
      : 100;

    // Calculate Consistency % via standard deviation of sample WPMs
    let consistency = 100;
    if (wpmSamples.length >= 3) {
      const speeds = wpmSamples.map((s) => s.wpm);
      const mean = speeds.reduce((acc, v) => acc + v, 0) / speeds.length;
      if (mean > 0) {
        const variance =
          speeds.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / speeds.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / mean; // coefficient of variation
        consistency = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
      }
    }

    // Count missed characters (in words that weren't finished or typed)
    let missedChars = 0;
    for (let i = currentWordIndex + 1; i < words.length; i++) {
      missedChars += words[i].length;
    }
    const currentTargetWord = words[currentWordIndex] || '';
    if (currentInput.length < currentTargetWord.length) {
      missedChars += currentTargetWord.length - currentInput.length;
    }

    onFinishTest({
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      consistency,
      duration: finalDurationSec,
      correctChars: correctKeyStrokes,
      errorChars: errorKeyStrokes,
      extraChars: Math.max(0, totalKeyStrokes - (correctKeyStrokes + errorKeyStrokes)),
      missedChars,
      wpmSamples: wpmSamples.length > 0 ? wpmSamples : [{
        second: Math.round(finalDurationSec),
        wpm: finalWpm,
        rawWpm: finalRawWpm,
        errors: errorKeyStrokes,
      }],
      keyErrors,
      keyAttempts,
    });
  }, [
    startTime,
    correctKeyStrokes,
    totalKeyStrokes,
    errorKeyStrokes,
    wpmSamples,
    currentWordIndex,
    currentInput,
    words,
    keyErrors,
    keyAttempts,
    onFinishTest,
  ]);

  // Keep finishSession in a ref so changes to typing state don't cause the timer effect to re-run
  const finishSessionRef = useRef(finishSession);
  useEffect(() => {
    finishSessionRef.current = finishSession;
  }, [finishSession]);

  // Timer Tick & Continuous Telemetry Sampling Loop (never interrupted by keystrokes)
  useEffect(() => {
    if (!hasStarted || !startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      if (elapsed <= 0) return;
      setElapsedSeconds(elapsed);

      // In 'time' mode, decrement remaining time
      if (mode === 'time') {
        const remaining = Math.max(0, timeLimit - elapsed);
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          finishSessionRef.current();
          return;
        }
      }

      // Record second-by-second WPM sample
      const durationMin = elapsed / 60;
      const currentWpm = Math.round((correctKeyStrokesRef.current / 5) / durationMin);
      const currentRaw = Math.round((totalKeyStrokesRef.current / 5) / durationMin);

      setWpmSamples((prev) => {
        // avoid duplicate second entries
        if (prev.length > 0 && prev[prev.length - 1].second === elapsed) {
          return prev;
        }
        return [
          ...prev,
          {
            second: elapsed,
            wpm: currentWpm,
            rawWpm: currentRaw,
            errors: errorKeyStrokesRef.current,
          },
        ];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, startTime, mode, timeLimit]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Start timer on first keystroke
    if (!hasStarted) {
      setHasStarted(true);
      setStartTime(Date.now());
    }

    const currentWord = words[currentWordIndex] || '';

    // Detect if user pressed Space to advance to next word
    if (val.endsWith(' ')) {
      const trimmedInput = val.slice(0, -1);
      if (trimmedInput.length === 0) {
        // Don't jump if nothing was typed
        return;
      }

      if (soundEnabled) {
        playKeyClick(true, false, soundVolume);
      }

      // Record space attempt
      setKeyAttempts((prev) => ({ ...prev, ' ': (prev[' '] || 0) + 1 }));
      setTotalKeyStrokes((prev) => prev + 1);

      // Check if word was typed correctly
      if (trimmedInput === currentWord) {
        setCorrectKeyStrokes((prev) => prev + 1); // +1 for the spacebar
      } else {
        setErrorKeyStrokes((prev) => prev + 1);
        setKeyErrors((prev) => ({ ...prev, ' ': (prev[' '] || 0) + 1 }));
      }

      // Save word to history
      setTypedWordsHistory((prev) => [...prev, trimmedInput]);
      setCurrentInput('');

      // Check if this was the last word
      if (currentWordIndex + 1 >= words.length) {
        finishSession();
      } else {
        setCurrentWordIndex((prev) => prev + 1);
      }
      return;
    }

    // Normal Character Typed or Backspace
    const isBackspace = val.length < currentInput.length;

    if (!isBackspace) {
      const newChar = val[val.length - 1];
      const targetChar = currentWord[val.length - 1];
      const isCorrect = newChar === targetChar;

      if (soundEnabled) {
        playKeyClick(false, !isCorrect, soundVolume);
      }

      // Record telemetry
      setTotalKeyStrokes((prev) => prev + 1);
      setKeyAttempts((prev) => ({ ...prev, [targetChar || newChar]: (prev[targetChar || newChar] || 0) + 1 }));

      if (isCorrect) {
        setCorrectKeyStrokes((prev) => prev + 1);
      } else {
        setErrorKeyStrokes((prev) => prev + 1);
        if (targetChar) {
          setKeyErrors((prev) => ({ ...prev, [targetChar]: (prev[targetChar] || 0) + 1 }));
        }
      }

      // In 'words' or 'quote' or 'custom' mode, if this is the final character of final word
      if (
        (mode === 'words' || mode === 'quote' || mode === 'custom' || mode === 'weak') &&
        currentWordIndex === words.length - 1 &&
        val === currentWord
      ) {
        setCurrentInput(val);
        finishSession();
        return;
      }
    }

    setCurrentInput(val);
  };

  // Keyboard Shortcuts (Tab + Enter to restart, Ctrl+Backspace to delete word)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check Caps Lock state
    setCapsLockActive(e.getModifierState('CapsLock'));

    if (e.key === 'Tab') {
      e.preventDefault();
      onRestart();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      onRestart();
      return;
    }

    // Backspace to previous word if currentInput is empty
    if (e.key === 'Backspace' && currentInput === '' && currentWordIndex > 0) {
      e.preventDefault();
      const prevWord = typedWordsHistory[currentWordIndex - 1];
      setCurrentWordIndex((prev) => prev - 1);
      setCurrentInput(prevWord);
      setTypedWordsHistory((prev) => prev.slice(0, -1));
    }
  };

  const live = calculateLiveMetrics();

  return (
    <div
      ref={containerRef}
      onClick={focusInput}
      className="relative w-full max-w-4xl mx-auto cursor-text select-none py-6"
    >
      {/* Hidden Text Input for native keystroke capturing and virtual mobile keyboards */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute opacity-0 pointer-events-none -left-9999px"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Live Minimalist HUD Bar */}
      <div className="flex items-center justify-between mb-8 px-2 text-sm">
        {/* Progress indicator */}
        <div className="flex items-center gap-6 font-mono text-xl tabular-nums">
          {mode === 'time' ? (
            <div className="text-amber-400 font-bold">
              {timeRemaining}
              <span className="text-xs text-slate-500 ml-1 font-normal">s</span>
            </div>
          ) : (
            <div className="text-amber-400 font-bold">
              {currentWordIndex}
              <span className="text-slate-500 font-normal">/{words.length}</span>
            </div>
          )}
        </div>

        {/* Live Speed & Accuracy (unobtrusive & sleek) */}
        {liveStats && (
          <div className="flex items-center gap-6 font-mono text-xs tabular-nums text-slate-400">
            <div>
              <span className="text-slate-500 mr-1.5">wpm:</span>
              <span className="text-slate-200 font-semibold">{live.wpm}</span>
            </div>
            <div>
              <span className="text-slate-500 mr-1.5">acc:</span>
              <span className="text-slate-200 font-semibold">{live.accuracy}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Caps Lock Alert */}
      {capsLockActive && (
        <div className="mb-4 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Caps Lock is ON</span>
        </div>
      )}

      {/* Click to Focus Overlay if blurred */}
      {!isFocused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0b0f17]/75 backdrop-blur-xs rounded-xl">
          <div className="text-sm text-amber-400 font-mono tracking-wide px-4 py-2 rounded-lg bg-[#141b27] border border-[#23334d] shadow-lg">
            Click here or press any key to focus
          </div>
        </div>
      )}

      {/* Words Display Stage */}
      <div
        ref={lineWrapperRef}
        className="relative min-h-[160px] max-h-[220px] overflow-hidden text-2xl md:text-3xl font-mono-typing leading-[2.1] tracking-normal"
      >
        {/* Dynamic Animated Caret */}
        {isFocused && (
          <div
            ref={caretRef}
            style={{
              transform: `translate3d(${caretPos.left}px, ${caretPos.top}px, 0)`,
              height: `${caretPos.height}px`,
              transition: smoothCaret ? 'transform 0.08s ease-out' : 'none',
            }}
            className="absolute top-0 left-0 w-[2.5px] rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)] pointer-events-none z-10 animate-caret-blink"
          />
        )}

        {/* Word Matrix */}
        <div className="flex flex-wrap gap-x-[0.65em] gap-y-2">
          {words.map((word, wordIdx) => {
            const isCurrent = wordIdx === currentWordIndex;
            const isCompleted = wordIdx < currentWordIndex;
            const typedWord = typedWordsHistory[wordIdx] || '';

            return (
              <span
                key={wordIdx}
                ref={isCurrent ? activeWordRef : undefined}
                className={`relative inline-block whitespace-nowrap transition-colors ${
                  isCurrent ? 'active-word' : ''
                }`}
              >
                {/* Character Breakdown */}
                {word.split('').map((char, charIdx) => {
                  let charColor = 'text-slate-600'; // upcoming character default
                  let isUnderlined = false;

                  if (isCompleted) {
                    const typedChar = typedWord[charIdx];
                    if (typedChar === char) {
                      charColor = 'text-slate-300';
                    } else {
                      charColor = 'text-red-400';
                      isUnderlined = true;
                    }
                  } else if (isCurrent) {
                    if (charIdx < currentInput.length) {
                      const typedChar = currentInput[charIdx];
                      if (typedChar === char) {
                        charColor = 'text-slate-100';
                      } else {
                        charColor = 'text-red-400';
                        isUnderlined = true;
                      }
                    }
                  }

                  return (
                    <span
                      key={charIdx}
                      className={`char-span inline-block transition-colors ${charColor} ${
                        isUnderlined ? 'border-b-2 border-red-500' : ''
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}

                {/* Extra incorrect characters typed beyond target word length */}
                {isCurrent && currentInput.length > word.length && (
                  <>
                    {currentInput
                      .slice(word.length)
                      .split('')
                      .map((extraChar, extraIdx) => (
                        <span
                          key={`extra-${extraIdx}`}
                          className="extra-char-span inline-block text-red-500/80 border-b-2 border-red-500 opacity-70"
                        >
                          {extraChar}
                        </span>
                      ))}
                  </>
                )}

                {/* Extra characters from previously completed words */}
                {isCompleted && typedWord.length > word.length && (
                  <>
                    {typedWord
                      .slice(word.length)
                      .split('')
                      .map((extraChar, extraIdx) => (
                        <span
                          key={`extra-prev-${extraIdx}`}
                          className="inline-block text-red-500/70 border-b-2 border-red-500 opacity-60"
                        >
                          {extraChar}
                        </span>
                      ))}
                  </>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Quote Author attribution if quote mode */}
      {mode === 'quote' && quoteAuthor && (
        <div className="mt-6 text-right text-xs text-slate-500 font-mono italic">
          — {quoteAuthor}
        </div>
      )}

      {/* Subtle keyboard prompt footer */}
      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-600 font-mono">
        <div>
          <kbd className="px-1.5 py-0.5 rounded bg-[#131a26] border border-[#1e2a3d] text-slate-400">
            Tab
          </kbd>{' '}
          restart
        </div>
        <div>
          <kbd className="px-1.5 py-0.5 rounded bg-[#131a26] border border-[#1e2a3d] text-slate-400">
            Esc
          </kbd>{' '}
          reset
        </div>
      </div>
    </div>
  );
};
