/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react';
import React from 'react';
import { Building, ChevronLeft, ChevronRight, LogOut, User, HelpCircle, Moon, Sun, Mail, AlertCircle, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { getToken } from '../../utils/auth';
import { getUser } from '../../services/users';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { Dialog } from '../shared/Dialog';
import UpgradeDialog from '../subscription/UpgradeDialog';
import { CompanyActionsSidebar } from '../companies/CompanyActionsSidebar';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onLogout }: SidebarProps) {
  const location = useLocation();
  const [userName, setUserName] = React.useState<string>('');
  const [userEmail, setUserEmail] = React.useState<string>('');
  const [planType, setPlanType] = React.useState<string>('');
  const [subscriptionStatus, setSubscriptionStatus] = React.useState<string>('');
  const [upgradeMessage, setUpgradeMessage] = React.useState<string>('');
  const [showUpgradeDialog, setShowUpgradeDialog] = React.useState(false);
  const [showUpgradeMessageDialog, setShowUpgradeMessageDialog] = React.useState(false);
  const { isDark, toggleTheme } = useTheme();
  
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (token) {
          const userData = await getUser(token);
          console.log('Fetched user data:', userData);
          setUserName(userData.name || '');
          setUserEmail(userData.email || '');
          setPlanType(userData.plan_type || '');
          setSubscriptionStatus(userData.subscription_status || '');
          if (userData.upgrade_message) {
            setUpgradeMessage(userData.upgrade_message);
            setShowUpgradeMessageDialog(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const isActive = (path: string) => {
    if (path === '/companies') {
      return location.pathname === '/companies';
    }
    return location.pathname.startsWith(path);
  };

  const isCompanyRoute = location.pathname.match(/^\/companies\/[^/]+/) && location.pathname !== '/companies/new';

  const mainMenuItems = [
    {
      name: 'Getting Started',
      icon: HelpCircle,
      path: '/getting-started'
    },
    {
      name: 'Companies',
      icon: Building,
      path: '/companies'
    },
    {
      name: 'Subscription',
      icon: CreditCard,
      path: '/subscription'
    }
  ];

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 flex flex-col font-sans",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center p-4 border-b">
          <div className="flex items-center space-x-0">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span 
                className="text-2xl font-bold relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 rounded-lg blur-lg"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                {isCollapsed ? (
                  <>
                    <span className="relative bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">R</span>
                    <span className="relative bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">G</span>
                  </>
                ) : (
                  <>
                    <span className="relative bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Reach</span>
                    <span className="relative bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Genie</span>
                  </>
                )}
              </motion.span>
            </motion.div>
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
          {isCompanyRoute && (
            <CompanyActionsSidebar isCollapsed={isCollapsed} />
          )}

          <ul className={cn("space-y-1", isCompanyRoute && "mt-4 pt-4 border-t dark:border-gray-800")}>
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive(item.path)
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
                        : "text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-indigo-900/30",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t dark:border-gray-800">
          {!isCollapsed && (
            <>
              {planType && (
                <div className="mb-3 px-4 py-2 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Current Plan</div>
                  <div className="flex flex-col space-y-2">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{planType}</span>
                        {subscriptionStatus && (
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs",
                            subscriptionStatus.toLowerCase() === 'active' && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                            subscriptionStatus.toLowerCase() === 'pending' && "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
                            subscriptionStatus.toLowerCase() === 'canceled' && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                            subscriptionStatus.toLowerCase() === 'expired' && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                            subscriptionStatus.toLowerCase() === 'past_due' && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1).toLowerCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    {(planType?.toLowerCase() === 'trial' || subscriptionStatus?.toLowerCase() === 'canceled') && (
                      <button
                        onClick={() => setShowUpgradeDialog(true)}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 hover:shadow-md hover:scale-[1.02] transform"
                      >
                        Upgrade Now
                      </button>
                    )}
                  </div>
                </div>
              )}
              {(userName || userEmail) && (
                <div className="px-4 py-2">
                  {userName && (
                    <div className="text-sm font-medium tracking-tight text-gray-700 dark:text-gray-300">
                      {userName}
                    </div>
                  )}
                  {userEmail && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                      <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                      {userEmail}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          <div className="flex flex-col space-y-2">
            <button
              onClick={toggleTheme}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                "text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-indigo-900/30",
                isCollapsed && "justify-center"
              )}
            >
              {isDark ? (
                <Sun className="h-5 w-5 flex-shrink-0" />
              ) : (
                <Moon className="h-5 w-5 flex-shrink-0" />
              )}
              {!isCollapsed && <span className="ml-3">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            <Link
              to="/profile"
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive('/profile')
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
                  : "text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-indigo-900/30",
                isCollapsed && "justify-center"
              )}
            >
              <User className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">Profile</span>}
            </Link>
            <button
              onClick={onLogout}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                "text-gray-700 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-red-900/30",
                isCollapsed && "justify-center"
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Upgrade Dialog */}
      <UpgradeDialog
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
      />

      {/* Upgrade Message Dialog */}
      <Dialog
        isOpen={showUpgradeMessageDialog && !!upgradeMessage}
        onClose={() => setShowUpgradeMessageDialog(false)}
        title="Plan Upgrade Available"
      >
        <div className="p-6">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {upgradeMessage}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowUpgradeMessageDialog(false)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}