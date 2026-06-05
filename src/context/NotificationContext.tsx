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
      {/* UI qismi keyingi bosqichda komponentga ko'chiriladi */}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
