import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Frame from "../components/ui/Frame";

/* ───────── Snippets that "type" themselves in the hero ───────── */
const SNIPPETS = [
  {
    lang: "javascript",
    label: "JavaScript",
    code: `const greet = (name) => \`Hello, \${name}!\`;\nconsole.log(greet("world"));\n// → Hello, world!`,
  },
  {
    lang: "python",
    label: "Python",
    code: `def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n\nprint(fib(10))  # 55`,
  },
  {
    lang: "rust",
    label: "Rust",
    code: `fn main() {\n    let nums = vec![3, 1, 4, 1, 5, 9, 2, 6];\n    let sum: i32 = nums.iter().sum();\n    println!("sum = {sum}");\n}`,
  },
  {
    lang: "cpp",
    label: "C++",
    code: `#include <iostream>\nint main() {\n    for (int i = 1; i <= 3; ++i)\n        std::cout << i*i << " ";\n    return 0;\n}`,
  },
];

const LANGS = [
  { key: "javascript", name: "JavaScript", img: "/javascript.png", color: "#F5C518" },
  { key: "python", name: "Python", img: "/python.png", color: "#3776AB" },
  { key: "java", name: "Java", img: "/java.png", color: "#E76F00" },
  { key: "cpp", name: "C++", img: "/cpp.png", color: "#00599C" },
  { key: "rust", name: "Rust", img: "/rust.png", color: "#CE422B" },
  { key: "php", name: "PHP", img: "/php.png", color: "#777BB4" },
];

const FEATURES = [
  {
    eyebrow: "01 / Editor",
    title: "A real editor, not a textarea.",
    body: "CodeMirror 6 under the hood — multi-cursor, folding, autocomplete, and ten themes. Vim and Emacs muscle memory still works.",
    aside: "Try Cmd+D to multi-select.",
  },
  {
    eyebrow: "02 / Execution",
    title: "Run six languages, fast.",
    body: "JavaScript, Python, Java, C++, Rust, PHP. Cloud runtime, fair queue, and you can cancel mid-run if your loop went sideways.",
    aside: "Average run: 600ms.",
  },
  {
    eyebrow: "03 / Storage",
    title: "Your code stays yours.",
    body: "No accounts, no analytics, no telemetry. Everything lives in your browser's localStorage. Export to a real file whenever.",
    aside: "Open the dev tools to verify.",
  },
];

/* ───────── Typing demo ───────── */
const useTypewriter = (snippet, speed = 22) => {
  const [text, setText] = useState("");
  useEffect(() => {
    setText("");
    let i = 0;
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      i++;
      setText(snippet.slice(0, i));
      if (i < snippet.length) setTimeout(tick, speed);
    };
    const t = setTimeout(tick, 250);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [snippet, speed]);
  return text;
};

const HeroEditor = () => {
  const [idx, setIdx] = useState(0);
  const current = SNIPPETS[idx];
  const typed = useTypewriter(current.code, 18);

  useEffect(() => {
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % SNIPPETS.length);
    }, current.code.length * 18 + 2400);
    return () => clearTimeout(t);
  }, [idx, current.code.length]);

  return (
    <Frame
      tone="signal"
      size="lg"
      corners="diagonal"
      className="w-full max-w-xl mx-auto"
      innerClassName="rounded-xl overflow-hidden bg-ink shadow-lift border border-ink"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-paper/10 bg-ink-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-signal/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-mustard/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-mint-300/80" />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55">
          {current.label}
        </span>
        <span className="font-mono text-[11px] text-paper/40">main.{ext(current.lang)}</span>
      </div>

      {/* Code */}
      <pre className="px-5 py-5 text-[13px] leading-relaxed font-mono text-paper/95 min-h-[210px] whitespace-pre overflow-x-auto">
        <code>
          {typed}
          <span className="inline-block w-2 h-4 bg-mustard align-middle ml-0.5 animate-blink" />
        </code>
      </pre>

      {/* Output strip */}
      <div className="px-5 py-3 border-t border-paper/10 bg-ink-900 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint-300">
          ✓ output
        </span>
        <span className="font-mono text-[12px] text-paper/70">
          {outputFor(current.lang)}
        </span>
      </div>
    </Frame>
  );
};

