# KeyCraft — Precision Typing Practice

A clean, distraction-free typing trainer engineered for fluid keyboard mastery with sub-millisecond input responsiveness, real-time speed and accuracy metrics, versatile test modes, and automated weak-key diagnostic drills.

---

## ✨ Features

- **Minimalist Workstation Aesthetic**: Deep obsidian dark theme (`#0b0f17`) with crisp character highlights, optical vertical centering, and a warm amber cursor glow.
- **Multiple Practice Modes**:
  - **Time**: 15s, 30s, 60s, and 120s sprint challenges with continuous live countdown.
  - **Words**: 10, 25, 50, and 100 word test sets.
  - **Quotes**: Short, medium, and long classic and modern passages with author attribution.
  - **Custom Text**: Paste your own paragraphs, essays, or code snippets with preset shortcuts (JavaScript, React hooks, philosophy).
  - **Modifiers**: Quick toggles for punctuation marks and numbers.
- **Real-Time Telemetry & Visual Analytics**:
  - Unobtrusive live HUD displaying instantaneous WPM, accuracy %, and remaining time.
  - Second-by-second SVG velocity curve showing Net WPM, Raw WPM, and error markers.
  - Post-test scorecards calculating Net WPM, Raw WPM, Precision Accuracy %, and Speed Consistency %.
- **Weak Keys & Frequent Mistake Diagnostics**:
  - Interactive QWERTY keyboard heatmap visualizing clean vs. problematic keys.
  - Detailed error count and error rate breakdown per character.
  - One-click **Practice Weak Keys** drill generator that creates targeted exercises focusing on your problem letters.
- **Synthetic Mechanical Switch Sounds**:
  - Ultra-snappy tactile clicks, spacebar thuds, and subtle error tones synthesized directly in the browser via the Web Audio API (zero external audio files or network latency).
  - One-click toggle in the header navigation.
- **100% Offline & Private**:
  - All test history, personal bests, and weak key analytics are stored locally in your browser via `localStorage`.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` (installed automatically with Node.js)

### Installation

1. Clone or download this repository.
2. In your terminal, navigate to the project directory:
   ```bash
   cd keycraft-—-precision-typing-practice
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the local development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Instant Restart / Next Test |
| <kbd>Esc</kbd> | Reset Current Test |
| <kbd>Backspace</kbd> | Correct previous character in current word |
| <kbd>Ctrl</kbd> + <kbd>Backspace</kbd> | Delete current word |

---

## 📦 Building for Production

To create an optimized, minified production build:

```bash
npm run build
```

The compiled static assets will be output to the `dist/` folder. You can preview the production build locally with:
```bash
npm run preview
```

---

## 🌐 Deploying to the Web (Free)

Because KeyCraft is a pure client-side SPA with zero database or backend requirements, you can deploy it for free in minutes:

### Vercel
1. Push your repository to [GitHub](https://github.com).
2. Go to [Vercel](https://vercel.com) and import your repository.
3. Leave all default settings (Framework: Vite, Build: `npm run build`, Output: `dist`).
4. Click **Deploy**.

### Netlify / Cloudflare Pages
- Connect your GitHub repo, set build command to `npm run build` and publish directory to `dist`.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: JetBrains Mono & Plus Jakarta Sans (via Google Fonts)
- **Audio**: Web Audio API (Synthetic oscillator clicks)
