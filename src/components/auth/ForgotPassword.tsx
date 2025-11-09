/**
 * Forgot Password Component
 * Allows users to request a password reset email
 */

import { useState } from 'react';
import Input from '@rdm-org-dev/core-ui-input';
import Button from '@rdm-org-dev/core-ui-button';
import Alert from '@rdm-org-dev/core-ui-alert';
import { userFacade } from '../../facades/user.facade';

interface ForgotPasswordProps {
  onBackToLogin?: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await userFacade.sendPasswordResetEmail(email);
      setSuccess(response.detail?.message || 'Password reset email sent successfully. Please check your inbox.');
      setEmail(''); // Clear form on success
    } catch (err: any) {
      setError(err.detail?.message || err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
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

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              isRequired
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              isDisabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
