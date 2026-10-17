import React, { useState } from 'react';
import { Target, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { WeakKeyStat } from '../types/typing';

interface WeakKeysViewProps {
  stats: WeakKeyStat[];
  onStartDrill: (keys: string[]) => void;
  onClearWeakKeys: () => void;
  onBackToPractice: () => void;
}

const QWERTY_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

export const WeakKeysView: React.FC<WeakKeysViewProps> = ({
  stats,
  onStartDrill,
  onClearWeakKeys,
  onBackToPractice,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Map key string to stat object
  const statMap: Record<string, WeakKeyStat> = {};
  stats.forEach((s) => {
    statMap[s.key.toLowerCase()] = s;
  });

  // Calculate highest error count for relative coloring
  const maxErrors = stats.length > 0 ? Math.max(...stats.map((s) => s.errors)) : 1;

  // Top 5 weakest keys
  const topWeakKeys = stats.slice(0, 5).map((s) => s.key);

  const getKeyColor = (char: string) => {
    const s = statMap[char];
    if (!s || s.errors === 0) {
      return 'bg-[#121824] border-[#1e2a3d] text-slate-400 hover:border-slate-500';
    }
    const ratio = s.errors / maxErrors;
    if (ratio > 0.6) {
      return 'bg-red-950/40 border-red-500/60 text-red-300 font-bold hover:border-red-400';
    }
    if (ratio > 0.25) {
      return 'bg-amber-950/40 border-amber-500/50 text-amber-300 font-medium hover:border-amber-400';
    }
    return 'bg-[#152033] border-[#253957] text-slate-200 hover:border-slate-400';
  };

  const activeStat = selectedKey ? statMap[selectedKey] : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c2638] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-xl font-bold text-slate-100">
              Weak Keys & Mistake Diagnostics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time keystroke precision telemetry and targeted muscle-memory drill generator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {topWeakKeys.length > 0 && (
            <button
              onClick={() => onStartDrill(topWeakKeys)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice Top 5 Weak Keys</span>
            </button>
          )}

          <button
            onClick={onBackToPractice}
            className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 border border-[#202c40] rounded-lg bg-[#111723] cursor-pointer"
          >
            Back to Test
          </button>
        </div>
      </div>

      {stats.length === 0 ? (
        <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <div className="text-slate-200 font-semibold text-base">
            No Missed Keys Recorded Yet
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Complete a typing test in Practice mode. As you type, KeyCraft automatically tracks your mistyped keys, error frequencies, and accuracy percentages.
          </p>
          <button
            onClick={onBackToPractice}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Start a Practice Test
          </button>
        </div>
      ) : (
        <>
          {/* Top Weak Keys Ranking Cards */}
          <div>
            <div className="text-xs text-slate-400 font-semibold mb-3 tracking-wide">
              HIGHEST ERROR FREQUENCY KEYS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {stats.slice(0, 5).map((stat, idx) => (
                <div
                  key={stat.key}
                  onClick={() => setSelectedKey(stat.key.toLowerCase())}
                  className={`p-4 rounded-xl border bg-[#121824] cursor-pointer transition-all ${
                    selectedKey === stat.key.toLowerCase()
                      ? 'border-amber-400 ring-1 ring-amber-400/40'
                      : 'border-[#1e2a3d] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-bold text-amber-400">
                      {stat.key === ' ' ? 'Space' : stat.key}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-slate-300 font-mono">
                    <span className="text-red-400 font-semibold">{stat.errors}</span> errors
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {stat.errorRate}% error rate
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Keyboard Heatmap */}
          <div className="bg-[#101622] border border-[#1d273a] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-400 font-semibold tracking-wide">
                KEYBOARD HEATMAP
              </span>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#121824] border border-[#1e2a3d]" />
                  Clean
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-950/40 border border-amber-500/50" />
                  Moderate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-red-950/40 border border-red-500/60" />
                  Frequent Error
                </span>
              </div>
            </div>

            {/* Keyboard Grid */}
            <div className="flex flex-col items-center gap-2 py-4 select-none">
              {QWERTY_ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-2">
                  {row.map((char) => {
                    const isSelected = selectedKey === char;
                    return (
                      <button
                        key={char}
                        onClick={() => setSelectedKey(char)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border text-sm sm:text-base font-mono flex items-center justify-center transition-all cursor-pointer ${getKeyColor(
                          char
                        )} ${isSelected ? 'ring-2 ring-amber-400 scale-105 z-10' : ''}`}
                      >
                        {char.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* Spacebar */}
              <div className="mt-1">
                <button
                  onClick={() => setSelectedKey(' ')}
                  className={`w-48 sm:w-64 h-10 rounded-lg border text-xs font-mono uppercase tracking-widest flex items-center justify-center transition-all cursor-pointer ${getKeyColor(
                    ' '
                  )} ${selectedKey === ' ' ? 'ring-2 ring-amber-400 scale-105' : ''}`}
                >
                  SPACEBAR
                </button>
              </div>
            </div>

            {/* Selected Key Detail Bar */}
            {activeStat ? (
              <div className="mt-4 p-4 rounded-lg bg-[#0c1017] border border-[#1e2a3d] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg font-mono font-bold">
                    {activeStat.key === ' ' ? '␣' : activeStat.key.toUpperCase()}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">
                      Key '{activeStat.key === ' ' ? 'Space' : activeStat.key}' Telemetry
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {activeStat.errors} mistakes / {activeStat.attempts} attempts ({activeStat.errorRate}% miss rate)
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onStartDrill([activeStat.key])}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Practice This Key Alone
                </button>
              </div>
            ) : (
              <div className="mt-4 text-center text-xs text-slate-500">
                Click any key on the keyboard above to inspect error telemetry.
              </div>
            )}
          </div>

          {/* Reset Weak Keys Data Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all tracked weak keys data?')) {
                  onClearWeakKeys();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Weak Keys Data</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
