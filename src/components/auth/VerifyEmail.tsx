import { useEffect, useState } from 'react';
import Button from '@rdm-org-dev/core-ui-button';
import Card from '@rdm-org-dev/core-ui-card';
import Alert from '@rdm-org-dev/core-ui-alert';
import Spinner from '@rdm-org-dev/core-ui-spinner';
import Input from '@rdm-org-dev/core-ui-input';
import { userFacade } from '../../facades/user.facade';
import { apiClient } from '../../../../packages/core-api/src';

type VerificationState = 'loading' | 'success' | 'error' | 'resend';

export default function VerifyEmail() {
  const [state, setState] = useState<VerificationState>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Configure API base URL from environment variable
    const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';
    apiClient.setBaseUrl(apiUrl);
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';
    
    if (!token) {
      setMessage('No verification token provided. Please check your email for the verification link.');
      setState('error');
      return;
    }
    
    verifyEmailToken(token);
  }, []);

  const verifyEmailToken = async (tokenToVerify: string) => {
    try {
      setState('loading');
      const response = await userFacade.verifyEmail(tokenToVerify);
      setMessage(response.message || 'Email verified successfully!');
      setState('success');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail || 
        'The verification token is invalid or has expired.'
      );
      setState('error');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    try {
      setIsResending(true);
      const response = await userFacade.resendVerification(email);
      setMessage(response.message || 'Verification email sent. Check your inbox.');
      setState('success');
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail || 
        'Error resending verification email.'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              {state === 'loading' && (
                <Spinner className="w-8 h-8 text-white" />
              )}
              {state === 'success' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {(state === 'error' || state === 'resend') && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Verification
            </h1>
            <p className="text-gray-600">
              {state === 'loading' && 'Verifying your email...'}
              {state === 'success' && 'Verification complete!'}
              {state === 'error' && 'Verification error'}
              {state === 'resend' && 'Resend verification'}
            </p>
          </div>

          {/* Loading State */}
          {state === 'loading' && (
            <div className="text-center py-8">
              <Spinner className="mx-auto mb-4" size="lg" />
              <p className="text-gray-600">
                We're verifying your email, please wait...
              </p>
            </div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <div className="space-y-4">
              <Alert status="success" variant="subtle" className="mb-4">
                {message}
              </Alert>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm text-center">
                  You will be redirected to login in a few seconds...
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="w-full"
                variant="solid"
                colorScheme="blue"
              >
                Go to login
              </Button>
            </div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <div className="space-y-4">
              <Alert status="error" variant="subtle" className="mb-4">
                {message}
              </Alert>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="text-gray-700 text-sm font-medium">
                  Need a new verification link?
                </p>
                <p className="text-gray-600 text-xs">
                  Enter your email and we'll send you a new verification link.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full"
                  isDisabled={isResending}
                />
                <Button
                  onClick={handleResendVerification}
                  isDisabled={isResending || !email}
                  className="w-full"
                  variant="solid"
                  colorScheme="blue"
                >
                  {isResending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Resend verification email'
                  )}
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={() => window.location.href = '/login'}
                  variant="outline"
                  className="w-full"
                >
                  Back to login
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-gray-500 text-sm">
          Need help? <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">Contact support</a>
        </p>
      </div>
    </div>
  );
}
