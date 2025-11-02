import { useState, useCallback } from 'react';

export type HttpMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface UseMutationOptions<T, V = any> {
  method?: HttpMethod;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  headers?: Record<string, string>;
  // V is used in UseMutationReturn.mutate signature
  _variables?: V;
}

export interface UseMutationReturn<T, V> {
  mutate: (variables: V) => Promise<T | undefined>;
  isLoading: boolean;
  error: Error | null;
  data: T | null;
  reset: () => void;
}

export function useMutation<T = any, V = any>(
  url: string,
  options: UseMutationOptions<T, V> = {}
): UseMutationReturn<T, V> {
  const { method = 'POST', onSuccess, onError, headers = {} } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: V): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      onError?.(error);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [url, method, headers, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { mutate, isLoading, error, data, reset };
}
