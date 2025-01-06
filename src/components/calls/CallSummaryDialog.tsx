import React from 'react';
import { Clock, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { Dialog } from '../shared/Dialog';
import { CallLog } from '../../types';
import { formatDuration, formatDateTime } from '../../utils/formatters';

interface CallSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callLog: CallLog | null;
}

export function CallSummaryDialog({ isOpen, onClose, callLog }: CallSummaryDialogProps) {
  if (!callLog) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Call Summary"
    >
      <div className="space-y-4">
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{callLog.lead_name}</h3>
              <p className="text-sm text-gray-500">{callLog.product_name}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              callLog.sentiment === 'positive' 
                ? 'bg-green-100 text-green-800'
                : callLog.sentiment === 'negative'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {callLog.sentiment === 'positive' && <ThumbsUp className="h-3 w-3 mr-1" />}
              {callLog.sentiment === 'negative' && <ThumbsDown className="h-3 w-3 mr-1" />}
              {callLog.sentiment === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
              {callLog.sentiment}
            </span>
          </div>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDuration(callLog.duration)}
            </div>
            <div>{formatDateTime(callLog.created_at)}</div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Call Summary</h4>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{callLog.summary}</p>
        </div>
      </div>
    </Dialog>
  );
}