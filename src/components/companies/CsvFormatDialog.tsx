import React from 'react';
import { Download } from 'lucide-react';
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
      title="CSV Import Guidelines"
    >
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500">
            Your CSV file can include the following information in any order, just make sure to add the header at the top.
            We support import from Cognism so you can direct export Cognism leads and import them here.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Required Information:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Name of the lead (missing this will result in skipping this lead)</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Optional Information:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Email address of the Lead (used in sending campaign emails)</li>
            <li>Contact number of the Lead (used in calls)</li>
            <li>Company name</li>
            <li>Size of the company (e.g., "100-500", "1000+")</li>
            <li>Lead's job title</li>
            <li>Facebook URL</li>
            <li>Twitter URL</li>
            <li>Company revenue range</li>
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