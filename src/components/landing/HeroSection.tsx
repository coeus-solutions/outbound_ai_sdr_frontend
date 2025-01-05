import React from 'react';
import { Bot, Sparkles, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">AI-Powered Sales Development</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-8">
            Transform Your Sales Process with AI
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Empower your sales team with intelligent automation, real-time insights, and data-driven decision making.
            Close more deals with less effort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}