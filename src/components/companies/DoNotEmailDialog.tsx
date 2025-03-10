import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Dialog } from '../shared/Dialog';
import { FileUpload } from '../shared/FileUpload';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { apiEndpoints } from '../../config';

interface DoNotEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export function DoNotEmailDialog({ isOpen, onClose, companyId }: DoNotEmailDialogProps) {
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

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
      onClose();
    } catch (error) {
      console.error('Error uploading do-not-email list:', error);
      showToast('Failed to upload do-not-email list. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Upload Do Not Email List">
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
    </Dialog>
  );
} 