import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppNotification } from '../types';

interface NotificationContextType {
  notify: (message: string, type?: AppNotification['type']) => void;
  notifications: AppNotification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const notify = useCallback((message: string, type: AppNotification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNote: AppNotification = { id, message, type };

    // Navbatga qo'shish (Queue logic)
    setNotifications((prev) => [...prev, newNote]);

    // Avtomatik o'chirish (Original koddagi setTimeout kabi)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, notifications }}>
      {children}
      
      {/* Notifications Overlay */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-x-0 animate-slide-in flex items-start gap-3 ${
              n.type === 'success'
                ? 'bg-[#00ff66]/10 border-[#00ff66]/30 text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                : n.type === 'error'
                ? 'bg-[#ff3366]/10 border-[#ff3366]/30 text-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.15)]'
                : 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]'
            }`}
          >
            {/* Icon */}
            <div className="mt-0.5 shrink-0">
              {n.type === 'success' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {n.type === 'error' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {n.type !== 'success' && n.type !== 'error' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-xs font-mono font-bold tracking-[0.5px] uppercase">
                {n.type === 'success' ? 'SYSTEM_SUCCESS' : n.type === 'error' ? 'SYSTEM_ERROR' : 'SYSTEM_INFO'}
              </p>
              <p className="text-xs font-mono mt-1 text-white/95 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
