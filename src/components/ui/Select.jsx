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
      ? "border-red-500 focus:border-red-500 focus:ring-red-500 focus:shadow-red-500/10 dark:border-red-400 animate-shake"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:shadow-blue-500/10 dark:border-gray-600 dark:focus:border-blue-400";

    const interactionClasses = disabled
      ? "bg-gray-100 cursor-not-allowed dark:bg-gray-800"
      : `cursor-pointer bg-white dark:bg-gray-900 ${
          hasHover
            ? "hover:border-gray-400 hover:shadow-md hover:-translate-y-0.5 dark:hover:border-gray-500"
            : "active:border-gray-400 active:scale-95 dark:active:border-gray-500"
        }`;

    return `${baseButton} ${stateClasses} ${interactionClasses}`;
  };

  return (
    <div className={`${baseClasses} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
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
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400"
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
                text-gray-400 dark:text-gray-500 transition-transform duration-200 
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
            absolute z-10 w-full mt-1 border rounded-lg shadow-xl max-h-60 overflow-auto
            bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600
            animate-scale-in backdrop-blur-sm
          `}
          >
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`
                    w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600
                    text-gray-900 dark:text-gray-100
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
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : `text-gray-900 dark:text-gray-100 ${
                              hasHover
                                ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                                : "active:bg-gray-100 dark:active:bg-gray-800"
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
                  text-gray-500 dark:text-gray-400
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
