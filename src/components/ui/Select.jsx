import React, { useState, useRef, useEffect } from "react";
import {
  useTouchDevice,
  getTouchFriendlyClasses,
} from "../../utils/responsive";

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  searchable = false,
  error,
  disabled = false,
  required = false,
  className = "",
  touchFriendly = true,
  ...props
}) => {
  const { isTouchDevice, hasHover } = useTouchDevice();
  const touchClasses = getTouchFriendlyClasses(isTouchDevice);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const baseClasses = "relative w-full";

  const getButtonClasses = () => {
    const baseButton = `
      w-full text-left border rounded-lg transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:scale-[1.02] focus:shadow-lg
      select-none relative overflow-hidden
      ${
        touchFriendly && isTouchDevice
          ? touchClasses.select
          : "px-3 py-2 text-sm"
      }
    `;

    const stateClasses = error
      ? "border-signal focus:border-signal focus:ring-signal/30 dark:border-signal-300 animate-shake"
      : "border-ink/15 focus:border-ink focus:ring-mustard/40 dark:border-paper/15 dark:focus:border-paper";

    const interactionClasses = disabled
      ? "bg-paper-200 cursor-not-allowed dark:bg-ink-700"
      : `cursor-pointer bg-paper-50 shadow-[inset_0_1px_0_rgba(11,23,51,0.04)] dark:bg-ink-800 dark:shadow-none ${
          hasHover
            ? "hover:border-ink/30 dark:hover:border-paper/30"
            : "active:border-ink/30 dark:active:border-paper/30"
        }`;

    return `${baseButton} ${stateClasses} ${interactionClasses}`;
  };

  return (
    <div className={`${baseClasses} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-2">
          {label}
          {required && <span className="text-signal ml-1">*</span>}
        </label>
      )}

      <div ref={selectRef} className="relative">
        <button
          type="button"
          className={getButtonClasses()}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          {...props}
        >
          <span
            className={`
            ${
              selectedOption
                ? "text-ink dark:text-paper"
                : "text-ink/40 dark:text-paper/40"
            }
          `}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span
            className={`
            absolute inset-y-0 right-0 flex items-center pointer-events-none
            ${isTouchDevice ? "pr-4" : "pr-2"}
          `}
          >
            <svg
              className={`
                ${isTouchDevice ? "h-6 w-6" : "h-5 w-5"} 
                text-ink/40 dark:text-paper/40 transition-transform duration-200
                ${isOpen ? "rotate-180" : ""}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div
            className={`
            absolute z-10 w-full mt-1 border rounded-xl shadow-lift max-h-60 overflow-auto
            bg-paper-50 dark:bg-ink-700 border-ink/10 dark:border-paper/10
            animate-scale-in
          `}
          >
            {searchable && (
              <div className="p-2 border-b border-ink/10 dark:border-paper/10">
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`
                    w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-mustard/40 focus:border-ink dark:focus:border-paper
                    bg-paper dark:bg-ink-800 border-ink/15 dark:border-paper/15
                    text-ink dark:text-paper
                    ${
                      isTouchDevice
                        ? "px-4 py-3 text-base"
                        : "px-3 py-2 text-sm"
                    }
                  `}
                />
              </div>
            )}

            <div className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`
                      w-full text-left transition-colors focus:outline-none
                      ${
                        isTouchDevice
                          ? "px-4 py-3 text-base min-h-touch"
                          : "px-3 py-2 text-sm"
                      }
                      ${
                        option.value === value
                          ? "bg-mustard/15 text-ink dark:text-paper font-medium"
                          : `text-ink/80 dark:text-paper/80 ${
                              hasHover
                                ? "hover:bg-ink/5 dark:hover:bg-paper/5 hover:text-ink dark:hover:text-paper"
                                : "active:bg-ink/5 dark:active:bg-paper/5"
                            }`
                      }
                    `}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div
                  className={`
                  text-ink/55 dark:text-paper/55
                  ${isTouchDevice ? "px-4 py-3 text-base" : "px-3 py-2 text-sm"}
                `}
                >
                  {searchable && searchTerm
                    ? "No options found"
                    : "No options available"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;
