import React from 'react';
import { Dialog } from '../shared/Dialog';
import { CallLog } from '../../types';
import { formatDateTime } from '../../utils/formatters';

interface CallTranscriptsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callLog: CallLog | null;
}

export function CallTranscriptsDialog({ isOpen, onClose, callLog }: CallTranscriptsDialogProps) {
  if (!callLog || !callLog.transcripts) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Call Transcripts"
    >
      <div className="space-y-4">
        <div className="border-b pb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{callLog.lead_name}</h3>
            <p className="text-sm text-gray-500">{callLog.campaign_name}</p>
          </div>
        </div>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {callLog.transcripts.map((transcript) => (
            <div
              key={transcript.id}
              className={`flex flex-col ${
                transcript.user === 'assistant' ? 'items-start' : 'items-end'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  transcript.user === 'assistant'
                    ? 'bg-blue-100'
                    : transcript.user === 'user'
                    ? 'bg-gray-100'
                    : 'bg-purple-100 italic'
                }`}
              >
                <p className="text-sm">
                  {transcript.text}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateTime(transcript.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
} 