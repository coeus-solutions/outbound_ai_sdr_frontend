import React, { useState } from 'react';
import { Mail, User, Calendar, Eye, MessageSquare, CalendarCheck, ChevronRight } from 'lucide-react';
import { EmailLog } from '../../services/emails';
import { formatDateTime } from '../../utils/formatters';
import { EmailSidePanel } from './EmailSidePanel';
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

  return (
    <>
      {emailLogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No emails yet</h3>
          <p className="mt-1 text-sm text-gray-500">Start sending emails to see your history here.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
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
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center ${log.has_opened ? 'text-green-600' : 'text-gray-400'}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="text-sm">{log.has_opened ? 'Opened' : 'Not opened'}</span>
                        </div>
                        <div className={`flex items-center ${log.has_replied ? 'text-blue-600' : 'text-gray-400'}`}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span className="text-sm">{log.has_replied ? 'Replied' : 'No reply'}</span>
                        </div>
                        <div className={`flex items-center ${log.has_meeting_booked ? 'text-purple-600' : 'text-gray-400'}`}>
                          <CalendarCheck className="h-4 w-4 mr-1" />
                          <span className="text-sm">{log.has_meeting_booked ? 'Meeting Booked' : 'No Meeting'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedEmailLog(log)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EmailSidePanel
        isOpen={selectedEmailLog !== null}
        onClose={() => setSelectedEmailLog(null)}
        companyId={companyId}
        emailLogId={selectedEmailLog?.id || ''}
      />
    </>
  );
} 