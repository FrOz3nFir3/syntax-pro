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
  const { toggleTheme } = useTheme();

  const { isTouchDevice } = useTouchDevice();
  const touchClasses = getTouchFriendlyClasses(isTouchDevice);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Focus trap for mobile menu
  const mobileMenuRef = useFocusTrap(mobileMenuOpen);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "alt+h": () => navigate("/"),
    escape: () => mobileMenuOpen && closeMobileMenu(),
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white/95 border-neutral-200 dark:bg-slate-800 dark:border-neutral-700
        backdrop-blur-sm border-b transition-colors duration-300
        ${className}
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 hover:scale-105 group"
              onClick={closeMobileMenu}
            >
              <SyntaxProLogo />
              <span
                className="
                text-xl font-bold transition-all duration-200
                text-gray-900 dark:text-white
                hidden sm:block
              "
              >
                Syntax Pro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className={`
                  text-sm font-medium transition-colors hover:text-blue-500
                  ${
                    location.pathname === "/"
                      ? "text-blue-500"
                      : "text-neutral-600 dark:text-neutral-300"
                  }
                `}
              >
                Home
              </Link>
              <Link
                to="/playgrounds"
                className={`
                  text-sm font-medium transition-colors hover:text-blue-500
                  ${
                    location.pathname === "/playgrounds"
                      ? "text-blue-500"
                      : "text-neutral-600 dark:text-neutral-300"
                  }
                `}
              >
                Playgrounds
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Theme Toggle */}
              <button
                className={`
                  ${touchClasses.iconButton} rounded-lg transition-all duration-200
                  hover:scale-110 hover:rotate-12 active:scale-95
                  hover:bg-neutral-100 text-neutral-600 hover:shadow-lg hover:shadow-blue-500/20
                  dark:hover:bg-neutral-800 dark:text-neutral-300 dark:hover:shadow-yellow-500/20
                `}
                aria-label="Toggle theme"
                title="Toggle theme"
                onClick={toggleTheme}
              >
                <svg
                  className="w-5 h-5 hidden dark:block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <svg
                  className="w-5 h-5 dark:hidden"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </button>

              {/* Custom Actions */}
              {customActions}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`
                ${touchClasses.iconButton} rounded-lg transition-colors
                hover:bg-neutral-100 text-neutral-600
                dark:hover:bg-neutral-800 dark:text-neutral-300
              `}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="
            md:hidden border-t animate-fade-in
            border-neutral-200 bg-white
            dark:border-neutral-700 dark:bg-neutral-900
          "
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`
                  block px-4 py-3 rounded-md text-base font-medium transition-colors
                  min-h-touch flex items-center
                  ${
                    location.pathname === "/"
                      ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800"
                  }
                `}
              >
                Home
              </Link>

              <Link
                to="/playgrounds"
                onClick={closeMobileMenu}
                className={`
                   px-4 py-3 rounded-md text-base font-medium transition-colors
                  min-h-touch flex items-center
                  ${
                    location.pathname === "/playgrounds"
                      ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800"
                  }
                `}
              >
                Playgrounds
              </Link>

              {/* Mobile Custom Actions */}
              {customActions && (
                <div className="px-3 py-2">{customActions}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
