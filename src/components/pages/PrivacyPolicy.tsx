import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../shared/Footer';

export function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-300">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="leading-relaxed">
                We collect information that you provide directly to us, including when you create an account, use our services, or communicate with us. This may include your name, email address, company information, and any other information you choose to provide.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to develop new products and services. We may also use your information to protect the security and integrity of our platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p className="leading-relaxed">
                We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our platform, conducting our business, or serving our users. These providers have access to your information only to perform these tasks on our behalf.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="leading-relaxed">
                You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your information. To exercise these rights, please contact us using the information provided below.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">6. Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the effective date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this privacy policy or our practices, please contact us at privacy@reachgenie.ai or write to us at: 1606 Headway Cir, STE 9810, Austin, TX 78754.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}