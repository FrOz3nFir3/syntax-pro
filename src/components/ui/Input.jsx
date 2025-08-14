import React from "react";
import {
  useTouchDevice,
  getTouchFriendlyClasses,
} from "../../utils/responsive";
import { getAriaAttributes, useAccessibleId } from "../../utils/accessibility";
import { TRANSITIONS } from "../../utils/animations";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  className = "",
  touchFriendly = true,
  ariaDescribedBy,
  ariaLabelledBy,
  ...props
}) => {
  const { isTouchDevice } = useTouchDevice();
  const touchClasses = getTouchFriendlyClasses(isTouchDevice);
  const inputId = useAccessibleId("input");
  const errorId = useAccessibleId("input-error");
  const successId = useAccessibleId("input-success");

  const baseClasses = `
    w-full border rounded-lg ${TRANSITIONS.DEFAULT}
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:scale-[1.02]
    ${touchFriendly && isTouchDevice ? touchClasses.input : "px-3 py-2 text-sm"}
    relative
  `;

  const stateClasses = {
    default: `
      border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:shadow-lg focus:shadow-blue-500/10
      dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400
      hover:border-gray-400 dark:hover:border-gray-500
    `,
    error: `
      border-red-500 focus:border-red-500 focus:ring-red-500 focus:shadow-lg focus:shadow-red-500/10
      dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400
      animate-shake
    `,
    success: `
      border-green-500 focus:border-green-500 focus:ring-green-500 focus:shadow-lg focus:shadow-green-500/10
      dark:border-green-400 dark:focus:border-green-400 dark:focus:ring-green-400
    `,
  };

  const getStateClass = () => {
    if (error) return stateClasses.error;
    if (success) return stateClasses.success;
    return stateClasses.default;
  };

  const backgroundClasses = disabled
    ? "bg-gray-100 cursor-not-allowed dark:bg-gray-800"
    : "bg-white dark:bg-gray-900";

  const inputClasses = `
    ${baseClasses} ${getStateClass()} ${backgroundClasses}
    ${icon ? (isTouchDevice ? "pl-12" : "pl-10") : ""} 
    ${className}
  `;

  // Generate accessibility attributes
  const ariaAttributes = getAriaAttributes.input({
    required,
    invalid: !!error,
    describedBy:
      [error ? errorId : null, success ? successId : null, ariaDescribedBy]
        .filter(Boolean)
        .join(" ") || undefined,
    labelledBy: ariaLabelledBy,
  });

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div
            className={`absolute inset-y-0 left-0 ${
              isTouchDevice ? "pl-4" : "pl-3"
            } flex items-center pointer-events-none`}
          >
            <span className="text-gray-400 dark:text-gray-500">{icon}</span>
          </div>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...ariaAttributes}
          {...props}
        />

        {(error || success) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {error && (
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {success && (
              <svg
                className="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          id={successId}
          className="mt-1 text-sm text-green-600 dark:text-green-400"
          role="status"
        >
          {success}
        </p>
      )}
    </div>
  );
};

export default Input;
