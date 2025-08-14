import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PAGE_TRANSITIONS, ENTRY_ANIMATIONS } from "../../utils/animations";

const PageTransition = ({
  children,
  transitionType = "FADE",
  duration = 300,
  className = "",
}) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    // Handle route changes
    if (location.pathname !== currentPath) {
      setIsVisible(false);

      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        setIsVisible(true);
      }, duration / 2);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [location.pathname, currentPath, duration]);

  const transitionClasses = PAGE_TRANSITIONS[transitionType];
  const animationClass = isVisible
    ? transitionClasses.enter
    : transitionClasses.exit;

  return (
    <div
      className={`${animationClass} ${className}`}
      style={{
        animationDuration: `${duration}ms`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
};

// Higher-order component for page transitions
export const withPageTransition = (Component, options = {}) => {
  return function TransitionedComponent(props) {
    return (
      <PageTransition {...options}>
        <Component {...props} />
      </PageTransition>
    );
  };
};

// Staggered children animation component
export const StaggeredContainer = ({
  children,
  staggerDelay = 50,
  className = "",
  animationType = "FADE_IN",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className={isVisible ? ENTRY_ANIMATIONS[animationType] : "opacity-0"}
          style={{
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: "both",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default PageTransition;
