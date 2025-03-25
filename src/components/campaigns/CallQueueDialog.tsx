import React from 'react';
import { X } from 'lucide-react';
import { CallQueue } from '../../services/calls';
import { formatDateTime } from '../../utils/formatters';

interface CallQueueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callQueue: CallQueue | null;
}

export function CallQueueDialog({ isOpen, onClose, callQueue }: CallQueueDialogProps) {
  if (!isOpen || !callQueue) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                Call Queue Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Lead Information</h4>
                  <p className="mt-1">{callQueue.lead_name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{callQueue.lead_phone || 'No phone'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Call Script</h4>
                  <pre className="mt-1 whitespace-pre-wrap text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                    {callQueue.call_script || 'No script available'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 