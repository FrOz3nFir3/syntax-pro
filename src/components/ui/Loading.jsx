import React from "react";
import { LOADING_ANIMATIONS, TRANSITIONS } from "../../utils/animations";

// Basic Loading Spinner
const LoadingSpinner = ({
  size = "medium",
  color = "blue",
  className = "",
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const colorClasses = {
    blue: "text-blue-600",
    gray: "text-gray-600",
    white: "text-white",
    green: "text-green-600",
    red: "text-red-600",
  };

  return (
    <div className="relative">
      <svg
        className={`${LOADING_ANIMATIONS.SPIN} ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {/* Glow effect */}
      <div
        className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]} opacity-20 blur-sm ${LOADING_ANIMATIONS.PULSE_SLOW}`}
      ></div>
    </div>
  );
};

// Loading with text
const Loading = ({
  text = "Loading...",
  size = "medium",
  color = "blue",
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <LoadingSpinner size={size} color={color} />
      <span className="text-gray-600">{text}</span>
    </div>
  );
};

// Progress Bar component
const ProgressBar = ({
  progress = 0,
  max = 100,
  size = "medium",
  color = "blue",
  showPercentage = false,
  className = "",
}) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

  const sizeClasses = {
    small: "h-2",
    medium: "h-3",
    large: "h-4",
  };

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full ${TRANSITIONS.DEFAULT} relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer bg-[length:200%_100%]"></div>
        </div>
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 mt-1 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

// Circular Progress component
const CircularProgress = ({
  progress = 0,
  max = 100,
  size = "medium",
  color = "blue",
  showPercentage = false,
  strokeWidth = 4,
  className = "",
}) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

  const sizeClasses = {
    small: "h-12 w-12",
    medium: "h-16 w-16",
    large: "h-24 w-24",
  };

  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
  };

  const radius = 50 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClasses[color]} transition-all duration-300 ease-out`}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Full page loading overlay
const LoadingOverlay = ({ text = "Loading...", className = "" }) => {
  return (
    <div
      className={`fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in ${className}`}
    >
      <div className="text-center animate-scale-in">
        <div className="relative">
          <LoadingSpinner size="large" />
          {/* Pulsing background */}
          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-pulse-slow scale-150"></div>
        </div>
        <p
          className="mt-4 text-gray-600 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export {
  LoadingSpinner,
  Loading,
  ProgressBar,
  CircularProgress,
  LoadingOverlay,
};

export default Loading;
