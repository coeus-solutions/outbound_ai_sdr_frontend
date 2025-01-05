import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { auth } from '../../utils/auth';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        onLogout={handleLogout}
      />
      
      <main className={cn(
        "transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-64",
        "p-8"
      )}>
        {children}
      </main>
    </div>
  );
}