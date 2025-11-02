import { useState, useCallback } from 'react';
export function useMutation(url, options = {}) {
    const { method = 'POST', onSuccess, onError, headers = {} } = options;
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const mutate = useCallback(async (variables) => {
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
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('An error occurred');
            setError(error);
            onError?.(error);
            return undefined;
        }
        finally {
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
