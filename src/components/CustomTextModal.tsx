import React, { useState } from 'react';
import { X, FileText, Code2, Sparkles } from 'lucide-react';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  initialText?: string;
}

const PRESETS = [
  {
    title: 'JavaScript Async Loop',
    text: 'const processItems = async (items) => { for (const item of items) { await saveRecord(item); } return true; };',
  },
  {
    title: 'React Functional Hook',
    text: 'const useDebounce = (value, delay) => { const [debounced, setDebounced] = useState(value); useEffect(() => { const timer = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(timer); }, [value, delay]); return debounced; };',
  },
  {
    title: 'Philosophical Meditation',
    text: 'Waste no more time arguing what a good person should be. Be one. Look well into yourself; there is a source of strength which will always spring up if you will always look.',
  },
];

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialText = '',
}) => {
  const [text, setText] = useState(initialText);

  if (!isOpen) return null;

  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = text.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordCount < 3) return;
    onSubmit(text.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0f1521] border border-[#202e44] rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1d273a] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Custom Practice Text
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1a2333] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">
              Paste or type your own practice material, essay, or code:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste custom text here..."
              rows={6}
              className="w-full p-3.5 rounded-xl bg-[#0a0e16] border border-[#1e2a3d] focus:border-amber-500 focus:outline-none text-slate-200 font-mono text-sm leading-relaxed resize-none shadow-inner"
              autoFocus
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1 px-1">
              <span>{wordCount} words · {charCount} characters</span>
              {wordCount < 3 && text.length > 0 && (
                <span className="text-amber-400">Please enter at least 3 words</span>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <div className="text-[11px] text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Or choose a preset drill:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => setText(preset.text)}
                  className="p-2.5 rounded-lg border border-[#1b2537] bg-[#131b28] hover:border-amber-500/40 text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{preset.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1d273a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={wordCount < 3}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Start Custom Practice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
