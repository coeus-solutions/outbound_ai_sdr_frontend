import React, { useState, useEffect } from 'react';
import { Mail, X, ChevronLeft, ChevronRight, Loader2, Upload, List } from 'lucide-react';
import { Dialog } from '../shared/Dialog';
import { getToken } from '../../utils/auth';
import { DoNotEmailEntry, getDoNotEmailList } from '../../services/companies';
import { useToast } from '../../context/ToastContext';
import { FileUpload } from '../shared/FileUpload';
import { apiEndpoints } from '../../config';

interface DoNotEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

type TabType = 'view' | 'upload';

export function DoNotEmailDialog({ isOpen, onClose, companyId }: DoNotEmailDialogProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('view');
  const [entries, setEntries] = useState<DoNotEmailEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    if (isOpen && activeTab === 'view') {
      fetchDoNotEmailList(1);
    }
  }, [isOpen, activeTab]);

  const fetchDoNotEmailList = async (page: number) => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const response = await getDoNotEmailList(token, companyId, page, limit);
      setEntries(response.items);
      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error fetching do-not-email list:', error);
      showToast('Failed to fetch do-not-email list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(apiEndpoints.companies.doNotEmail.upload(companyId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload do-not-email list');
      }

      showToast('Do-not-email list uploaded successfully', 'success');
      // Refresh the list if we're viewing it
      if (activeTab === 'view') {
        fetchDoNotEmailList(1);
      }
    } catch (error) {
      console.error('Error uploading do-not-email list:', error);
      showToast('Failed to upload do-not-email list. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchDoNotEmailList(page);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Do Not Email List"
      size="lg"
    >
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('view')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'view'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <List className="w-5 h-5 inline-block mr-2" />
            View List
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'upload'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Upload className="w-5 h-5 inline-block mr-2" />
            Upload CSV
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'view' ? (
          <div className="min-h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                <Mail className="h-12 w-12 mb-4" />
                <p>No emails in the do-not-email list</p>
              </div>
            ) : (
              <>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mb-4">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Email
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Reason
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Added On
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {entries.map((entry) => (
                        <tr key={entry.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {entry.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {entry.reason || '-'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(entry.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * limit, totalItems)}</span> of{' '}
                        <span className="font-medium">{totalItems}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Upload a CSV file containing a list of email addresses that should not receive emails from your campaigns.
            </p>
            <div className="flex justify-center">
              <FileUpload
                accept=".csv"
                onUpload={handleFileUpload}
                buttonText={isUploading ? 'Uploading...' : 'Upload CSV'}
                icon={<Upload className="h-5 w-5 mr-2" />}
                disabled={isUploading}
              />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p className="font-medium mb-2">CSV Format Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>File must be in CSV format</li>
                <li>First row should contain column headers</li>
                <li>Must include an 'email' column</li>
                <li>Each row should contain a unique email address</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
} 