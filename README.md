# Syntax Pro

[![CodeQL](https://github.com/FrOz3nFir3/syntax-pro/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/FrOz3nFir3/syntax-pro/actions/workflows/github-code-scanning/codeql)
[![Dependabot Updates](https://github.com/FrOz3nFir3/syntax-pro/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/FrOz3nFir3/syntax-pro/actions/workflows/dependabot/dependabot-updates)

A friendlier code playground for six languages — write, run, and save code in
your browser without an account, a sign-up flow, or a "free trial" of anything.
Everything stays on your device. Code execution is the only thing that hits the
network (it has to).

Built with React, CodeMirror 6, and a custom design system called **Bracket**
that draws from the Syntax Pro logo's framing brackets and warm-paper palette.

## ✨ Features

* **Six languages, one editor.** JavaScript, Python, Java, C++, Rust, PHP.
  Each gets proper syntax highlighting, autocomplete, code folding, and
  multi-cursor editing via CodeMirror 6.
* **Run in the cloud, cancel any time.** Powered by Judge0. Hit `⌘↵` to
  execute, hit it again to stop a runaway loop.
* **Local-first storage.** Folders and playgrounds live in your browser's
  `localStorage`. No accounts, no analytics, no telemetry. Open the dev tools
  and verify.
* **Real keyboard shortcuts.** `⌘↵` runs (toggles to Stop while running).
  `⌘S` saves. Auto-save runs every 3 seconds when enabled. Hints adapt to
  your OS — Mac shows `⌘`, Windows/Linux shows `Ctrl`.
* **Light and dark, system-aware.** Follows your OS theme by default; manual
  toggle is persisted to `localStorage`.
* **Bracket design system.** Custom Tailwind theme with `paper`, `ink`,
  `mustard`, and `signal` tokens. Editorial typography (Instrument Serif +
  Inter + JetBrains Mono). Signature corner-bracket motif from the logo as a
  reusable `<Frame>` component.
* **Cohesive skeleton loaders.** Single `<Skeleton.Block />` primitive used
  across landing, playgrounds, editor, and 404. Shapes match the live layouts
  so there's no jarring color flash on hydration.
* **Accessible.** Skip links, focus traps, ARIA-busy loading regions,
  keyboard-shortcut overrides, full screen-reader announcements.
* **Mobile-friendly.** Responsive panel layout (horizontal on desktop,
  vertical on mobile), touch-friendly hit targets, no fake desktop kbd hints
  shown on phones.

## 🛠 Tech Stack

* **Framework:** React 18 + Vite 4
* **Editor:** [CodeMirror 6](https://codemirror.net/) (`@uiw/react-codemirror`)
  with `@uiw/codemirror-themes-all` for ten editor themes
* **Styling:** Tailwind CSS 3.4 with a custom Bracket theme
  (see [`tailwind.config.cjs`](tailwind.config.cjs))
* **State:** Redux Toolkit + `react-redux`
* **Routing:** React Router 6
* **Code execution:** [Judge0 CE](https://judge0.com/) via RapidAPI
* **Persistence:** `localStorage` (no backend)

## 🏁 Getting Started

### Prerequisites
* **Node.js:** v18 or higher
* A free [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce) key for
  Judge0 (only needed if you want to actually *run* code; the editor and
  storage work without one)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FrOz3nFir3/syntax-pro.git
   cd syntax-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configuration:**
   Copy the sample env file and add your RapidAPI key:
   ```bash
   cp sample.env .env
   ```

   Open `.env` and set:
   ```
   VITE_RAPID_API_KEY=your_rapidapi_key_here
   ```

### Running the App

```bash
npm run dev
```

Then open http://localhost:5173.

## 📜 Scripts

* `npm run dev` — start the Vite dev server with HMR
* `npm run build` — type-check and build for production
* `npm run preview` — preview the production build locally

## 🎨 Design system

The "Bracket" system lives in
[`tailwind.config.cjs`](tailwind.config.cjs) and
[`src/index.css`](src/index.css). The most useful pieces:

* **Color tokens:** `ink` (deep navy), `paper` (warm cream), `bone` (warmer
  cream for section bands), `mustard` (primary CTAs), `signal` (accent red,
  the corner-bracket color), `mint` (success/syntax accent)
* **Typography:** `font-display` (Instrument Serif), `font-sans` (Inter),
  `font-mono` (JetBrains Mono); `eyebrow` utility for small-caps mono labels
* **Component classes:** `btn-primary` / `btn-secondary` / `btn-outline` /
  `btn-ghost` / `btn-danger`, `input-primary`, `card`, `heading-1` / `-2` / `-3`
* **Bracket primitive:** [`<Frame>`](src/components/ui/Frame.jsx) wraps content
  with the logo's diagonal corner brackets (top-right + bottom-left by default)
* **Skeleton primitive:** [`<Skeleton.Block />`](src/components/skeletons/Skeleton.jsx)
  for cohesive loading states across all routes

## 📄 License

This project is released under **The Unlicense** (Public Domain).
See the [UNLICENSE](UNLICENSE) file for details.

Use it, fork it, sell it, don't credit me. Whatever works.
