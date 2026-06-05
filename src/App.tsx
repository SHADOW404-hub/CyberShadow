import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import CyberBackground from './components/CyberBackground';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';

type View = 'login' | 'register' | 'reset-password' | 'forgot-password';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [view, setView] = useState<View>('login');

  React.useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setView('reset-password');
    }
  }, []);

  if (loading) return null;

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <CyberBackground />
      
      <div className={isAuthenticated ? "w-full max-w-[900px] z-10 p-5" : "w-full max-w-[450px] z-10 p-5"}>
        {view === 'reset-password' ? (
          <ResetPassword />
        ) : view === 'forgot-password' ? (
          <ForgotPassword onSwitch={() => setView('login')} />
        ) : !isAuthenticated ? (
          view === 'login' ? (
            <LoginForm
              onSwitch={() => setView('register')}
              onForgotPassword={() => setView('forgot-password')}
            />
          ) : (
            <RegisterForm onSwitch={() => setView('login')} />
          )
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <NotificationProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </NotificationProvider>
);

export default App;