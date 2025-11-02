import { useState, useEffect } from 'react';

export interface User {
  id: string | number;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface UseAuthReturn<T extends User = User> {
  user: T | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_STORAGE_KEY = 'auth_user';
const TOKEN_STORAGE_KEY = 'auth_token';

export function useAuth<T extends User = User>(): UseAuthReturn<T> {
  const [user, setUser] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
  };
}

export function setAuthUser<T extends User = User>(user: T, token: string): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.dispatchEvent(new Event('storage'));
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.dispatchEvent(new Event('storage'));
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}
