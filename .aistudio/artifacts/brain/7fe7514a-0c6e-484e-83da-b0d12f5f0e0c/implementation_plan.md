# KeyCraft — Minimalist Precision Typing Trainer

A distraction-free, high-performance typing practice application engineered for fluid keyboard mastery with sub-millisecond input responsiveness, real-time speed/accuracy metrics, versatile test modes, and automated weak-key diagnostic drills.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user-confirmed choices from Phase 1 drive the application architecture and aesthetic design:

- **Practice Modes**: Versatile test modes confirmed (Timed tests at 15s, 30s, 60s, 120s; Word count sprints at 10, 25, 50, 100 words; Inspiring literary quotes with attribution; and Custom text practice).
- **Visual Aesthetic**: Minimalist Dark confirmed — inspired by premium mechanical typing workstations with deep obsidian-slate background (`#0e131b`), muted stone character banks, and high-legibility warm amber cursor/accent highlights (`#f59e0b`).
- **Telemetry & Diagnostics**: Live second-by-second WPM & accuracy time-series chart, paired with an intelligent Weak Key & Mistake Tracker that isolates problem keys and generates focused diagnostic drill sessions.

---

### 1. Overview & Core Concept

- **What It Does**: KeyCraft provides a focused, zero-latency typing environment where users practice typing across diverse modes. As the user types, the engine calculates real-time Words Per Minute (WPM), Raw WPM, Character Accuracy (%), Consistency, and Keystroke Error distribution. Upon test completion, an interactive performance review displays an SVG velocity curve and identifies specific weak keys with one-click drill generation.
- **Target Audience / Persona**: Developers, writers, students, and competitive keyboard enthusiasts seeking an ad-free, snappy, distraction-free environment to elevate typing speed and reduce habitual finger errors.
- **Key Value**: Immediate feedback without sensory overload. Clear separation between the focused typing stage and post-test analytical insights, with persistent progress stored locally.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Quick Start*: User arrives at the typing canvas; standard 30s timed mode is primed with high-frequency English vocabulary. Typing immediately begins on the first keystroke with no manual focus button required.
  2. *Mode Switching*: A quiet top toolbar allows toggling between **Time** (15s, 30s, 60s, 120s), **Words** (10, 25, 50, 100), **Quotes** (short, medium, long literature passages), and **Custom** (paste own text or code snippets).
  3. *Live Typing Experience*: The active word and character are dynamically highlighted with a smooth vertical blinking caret. Correct characters turn bright crisp white/amber; mistaken characters highlight in muted coral red with instant backspace correction support. A live unobtrusive HUD shows current elapsed time/remaining words, instantaneous WPM, and accuracy.
  4. *Results & Analytics Stage*: Instantly transitions to a detailed scorecard showing Final WPM, Raw WPM, Accuracy, Consistency %, Total Characters (correct/incorrect/extra/missed), and an interactive SVG velocity chart showing WPM/Error progression over time.
  5. *Diagnostic Weak-Key Drill*: Below the scorecard, a visual frequency matrix highlights the user's top error characters (e.g., missed 'p', 'b', ';') and provides a "Practice Weak Keys" button to instantly spin up targeted drills focusing on those specific characters.
  6. *History & Personal Bests*: Stored in browser `localStorage` with stats by mode, best WPM records, and recent test history.

- **Visual Identity & Theme**:
  - *Aesthetic*: Minimalist Dark workstation, distraction-free, zero extraneous borders or flashy banners.
  - *Color Palette (Tailwind-native)*:
    - Dominant Canvas (60%): `#0c1017` (Deep Obsidian Slate)
    - Structural Surfaces (30%): `#151c28` (Card / Control Deck) with hairline borders `#222f42`
    - Inactive / Upcoming Characters: `#4b5568` (Muted Slate, high legibility without glare)
    - Correct Characters: `#e2e8f0` (Crisp Off-White)
    - Accent / Active Cursor (10%): `#f59e0b` (Warm Amber Glow)
    - Error Characters: `#ef4444` (Coral Crimson with subtle underline)
  - *Typography*:
    - Display / Brand: `Plus Jakarta Sans` for clean, modern titles
    - Typing Canvas & Telemetry: `JetBrains Mono` / Monospace with `tabular-nums` for rock-solid letter spacing and zero jitter during live typing.
  - *Anti-Slop Discipline*: Zero static pill tags, no fake telemetry badges, no decorative pulsing dots. Clean typographic segmented controls with active state underlines or subtle backgrounds.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Keystroke Capture vs Textarea Proxy**
  - *Chosen Approach*: Invisible capture textarea aligned over the canvas while rendering custom character-by-character styled `<span>` elements with a dedicated animated caret.
  - *Why*: Supports standard mobile virtual keyboards, IME composition, and full physical keyboard modifier keys (Backspace, Ctrl+Backspace word deletion) while providing pixel-perfect control over cursor animations and character coloring.
  - *Alternatives Considered*: ContentEditable (prone to browser DOM divergence and caret calculation glitches).
- **Decision 2: Performance Measurement Methodology (Standard Net WPM)**
  - *Chosen Approach*: Official standard metric: `WPM = (Correct Characters Typed / 5) / (Time in Minutes)`. Raw WPM includes all keystrokes. Consistency calculated via standard deviation of 1-second interval rolling WPM samples.
  - *Why*: Conforms strictly to Monkeytype and TypeRacer standard benchmarks.
- **Decision 3: Persistence Strategy**
  - *Chosen Approach*: Robust client-side `localStorage` schema saving test sessions, personal bests per mode, and aggregated key error frequencies.
  - *Why*: Zero account friction, 100% offline capable, instant loading with privacy preserved.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Bar (Brand & Mode Nav)                      │
│   [ KeyCraft ]           [ Mode: Time | Words | Quote | Custom ]       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Interactive Typing Stage & Live HUD                    │
│   • Instantaneous WPM / Accuracy Counter                               │
│   • Active Word Bank with Smooth Caret Tracker                         │
│   • Hidden Raw Input Handler (handles Backspace, Shortcuts, CapsLock)  │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │ (on test finish)
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│       Live Telemetry Engine          │  │     Post-Test Analytics      │
│  • 1000ms Interval Speed Sampler     │  │  • SVG Velocity Curve Chart  │
│  • Per-key error frequency collector │  │  • Weak-Key Diagnostic Grid  │
│  • Consistency % standard deviation  │  │  • "Practice Weak Keys" CTA  │
└───────────────────┬──────────────────┘  └──────────────┬───────────────┘
                    │                                    │
                    ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   LocalStorage Persistence & Records                   │
│   • Personal Bests per mode (15s, 30s, 60s, words, quotes)             │
│   • Lifetime stats (tests taken, total words, average accuracy)        │
│   • Rolling weak keys error frequency map                              │
└────────────────────────────────────────────────────────────────────────┘
```

- **Core State Modules**:
  1. `typingEngine`: Manages raw typed string, active word index, caret position, start time, pause/resume, and keystroke timestamps.
  2. `metricsCalculator`: Computes instantaneous and final WPM, raw WPM, accuracy %, consistency %, and second-by-second data points.
  3. `wordBank`: Curates top 1000 common English words, punctuation sets, quote database with authors, and custom text parser.
  4. `weakKeyTracker`: Maps `[char] -> { attempts: number, errors: number, missRate: number }`, updating local storage to generate practice drills.
