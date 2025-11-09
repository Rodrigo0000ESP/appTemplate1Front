/**
 * Login Form Component
 */

import { useState } from 'react';
import Input from '@rdm-org-dev/core-ui-input';
import Button from '@rdm-org-dev/core-ui-button';
import Alert from '@rdm-org-dev/core-ui-alert';
import { userFacade } from '../../facades/user.facade';
import type { LoginRequest } from '../../../../packages/core-api/src/types/auth';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export function LoginForm({ onSuccess, onRegisterClick, onForgotPasswordClick }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setWarning(null);
    setInfo(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await userFacade.login(formData);
      
      // Handle detail field based on type
      if (response.detail) {
        switch (response.detail.type) {
          case 'success':
            setSuccess(response.detail.message);
            break;
          case 'info':
            setInfo(response.detail.message);
            break;
          case 'warning':
            setWarning(response.detail.message);
            break;
          case 'error':
            setError(response.detail.message);
            break;
          default:
            setInfo(response.detail.message);
        }
      }
      
      onSuccess?.();
    } catch (err: any) {
      // Handle error with detail structure
      if (err.detail && typeof err.detail === 'object') {
        switch (err.detail.type) {
          case 'error':
            setError(err.detail.message);
            break;
          case 'warning':
            setWarning(err.detail.message);
            break;
          case 'info':
            setInfo(err.detail.message);
            break;
          case 'success':
            setSuccess(err.detail.message);
            onSuccess?.();
            break;
          default:
            setError(err.detail.message);
        }
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              type="button"
              onClick={onRegisterClick}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {success && (
            <Alert status="success">
              {success}
            </Alert>
          )}
          {error && (
            <Alert status="error">
              {error}
            </Alert>
          )}
          {warning && (
            <Alert status="warning">
              {warning}
            </Alert>
          )}
          {info && (
            <Alert status="info">
              {info}
            </Alert>
          )}

          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                isRequired
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                isDisabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                isRequired
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                isDisabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
