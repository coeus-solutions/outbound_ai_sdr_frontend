import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Dialog } from '../shared/Dialog';

interface CsvFormatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CsvFormatDialog({ isOpen, onClose }: CsvFormatDialogProps) {
  const sampleData = `name,email,company,phone_number,company_size,job_title,company_facebook,company_twitter,company_revenue
John Doe,john@example.com,Acme Inc,+1234567890,100-500,Sales Manager,https://facebook.com/acme,https://twitter.com/acme,$1M-$5M
Jane Smith,jane@example.com,Tech Corp,+0987654321,500-1000,VP Sales,https://facebook.com/techcorp,https://twitter.com/techcorp,$5M-$10M`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="CSV File Format Guide"
    >
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500">
            Your CSV file should include the following columns in this exact order:
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="font-mono text-sm text-gray-600 whitespace-pre-wrap break-all">
            name, email, company, phone_number, company_size, job_title, company_facebook, company_twitter, company_revenue
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Required Fields:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>name - Full name of the lead</li>
            <li>email - Email address</li>
            <li>phone_number - Contact number</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Optional Fields:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>company - Company name</li>
            <li>company_size - Size of the company (e.g., "100-500", "1000+")</li>
            <li>job_title - Lead's job title</li>
            <li>company_facebook - Facebook URL</li>
            <li>company_twitter - Twitter URL</li>
            <li>company_revenue - Company revenue range</li>
          </ul>
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleDownloadSample}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Sample CSV
          </button>
        </div>
      </div>
    </Dialog>
  );
} 