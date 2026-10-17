import React, { useState } from 'react';
import { WpmSample } from '../types/typing';

interface VelocityChartProps {
  samples: WpmSample[];
  finalWpm: number;
  finalRawWpm: number;
}

export const VelocityChart: React.FC<VelocityChartProps> = ({
  samples,
  finalWpm,
  finalRawWpm,
}) => {
  const [hoveredSample, setHoveredSample] = useState<WpmSample | null>(null);

  if (!samples || samples.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
        No telemetry samples recorded for this session.
      </div>
    );
  }

  // Ensure samples are sorted by second
  const sorted = [...samples].sort((a, b) => a.second - b.second);

  // SVG dimensions
  const width = 800;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxSecond = Math.max(...sorted.map((s) => s.second), 1);
  const maxWpm = Math.max(
    ...sorted.map((s) => Math.max(s.wpm, s.rawWpm)),
    finalWpm,
    finalRawWpm,
    20
  );
  // Round maxWpm up to neat multiple of 10 or 20
  const yAxisMax = Math.ceil(maxWpm / 15) * 15 + 10;

  const getX = (second: number) => padding.left + (second / maxSecond) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - (val / yAxisMax) * innerHeight;

  // Build SVG path strings
  const wpmPoints = sorted.map((s) => `${getX(s.second)},${getY(s.wpm)}`).join(' ');
  const rawPoints = sorted.map((s) => `${getX(s.second)},${getY(s.rawWpm)}`).join(' ');

  const areaPath = `
    M ${getX(sorted[0].second)},${getY(0)}
    L ${wpmPoints}
    L ${getX(sorted[sorted.length - 1].second)},${getY(0)}
    Z
  `;

  // Horizontal guide lines
  const gridSteps = 4;
  const yGuides = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const val = Math.round((yAxisMax / gridSteps) * i);
    return { val, y: getY(val) };
  });

  return (
    <div className="w-full bg-[#0e141f] border border-[#1b2537] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-400 rounded-full" />
            <span className="text-slate-300 font-medium">Net WPM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
            <span className="text-slate-400">Raw WPM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span className="text-slate-400">Errors</span>
          </div>
        </div>
        {hoveredSample ? (
          <div className="text-slate-300 font-mono">
            {hoveredSample.second}s: <span className="text-amber-400 font-bold">{hoveredSample.wpm}</span> WPM (Raw: {hoveredSample.rawWpm}{hoveredSample.errors > 0 ? `, ${hoveredSample.errors} err` : ''})
          </div>
        ) : (
          <span className="text-slate-500 text-xs">Hover over points to inspect telemetry</span>
        )}
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y axis numbers */}
          {yGuides.map((g, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={g.y}
                x2={width - padding.right}
                y2={g.y}
                stroke="#1b2537"
                strokeWidth="1"
                strokeDasharray={idx === 0 ? '' : '3 3'}
              />
              <text
                x={padding.left - 10}
                y={g.y + 4}
                fill="#64748b"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="end"
              >
                {g.val}
              </text>
            </g>
          ))}

          {/* X axis labels (seconds) */}
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={width - padding.right}
            y2={padding.top + innerHeight}
            stroke="#1b2537"
            strokeWidth="1"
          />

          {sorted.map((s, idx) => {
            // Show every few seconds depending on count
            const interval = Math.max(1, Math.floor(maxSecond / 6));
            if (s.second % interval === 0 || s.second === maxSecond) {
              return (
                <text
                  key={idx}
                  x={getX(s.second)}
                  y={height - 12}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {s.second}s
                </text>
              );
            }
            return null;
          })}

          {/* WPM Area fill */}
          <path d={areaPath} fill="url(#wpmGradient)" />

          {/* Raw WPM curve (dashed line) */}
          <polyline
            fill="none"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            points={rawPoints}
          />

          {/* Net WPM curve (solid amber) */}
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={wpmPoints}
          />

          {/* Points & Error Markers */}
          {sorted.map((s, idx) => {
            const cx = getX(s.second);
            const cy = getY(s.wpm);
            const hasError = s.errors > 0;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredSample(s)}
                onMouseLeave={() => setHoveredSample(null)}
              >
                {/* Invisible hover trigger area */}
                <circle cx={cx} cy={cy} r="10" fill="transparent" />

                {/* Visible WPM node */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={hoveredSample?.second === s.second ? '5' : '3'}
                  fill="#0c1017"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  className="transition-all"
                />

                {/* Error cross/dot */}
                {hasError && (
                  <circle
                    cx={cx}
                    cy={getY(0) - 8}
                    r="3.5"
                    fill="#ef4444"
                    stroke="#0c1017"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
