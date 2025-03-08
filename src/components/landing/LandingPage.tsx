import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { HeroSection } from './HeroSection';
import { StrapiHeroSection } from './StrapiHeroSection';
import { FeatureSection } from './FeatureSection';
import { PricingSection } from './PricingSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TestimonialSection } from './TestimonialSection';
import { Footer } from '../shared/Footer';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const scrollToSection = (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };
  
  const navItems = [
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'Features', id: 'features' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Pricing', id: 'pricing' }
  ];
  
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
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map(item => (
                <a 
                  key={item.id}
                  onClick={scrollToSection(item.id)} 
                  href={`#${item.id}`} 
                  className="text-gray-300 hover:text-white cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
              {navItems.map(item => (
                <a
                  key={item.id}
                  onClick={(e) => {
                    scrollToSection(item.id)(e);
                    setMobileMenuOpen(false);
                  }}
                  href={`#${item.id}`}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-grow">
        <StrapiHeroSection pageIdentifier="home" />
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