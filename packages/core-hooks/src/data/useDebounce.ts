import { useState, useEffect } from 'react';

export interface UseDebounceOptions {
  delay?: number;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  isDebouncing: boolean;
}

export function useDebounce<T>(
  value: T,
  options: UseDebounceOptions = {}
): UseDebounceReturn<T> {
  const { delay = 300 } = options;
  
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    setIsDebouncing(true);
    
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
}
