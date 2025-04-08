import React, { useState } from 'react';
import { Phone, Clock, ThumbsUp, ThumbsDown, Minus, CalendarCheck, ChevronRight, Filter, PlayCircle, X, PhoneOff } from 'lucide-react';
import { CallLog } from '../../types';
import { formatDuration, formatDateTime } from '../../utils/formatters';
import { CallTranscriptsDialog } from './CallTranscriptsDialog';
import { CallSummaryPanel } from './CallSummaryPanel';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface CallLogFilters {
  sentiment?: 'positive' | 'negative' | 'not_connected';
  hasMeeting?: boolean;
}

interface CallLogListProps {
  callLogs: CallLog[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function CallLogList({ 
  callLogs, 
  isLoading, 
  page, 
  pageSize, 
  totalItems, 
  onPageChange, 
  onPageSizeChange 
}: CallLogListProps) {
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  const [dialogType, setDialogType] = useState<'summary' | 'transcripts' | null>(null);
  const [filters, setFilters] = useState<CallLogFilters>({});
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Add debug logging
  console.log('Call Logs Data:', callLogs.map(log => ({
    id: log.id,
    lead_name: log.lead_name,
    has_recording: !!log.recording_url,
    recording_url: log.recording_url
  })));

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
      case 'not_connected':
        return <PhoneOff className="h-4 w-4" />;
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
      case 'not_connected':
        return 'text-gray-500';
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

  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

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
                  Last Called At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                  <span className="sr-only">View Details</span>
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
                    <div className="text-sm text-gray-900">{formatDateTime(log.last_called_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {formatDuration(log.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      {log.recording_url && (
                        <button
                          onClick={() => setPlayingAudioId(playingAudioId === log.id ? null : log.id)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none flex items-center space-x-2"
                          title="Play Recording"
                        >
                          <PlayCircle className="h-5 w-5" />
                          <span className="text-sm">Play</span>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center ${getSentimentColor(log.sentiment)}`}>
                        {getSentimentIcon(log.sentiment)}
                        <span className="ml-1 text-sm capitalize">{log.sentiment === 'not_connected' ? 'Unable to connect' : log.sentiment}</span>
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
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === Math.ceil(totalItems / pageSize)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * pageSize, totalItems)}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, Math.ceil(totalItems / pageSize)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pageNum
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page === Math.ceil(totalItems / pageSize)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Audio Player */}
      {playingAudioId && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPlayingAudioId(null)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                Playing recording for: {callLogs.find(log => log.id === playingAudioId)?.lead_name}
              </span>
            </div>
            <audio
              controls
              autoPlay
              className="w-1/2"
              src={callLogs.find(log => log.id === playingAudioId)?.recording_url}
              onEnded={() => setPlayingAudioId(null)}
              key={playingAudioId} // Force audio element to re-render when changing tracks
            />
          </div>
        </div>
      )}

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