const ext = (lang) =>
  ({
    javascript: "js",
    python: "py",
    java: "java",
    cpp: "cpp",
    rust: "rs",
    php: "php",
  }[lang] || "txt");

const outputFor = (lang) =>
  ({
    javascript: "Hello, world!",
    python: "55",
    rust: "sum = 31",
    cpp: "1 4 9",
  }[lang] || "—");

/* ───────── Page ───────── */
const Landing = () => {
  return (
    <AppLayout showBreadcrumbs={false} noPadding className="!bg-paper dark:!bg-ink-800">
      {/* ════════════ HERO ════════════ */}
      <section className="relative overflow-hidden pt-28 pb-24 sm:pt-36 sm:pb-32">
        <div className="absolute inset-0 bg-grain pointer-events-none" />
        {/* corner motif */}
        <span
          aria-hidden
          className="absolute top-24 left-6 w-10 h-10 border-t-2 border-l-2 border-signal hidden sm:block"
        />
        <span
          aria-hidden
          className="absolute bottom-12 right-6 w-10 h-10 border-b-2 border-r-2 border-signal hidden sm:block"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-signal mr-2 align-middle" />
                A code playground
              </p>

              <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl text-ink dark:text-paper">
                Write code.{" "}
                <span className="italic text-ink/65 dark:text-paper/65">
                  Run anywhere.
                </span>
                <br />
                Save{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">nothing</span>
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 bottom-1 h-3 bg-mustard/70 -z-0"
                  />
                </span>{" "}
                you don't want to.
              </h1>

              <p className="mt-7 max-w-xl text-lg text-ink/70 dark:text-paper/70 leading-relaxed">
                A friendlier code playground for six languages. No accounts, no
                cloud-storage upsells — just an editor, a runtime, and your
                browser's local storage.<sup className="ml-1 text-signal font-mono not-italic">*</sup>
              </p>
              <p className="mt-2 max-w-xl font-mono text-[11px] text-ink/45 dark:text-paper/45 italic">
                * code execution does hit a cloud runtime. that part has to.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/playgrounds" className="btn-secondary group !px-6 !py-3.5 !text-base">
                  Open the playground
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
                <a href="#features" className="btn-outline !px-6 !py-3.5 !text-base">
                  See features
                </a>
              </div>

              {/* tiny status badges */}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint-400" />
                  6 languages
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mustard" />
                  Local-first
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                  Open source
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <HeroEditor />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ LANGUAGES band (dark) ════════════ */}
      <section className="bg-ink dark:bg-ink-900 text-paper py-16 sm:py-20 relative overflow-hidden">
        <span
          aria-hidden
          className="absolute top-8 right-8 w-14 h-14 border-t-[3px] border-r-[3px] border-mustard/35"
        />
        <span
          aria-hidden
          className="absolute bottom-8 left-8 w-14 h-14 border-b-[3px] border-l-[3px] border-mustard/35"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-mustard mb-3">
                Six. That's it.
              </p>
              <h2 className="heading-display text-4xl sm:text-5xl text-paper">
                One editor. Six languages.
                <br />
                <span className="italic text-paper/60">Zero context-switching.</span>
              </h2>
            </div>
            <p className="md:max-w-sm text-paper/65">
              Each language ships with proper syntax highlighting and a runtime,
              so you can prototype where it makes sense.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-paper/10 rounded-2xl overflow-hidden border border-paper/10">
            {LANGS.map((lang, i) => (
              <div
                key={lang.key}
                className="group relative bg-ink dark:bg-ink-900 hover:bg-ink-700 transition-colors p-6 flex flex-col items-center justify-center gap-3"
              >
                <span className="absolute top-2 right-3 font-mono text-[10px] text-paper/30">
                  0{i + 1}
                </span>
                <img
                  src={lang.img}
                  alt={lang.name}
                  className="w-12 h-12 object-contain transition-transform duration-500 group-hover:-translate-y-1"
                />
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-paper/80">
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FEATURES (warm bone bg) ════════════ */}
      <section id="features" className="bg-bone dark:bg-ink-700 py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <p className="eyebrow mb-4">What's inside</p>
            <h2 className="heading-display text-4xl sm:text-5xl text-ink dark:text-paper">
              Built for the way you{" "}
              <span className="italic">actually</span> write code.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <Frame
                key={i}
                tone="signal"
                size="md"
                hover
                className="h-full"
                innerClassName="h-full bg-paper dark:bg-ink-800 rounded-2xl border border-ink/10 dark:border-paper/10 p-7 flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal mb-5">
                  {f.eyebrow}
                </p>
                <h3 className="heading-display text-2xl text-ink dark:text-paper mb-3">
                  {f.title}
                </h3>
                <p className="text-ink/70 dark:text-paper/70 text-[15px] leading-relaxed">
                  {f.body}
                </p>
                {/* hand-written aside */}
                <p className="mt-5 pt-4 border-t border-dashed border-ink/15 dark:border-paper/15 font-mono text-[11px] text-ink/45 dark:text-paper/45 italic">
                  ↳ {f.aside}
                </p>
              </Frame>
            ))}
          </div>

          {/* personal aside in the margin */}
          <p className="mt-12 max-w-md mx-auto text-center font-display italic text-ink/45 dark:text-paper/45 text-lg">
            "Look — I just wanted a place to test stuff without signing up.
            Maybe you do too."
          </p>
        </div>
      </section>

      {/* ════════════ HOW IT WORKS (paper, with a number marquee) ════════════ */}
      <section className="bg-paper dark:bg-ink-800 py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="eyebrow mb-4">Three steps to running code</p>
            <h2 className="heading-display text-4xl sm:text-5xl text-ink dark:text-paper">
              No setup. No signup. No nonsense.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                n: "01",
                t: "Pick a language",
                d: "Six languages waiting. Make a folder, name it whatever you want.",
              },
              {
                n: "02",
                t: "Write something",
                d: "Real editor, real keyboard shortcuts. Auto-save runs every few seconds.",
              },
              {
                n: "03",
                t: "Run it",
                d: "Hit Run. Watch it execute. Cancel mid-run if you change your mind.",
              },
            ].map((step) => (
              <div key={step.n} className="relative">
                <div className="font-display text-7xl text-mustard leading-none mb-4 tracking-tightest">
                  {step.n}
                </div>
                <h3 className="font-display text-2xl text-ink dark:text-paper mb-2">
                  {step.t}
                </h3>
                <p className="text-ink/65 dark:text-paper/65 leading-relaxed">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA / mini-playground footer (dark) ════════════ */}
      <section className="bg-ink-800 text-paper py-24 relative overflow-hidden">
        <span
          aria-hidden
          className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-signal/70"
        />
        <span
          aria-hidden
          className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-signal/70"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-mustard mb-5">
            $ syntax-pro --start
          </p>
          <h2 className="heading-display text-4xl sm:text-6xl mb-6 leading-[0.95]">
            The fastest way from{" "}
            <span className="italic text-mustard">idea</span> to{" "}
            <span className="italic text-mustard">output</span>.
          </h2>
          <p className="text-paper/70 text-lg mb-10 max-w-xl mx-auto">
            Go from blank file to running program in under ten seconds. No
            install. No "create your free account."
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/playgrounds"
              className="inline-flex items-center gap-2 bg-mustard text-ink font-semibold px-7 py-4 rounded-xl shadow-press hover:-translate-y-0.5 hover:bg-mustard-300 transition-all"
            >
              Launch playground
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://github.com/FrOz3nFir3/syntax-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-paper/25 text-paper px-7 py-4 rounded-xl hover:bg-paper/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 21.8 24 17.3 24 12c0-6.6-5.4-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/35">
            Unlicense · No tracking · Open source
          </p>
        </div>
      </section>
    </AppLayout>
  );
};

export default Landing;
