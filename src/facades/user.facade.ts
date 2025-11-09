/**
 * User Facade
 * Aggregates multiple services and adds business logic
 */

import { userAuthService } from '../services/user.apiService';
import type { LoginRequest, RegisterRequest, UserResponse } from '../../../packages/core-api/src/types/auth';
import type { ApiResponse, EmptyResponse } from '../utils';
import { TokenManager } from '../../../packages/core-api/src/utils';

export class UserFacade {
  /**
   * Login user and return user data
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<{ 
    user: UserResponse; 
    token: string;
  }>> {
    // Login via service
    const tokenResponse = await userAuthService.login(credentials);
    if(tokenResponse.access_token) {
      TokenManager.setToken(tokenResponse.access_token);
    }
    // Get user data
    const user = await userAuthService.getCurrentUser();
    return {
      user,
      token: tokenResponse.access_token,
      detail: tokenResponse.detail
    };
  }

  /**
   * Register user and return user data
   * Note: Does not authenticate user - email verification required first
   */
  async register(data: RegisterRequest): Promise<ApiResponse<EmptyResponse>> {
    // Register via service
    const response = await userAuthService.register(data);
    return {
      detail: response.detail
    };
  }

  /**
   * Logout user
   */
  logout(): void {
    userAuthService.logout();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return userAuthService.isAuthenticated();
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<UserResponse> {
    return await userAuthService.getCurrentUser();
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    return await userAuthService.verifyEmail(token);
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ message: string }> {
    return await userAuthService.resendVerification(email);
  }

  /**
   * Refresh token
   */
  async refreshToken() {
    return await userAuthService.refreshToken();
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<ApiResponse<EmptyResponse>> {
    return await userAuthService.sendPasswordResetEmail(email);
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<EmptyResponse>> {
    return await userAuthService.resetPassword(token, newPassword);
  }
}

// Export singleton
export const userFacade = new UserFacade();
