import React, { useEffect, useState } from "react";
import { TRANSITIONS, LOADING_ANIMATIONS } from "../../utils/animations";

// Enhanced Progress Bar with smooth animations
const EnhancedProgressBar = ({
  progress = 0,
  max = 100,
  size = "medium",
  color = "blue",
  showPercentage = false,
  animated = true,
  striped = false,
  className = "",
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(percentage);
    }
  }, [percentage, animated]);

  const sizeClasses = {
    small: "h-2",
    medium: "h-3",
    large: "h-4",
    xl: "h-6",
  };

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
    indigo: "bg-indigo-600",
  };

  const stripedPattern = striped
    ? "bg-gradient-to-r from-transparent via-white to-transparent bg-[length:20px_100%] animate-shimmer"
    : "";

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}
      >
        <div
          className={`
            ${colorClasses[color]} ${sizeClasses[size]} rounded-full 
            ${animated ? "transition-all duration-1000 ease-out" : ""} 
            relative overflow-hidden shadow-sm
          `}
          style={{ width: `${animatedProgress}%` }}
        >
          {/* Shimmer effect */}
          <div
            className={`absolute inset-0 ${stripedPattern} opacity-30`}
          ></div>

          {/* Glow effect */}
          <div
            className={`absolute inset-0 ${colorClasses[color]} opacity-50 blur-sm animate-pulse-slow`}
          ></div>
        </div>
      </div>

      {showPercentage && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center font-medium">
          {Math.round(animatedProgress)}%
        </div>
      )}
    </div>
  );
};

// Step Progress Indicator
const StepProgress = ({
  steps = [],
  currentStep = 0,
  color = "blue",
  size = "medium",
  className = "",
}) => {
  const sizeClasses = {
    small: { circle: "w-6 h-6", text: "text-xs", line: "h-0.5" },
    medium: { circle: "w-8 h-8", text: "text-sm", line: "h-1" },
    large: { circle: "w-10 h-10", text: "text-base", line: "h-1.5" },
  };

  const colorClasses = {
    blue: {
      active: "bg-blue-600 text-white border-blue-600",
      completed: "bg-blue-600 text-white border-blue-600",
      pending:
        "bg-gray-200 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600",
      line: "bg-blue-600",
      pendingLine: "bg-gray-300 dark:bg-gray-600",
    },
    green: {
      active: "bg-green-600 text-white border-green-600",
      completed: "bg-green-600 text-white border-green-600",
      pending:
        "bg-gray-200 text-gray-500 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600",
      line: "bg-green-600",
      pendingLine: "bg-gray-300 dark:bg-gray-600",
    },
  };

  const sizes = sizeClasses[size];
  const colors = colorClasses[color];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        let stepClasses = colors.pending;
        if (isCompleted) stepClasses = colors.completed;
        if (isActive) stepClasses = colors.active;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  ${
                    sizes.circle
                  } rounded-full border-2 flex items-center justify-center
                  ${stepClasses} ${TRANSITIONS.DEFAULT}
                  ${isActive ? "animate-pulse scale-110 shadow-lg" : ""}
                  ${isCompleted ? "animate-bounce-in" : ""}
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className={`font-medium ${sizes.text}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`mt-2 ${sizes.text} text-center max-w-20 text-gray-600 dark:text-gray-400`}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 mx-4 ${sizes.line} rounded-full overflow-hidden`}
              >
                <div
                  className={`
                    h-full ${isCompleted ? colors.line : colors.pendingLine}
                    ${TRANSITIONS.DEFAULT}
                    ${isCompleted ? "animate-slide-in-right" : ""}
                  `}
                  style={{
                    width: isCompleted ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Skeleton Loading Animation
const SkeletonLoader = ({ lines = 3, className = "", animated = true }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`
            h-4 bg-gray-200 dark:bg-gray-700 rounded
            ${animated ? "animate-pulse" : ""}
          `}
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${index * 100}ms`,
          }}
        />
      ))}
    </div>
  );
};

export { EnhancedProgressBar, StepProgress, SkeletonLoader };
export default EnhancedProgressBar;
