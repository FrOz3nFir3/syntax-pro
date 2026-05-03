import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useTouchDevice,
  getTouchFriendlyClasses,
} from "../../utils/responsive";
import { useFocusTrap, useKeyboardShortcuts } from "../../utils/accessibility";
import { useTheme } from "../../contexts/ThemeContext";
import SyntaxProLogo from "../svg/SyntaxProLogo";

const Header = ({ customActions = null, className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const { isTouchDevice } = useTouchDevice();
  const touchClasses = getTouchFriendlyClasses(isTouchDevice);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const mobileMenuRef = useFocusTrap(mobileMenuOpen);

  useKeyboardShortcuts({
    "alt+h": () => navigate("/"),
    escape: () => mobileMenuOpen && closeMobileMenu(),
  });

  const toggleMobileMenu = () => setMobileMenuOpen((p) => !p);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/playgrounds", label: "Playgrounds" },
  ];

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-paper-50/90 dark:bg-ink-900/90
        backdrop-blur-md backdrop-saturate-150
        border-b border-ink/15 dark:border-paper/15
        shadow-[0_1px_0_rgba(11,23,51,0.02)]
        transition-colors duration-300
        ${className}
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={closeMobileMenu}
            aria-label="Syntax Pro home"
          >
            <span className="relative inline-flex w-9 h-9 items-center justify-center rounded-lg overflow-hidden">
              <SyntaxProLogo width={34} height={34} />
              <span
                aria-hidden
                className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-signal opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span
                aria-hidden
                className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-signal opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-xl text-ink dark:text-paper tracking-tightest">
                Syntax<span className="text-signal">.</span>Pro
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45 dark:text-paper/45 mt-0.5">
                Code · Run · Save
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-7">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={active ? "nav-link-active" : "nav-link"}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              {customActions}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <button
              onClick={toggleMobileMenu}
              className={`${touchClasses.iconButton} rounded-lg text-ink/70 dark:text-paper/70 hover:bg-ink/5 dark:hover:bg-paper/5 transition-colors`}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-ink/8 dark:border-paper/8 animate-fade-in"
            role="navigation"
          >
            <div className="py-3 space-y-1">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={`
                      flex items-center px-4 py-3 rounded-lg text-base font-medium min-h-touch transition-colors
                      ${
                        active
                          ? "bg-mustard/15 text-ink dark:text-paper"
                          : "text-ink/70 dark:text-paper/70 hover:bg-ink/5 dark:hover:bg-paper/5"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {customActions && <div className="px-4 pt-2">{customActions}</div>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    title={isDark ? "Switch to light" : "Switch to dark"}
    aria-label="Toggle color theme"
    className="
      relative inline-flex items-center justify-center w-10 h-10 rounded-lg
      text-ink/70 dark:text-paper/70 hover:text-ink dark:hover:text-paper
      hover:bg-ink/5 dark:hover:bg-paper/5
      transition-all duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard
    "
  >
    <svg
      className={`absolute w-5 h-5 transition-all duration-300 ${
        isDark ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1 1M17.4 17.4l1 1M5.6 18.4l1-1M17.4 6.6l1-1"
      />
    </svg>
    <svg
      className={`absolute w-5 h-5 transition-all duration-300 ${
        isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
      />
    </svg>
  </button>
);

export default Header;
