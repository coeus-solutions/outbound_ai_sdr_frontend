import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Target, Megaphone, Package, FileSpreadsheet, Eye, Settings, Users, Ban, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUserRole } from '../../hooks/useUserRole';
import { Company, getCompanyById } from '../../services/companies';
import { getToken } from '../../utils/auth';
import * as Tooltip from '@radix-ui/react-tooltip';

interface CompanyActionsSidebarProps {
  isCollapsed: boolean;
}

export function CompanyActionsSidebar({ isCollapsed }: CompanyActionsSidebarProps) {
  const { companyId } = useParams();
  const location = useLocation();
  const { isAdmin } = useUserRole(companyId || '');
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return;
      try {
        const token = getToken();
        if (!token) return;
        const companyData = await getCompanyById(token, companyId);
        setCompany(companyData);
      } catch (error) {
        console.error('Error fetching company:', error);
      }
    };

    fetchCompany();
  }, [companyId]);

  const isActive = (basePath: string) => {
    const currentPath = location.pathname;
    const baseCompanyPath = `/companies/${companyId}/${basePath}`;

    // Special cases for routes with sub-paths
    switch (basePath) {
      case 'campaigns':
        return currentPath === baseCompanyPath || currentPath === `${baseCompanyPath}/new`;
      case 'products':
        return currentPath === baseCompanyPath || 
               currentPath === `${baseCompanyPath}/new` || 
               currentPath.startsWith(`${baseCompanyPath}/`) && currentPath.includes('/edit');
      default:
        return currentPath === baseCompanyPath;
    }
  };

  if (!companyId || !company) return null;

  const actions = [
    {
      name: 'Campaigns',
      icon: Target,
      path: `/companies/${companyId}/campaigns`,
      tooltip: 'Campaigns',
      basePath: 'campaigns'
    },
    {
      name: 'Campaign Runs',
      icon: Megaphone,
      path: `/companies/${companyId}/campaign-runs`,
      tooltip: 'Campaign Runs',
      basePath: 'campaign-runs'
    },
    {
      name: 'Products',
      icon: Package,
      path: `/companies/${companyId}/products`,
      tooltip: 'Products',
      basePath: 'products'
    },
    {
      name: 'Upload History',
      icon: FileSpreadsheet,
      path: `/companies/${companyId}/upload-history`,
      tooltip: 'CSV Upload History',
      basePath: 'upload-history'
    },
    {
      name: 'Leads',
      icon: Users,
      path: `/companies/${companyId}/leads`,
      tooltip: 'Leads',
      basePath: 'leads'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: `/companies/${companyId}/settings`,
      tooltip: 'Company Settings',
      basePath: 'settings'
    }
  ];

  return (
    <div>
      {!isCollapsed && (
        <div className="px-4 py-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {company.name}
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Choose from available actions
          </div>
        </div>
      )}
      <ul className="space-y-1">
        {actions.map((action) => {
          const Icon = action.icon;
          const isActiveRoute = isActive(action.basePath);
          return (
            <Tooltip.Provider key={action.path}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <li>
                    <Link
                      to={action.path}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActiveRoute
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
                          : "text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-indigo-900/30",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActiveRoute && "text-indigo-600 dark:text-indigo-400"
                      )} />
                      {!isCollapsed && <span className="ml-3">{action.name}</span>}
                    </Link>
                  </li>
                </Tooltip.Trigger>
                {isCollapsed && (
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                      sideOffset={5}
                    >
                      {action.tooltip}
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                )}
              </Tooltip.Root>
            </Tooltip.Provider>
          );
        })}
      </ul>
    </div>
  );
} 