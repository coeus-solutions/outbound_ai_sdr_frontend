import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function DashboardLayout({ children, onLogout }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        onLogout={onLogout}
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