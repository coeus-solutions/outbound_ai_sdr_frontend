import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TermsDialog } from './TermsDialog';
import { PrivacyDialog } from './PrivacyDialog';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Reach</span><span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Genie</span>
              </span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Empowering sales teams with AI-driven automations to reach and close more deals efficiently.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact Us</h3>
            <address className="mt-4 not-italic text-sm text-gray-400">
              1606 Headway Cir<br />
              STE 9810<br />
              Austin, TX 78754<br />
              United States
            </address>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Compare To</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link to="/compare/jason-ai" className="text-gray-400 hover:text-indigo-400 text-sm">
                      Jason AI (Reply.io)
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare/aisdr" className="text-gray-400 hover:text-indigo-400 text-sm">
                      AiSDR
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare/jazon-by-lyzr" className="text-gray-400 hover:text-indigo-400 text-sm">
                      Jazon by Lyzr
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare/alice-by-11x" className="text-gray-400 hover:text-indigo-400 text-sm">
                      Alice by 11x
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare/luru" className="text-gray-400 hover:text-indigo-400 text-sm">
                      Luru
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare/regie-ai" className="text-gray-400 hover:text-indigo-400 text-sm">
                      Regie AI
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link to="/compare/bosh-by-relevance" className="text-gray-400 hover:text-indigo-400 text-sm">
                      Bosh by Relevance
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare/piper-by-qualified" className="text-gray-400 hover:text-indigo-400 text-sm">
                      Piper by Qualified
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare/meetchase-ai-sdr" className="text-gray-400 hover:text-indigo-400 text-sm">
                      MeetChase AI SDR
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare/gem-e-by-usergems" className="text-gray-400 hover:text-indigo-400 text-sm">
                      Gem-E by UserGems
                    </Link>
                  </li>
                  <li>
                    <Link to="/compare/artisan-ai" className="text-gray-400 hover:text-indigo-400 text-sm">
                      Artisan AI
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <button
                  onClick={() => setIsTermsOpen(true)}
                  className="text-gray-400 hover:text-indigo-400 text-sm text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-gray-400 hover:text-indigo-400 text-sm text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} LeanAI Ventures LLC. All rights reserved.
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