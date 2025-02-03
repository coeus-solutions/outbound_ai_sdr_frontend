import React, { useState } from 'react';
import { Mail, User, Calendar, History } from 'lucide-react';
import { EmailLog } from '../../services/emails';
import { formatDateTime } from '../../utils/formatters';
import { EmailHistoryDialog } from './EmailHistoryDialog';
import { useParams } from 'react-router-dom';

interface EmailLogListProps {
  emailLogs: EmailLog[];
  isLoading: boolean;
}

export function EmailLogList({ emailLogs, isLoading }: EmailLogListProps) {
  const { companyId = '' } = useParams();
  const [selectedEmailLog, setSelectedEmailLog] = useState<EmailLog | null>(null);

  if (isLoading) {
    return <div className="text-center py-8">Loading email logs...</div>;
  }

  if (emailLogs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Mail className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No emails yet</h3>
        <p className="mt-1 text-sm text-gray-500">Start sending emails to see your history here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent at</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emailLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.lead_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{log.lead_email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.campaign_name || 'Unknown Campaign'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDateTime(log.sent_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedEmailLog(log)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <History className="h-4 w-4 mr-1" />
                      View Email History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EmailHistoryDialog
        isOpen={selectedEmailLog !== null}
        onClose={() => setSelectedEmailLog(null)}
        companyId={companyId}
        emailLogId={selectedEmailLog?.id || ''}
      />
    </>
  );
} 