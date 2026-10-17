import React from 'react';
import { Volume2, VolumeX, BarChart2, Keyboard, RotateCcw } from 'lucide-react';
import { UserPreferences } from '../types/typing';

interface HeaderProps {
  activeView: 'test' | 'weakKeys' | 'history';
  setActiveView: (view: 'test' | 'weakKeys' | 'history') => void;
  bestWpm: number;
  preferences: UserPreferences;
  onToggleSound: () => void;
  onResetTest: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  bestWpm,
  preferences,
  onToggleSound,
  onResetTest,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 md:px-12 py-5 border-b border-[#1c2638] bg-[#0c1017]">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => {
          setActiveView('test');
          onResetTest();
        }}
        className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        title="KeyCraft Home"
      >
        <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
        <span>KeyCraft</span>
      </button>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden sm:flex items-center gap-7 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveView('test')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'test' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          Practice
        </button>
        <button
          onClick={() => setActiveView('weakKeys')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeView === 'weakKeys' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          Weak Keys
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeView === 'history' ? 'text-amber-400 font-semibold' : 'hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          History
        </button>
        <button
          onClick={onToggleSound}
          className="cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 hover:text-slate-200"
          title={preferences.soundEnabled ? 'Disable mechanical key sound' : 'Enable mechanical key sound'}
        >
          {preferences.soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-500/80" />
              <span>Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Muted</span>
            </>
          )}
        </button>
        {bestWpm > 0 && (
          <span className="text-xs font-mono tabular-nums text-slate-500 whitespace-nowrap shrink-0">
            PB: <strong className="text-slate-300 font-medium">{bestWpm} WPM</strong>
          </span>
        )}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onResetTest}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-400 bg-[#162132] border border-[#23334d] hover:border-amber-500/40 hover:bg-[#1c2a40] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm active:scale-95"
          title="Restart Test (or press Tab + Enter)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Test</span>
        </button>
      </div>
    </header>
  );
};
