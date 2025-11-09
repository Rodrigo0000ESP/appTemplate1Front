/**
 * Register Form Component
 */

import { useState } from 'react';
import Input from '@rdm-org-dev/core-ui-input';
import Button from '@rdm-org-dev/core-ui-button';
import Alert from '@rdm-org-dev/core-ui-alert';
import { userFacade } from '../../facades/user.facade';
import type { RegisterRequest } from '../../../../packages/core-api/src/types/auth';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
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

    // Validate passwords match
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userFacade.register(formData);
      
      // Handle detail field based on type
      if (response.detail) {
        switch (response.detail.type) {
          case 'success':
            setSuccess(response.detail.message);
            setFormData({ username: '', email: '', password: '' });
            setConfirmPassword('');
            onSuccess?.();
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
    } catch (err: any) {
      // Handle error with detail structure
      if (err.detail && typeof err.detail === 'object') {
        switch (err.detail.type) {
          case 'success':
            setSuccess(err.detail.message);
            break;
          case 'info':
            setInfo(err.detail.message);
            break;
          case 'error':
            setError(err.detail.message);
            break;
          case 'warning':
            setWarning(err.detail.message);
            break;
          default:
            setError(err.detail.message);
        }
      } else {
        setError(err.message || 'Registration failed. Please try again.');
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
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
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                isRequired
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                isDisabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                isRequired
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
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
                placeholder="At least 8 characters"
                isDisabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                isRequired
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                isDisabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </a>
            </label>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
