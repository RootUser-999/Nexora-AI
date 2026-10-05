import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Package,
  Boxes,
  ShoppingCart,
  FileText,
  CheckSquare,
  BarChart3,
  FileSpreadsheet,
  ShieldCheck,
  History,
  Settings,
  Code2,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Building2,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useApp, AppView } from '../context/AppContext.tsx';
import { UserRole } from '../types/index.ts';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const {
    currentView,
    setCurrentView,
    currentUser,
    activeBusiness,
    setActiveBusiness,
    businesses,
    notifications,
    unreadNotificationsCount,
    markNotificationsAsRead,
    setIsCommandPaletteOpen,
    theme,
    toggleTheme,
    setUserRole,
    logout,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navItems: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'team', label: 'Team & Roles', icon: ShieldCheck },
    { id: 'audit', label: 'Audit Log', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'docs', label: 'API Docs', icon: Code2 },
  ];

  const roles: UserRole[] = ['owner', 'manager', 'accountant', 'employee'];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 z-30">
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 font-bold tracking-tight text-white text-base"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white shadow-sm">
            N
          </div>
          <span>NEXORA<span className="text-indigo-400 font-mono text-xs ml-1">AI</span></span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-200"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 ${
          theme === 'dark' ? 'bg-slate-900/95 border-r border-slate-800' : 'bg-white border-r border-slate-200'
        } backdrop-blur-md flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('landing');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 font-bold tracking-tight group text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
              N
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                NEXORA
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-normal">Business Management</div>
            </div>
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="p-3 border-b border-slate-800/50">
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-colors text-xs text-left"
            >
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">{activeBusiness?.name || 'Nexora Labs'}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{activeBusiness?.currencySymbol} {activeBusiness?.currency} · Net 30</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {isWorkspaceDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in duration-100">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                  Workspaces
                </div>
                {businesses.map((biz) => (
                  <button
                    key={biz.id}
                    onClick={() => {
                      setActiveBusiness(biz);
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-800/70 text-slate-200 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{biz.name}</div>
                      <div className="text-[10px] text-slate-400">{biz.industry}</div>
                    </div>
                    {biz.id === activeBusiness?.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
            Core Platform
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-indigo-300 shrink-0">
                {currentUser?.name?.charAt(0) || 'S'}
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-slate-200 truncate">{currentUser?.name || 'Sarah Jenkins'}</div>
                <div className="text-[10px] text-slate-400 capitalize">{currentUser?.role || 'owner'}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800/60"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className={`h-14 border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white/90'} backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-20`}>
          {/* Search Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search anything across Nexora...</span>
              <span className="sm:hidden">Search...</span>
              <kbd className="hidden sm:inline ml-4 px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* Quick RBAC Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Simulate Role Based Access Control"
              >
                <span className="text-slate-500 font-mono text-[10px]">Role:</span>
                <span className="capitalize font-semibold text-indigo-400">{currentUser?.role || 'owner'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-40 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Simulate RBAC Role
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left text-slate-300 hover:bg-slate-800 capitalize"
                    >
                      <span>{r}</span>
                      {currentUser?.role === r && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">Notifications ({notifications.length})</span>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markNotificationsAsRead}
                        className="text-[11px] text-indigo-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3 text-xs hover:bg-slate-800/40 transition-colors">
                        <div className="flex items-center gap-1.5 font-medium text-slate-200">
                          {notif.type === 'inventory' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          {notif.type === 'ai' && <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                          <span>{notif.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{notif.message}</p>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60 transition-colors"
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Explore Landing View */}
            <button
              onClick={() => setCurrentView('landing')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              View Landing Page
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
