import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseFetchOptions<T> {
  staleTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export interface UseFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const cache = new Map<string, { data: any; timestamp: number }>();

export function useFetch<T = any>(
  url: string | null,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { staleTime = 0, onSuccess, onError, enabled = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    // Check cache
    if (staleTime > 0) {
      const cached = cache.get(url);
      if (cached && Date.now() - cached.timestamp < staleTime) {
        setData(cached.data);
        onSuccess?.(cached.data);
        return;
      }
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Update cache
      if (staleTime > 0) {
        cache.set(url, { data: result, timestamp: Date.now() });
      }

      setData(result);
      onSuccess?.(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled, staleTime, onSuccess, onError]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
