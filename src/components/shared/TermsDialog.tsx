import React from 'react';
import { X } from 'lucide-react';

interface TermsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsDialog({ isOpen, onClose }: TermsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative bg-white rounded-lg max-w-3xl w-full p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h3>
              <p className="text-gray-600">
                By accessing and using ReachGenie.ai, you accept and agree to be bound by the terms and 
                provision of this agreement.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Use License</h3>
              <p className="text-gray-600">
                Permission is granted to temporarily access the materials (information or software) on 
                ReachGenie.ai's website for personal, non-commercial transitory viewing only.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Disclaimer</h3>
              <p className="text-gray-600">
                The materials on ReachGenie.ai's website are provided on an 'as is' basis. ReachGenie.ai 
                makes no warranties, expressed or implied, and hereby disclaims and negates all other 
                warranties including, without limitation, implied warranties or conditions of merchantability, 
                fitness for a particular purpose, or non-infringement of intellectual property or other 
                violation of rights.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">4. Limitations</h3>
              <p className="text-gray-600">
                In no event shall ReachGenie.ai or its suppliers be liable for any damages (including, 
                without limitation, damages for loss of data or profit, or due to business interruption) 
                arising out of the use or inability to use the materials on ReachGenie.ai's website.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">5. Privacy</h3>
              <p className="text-gray-600">
                Your use of ReachGenie.ai is also governed by our Privacy Policy. Please review our 
                Privacy Policy, which also governs the Site and informs users of our data collection practices.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">6. Governing Law</h3>
              <p className="text-gray-600">
                These terms and conditions are governed by and construed in accordance with the laws of 
                Texas and you irrevocably submit to the exclusive jurisdiction of the courts in that State.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 