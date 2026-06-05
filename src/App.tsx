import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import CyberBackground from './components/CyberBackground';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';

/**
 * Ilova kontenti - bu yerda biz auth holatiga qarab nima ko'rsatishni hal qilamiz.
 */
const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { notifications } = useNotification();
  const [view, setView] = useState<'login' | 'register' | 'reset-password'>('login');

  // Parolni tiklash rejimini aniqlash (Hash orqali yoki Supabase event)
  React.useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setView('reset-password');
    }
  }, []);

  if (loading) return null; // Yuklanayotgan vaqtda bo'sh ekran (yoki loader)

  return (
    <div style={styles.appWrapper}>
      <CyberBackground />
      
      <div style={styles.mainContainer}>
        {view === 'reset-password' ? (
          <ResetPassword />
        ) : !isAuthenticated ? (
          view === 'login' ? (
            <LoginForm onSwitch={() => setView('register')} />
          ) : (
            <RegisterForm onSwitch={() => setView('login')} />
          )
        ) : (
          <Dashboard />
        )}
      </div>

      {/* Global Bildirishnomalar UI */}
      <div style={styles.notificationStack}>
        {notifications.map((n) => (
          <div 
            key={n.id} 
            style={{
              ...styles.note,
              backgroundColor: n.type === 'error' ? 'rgba(255, 51, 102, 0.9)' : 
                               n.type === 'success' ? 'rgba(0, 255, 102, 0.9)' : 
                               'rgba(0, 240, 255, 0.9)',
              boxShadow: n.type === 'error' ? '0 0 20px rgba(255,51,102,0.4)' : '0 0 20px rgba(0,240,255,0.4)'
            }}
          >
            {n.message.toUpperCase()}
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

const styles: Record<string, React.CSSProperties> = {
  appWrapper: { width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  mainContainer: { width: '100%', maxWidth: '450px', zIndex: 10, padding: '20px' },
  notificationStack: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 9999 },
  note: { padding: '12px 25px', borderRadius: '8px', background: 'rgba(0, 240, 255, 0.9)', color: '#000', fontFamily: 'monospace', fontWeight: 'bold', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }
};

export default App;