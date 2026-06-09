import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { supabase } from './services/supabase';
import CyberBackground from './components/CyberBackground';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';

type View = 'login' | 'register' | 'reset-password' | 'forgot-password';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading, profile, user, signOut } = useAuth();
  const { notify } = useNotification();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [view, setView] = useState<View>('login');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
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
    <div className={`w-full h-screen flex justify-center ${isAuthenticated && !isRedirecting ? 'items-start' : 'items-center'} ${(showProfileModal || showLogoutConfirm) ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
      <CyberBackground />

      {isAuthenticated && !isRedirecting && (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#0d101b]/60 backdrop-blur-xl border-b border-[#00f0ff]/10 px-8 py-4 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Enhanced Branding Section - Left Aligned */}
          <div className="flex items-center gap-4 group cursor-default">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#00f0ff] to-[#9d4edd] rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative w-11 h-11 bg-[#0d101b] border border-[#00f0ff]/30 rounded-lg flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]">
                <img src="/favicon.svg" alt="Logo" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transform group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-mono font-black tracking-[6px] text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#00f0ff]/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-500">
                CYBERSHADOW
              </span>
              <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-[#00f0ff] to-transparent transition-all duration-700"></div>
            </div>
          </div>

          {/* Profile Section - Right Aligned */}
          <div 
            className="relative outline-none"
            onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
            tabIndex={0}
          >
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-4 border border-[#00f0ff]/25 bg-[#0d101b]/40 group cursor-pointer hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 py-2 px-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.05)]"
            >
              <div className="flex flex-col items-end">
                <span className="text-white font-mono text-sm font-bold tracking-wider group-hover:text-[#00f0ff] transition-colors">
                  {profile?.username || 'GHOST_USER'}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ff66]"></span>
                  </span>
                  <span className="text-[10px] font-mono text-[#00ff66] tracking-[1px] uppercase opacity-90 leading-none">Online</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] to-[#9d4edd] rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative w-10 h-10 rounded-full border-2 border-[#00f0ff]/30 overflow-hidden bg-[#0d101b] flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#00f0ff] font-mono font-bold text-lg drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                      {(profile?.username || 'G').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className={`absolute right-0 mt-2 w-48 bg-[#0d101b]/95 border border-[#00f0ff]/20 rounded-xl shadow-2xl backdrop-blur-md z-50 overflow-hidden origin-top-right transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_30px_rgba(0,240,255,0.15)] ${
              showProfileMenu 
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 scale-90 -translate-y-4 pointer-events-none'
            }`}>
              <div className="p-2 flex flex-col gap-1">
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-white/80 font-mono text-[10px] hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] rounded-lg transition-all text-left uppercase tracking-wider group cursor-pointer"
                >
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </button>
                <div className="h-[1px] bg-[#00f0ff]/10 mx-2 my-1"></div>
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowLogoutConfirm(true);
                  }}
                    className="flex items-center gap-3 px-4 py-2 text-[#ff3366]/80 font-mono text-[10px] hover:bg-[#ff3366]/10 hover:text-[#ff3366] rounded-lg transition-all text-left uppercase tracking-wider group cursor-pointer"
                >
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0d101b]/80 backdrop-blur-sm transition-opacity" 
          />
          <div className="relative bg-[#0d101b] border border-[#ff3366]/30 p-8 rounded-2xl max-w-sm w-full shadow-[0_0_50px_rgba(255,51,102,0.2)] animate-[scaleIn_0.2s_ease-out]">
            {/* Cyberpunk Decorative Corners */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#ff3366]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#ff3366]" />

            <h3 className="text-white font-mono font-bold text-lg mb-2 tracking-wider text-center uppercase">Terminating Session</h3>
            <p className="text-[#64748b] font-mono text-[10px] mb-8 text-center leading-relaxed uppercase tracking-widest">
              Are you sure you want to log out?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-[#64748b]/30 text-[#64748b] rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut()}
                className="flex-1 px-4 py-2.5 bg-[#ff3366]/10 border border-[#ff3366] text-[#ff3366] rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-[#ff3366]/20 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,51_102,0.3)]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
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