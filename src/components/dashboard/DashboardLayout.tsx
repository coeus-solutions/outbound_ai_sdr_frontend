import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  onLogout: () => void;
}

export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={onLogout}
      />
      <main
        className={cn(
          "transition-all duration-300",
          isSidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}