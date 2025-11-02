import { useState, useEffect, useCallback, useRef } from 'react';
const cache = new Map();
export function useFetch(url, options = {}) {
    const { staleTime = 0, onSuccess, onError, enabled = true } = options;
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const fetchData = useCallback(async () => {
        if (!url || !enabled)
            return;
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
        }
        catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }
            const error = err instanceof Error ? err : new Error('An error occurred');
            setError(error);
            onError?.(error);
        }
        finally {
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
