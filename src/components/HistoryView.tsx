import React, { useState } from 'react';
import { Clock, Trash2, ArrowLeft, Award, Zap, Target } from 'lucide-react';
import { TestResult } from '../types/typing';

interface HistoryViewProps {
  results: TestResult[];
  onClearHistory: () => void;
  onBackToPractice: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  results,
  onClearHistory,
  onBackToPractice,
}) => {
  const [filterMode, setFilterMode] = useState<string>('all');

  const filtered = filterMode === 'all'
    ? results
    : results.filter((r) => r.mode === filterMode);

  // Lifetime summaries
  const totalTests = results.length;
  const bestWpm = results.length > 0 ? Math.max(...results.map((r) => r.wpm)) : 0;
  const avgWpm = totalTests > 0
    ? Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / totalTests)
    : 0;
  const avgAccuracy = totalTests > 0
    ? Math.round((results.reduce((acc, r) => acc + r.accuracy, 0) / totalTests) * 10) / 10
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c2638] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-xl font-bold text-slate-100">
              Session History & Benchmarks
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review past typing sessions, speed trajectories, and personal records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPractice}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-300 hover:text-white border border-[#202c40] rounded-lg bg-[#111723] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Practice</span>
          </button>

          {totalTests > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all session history? This action cannot be undone.')) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-red-400 border border-[#202c40] rounded-lg bg-[#111723] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {totalTests === 0 ? (
        <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-slate-200 font-semibold text-base">
            No Test Records Found
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Take your first test in Practice mode. Your speed, accuracy, and detailed second-by-second analytics will be stored here.
          </p>
          <button
            onClick={onBackToPractice}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Start Practice
          </button>
        </div>
      ) : (
        <>
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-4">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>ALL-TIME BEST</span>
              </div>
              <div className="text-3xl font-mono-typing font-bold text-amber-400 tabular-nums">
                {bestWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
              </div>
            </div>

            <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-4">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>AVERAGE WPM</span>
              </div>
              <div className="text-3xl font-mono-typing font-bold text-slate-200 tabular-nums">
                {avgWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
              </div>
            </div>

            <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-4">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>AVG ACCURACY</span>
              </div>
              <div className="text-3xl font-mono-typing font-bold text-slate-200 tabular-nums">
                {avgAccuracy}%
              </div>
            </div>

            <div className="bg-[#121824] border border-[#1e2a3d] rounded-xl p-4">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>TESTS COMPLETED</span>
              </div>
              <div className="text-3xl font-mono-typing font-bold text-slate-200 tabular-nums">
                {totalTests}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 mr-2">Filter mode:</span>
            {['all', 'time', 'words', 'quote', 'custom', 'weak'].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors capitalize ${
                  filterMode === m
                    ? 'bg-[#1e2c40] text-amber-400 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Results Table */}
          <div className="bg-[#101622] border border-[#1d273a] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1c2638] text-slate-400 font-mono uppercase tracking-wider bg-[#0d121c]">
                    <th className="py-3 px-4">WPM</th>
                    <th className="py-3 px-4">Raw</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Errors</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172030] font-mono">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#151c29] transition-colors text-slate-300"
                    >
                      <td className="py-3.5 px-4 font-bold text-amber-400 text-sm tabular-nums">
                        {item.wpm}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 tabular-nums">
                        {item.rawWpm}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums">
                        <span
                          className={
                            item.accuracy >= 97
                              ? 'text-emerald-400'
                              : item.accuracy >= 92
                              ? 'text-slate-200'
                              : 'text-amber-400'
                          }
                        >
                          {item.accuracy}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 capitalize">
                        {item.mode} ({item.modeConfig})
                      </td>
                      <td className="py-3.5 px-4 tabular-nums text-red-400">
                        {item.errorChars}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500 tabular-nums text-[11px]">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
