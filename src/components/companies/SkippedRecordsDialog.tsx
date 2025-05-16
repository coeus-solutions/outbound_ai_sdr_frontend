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
}

export function SkippedRecordsDialog({ isOpen, onClose, uploadTaskId }: SkippedRecordsDialogProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [skippedRows, setSkippedRows] = useState<SkippedRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Skipped Records"
      size="xl"
    >
      <div className="space-y-4">
        {loading ? (
          <TableSkeletonLoader rowCount={5} columnCount={3} hasHeader={true} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Row Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {skippedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(row.row_data, null, 2)}
                        </pre>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((page - 1) * pageSize) + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(page * pageSize, totalItems)}</span> of{' '}
                      <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            page === pageNum
                              ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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