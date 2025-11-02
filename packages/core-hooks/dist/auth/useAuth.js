import { useState, useEffect } from 'react';
const AUTH_STORAGE_KEY = 'auth_user';
const TOKEN_STORAGE_KEY = 'auth_token';
export function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
            }
        }
        catch (error) {
            console.error('Error loading auth state:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return {
        user,
        isAuthenticated: user !== null,
        isLoading,
    };
}
export function setAuthUser(user, token) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    window.dispatchEvent(new Event('storage'));
}
export function clearAuthUser() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
}
export function getAuthToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}
