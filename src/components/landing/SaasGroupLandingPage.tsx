import React from 'react';
import { Link } from 'react-router-dom';
import { SaasGroupHeroSection } from './SaasGroupHeroSection';
import { FeatureSection } from './FeatureSection';
import { PricingSection } from './PricingSection';
import { HowItWorksSection } from './HowItWorksSection';
import { Footer } from '../shared/Footer';
import { motion } from 'framer-motion';

export function SaasGroupLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/saas-group" className="flex items-center">
                <img 
                  src="https://saas.group/wp-content/uploads/logo-1.svg" 
                  alt="SaaS Group" 
                  className="h-8 mr-2"
                />
                <span className="text-xl font-semibold text-white">ReachGenie</span>
              </Link>
            </motion.div>
            <nav className="flex items-center space-x-6">
              <a href="#how-it-works" className="text-gray-300 hover:text-white cursor-pointer">
                How It Works
              </a>
              <a href="#features" className="text-gray-300 hover:text-white cursor-pointer">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white cursor-pointer">
                Pricing
              </a>
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
      <main className="flex-grow">
        <SaasGroupHeroSection />
        <HowItWorksSection />
        <FeatureSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
} 