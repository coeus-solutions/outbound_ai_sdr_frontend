import React from 'react';
import { HeroSection } from './HeroSection';
import { FeatureSection } from './FeatureSection';
import { Footer } from '../shared/Footer';

const scrollToSection = (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-0">
              <img src="/images/logo.png" alt="ReachGenie.ai Logo" className="h-8" />
              <span className="text-xl font-bold text-gray-900">ReachGenie.ai</span>
            </div>
            <nav className="flex items-center space-x-4">
              <a onClick={scrollToSection('features')} href="#features" className="text-gray-600 hover:text-gray-900 cursor-pointer">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
}