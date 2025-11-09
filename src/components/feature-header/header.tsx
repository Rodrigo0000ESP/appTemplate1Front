/**
 * Header Component
 * Navigation header with authentication state
 */

import { useState, useEffect } from 'react';
import Button from '@rdm-org-dev/core-ui-button';
import { userFacade } from '../../facades/user.facade';
import type { UserResponse } from '../../../../packages/core-api/src/types/auth';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (userFacade.isAuthenticated()) {
        try {
          const currentUser = await userFacade.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to load user:', error);
          userFacade.logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    userFacade.logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">R Firm</h1>
            <div className="animate-pulse h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">R Firm</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </a>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onLoginClick} variant="outline">
                  Login
                </Button>
                <Button onClick={onRegisterClick}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
