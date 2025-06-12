import React, { useState } from 'react';
import { Phone, Clock, ThumbsUp, ThumbsDown, Minus, CalendarCheck, ChevronRight, PlayCircle, X, PhoneOff, Copy } from 'lucide-react';
import { CallLog } from '../../types';
import { formatDuration, formatDateTime } from '../../utils/formatters';
import { CallTranscriptsDialog } from './CallTranscriptsDialog';
import { CallSummaryPanel } from './CallSummaryPanel';
import { useToast } from '../../context/ToastContext';

interface CallLogListProps {
  callLogs: CallLog[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function CallLogList({ 
  callLogs, 
  isLoading, 
  page, 
  pageSize, 
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange
}: CallLogListProps) {
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  const [dialogType, setDialogType] = useState<'summary' | 'transcripts' | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const { showToast } = useToast();
  
  // Ensure page is always a number
  const currentPage = Number(page) || 1;
  const currentPageSize = Number(pageSize) || 3;
  const currentTotalPages = Number(totalPages) || 1;
  const currentTotalItems = Number(totalItems) || 0;

  const handleCopyId = async (e: React.MouseEvent, callId: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(callId);
      showToast('Call ID copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy ID:', error);
      showToast('Failed to copy ID', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Called At</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">View Details</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="w-16 px-3 py-4 whitespace-nowrap">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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

  const startItem = (currentPage - 1) * currentPageSize + 1;
  const endItem = Math.min(currentPage * currentPageSize, currentTotalItems);

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Called At</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">View Details</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {callLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="w-16 px-3 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => handleCopyId(e, log.id)}
                      className="inline-flex items-center p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-md transition-colors"
                      title="Copy Call ID"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy ID</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.lead_name}</div>
                    <div className="text-sm text-gray-500">{log.lead_phone_number || 'No phone number'}</div>
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
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= currentTotalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{currentTotalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= currentTotalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
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