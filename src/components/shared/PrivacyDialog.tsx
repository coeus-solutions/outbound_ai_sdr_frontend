import React from 'react';
import { X } from 'lucide-react';

interface PrivacyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyDialog({ isOpen, onClose }: PrivacyDialogProps) {
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
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h3>
              <p className="text-gray-600">
                We collect information that you provide directly to us, including when you create an account, 
                use our services, or communicate with us. This may include your name, email address, company 
                information, and any other information you choose to provide.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h3>
              <p className="text-gray-600">
                We use the information we collect to provide, maintain, and improve our services, to communicate 
                with you, and to develop new products and services. We may also use your information to protect 
                the security and integrity of our platform.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Information Sharing</h3>
              <p className="text-gray-600">
                We do not sell your personal information. We may share your information with third-party service 
                providers who assist us in operating our platform, conducting our business, or serving our users. 
                These providers have access to your information only to perform these tasks on our behalf.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">4. Data Security</h3>
              <p className="text-gray-600">
                We implement appropriate technical and organizational measures to protect the security of your 
                personal information. However, please note that no method of transmission over the Internet or 
                electronic storage is 100% secure.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">5. Your Rights</h3>
              <p className="text-gray-600">
                You have the right to access, correct, or delete your personal information. You may also have 
                the right to restrict or object to certain processing of your information. To exercise these 
                rights, please contact us using the information provided below.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">6. Changes to This Policy</h3>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new privacy policy on this page and updating the effective date.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">7. Contact Us</h3>
              <p className="text-gray-600">
                If you have any questions about this privacy policy or our practices, please contact us at 
                privacy@reachgenie.ai or write to us at: 1606 Headway Cir, STE 9810, Austin, TX 78754.
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