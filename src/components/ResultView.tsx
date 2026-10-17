import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, Award, Zap, Target, Activity, Flame } from 'lucide-react';
import { TestResult } from '../types/typing';
import { VelocityChart } from './VelocityChart';

interface ResultViewProps {
  result: TestResult;
  isNewBest: boolean;
  onNextTest: () => void;
  onRepeatTest: () => void;
  onPracticeWeakKeys: (keys: string[]) => void;
  onOpenWeakKeysView: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  isNewBest,
  onNextTest,
  onRepeatTest,
  onPracticeWeakKeys,
  onOpenWeakKeysView,
}) => {
  useEffect(() => {
    if (isNewBest) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff'],
        });
      } catch {
        // gracefully ignore if canvas confetti is blocked
      }
    }
  }, [isNewBest]);

  // Extract keys with errors from this test
  const errorKeys = Object.entries(result.keyErrors)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count > 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner if new best */}
      {isNewBest && (
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm font-medium">
          <Award className="w-4 h-4 text-amber-400" />
          <span>New Personal Best for {result.mode} {result.modeConfig}!</span>
        </div>
      )}

      {/* Main KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* WPM */}
        <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-5 relative overflow-hidden">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>WPM</span>
          </div>
          <div className="text-5xl font-mono-typing font-extrabold text-amber-400 tabular-nums">
            {Math.round(result.wpm)}
          </div>
          <div className="text-xs text-slate-500 mt-2 font-mono">
            net words per min
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>ACCURACY</span>
          </div>
          <div className="text-5xl font-mono-typing font-extrabold text-slate-100 tabular-nums">
            {result.accuracy <= 1 && result.accuracy > 0 ? Math.round(result.accuracy * 100) : Math.round(result.accuracy)}%
          </div>
          <div className="text-xs text-slate-500 mt-2 font-mono">
            precision rate
          </div>
        </div>

        {/* Raw WPM */}
        <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>RAW SPEED</span>
          </div>
          <div className="text-5xl font-mono-typing font-extrabold text-slate-300 tabular-nums">
            {Math.round(result.rawWpm)}
          </div>
          <div className="text-xs text-slate-500 mt-2 font-mono">
            all keystrokes / 5
          </div>
        </div>

        {/* Consistency */}
        <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>CONSISTENCY</span>
          </div>
          <div className="text-5xl font-mono-typing font-extrabold text-slate-300 tabular-nums">
            {Math.round(result.consistency)}%
          </div>
          <div className="text-xs text-slate-500 mt-2 font-mono">
            speed uniformity
          </div>
        </div>
      </div>

      {/* SVG Velocity Curve Chart */}
      <VelocityChart
        samples={result.wpmSamples}
        finalWpm={result.wpm}
        finalRawWpm={result.rawWpm}
      />

      {/* Detailed Diagnostics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Character Breakdown */}
        <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-5 text-sm">
          <div className="text-xs text-slate-400 font-semibold mb-3 tracking-wide">
            CHARACTER METRICS
          </div>
          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-lg bg-[#0e141f] border border-[#1a2436]">
              <div className="text-lg font-bold text-slate-100 tabular-nums">
                {result.correctChars}
              </div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider mt-0.5">
                Correct
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0e141f] border border-[#1a2436]">
              <div className="text-lg font-bold text-red-400 tabular-nums">
                {result.errorChars}
              </div>
              <div className="text-[10px] text-red-400 uppercase tracking-wider mt-0.5">
                Mistakes
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0e141f] border border-[#1a2436]">
              <div className="text-lg font-bold text-slate-400 tabular-nums">
                {result.extraChars}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                Extra
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0e141f] border border-[#1a2436]">
              <div className="text-lg font-bold text-slate-400 tabular-nums">
                {result.missedChars}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                Missed
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Test Duration: {result.duration.toFixed(1)}s</span>
            <span>Mode: {result.mode} {result.modeConfig}</span>
          </div>
        </div>

        {/* Weak Key Diagnostics from this test */}
        <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-5 text-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-semibold tracking-wide">
                TEST ERROR BREAKDOWN
              </span>
              <button
                onClick={onOpenWeakKeysView}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                All-time map →
              </button>
            </div>

            {errorKeys.length === 0 ? (
              <div className="py-4 text-center text-xs text-emerald-400/90 font-medium">
                Flawless execution! Zero character errors recorded.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {errorKeys.slice(0, 8).map(([key, count]) => (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e141f] border border-red-500/20 text-xs font-mono"
                  >
                    <span className="text-slate-200 font-bold px-1.5 py-0.5 rounded bg-[#192436]">
                      {key === ' ' ? 'Space' : key}
                    </span>
                    <span className="text-red-400 text-[11px] font-semibold">
                      {count} {count === 1 ? 'err' : 'errs'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorKeys.length > 0 && (
            <button
              onClick={() => onPracticeWeakKeys(errorKeys.map(([k]) => k))}
              className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Practice Missed Keys Drill</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={onNextTest}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Next Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onRepeatTest}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#162132] hover:bg-[#1f2d44] border border-[#23334d] text-slate-200 font-medium text-sm transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Repeat Same Text</span>
        </button>
      </div>

      <div className="text-center text-xs text-slate-500 font-mono">
        Pro tip: Press <kbd className="px-1.5 py-0.5 rounded bg-[#1c2638] text-slate-300 border border-[#2b3b55]">Tab</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-[#1c2638] text-slate-300 border border-[#2b3b55]">Enter</kbd> to start next test immediately
      </div>
    </div>
  );
};
