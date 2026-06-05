import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import CyberBackground from './components/CyberBackground';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';

type View = 'login' | 'register' | 'reset-password' | 'forgot-password';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { notifications } = useNotification();
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

      {/* Notifications */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2.5 z-[9999]">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`py-3 px-6 rounded-lg font-mono font-bold text-sm shadow-[0_0_20px] transition-all duration-300 ${
              n.type === 'error'
                ? 'bg-[#ff3366]/90 text-white shadow-[#ff3366]/40'
                : n.type === 'success'
                ? 'bg-[#00ff66]/90 text-black shadow-[#00ff66]/40'
                : 'bg-[#00f0ff]/90 text-black shadow-[#00f0ff]/40'
            }`}
          >
            {n.message}
          </div>
        ))}
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