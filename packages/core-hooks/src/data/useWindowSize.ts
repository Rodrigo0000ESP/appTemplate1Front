import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface UseWindowSizeOptions {
  debounceDelay?: number;
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface UseWindowSizeReturn {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
}

const DEFAULT_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
};

export function useWindowSize(
  options: UseWindowSizeOptions = {}
): UseWindowSizeReturn {
  const { debounceDelay = 150, breakpoints = DEFAULT_BREAKPOINTS } = options;

  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceDelay);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceDelay]);

  const getBreakpoint = (width: number): Breakpoint => {
    if (width < breakpoints.mobile) return 'mobile';
    if (width < breakpoints.tablet) return 'tablet';
    if (width < breakpoints.desktop) return 'desktop';
    return 'wide';
  };

  const breakpoint = getBreakpoint(windowSize.width);

  return {
    width: windowSize.width,
    height: windowSize.height,
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isWide: breakpoint === 'wide',
  };
}
