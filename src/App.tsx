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
  const { isAuthenticated, loading, profile } = useAuth();
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
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsRedirecting(false);
    }
    prevAuth.current = isAuthenticated;
  }, [isAuthenticated]);

  if (loading) return null;

  return (
    <div className={`w-screen h-screen flex justify-center ${isAuthenticated && !isRedirecting ? 'items-start' : 'items-center'} overflow-auto`}>
      <CyberBackground />

      {isAuthenticated && !isRedirecting && (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#0d101b]/60 backdrop-blur-xl border-b border-[#00f0ff]/10 px-8 py-5 flex justify-center items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Ultra-Focused Branding Section */}
          <div className="flex items-center gap-5 group cursor-default scale-110">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-[#00f0ff] to-[#9d4edd] rounded-full blur-md opacity-20 group-hover:opacity-50 transition duration-700"></div>
              <div className="relative w-12 h-12 bg-[#0d101b] border border-[#00f0ff]/40 rounded-xl flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,240,255,0.2)]">
                <img src="/favicon.svg" alt="Logo" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(0,240,255,0.9)] transform group-hover:rotate-[360deg] transition-transform duration-1000" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-3 h-[1px] bg-[#00f0ff] shadow-[0_0_5px_#00f0ff]"></span>
                <span className="text-[10px] font-mono text-[#00f0ff] tracking-[4px] leading-none opacity-80 uppercase font-bold">Mainframe_Access</span>
              </div>
              <span className="text-white font-mono font-black tracking-[8px] text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#00f0ff]/60 drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                CYBERSHADOW
              </span>
            </div>
          </div>
        </nav>
      )}
      
      <div className={isAuthenticated && !isRedirecting ? "w-full max-w-[900px] z-10 p-5 pt-24" : "w-full max-w-[450px] z-10 p-5"}>
        {isRedirecting ? (
          <div className="bg-[#0d101b]/95 p-10 rounded-2xl border border-[#00ff66]/30 w-full backdrop-blur-md flex flex-col items-center justify-center min-h-[350px] shadow-[0_0_30px_rgba(0,255,102,0.15)] animate-[pulse_2s_infinite]">
            {/* Animated Checkmark with Neon Pulse */}
            <div className="w-20 h-20 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.2)] mb-8 animate-bounce">
              <svg className="w-10 h-10 text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-[#00ff66] tracking-[6px] text-2xl font-bold font-mono text-center mb-3 drop-shadow-[0_0_12px_rgba(0,255,102,0.6)]">
              WELCOME
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