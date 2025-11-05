import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

type Notification = {
  id: string;
  type: ToastType;
  message: string;
};

interface NotificationContextType {
  notify: (type: ToastType, message: string, ttl?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [list, setList] = useState<Notification[]>([]);

  const notify = useCallback((type: ToastType, message: string, ttl = 4000) => {
    const id = `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const n: Notification = { id, message, type };
    setList(prev => [n, ...prev]);
    if (ttl > 0) {
      setTimeout(() => setList(prev => prev.filter(x => x.id !== id)), ttl);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div style={{ position: 'fixed', right: 16, top: 16, zIndex: 9999 }}>
        {list.map(n => (
          <div key={n.id} style={{ marginBottom: 8, minWidth: 220, padding: '10px 12px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', background: n.type === 'error' ? '#fee2e2' : n.type === 'success' ? '#ecfdf5' : '#f0f9ff', color: '#0f172a' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{n.type.toUpperCase()}</div>
            <div style={{ fontSize: 13 }}>{n.message}</div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export default NotificationContext;
