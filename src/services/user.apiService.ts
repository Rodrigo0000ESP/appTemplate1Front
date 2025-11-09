/**
 * User Authentication Service
 * Uses @rdm-org-dev/core-api for all API calls
 * This is a facade/wrapper for your app-specific logic
 */

import { AuthService } from '../../../packages/core-api/src/services';
import { apiClient } from '../../../packages/core-api/src';
import { 
  type LoginRequest, 
  type RegisterRequest,
  type PasswordResetRequest,
  type PasswordResetConfirm
} from '../../../packages/core-api/src/types/auth';

const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';
apiClient.setBaseUrl(apiUrl);

export class UserAuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest){
    return await AuthService.login(credentials);
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest) {
    return await AuthService.register(data);
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    return await AuthService.getCurrentUser();
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string) {
    return await AuthService.verifyEmail(token);
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string) {
    return await AuthService.resendVerification(email);
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    return await AuthService.refreshToken();
  }

  /**
   * Logout user
   */
  logout() {
    AuthService.logout();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return AuthService.isAuthenticated();
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string) {
    return await AuthService.sendPasswordResetEmail({ email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    return await AuthService.resetPassword({ 
      token, 
      new_password: newPassword 
    });
  }
}

// Export singleton instance
export const userAuthService = new UserAuthService();