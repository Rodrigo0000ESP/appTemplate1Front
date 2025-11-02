import { useState, useCallback } from 'react';
import { setAuthUser } from './useAuth';
export function useLogin(options = {}) {
    const { apiUrl = '/api/v1/auth/login', onSuccess, onError } = options;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const login = useCallback(async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Login failed: ${response.status}`);
            }
            const data = await response.json();
            setAuthUser(data.user, data.token);
            onSuccess?.(data.user, data.token);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Login failed');
            setError(error);
            onError?.(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, [apiUrl, onSuccess, onError]);
    return { login, isLoading, error };
}
