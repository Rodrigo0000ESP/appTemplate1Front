/**
 * Main App Component
 * Handles routing between Login, Register, and Home views
 */

import { useState } from 'react';
import Button from '@rdm-org-dev/core-ui-button';
import Card from '@rdm-org-dev/core-ui-card';
import { ChakraProvider } from './chakra-Provider/ChakraProvider';
import { Header } from './feature-header/header';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';
import { ForgotPassword } from './auth/ForgotPassword';

type View = 'home' | 'login' | 'register' | 'forgot-password';

export function App() {
  const [view, setView] = useState<View>('home');

  const handleLoginSuccess = () => {
    setView('home');
    // Force reload to update header with user data
    setTimeout(() => window.location.reload(), 100);
  };

  const handleRegisterSuccess = () => {
    setView('home');
    // Force reload to update header with user data
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <ChakraProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onLoginClick={() => setView('login')}
          onRegisterClick={() => setView('register')}
        />

        {view === 'home' && (
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Card className="text-center p-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to R Firm
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A professional SaaS platform built with modern architecture
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setView('login')}
                  colorScheme="blue"
                  size="lg"
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => setView('register')}
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                >
                  Sign Up
                </Button>
              </div>
            </Card>
          </div>
        )}

        {view === 'login' && (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onRegisterClick={() => setView('register')}
            onForgotPasswordClick={() => setView('forgot-password')}
          />
        )}

        {view === 'register' && (
          <RegisterForm
            onLoginClick={() => setView('login')}
          />
        )}

        {view === 'forgot-password' && (
          <ForgotPassword
            onBackToLogin={() => setView('login')}
          />
        )}
      </div>
    </ChakraProvider>
  );
}
