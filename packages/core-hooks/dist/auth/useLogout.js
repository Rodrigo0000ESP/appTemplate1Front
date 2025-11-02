import { useState, useCallback } from 'react';
import { clearAuthUser, getAuthToken } from './useAuth';
export function useLogout(options = {}) {
    const { apiUrl = '/api/v1/auth/logout', onSuccess, onError } = options;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            if (token) {
                // Attempt to notify the server
                try {
                    await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                }
                catch (err) {
                    // Continue with local logout even if server request fails
                    console.warn('Server logout failed, continuing with local logout:', err);
                }
            }
            clearAuthUser();
            onSuccess?.();
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Logout failed');
            setError(error);
            onError?.(error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, [apiUrl, onSuccess, onError]);
    return { logout, isLoading, error };
}
