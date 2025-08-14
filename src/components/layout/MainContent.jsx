import React from "react";

const MainContent = ({
  children,
  className = "",
  containerSize = "default",
  noPadding = false,
}) => {
  const sizeClasses = {
    sm: "max-w-2xl",
    default: "max-w-7xl",
    lg: "max-w-screen-2xl",
    full: "max-w-none",
  };

  return (
    <main className={`flex-1 min-w-0 ${className}`} role="main">
      <div
        className={`
          container mx-auto 
          ${sizeClasses[containerSize]} 
          ${noPadding ? "" : "px-4 sm:px-6 lg:px-8 py-6"}
        `}
      >
        {children}
      </div>
    </main>
  );
};

export default MainContent;
