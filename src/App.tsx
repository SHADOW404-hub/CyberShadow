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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const prevAuth = React.useRef(isAuthenticated);

  React.useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setView('reset-password');
    }
  }, []);

  React.useEffect(() => {
    if (!prevAuth.current && isAuthenticated) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        setIsRedirecting(false);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setIsRedirecting(false);
    }
    prevAuth.current = isAuthenticated;
  }, [isAuthenticated]);

  if (loading) return null;

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <CyberBackground />
      
      <div className={isAuthenticated && !isRedirecting ? "w-full max-w-[900px] z-10 p-5" : "w-full max-w-[450px] z-10 p-5"}>
        {isRedirecting ? (
          <div className="bg-[#0d101b]/95 p-10 rounded-2xl border border-[#00ff66]/30 w-full backdrop-blur-md flex flex-col items-center justify-center min-h-[350px] shadow-[0_0_30px_rgba(0,255,102,0.15)] animate-[pulse_2s_infinite]">
            {/* Animated Checkmark with Neon Pulse */}
            <div className="w-20 h-20 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.2)] mb-8 animate-bounce">
              <svg className="w-10 h-10 text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-[#00ff66] tracking-[6px] text-2xl font-bold font-mono text-center mb-3 drop-shadow-[0_0_12px_rgba(0,255,102,0.6)]">
              WELCOME BACK
            </h2>

            <p className="text-[#64748b] text-xs font-mono tracking-[2px] text-center flex items-center gap-2">
              <span>Redirecting to dashboard</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-full animate-bounce delay-200"></span>
                <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-full animate-bounce delay-300"></span>
              </span>
            </p>

            {/* Loading Bar */}
            <div className="w-full max-w-[200px] h-1 bg-[#1e293b] rounded-full overflow-hidden mt-6 border border-[#00ff66]/10 relative">
              <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-[#00ff66] to-[#00f0ff] animate-progress-move rounded-full"></div>
            </div>
          </div>
        ) : view === 'reset-password' ? (
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