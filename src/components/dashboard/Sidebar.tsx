import React from 'react';
import { Building2, Building, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onLogout }: SidebarProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/companies') {
      return location.pathname === '/' || location.pathname.startsWith('/companies');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-indigo-600 flex-shrink-0" />
          {!isCollapsed && <span className="text-xl font-bold">SDR AI</span>}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/companies"
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors",
                isActive('/companies')
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-indigo-50",
                isCollapsed && "justify-center"
              )}
            >
              <Building className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Companies</span>}
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 rounded-lg transition-colors",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </nav>
  );
}