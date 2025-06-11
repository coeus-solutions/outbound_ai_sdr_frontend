import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../shared/Footer';

export function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Reach</span>
                  <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Genie</span>
                </span>
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-300">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using ReachGenie.ai, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
              <p className="leading-relaxed">
                Permission is granted to temporarily access the materials (information or software) on ReachGenie.ai's website for personal, non-commercial transitory viewing only.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. Disclaimer</h2>
              <p className="leading-relaxed">
                The materials on ReachGenie.ai's website are provided on an 'as is' basis. ReachGenie.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">4. Limitations</h2>
              <p className="leading-relaxed">
                In no event shall ReachGenie.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ReachGenie.ai's website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">5. Privacy</h2>
              <p className="leading-relaxed">
                Your use of ReachGenie.ai is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">6. Governing Law</h2>
              <p className="leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of Texas and you irrevocably submit to the exclusive jurisdiction of the courts in that State.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}