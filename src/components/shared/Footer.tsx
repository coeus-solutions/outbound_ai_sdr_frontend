import React, { useState } from 'react';
import { TermsDialog } from './TermsDialog';
import { PrivacyDialog } from './PrivacyDialog';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="ReachGenie.ai Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">ReachGenie.ai</span>
            </div>
            <p className="mt-4 text-gray-600 text-sm">
              Empowering sales teams with AI-driven automations to reach and close more deals efficiently.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Us</h3>
            <address className="mt-4 not-italic text-sm text-gray-600">
              1606 Headway Cir<br />
              STE 9810<br />
              Austin, TX 78754<br />
              United States
            </address>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <button
                  onClick={() => setIsTermsOpen(true)}
                  className="text-gray-600 hover:text-indigo-600 text-sm text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-gray-600 hover:text-indigo-600 text-sm text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} ReachGenie.ai. All rights reserved.
          </p>
        </div>
      </div>

      <TermsDialog 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
      <PrivacyDialog 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </footer>
  );
} 