import React, { useState } from 'react';
import { Phone, Clock, ThumbsUp, ThumbsDown, Minus, CalendarCheck, ChevronRight, Filter } from 'lucide-react';
import { CallLog } from '../../types';
import { formatDuration, formatDateTime } from '../../utils/formatters';
import { CallTranscriptsDialog } from './CallTranscriptsDialog';
import { CallSummaryPanel } from './CallSummaryPanel';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface CallLogFilters {
  sentiment?: 'positive' | 'negative' | 'neutral';
  hasMeeting?: boolean;
}

interface CallLogListProps {
  callLogs: CallLog[];
  isLoading: boolean;
}

export function CallLogList({ callLogs, isLoading }: CallLogListProps) {
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  const [dialogType, setDialogType] = useState<'summary' | 'transcripts' | null>(null);
  const [filters, setFilters] = useState<CallLogFilters>({});

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

  const handleViewSummary = (log: CallLog) => {
    setSelectedLog(log);
    setDialogType('summary');
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredCallLogs = callLogs.filter(log => {
    if (filters.sentiment && log.sentiment !== filters.sentiment) {
      return false;
    }
    if (filters.hasMeeting !== undefined && log.has_meeting_booked !== filters.hasMeeting) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>Outcome</span>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button 
                          className={`p-1 rounded-md hover:bg-gray-200 focus:outline-none ${
                            Object.keys(filters).length > 0 ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'
                          }`}
                          title="Filter outcomes"
                        >
                          <Filter className="h-4 w-4" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="bg-white rounded-md shadow-lg p-2 min-w-[200px] z-50"
                          sideOffset={5}
                        >
                          <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                            Sentiment
                          </div>
                          <DropdownMenu.Item
                            className={`text-sm px-2 py-1 my-1 rounded cursor-pointer flex items-center ${
                              filters.sentiment === 'positive' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setFilters(f => ({
                              ...f,
                              sentiment: f.sentiment === 'positive' ? undefined : 'positive'
                            }))}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Positive
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className={`text-sm px-2 py-1 my-1 rounded cursor-pointer flex items-center ${
                              filters.sentiment === 'negative' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setFilters(f => ({
                              ...f,
                              sentiment: f.sentiment === 'negative' ? undefined : 'negative'
                            }))}
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Negative
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className={`text-sm px-2 py-1 my-1 rounded cursor-pointer flex items-center ${
                              filters.sentiment === 'neutral' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setFilters(f => ({
                              ...f,
                              sentiment: f.sentiment === 'neutral' ? undefined : 'neutral'
                            }))}
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            Neutral
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />
                          <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                            Meeting Status
                          </div>
                          <DropdownMenu.Item
                            className={`text-sm px-2 py-1 my-1 rounded cursor-pointer flex items-center ${
                              filters.hasMeeting === true ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => setFilters(f => ({
                              ...f,
                              hasMeeting: f.hasMeeting === true ? undefined : true
                            }))}
                          >
                            <CalendarCheck className="h-4 w-4 mr-2" />
                            Meeting Booked
                          </DropdownMenu.Item>
                          {Object.keys(filters).length > 0 && (
                            <>
                              <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />
                              <DropdownMenu.Item
                                className="text-sm px-2 py-1 my-1 rounded cursor-pointer text-red-600 hover:bg-red-50 flex items-center justify-center"
                                onClick={() => setFilters({})}
                              >
                                Clear Filters
                              </DropdownMenu.Item>
                            </>
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">View Summary</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCallLogs.map((log) => (
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
                    <div className="text-sm text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {formatDuration(log.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center ${getSentimentColor(log.sentiment)}`}>
                        {getSentimentIcon(log.sentiment)}
                        <span className="ml-1 text-sm capitalize">{log.sentiment}</span>
                      </div>
                      {log.has_meeting_booked && (
                        <div className="flex items-center text-purple-600">
                          <CalendarCheck className="h-4 w-4 mr-1" />
                          <span className="text-sm">Meeting Booked</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewSummary(log)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      title="View Summary"
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

      <CallSummaryPanel
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