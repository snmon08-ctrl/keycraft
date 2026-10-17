import React from 'react';
import { Clock, Type, Quote as QuoteIcon, Sliders, Hash, AtSign } from 'lucide-react';
import { TestMode, TimeOption, WordCountOption, QuoteLengthOption } from '../types/typing';

interface ModeSelectorProps {
  mode: TestMode;
  setMode: (mode: TestMode) => void;
  timeOption: TimeOption;
  setTimeOption: (val: TimeOption) => void;
  wordCountOption: WordCountOption;
  setWordCountOption: (val: WordCountOption) => void;
  quoteLength: QuoteLengthOption;
  setQuoteLength: (val: QuoteLengthOption) => void;
  punctuation: boolean;
  setPunctuation: (val: boolean) => void;
  numbers: boolean;
  setNumbers: (val: boolean) => void;
  onOpenCustomModal: () => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  setMode,
  timeOption,
  setTimeOption,
  wordCountOption,
  setWordCountOption,
  quoteLength,
  setQuoteLength,
  punctuation,
  setPunctuation,
  numbers,
  setNumbers,
  onOpenCustomModal,
  disabled = false,
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 py-3 px-4 bg-[#121824] rounded-xl border border-[#1e2a3d] max-w-4xl mx-auto shadow-sm transition-opacity ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* Primary Mode Picker */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setMode('time')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
            mode === 'time'
              ? 'bg-amber-500/15 text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#182233]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>time</span>
        </button>

        <button
          onClick={() => setMode('words')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
            mode === 'words'
              ? 'bg-amber-500/15 text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#182233]'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>words</span>
        </button>

        <button
          onClick={() => setMode('quote')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
            mode === 'quote'
              ? 'bg-amber-500/15 text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#182233]'
          }`}
        >
          <QuoteIcon className="w-3.5 h-3.5" />
          <span>quote</span>
        </button>

        <button
          onClick={() => {
            setMode('custom');
            onOpenCustomModal();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
            mode === 'custom'
              ? 'bg-amber-500/15 text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#182233]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>custom</span>
        </button>
      </div>

      <div className="hidden sm:block w-px h-4 bg-[#223147]" />

      {/* Sub-mode options */}
      <div className="flex items-center gap-1">
        {mode === 'time' && (
          <>
            {([15, 30, 60, 120] as TimeOption[]).map((time) => (
              <button
                key={time}
                onClick={() => setTimeOption(time)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono tabular-nums cursor-pointer transition-colors ${
                  timeOption === time
                    ? 'text-amber-400 font-bold bg-[#1d293d]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {time}s
              </button>
            ))}
          </>
        )}

        {mode === 'words' && (
          <>
            {([10, 25, 50, 100] as WordCountOption[]).map((count) => (
              <button
                key={count}
                onClick={() => setWordCountOption(count)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono tabular-nums cursor-pointer transition-colors ${
                  wordCountOption === count
                    ? 'text-amber-400 font-bold bg-[#1d293d]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {count}
              </button>
            ))}
          </>
        )}

        {mode === 'quote' && (
          <>
            {(['short', 'medium', 'long'] as QuoteLengthOption[]).map((len) => (
              <button
                key={len}
                onClick={() => setQuoteLength(len)}
                className={`px-2.5 py-1 rounded-md text-xs capitalize cursor-pointer transition-colors ${
                  quoteLength === len
                    ? 'text-amber-400 font-bold bg-[#1d293d]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {len}
              </button>
            ))}
          </>
        )}

        {mode === 'custom' && (
          <button
            onClick={onOpenCustomModal}
            className="px-2.5 py-1 rounded-md text-xs text-amber-400/90 hover:text-amber-300 font-mono underline decoration-amber-500/40 cursor-pointer"
          >
            Edit Custom Text
          </button>
        )}

        {mode === 'weak' && (
          <span className="px-2.5 py-1 text-xs text-amber-400 font-mono">
            Weak Key Drill Mode
          </span>
        )}
      </div>

      {/* Punctuation & Numbers Toggles (for time and words modes) */}
      {(mode === 'time' || mode === 'words') && (
        <>
          <div className="hidden sm:block w-px h-4 bg-[#223147]" />
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPunctuation(!punctuation)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                punctuation
                  ? 'text-amber-400 bg-[#1d293d]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Punctuation"
            >
              <AtSign className="w-3 h-3" />
              <span>punct</span>
            </button>
            <button
              onClick={() => setNumbers(!numbers)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                numbers
                  ? 'text-amber-400 bg-[#1d293d]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Numbers"
            >
              <Hash className="w-3 h-3" />
              <span>num</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
