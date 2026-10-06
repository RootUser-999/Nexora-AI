import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { AppShell } from './components/AppShell.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { AIAssistantPage } from './pages/AIAssistantPage.tsx';
import { CustomersPage } from './pages/CustomersPage.tsx';
import { ProductsPage } from './pages/ProductsPage.tsx';
import { InventoryPage } from './pages/InventoryPage.tsx';
import { OrdersPage } from './pages/OrdersPage.tsx';
import { InvoicesPage } from './pages/InvoicesPage.tsx';
import { TasksPage } from './pages/TasksPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { TeamPage } from './pages/TeamPage.tsx';
import { AuditPage } from './pages/AuditPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { DocsPage } from './pages/DocsPage.tsx';

function MainRouter() {
  const { currentView, isAuthModalOpen, setIsAuthModalOpen, authModalMode } = useApp();

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage />
        <CommandPalette />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      </>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'customers':
        return <CustomersPage />;
      case 'products':
        return <ProductsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'orders':
        return <OrdersPage />;
      case 'invoices':
        return <InvoicesPage />;
      case 'tasks':
        return <TasksPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'team':
        return <TeamPage />;
      case 'audit':
        return <AuditPage />;
      case 'settings':
        return <SettingsPage />;
      case 'docs':
        return <DocsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      <AppShell>
        {renderActiveView()}
      </AppShell>
      <CommandPalette />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

