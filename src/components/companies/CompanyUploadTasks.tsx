import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileSpreadsheet, Info } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { getCompanyById, type Company } from '../../services/companies';
import { getUploadTasks, downloadUploadFile, type UploadTask } from '../../services/uploadTasks';
import { formatDate } from '../../utils/date';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { TableSkeletonLoader } from '../shared/TableSkeletonLoader';
import { SkippedRecordsDialog } from './SkippedRecordsDialog';

export function CompanyUploadTasks() {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSkippedRecordsDialogOpen, setIsSkippedRecordsDialogOpen] = useState(false);
  const [selectedUploadTaskId, setSelectedUploadTaskId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!companyId) return;

      try {
        setLoading(true);
        setError(null);
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const [companyData, uploadTasksData] = await Promise.all([
          getCompanyById(token, companyId),
          getUploadTasks(token, companyId, page, pageSize)
        ]);

        setCompany(companyData);
        setUploadTasks(uploadTasksData.items);
        setTotalItems(uploadTasksData.total);
        setTotalPages(uploadTasksData.total_pages);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch upload tasks';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [companyId, page, pageSize, showToast]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDownload = async (uploadTaskId: string, fileName: string) => {
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const blob = await downloadUploadFile(token, uploadTaskId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download file';
      showToast(errorMessage, 'error');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'leads':
        return 'bg-blue-100 text-blue-800';
      case 'do_not_email':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={company?.name || 'Loading...'}
          subtitle="CSV Upload History for"
        />
        <TableSkeletonLoader
          rowCount={5}
          columnCount={5}
          hasHeader={true}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="space-y-6">
      <PageHeader
        title={company?.name || 'Company'}
        subtitle="CSV Upload History for"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-center space-x-2">
        <Info className="h-5 w-5 text-blue-400" />
        <p className="text-sm text-blue-700">
          CSV processing progress is updated periodically. Refresh the page to see the latest results.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skipped Records
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploadTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No upload tasks</h3>
                    <p className="mt-1 text-sm text-gray-500">No CSV files have been uploaded yet.</p>
                  </td>
                </tr>
              ) : (
                uploadTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.file_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(task.type)}`}>
                        {task.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      {typeof task.result === 'string' ? (
                        <div className="break-words">{task.result}</div>
                      ) : task.result ? (
                        <div className="space-y-1">
                          {'leads_saved' in task.result && (
                            <>
                              <div>Leads Saved: {task.result.leads_saved}</div>
                              <div>Leads Skipped: {task.result.leads_skipped}</div>
                            </>
                          )}
                          {'emails_saved' in task.result && (
                            <>
                              <div>Emails Saved: {task.result.emails_saved}</div>
                              <div>Emails Skipped: {task.result.emails_skipped}</div>
                            </>
                          )}
                          {task.result.unmapped_headers?.length > 0 && (
                            <div className="break-words">
                              Unmapped: {task.result.unmapped_headers.join(', ')}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(task.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDownload(task.id, task.file_name)}
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                        title="Download"
                        aria-label={`Download ${task.file_name}`}
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.result && typeof task.result === 'object' && (
                        ('leads_skipped' in task.result && task.result.leads_skipped > 0 ||
                         'emails_skipped' in task.result && task.result.emails_skipped > 0) && (
                          <button
                            className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                            onClick={() => {
                              setSelectedUploadTaskId(task.id);
                              setIsSkippedRecordsDialogOpen(true);
                            }}
                          >
                            View
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {uploadTasks.length > 0 && (
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
      </div>
      {selectedUploadTaskId && (
        <SkippedRecordsDialog
          isOpen={isSkippedRecordsDialogOpen}
          onClose={() => {
            setIsSkippedRecordsDialogOpen(false);
            setSelectedUploadTaskId(null);
          }}
          uploadTaskId={selectedUploadTaskId}
          type={uploadTasks.find(task => task.id === selectedUploadTaskId)?.type || 'leads'}
        />
      )}
    </div>
  );
} 