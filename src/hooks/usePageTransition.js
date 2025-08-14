import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const usePageTransition = (duration = 300) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, duration / 2);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation, duration]);

  return { isTransitioning, displayLocation };
};

export const useStaggeredAnimation = (itemCount, delay = 50) => {
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    if (itemCount === 0) return;

    const timers = [];

    for (let i = 0; i <= itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(i);
      }, i * delay);
      timers.push(timer);
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [itemCount, delay]);

  return visibleItems;
};

export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(elementRef);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold]);

  return [setElementRef, isVisible];
};

export default usePageTransition;
