import React, { useEffect, useState } from 'react';
import { Building, ChevronLeft, ChevronRight, LogOut, User, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { getToken } from '../../utils/auth';
import { getUser } from '../../services/users';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onLogout }: SidebarProps) {
  const location = useLocation();
  const [userName, setUserName] = useState<string>('');
  
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = getToken();
        if (token) {
          const userData = await getUser(token);
          setUserName(userData.name || '');
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      }
    };

    fetchUserName();
  }, []);

  const isActive = (path: string) => {
    if (path === '/companies') {
      return location.pathname === '/' || location.pathname.startsWith('/companies');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 flex flex-col font-sans",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b">
        <div className="flex items-center space-x-0">
          <div className={cn("flex-shrink-0", isCollapsed ? "w-10" : "w-8")}>
            <img 
              src="/images/logo.png" 
              alt="ReachGenie.ai Logo" 
              className="w-full h-auto object-contain" 
            />
          </div>
          {!isCollapsed && <span className="text-xl font-semibold tracking-tight">ReachGenie.ai</span>}
        </div>
      </div>

      {/* Vertical divider with centered collapse button */}
      <div className="absolute right-0 top-0 h-full">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 h-16 flex items-center">
          <div className="w-[1px] h-full bg-gray-200"></div>
          <button
            onClick={onToggle}
            className="absolute -right-3 p-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/getting-started"
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors font-medium",
                isActive('/getting-started')
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-indigo-50",
                isCollapsed && "justify-center"
              )}
            >
              <HelpCircle className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="tracking-tight">Getting Started</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/companies"
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors font-medium",
                isActive('/companies')
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-indigo-50",
                isCollapsed && "justify-center"
              )}
            >
              <Building className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="tracking-tight">Companies</span>}
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4 border-t">
        {!isCollapsed && (
          <>
            {userName && (
              <div className="px-4 py-2">
                <div className="text-sm font-medium tracking-tight text-gray-700">
                  {userName}
                </div>
              </div>
            )}
          </>
        )}
        <Link
          to="/profile"
          className={cn(
            "flex items-center w-full px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors mb-2 font-medium",
            isActive('/profile') && "bg-indigo-50 text-indigo-600",
            isCollapsed && "justify-center"
          )}
        >
          <User className={cn("h-5 w-5 flex-shrink-0", isActive('/profile') && "text-indigo-600")} />
          {!isCollapsed && <span className="ml-3 tracking-tight">Profile</span>}
        </Link>
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 rounded-lg transition-colors font-medium",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3 tracking-tight">Logout</span>}
        </button>
      </div>
    </nav>
  );
}