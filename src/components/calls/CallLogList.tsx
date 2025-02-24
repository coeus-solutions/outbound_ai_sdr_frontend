import React, { useState } from 'react';
import { Phone, Clock, ThumbsUp, ThumbsDown, Minus, FileText, CalendarCheck, ChevronDown } from 'lucide-react';
import { CallLog } from '../../types';
import { formatDuration, formatDateTime } from '../../utils/formatters';
import { CallSummaryDialog } from './CallSummaryDialog';
import { CallTranscriptsDialog } from './CallTranscriptsDialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface CallLogListProps {
  callLogs: CallLog[];
  isLoading: boolean;
}

export function CallLogList({ callLogs, isLoading }: CallLogListProps) {
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  const [dialogType, setDialogType] = useState<'summary' | 'transcripts' | null>(null);

  if (isLoading) {
    return <div className="text-center py-8">Loading call logs...</div>;
  }

  if (callLogs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <Phone className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No calls yet</h3>
        <p className="mt-1 text-sm text-gray-500">Start making calls to see your history here.</p>
      </div>
    );
  }

  const handleCloseDialog = () => {
    setSelectedLog(null);
    setDialogType(null);
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Called at</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {callLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.lead_name}</div>
                    <div className="text-sm text-gray-500">{log.lead_phone_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.campaign_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDateTime(log.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDuration(log.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.sentiment === 'positive' 
                        ? 'bg-green-100 text-green-800'
                        : log.sentiment === 'negative'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {log.sentiment === 'positive' && <ThumbsUp className="h-3 w-3 mr-1" />}
                      {log.sentiment === 'negative' && <ThumbsDown className="h-3 w-3 mr-1" />}
                      {log.sentiment === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
                      {log.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${log.has_meeting_booked ? 'text-purple-600' : 'text-gray-400'}`}>
                      <CalendarCheck className="h-4 w-4 mr-1" />
                      <span className="text-sm">{log.has_meeting_booked ? 'Meeting Booked' : 'No Meeting'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <FileText className="h-4 w-4 mr-1" />
                          Actions
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[160px] bg-white rounded-md shadow-lg p-1 z-50"
                          sideOffset={5}
                        >
                          <DropdownMenu.Item
                            className="text-xs text-gray-700 hover:bg-gray-100 px-3 py-2 rounded cursor-pointer flex items-center"
                            onClick={() => {
                              setSelectedLog(log);
                              setDialogType('summary');
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Summary
                          </DropdownMenu.Item>
                          
                          {log.transcripts && log.transcripts.length > 0 && (
                            <DropdownMenu.Item
                              className="text-xs text-gray-700 hover:bg-gray-100 px-3 py-2 rounded cursor-pointer flex items-center"
                              onClick={() => {
                                setSelectedLog(log);
                                setDialogType('transcripts');
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Transcripts
                            </DropdownMenu.Item>
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CallSummaryDialog
        isOpen={dialogType === 'summary' && selectedLog !== null}
        onClose={handleCloseDialog}
        callLog={selectedLog}
      />

      <CallTranscriptsDialog
        isOpen={dialogType === 'transcripts' && selectedLog !== null}
        onClose={handleCloseDialog}
        callLog={selectedLog}
      />
    </>
  );
}