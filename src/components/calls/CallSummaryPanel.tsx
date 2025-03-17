import React from 'react';
import { Clock, ThumbsUp, ThumbsDown, Minus, X, CalendarCheck, PhoneOff } from 'lucide-react';
import { CallLog } from '../../types';
import { formatDuration, formatDateTime } from '../../utils/formatters';

interface CallSummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  callLog: CallLog | null;
}

export function CallSummaryPanel({ isOpen, onClose, callLog }: CallSummaryPanelProps) {
  if (!isOpen || !callLog) return null;

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

  return (
    <div 
      className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out"
      style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Call Summary</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Call Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Lead</div>
                <div className="font-medium">{callLog.lead_name}</div>
                <div className="text-sm text-gray-500">{callLog.lead_phone_number}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Campaign</div>
                <div className="font-medium">{callLog.campaign_name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Called At</div>
                <div className="font-medium">{formatDateTime(callLog.created_at)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  {formatDuration(callLog.duration)}
                </div>
              </div>
            </div>
          </div>

          {/* Call Outcome */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Call Outcome</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center ${getSentimentColor(callLog.sentiment)}`}>
                  {getSentimentIcon(callLog.sentiment)}
                  <span className="ml-2 font-medium capitalize">{callLog.sentiment}</span>
                </div>
                <div className={`flex items-center ${callLog.has_meeting_booked ? 'text-purple-600' : 'text-gray-400'}`}>
                  <CalendarCheck className="h-4 w-4 mr-1" />
                  <span className="text-sm">{callLog.has_meeting_booked ? 'Meeting Booked' : 'No Meeting'}</span>
                </div>
              </div>
              {callLog.failure_reason && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-sm text-red-600">
                    <span className="font-medium">Failure Reason: </span>
                    {callLog.failure_reason}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Call Summary */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="prose prose-sm max-w-none">
                {callLog.summary}
              </div>
            </div>
          </div>

          {/* Transcripts */}
          {callLog.transcripts && callLog.transcripts.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Transcripts</h3>
              <div className="space-y-4">
                {callLog.transcripts.map((transcript) => (
                  <div
                    key={transcript.id}
                    className={`bg-gray-50 rounded-lg p-4 ${
                      transcript.user === 'assistant' ? 'bg-blue-50' :
                      transcript.user === 'user' ? 'bg-gray-50' : 'bg-purple-50 italic'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {transcript.user === 'assistant' ? 'AI Assistant' :
                         transcript.user === 'user' ? 'User' : 'System'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(transcript.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{transcript.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 