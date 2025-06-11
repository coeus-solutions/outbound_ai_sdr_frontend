import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Target, Megaphone, Package, FileSpreadsheet, Eye, Settings, Users, Ban, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUserRole } from '../../hooks/useUserRole';
import { Company, getCompanyById } from '../../services/companies';
import { getToken } from '../../utils/auth';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CompanyDetailsPanel } from './CompanyDetailsPanel';
import { DoNotEmailDialog } from './DoNotEmailDialog';
import { useToast } from '../../context/ToastContext';
import ReactDOM from 'react-dom';

interface CompanyActionsSidebarProps {
  isCollapsed: boolean;
}

export function CompanyActionsSidebar({ isCollapsed }: CompanyActionsSidebarProps) {
  const { companyId } = useParams();
  const location = useLocation();
  const { isAdmin } = useUserRole(companyId || '');
  const [company, setCompany] = useState<Company | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDoNotEmailDialogOpen, setIsDoNotEmailDialogOpen] = useState(false);
  const { showToast } = useToast();

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

  const handleViewDetails = async () => {
    if (!company) return;
    setIsDetailsOpen(true);
  };

  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompany(updatedCompany);
  };

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
      name: 'Products',
      icon: Package,
      path: `/companies/${companyId}/products`,
      tooltip: 'Products',
      basePath: 'products',
      type: 'link'
    },
    {
      name: 'Leads',
      icon: Users,
      path: `/companies/${companyId}/leads`,
      tooltip: 'Leads',
      basePath: 'leads',
      type: 'link'
    },
    {
      name: 'Campaigns',
      icon: Target,
      path: `/companies/${companyId}/campaigns`,
      tooltip: 'Campaigns',
      basePath: 'campaigns',
      type: 'link'
    },
    {
      name: 'Campaign Runs',
      icon: Megaphone,
      path: `/companies/${companyId}/campaign-runs`,
      tooltip: 'Campaign Runs',
      basePath: 'campaign-runs',
      type: 'link'
    },
    {
      name: 'Upload History',
      icon: FileSpreadsheet,
      path: `/companies/${companyId}/upload-history`,
      tooltip: 'CSV Upload History',
      basePath: 'upload-history',
      type: 'link'
    },
    {
      name: 'Company Details',
      icon: Eye,
      onClick: handleViewDetails,
      tooltip: 'Company Details',
      type: 'button'
    },
    {
      name: 'Do Not Contact List',
      icon: Ban,
      onClick: () => setIsDoNotEmailDialogOpen(true),
      tooltip: 'Do Not Contact List',
      type: 'button'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: `/companies/${companyId}/settings`,
      tooltip: 'Company Settings',
      basePath: 'settings',
      type: 'link'
    }
  ];

  const renderDialogs = () => {
    return ReactDOM.createPortal(
      <>
        {(isDetailsOpen || isDoNotEmailDialogOpen) && (
          <div className="fixed inset-0 bg-black/50" style={{ zIndex: 99998 }} />
        )}
        <div style={{ zIndex: 99999 }}>
          <CompanyDetailsPanel
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            company={company}
            onCompanyUpdate={handleCompanyUpdate}
          />

          <DoNotEmailDialog
            isOpen={isDoNotEmailDialogOpen}
            onClose={() => setIsDoNotEmailDialogOpen(false)}
            companyId={companyId}
          />
        </div>
      </>,
      document.body
    );
  };

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
          const isActiveRoute = action.type === 'link' ? isActive(action.basePath!) : false;
          
          const commonClasses = cn(
            "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            isActiveRoute
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
              : "text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-indigo-900/30",
            isCollapsed && "justify-center"
          );

          const content = (
            <>
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0",
                isActiveRoute && "text-indigo-600 dark:text-indigo-400"
              )} />
              {!isCollapsed && <span className="ml-3">{action.name}</span>}
            </>
          );

          return (
            <Tooltip.Provider key={action.type === 'link' ? action.path : action.name}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <li>
                    {action.type === 'link' ? (
                      <Link
                        to={action.path!}
                        className={commonClasses}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        onClick={action.onClick}
                        className={commonClasses}
                      >
                        {content}
                      </button>
                    )}
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

      {/* Render dialogs through portal */}
      {renderDialogs()}
    </div>
  );
} 