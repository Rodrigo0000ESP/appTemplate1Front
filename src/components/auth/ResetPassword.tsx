/**
 * Reset Password Component
 * Allows users to set a new password using a reset token
 */

import { useState, useEffect } from 'react';
import Input from '@rdm-org-dev/core-ui-input';
import Button from '@rdm-org-dev/core-ui-button';
import Alert from '@rdm-org-dev/core-ui-alert';
import { userFacade } from '../../facades/user.facade';

interface ResetPasswordProps {
  token?: string;
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export function ResetPassword({ token: initialToken, onSuccess, onBackToLogin }: ResetPasswordProps) {
  const [token, setToken] = useState(initialToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Extract token from URL if not provided as prop
    if (!initialToken) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        setToken(urlToken);
      } else {
        setError('No reset token provided. Please use the link from your email.');
      }
    }
  }, [initialToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setWarning(null);
    setInfo(null);
    setSuccess(null);

    // Validation
    if (!token) {
      setError('No reset token provided. Please use the link from your email.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userFacade.resetPassword(token, newPassword);
      
      // Handle detail field based on type
      if (response.detail) {
        switch (response.detail.type) {
          case 'success':
            setSuccess(response.detail.message);
            setNewPassword('');
            setConfirmPassword('');
            // Redirect to login after 3 seconds
            setTimeout(() => {
              onSuccess?.();
            }, 3000);
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
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
              onSuccess?.();
            }, 3000);
            break;
          default:
            setError(err.detail.message);
        }
      } else {
        setError(err.message || 'Failed to reset password. The link may have expired.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to login
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
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                isRequired
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                isDisabled={isLoading || !token}
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
                isDisabled={isLoading || !token}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !token}
            >
              {isLoading ? 'Resetting password...' : 'Reset password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
