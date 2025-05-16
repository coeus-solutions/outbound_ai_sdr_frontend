import React, { useState, useEffect } from 'react';
import { Dialog } from '../shared/Dialog';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { TableSkeletonLoader } from '../shared/TableSkeletonLoader';
import { getSkippedRows, type SkippedRow, type PaginatedSkippedRowResponse } from '../../services/uploadTasks';

interface SkippedRecordsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  uploadTaskId: string;
  type: string;
}

export function SkippedRecordsDialog({ isOpen, onClose, uploadTaskId, type }: SkippedRecordsDialogProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [skippedRows, setSkippedRows] = useState<SkippedRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getDialogTitle = () => {
    switch (type) {
      case 'leads':
        return 'Skipped Leads';
      case 'do_not_email':
        return 'Skipped Emails';
      default:
        return 'Skipped Records';
    }
  };

  useEffect(() => {
    async function fetchSkippedRows() {
      if (!uploadTaskId) return;

      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const data = await getSkippedRows(token, uploadTaskId, page, pageSize);
        setSkippedRows(data.items);
        setTotalItems(data.total);
        setTotalPages(data.total_pages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch skipped rows';
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchSkippedRows();
    }
  }, [uploadTaskId, page, pageSize, isOpen, showToast]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  // Get all unique fields from all rows
  const getAllFields = () => {
    const fields = new Set<string>();
    skippedRows.forEach(row => {
      Object.keys(row.row_data).forEach(key => fields.add(key));
    });
    return Array.from(fields);
  };

  const fields = getAllFields();

  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'missing_name':
        return 'bg-amber-100 text-amber-800';
      case 'invalid_email':
        return 'bg-red-100 text-red-800';
      case 'invalid_phone':
        return 'bg-purple-100 text-purple-800';
      case 'missing_company_name_or_website':
        return 'bg-blue-100 text-blue-800';
      case 'lead_creation_error':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategoryLabel = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={getDialogTitle()}
      size="4xl"
    >
      <div className="space-y-4">
        {loading ? (
          <TableSkeletonLoader rowCount={5} columnCount={fields.length + 2} hasHeader={true} />
        ) : (
          <>
            {skippedRows.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No {type === 'leads' ? 'leads' : 'emails'} skipped</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All {type === 'leads' ? 'leads' : 'emails'} in this upload were processed successfully.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      {fields.map(field => (
                        <th key={field} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {skippedRows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(row.category)}`}>
                            {formatCategoryLabel(row.category)}
                          </span>
                        </td>
                        {fields.map(field => (
                          <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof row.row_data[field] === 'object' && row.row_data[field] !== null
                              ? JSON.stringify(row.row_data[field])
                              : String(row.row_data[field] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {skippedRows.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startItem}</span> to{' '}
                      <span className="font-medium">{endItem}</span> of{' '}
                      <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(page - 1, 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
} 