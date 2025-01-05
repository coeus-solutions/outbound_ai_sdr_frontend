import React from 'react';
import { Bot } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { FeatureSection } from './FeatureSection';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">SDR AI</span>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <HeroSection />
        <FeatureSection />
      </main>
    </div>
  );
}