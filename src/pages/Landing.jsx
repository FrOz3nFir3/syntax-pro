import React from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const Landing = () => {
  return (
    <AppLayout showBreadcrumbs={false} noPadding className="!bg-transparent">
      {/* Hero Section */}
      <section className="relative py-24 text-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="max-w-5xl mx-auto relative z-10 px-4">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-slate-900 dark:text-slate-100 leading-tight">
              The online{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                code playground
              </span>{" "}
              for developers
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
              Write, run, and experiment with code in multiple languages. All
              your work is saved locally on your device - no account required!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/playgrounds"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">Start Coding Now</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Powerful{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Features
              </span>{" "}
              for Modern Development
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to write, test, and perfect your code in one
              beautiful interface
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
            {/* Feature 1 - Multi-Language */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 text-center">
                  6 Programming Languages
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center mb-4">
                  Full support for JavaScript, Python, Java, C++, Rust, and PHP
                  with syntax highlighting and intelligent autocomplete.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["JS", "Python", "Java", "C++", "Rust", "PHP"].map(
                    (lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {lang}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Feature 2 - Instant Execution */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 text-center">
                  Cloud Code Execution
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center mb-4">
                  Execute your code using our cloud-based engine with
                  comprehensive error handling. Cancel long-running processes
                  anytime.
                </p>
                <div className="flex justify-center">
                  <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    ⚡ Reliable execution
                  </span>
                </div>
              </div>
            </div>

            {/* Feature 3 - Local Storage */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 text-center">
                  100% Local Storage
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center mb-4">
                  Your code stays on your device. No accounts, no servers, no
                  privacy concerns. Auto-save keeps your work safe.
                </p>
                <div className="flex justify-center">
                  <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    🔒 Privacy First
                  </span>
                </div>
              </div>
            </div>

            {/* Feature 4 - Smart Editor */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 text-center">
                  Professional Editor
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                  Advanced code editor with syntax highlighting,
                  auto-completion, code folding, and multiple themes.
                </p>
              </div>
            </div>

            {/* Feature 5 - Responsive Design */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 text-center">
                  Mobile Optimized
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                  Fully responsive design that works perfectly on desktop,
                  tablet, and mobile devices.
                </p>
              </div>
            </div>

            {/* Feature 6 - Import/Export */}
            <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 text-center">
                  Import & Export
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                  Import existing code files or export your projects. Seamlessly
                  work with your local development environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Get Started in{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              No registration required. Start coding immediately and see your
              results in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-200 dark:bg-blue-800 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                Choose Your Language
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Select from JavaScript, Python, Java, C++, Rust, or PHP. Create
                a new playground or organize with folders for better project
                management.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-200 dark:bg-green-800 rounded-full animate-ping delay-1000"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                Write & Edit Code
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Use our advanced editor with syntax highlighting,
                auto-completion, and multiple themes. Auto-save keeps your work
                safe.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-200 dark:bg-purple-800 rounded-full animate-ping delay-2000"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                Run & Export
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Execute your code, see results in real-time, and export your
                projects as files. Stop execution anytime with our cancel
                feature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h3 className="text-4xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Ready to Start Your Coding Journey?
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Begin your coding journey for rapid prototyping, learning, and
              experimentation. No setup required - start coding in seconds!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/playgrounds"
                className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-3">Launch Playground</span>
                <svg
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <a
                href="https://github.com/FrOz3nFir3/syntax-pro"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>View Source Code</span>
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-400">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>100% Free</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-400">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Open Source</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-400">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Unlicense</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Landing;
