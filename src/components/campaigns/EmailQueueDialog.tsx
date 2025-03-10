import React from 'react';
import { X } from 'lucide-react';
import { EmailQueue } from '../../services/emailCampaigns';

interface EmailQueueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  emailQueue: EmailQueue | null;
}

export function EmailQueueDialog({ isOpen, onClose, emailQueue }: EmailQueueDialogProps) {
  if (!isOpen || !emailQueue) return null;

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
                Email Content
              </h3>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <p className="text-sm text-gray-500">Subject: <span className="text-gray-900">{emailQueue.subject}</span></p>
              </div>
              <div className="mt-4 prose max-w-none">
                <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[60vh]">
                  <div 
                    className="text-sm text-gray-700 email-content [&_p]:mb-4 [&_a]:text-blue-600 [&_a]:underline [&_ul]:mb-4 [&_ul]:pl-8 [&_ol]:mb-4 [&_ol]:pl-8 [&_li]:mb-2 [&_img]:max-w-full [&_img]:h-auto [&_img]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-gray-500"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                      lineHeight: 1.6,
                    }}
                    dangerouslySetInnerHTML={{ __html: emailQueue.email_body }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 