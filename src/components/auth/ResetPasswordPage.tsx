/**
 * Reset Password Page Wrapper
 * Wraps ResetPassword component with ChakraProvider
 */

import { ChakraProvider } from '../chakra-Provider/ChakraProvider';
import { ResetPassword } from './ResetPassword';

export function ResetPasswordPage() {
  return (
    <ChakraProvider>
      <ResetPassword
        onSuccess={() => window.location.href = '/'}
        onBackToLogin={() => window.location.href = '/'}
      />
    </ChakraProvider>
  );
}

export default ResetPasswordPage;
