import { useState, useCallback } from 'react';
import { User, setAuthUser } from './useAuth';

export interface LoginCredentials {
  email: string;
  password: string;
  [key: string]: any;
}

export interface LoginResponse<T extends User = User> {
  user: T;
  token: string;
  [key: string]: any;
}

export interface UseLoginOptions<T extends User = User> {
  apiUrl?: string;
  onSuccess?: (user: T, token: string) => void;
  onError?: (error: Error) => void;
}

export interface UseLoginReturn<T extends User = User> {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  // T is used in the login function's internal typing
  _user?: T;
}

export function useLogin<T extends User = User>(
  options: UseLoginOptions<T> = {}
): UseLoginReturn<T> {
  const { apiUrl = '/api/v1/auth/login', onSuccess, onError } = options;
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
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

      const data: LoginResponse<T> = await response.json();
      
      setAuthUser(data.user, data.token);
      onSuccess?.(data.user, data.token);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, onSuccess, onError]);

  return { login, isLoading, error };
}
