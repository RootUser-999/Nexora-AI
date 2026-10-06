import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Business, UserRole, Notification } from '../types/index.ts';
import { api } from '../services/api.ts';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'ai-assistant'
  | 'customers'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'invoices'
  | 'tasks'
  | 'analytics'
  | 'reports'
  | 'team'
  | 'audit'
  | 'settings'
  | 'docs';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  activeBusiness: Business | null;
  setActiveBusiness: (biz: Business) => void;
  businesses: Business[];
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationsAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setUserRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  logout: () => void;
  refreshDataTrigger: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(0);

  const triggerRefresh = () => setRefreshDataTrigger(prev => prev + 1);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Initialize session or default business
  useEffect(() => {
    api.businesses.list().then(list => {
      setBusinesses(list);
      if (list.length > 0 && !activeBusiness) {
        setActiveBusiness(list[0]);
      }
    }).catch(console.error);

    // Check existing stored auth
    const savedToken = localStorage.getItem('nexora_token');
    if (savedToken) {
      api.auth.me().then(res => {
        setCurrentUser(res.user);
        setActiveBusiness(res.business);
      }).catch(() => {
        localStorage.removeItem('nexora_token');
      });
    }
  }, []);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load notifications for active business
  const refreshNotifications = async () => {
    if (!activeBusiness) return;
    try {
      const res = await api.notifications.list(activeBusiness.id);
      setNotifications(res.notifications);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (activeBusiness && currentUser) {
      refreshNotifications();
    }
  }, [activeBusiness?.id, currentUser?.id, refreshDataTrigger]);

  const markNotificationsAsRead = async () => {
    if (!activeBusiness) return;
    try {
      await api.notifications.markAllRead(activeBusiness.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setUserRole = (role: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem('nexora_user_role', role);
    }
  };

  const logout = () => {
    localStorage.removeItem('nexora_token');
    localStorage.removeItem('nexora_user_role');
    setCurrentUser(null);
    setActiveBusiness(null);
    setCurrentView('landing');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        activeBusiness,
        setActiveBusiness,
        businesses,
        setBusinesses,
        notifications,
        unreadNotificationsCount,
        markNotificationsAsRead,
        refreshNotifications,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        openAuthModal,
        theme,
        toggleTheme,
        setUserRole,
        logout,
        refreshDataTrigger,
        triggerRefresh,
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
