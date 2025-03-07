import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { FeatureSection } from './FeatureSection';
import { PricingSection } from './PricingSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TestimonialSection } from './TestimonialSection';
import { Footer } from '../shared/Footer';
import { motion } from 'framer-motion';

const scrollToSection = (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export function LandingPage() {
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
              <Link to="/" className="flex items-center">
                <motion.span 
                  className="text-2xl font-bold relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-indigo-900/50 rounded-lg blur-lg"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <span className="relative bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Reach</span>
                  <span className="relative bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Genie</span>
                </motion.span>
              </Link>
            </motion.div>
            <nav className="flex items-center space-x-6">
              <a onClick={scrollToSection('how-it-works')} href="#how-it-works" className="text-gray-300 hover:text-white cursor-pointer">
                How It Works
              </a>
              <a onClick={scrollToSection('features')} href="#features" className="text-gray-300 hover:text-white cursor-pointer">
                Features
              </a>
              <a onClick={scrollToSection('testimonials')} href="#testimonials" className="text-gray-300 hover:text-white cursor-pointer">
                Testimonials
              </a>
              <a onClick={scrollToSection('pricing')} href="#pricing" className="text-gray-300 hover:text-white cursor-pointer">
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
        <HeroSection />
        <HowItWorksSection />
        <FeatureSection />
        <div id="testimonials">
          <TestimonialSection />
        </div>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}