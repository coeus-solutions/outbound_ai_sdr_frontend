import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../shared/Footer';
import { motion } from 'framer-motion';
import { Menu, X, CheckCircle } from 'lucide-react';
import PartnerApplicationModal from './PartnerApplicationModal';
import { PartnershipType } from '../../types';

const scrollToSection = (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export function PartnerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartnershipType, setSelectedPartnershipType] = useState<PartnershipType>('RESELLER');
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };
  
  const openApplicationModal = (partnershipType: PartnershipType) => {
    setSelectedPartnershipType(partnershipType);
    setIsModalOpen(true);
  };
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Why Partner', id: 'why-partner' },
    { name: 'Benefits', id: 'benefits' },
    { name: 'Programs', id: 'programs' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Partner Application Modal */}
      <PartnerApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialPartnershipType={selectedPartnershipType}
      />

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
                item.path ? (
                  <Link 
                    key={item.name}
                    to={item.path}
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a 
                    key={item.id || ''}
                    onClick={scrollToSection(item.id || '')} 
                    href={`#${item.id}`} 
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    {item.name}
                  </a>
                )
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
                item.path ? (
                  <Link 
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.id || ''}
                    onClick={(e) => {
                      scrollToSection(item.id || '')(e);
                      setMobileMenuOpen(false);
                    }}
                    href={`#${item.id}`}
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {item.name}
                  </a>
                )
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
        {/* Hero section */}
        <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Grow With ReachGenie
              </motion.h1>
              <motion.p 
                className="mt-6 max-w-2xl mx-auto text-xl text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Join our partner ecosystem and build a successful business around ReachGenie's AI-powered sales development platform.
              </motion.p>
              <motion.div 
                className="mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button
                  onClick={() => openApplicationModal('RESELLER')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Apply for Partnership
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Partner section */}
        <section id="why-partner" className="py-16 bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Why Partner With ReachGenie</h2>
              <p className="mt-4 text-xl text-gray-300">
                Join forces with the future of AI-powered sales development
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Growing Market Opportunity</h3>
                <p className="text-gray-300">
                  The AI sales solutions market is expanding rapidly as companies look to scale their outreach without sacrificing quality. Partner with ReachGenie to capture this emerging opportunity and position yourself at the forefront of AI-driven sales innovation.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Differentiated Technology</h3>
                <p className="text-gray-300">
                  ReachGenie stands out with its true conversational AI capabilities that create authentic two-way conversations with prospects, not just automated messages. Our multi-channel approach and deep personalization create a unique value proposition for your clients.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Recurring Revenue Model</h3>
                <p className="text-gray-300">
                  Build a predictable revenue stream with our subscription-based model. Our partners enjoy attractive margins and ongoing commission from customer renewals, creating a sustainable business that grows over time.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Comprehensive Support</h3>
                <p className="text-gray-300">
                  We invest in our partners' success with comprehensive training, marketing resources, dedicated support, and joint go-to-market strategies. Our partnership is designed to ensure your success from day one.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Benefits section */}
        <section id="benefits" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Partner Benefits</h2>
              <p className="mt-4 text-xl text-gray-300">
                Everything you need to succeed with ReachGenie
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Financial Rewards",
                  features: [
                    "Competitive commission structure",
                    "Recurring revenue on renewals",
                    "Performance-based incentives",
                    "Deal registration protection",
                    "Tiered partnership levels"
                  ]
                },
                {
                  title: "Sales & Marketing Support",
                  features: [
                    "Co-branded marketing materials",
                    "Lead sharing opportunities",
                    "Joint webinars and events",
                    "Sales enablement resources",
                    "Partner portal access"
                  ]
                },
                {
                  title: "Technical Resources",
                  features: [
                    "Comprehensive partner training",
                    "Technical certification program",
                    "Pre-sales engineering support",
                    "Implementation assistance",
                    "Dedicated partner success manager"
                  ]
                }
              ].map((category, idx) => (
                <div key={idx} className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl">
                  <h3 className="text-xl font-semibold text-white mb-4">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400 mt-0.5" />
                        <span className="ml-3 text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Programs section */}
        <section id="programs" className="py-16 bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Partnership Programs</h2>
              <p className="mt-4 text-xl text-gray-300">
                Choose the partnership model that works for your business
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-2">Reseller Partners</h3>
                <p className="text-gray-300 flex-grow mb-4">
                  Sell ReachGenie directly to your customers and manage the entire customer relationship, from sales to support. Ideal for IT service providers, sales consultancies, and agencies looking to expand their offering.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-2 text-gray-300">Higher margins</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-2 text-gray-300">Full customer relationship</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-2 text-gray-300">White-label options available</span>
                  </li>
                </ul>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mt-auto"
                >
                  <button
                    onClick={() => openApplicationModal('RESELLER')}
                    className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Apply as Reseller
                  </button>
                </motion.div>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-2">Referral Partners</h3>
                <p className="text-gray-300 flex-grow mb-4">
                  Introduce ReachGenie to your network and earn commissions on successful referrals. Perfect for consultants, influencers, and professionals with access to businesses seeking sales solutions.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-2 text-gray-300">Simple engagement model</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-2 text-gray-300">Attractive referral fees</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-2 text-gray-300">Minimal commitment required</span>
                  </li>
                </ul>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mt-auto"
                >
                  <button
                    onClick={() => openApplicationModal('REFERRAL')}
                    className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Become a Referral Partner
                  </button>
                </motion.div>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-xl flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-2">Technology Partners</h3>
                <p className="text-gray-300 flex-grow mb-4">
                  Integrate ReachGenie with your technology solution to create joint value for customers. Ideal for CRM providers, marketing platforms, and other complementary technology vendors.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-2 text-gray-300">API access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-2 text-gray-300">Integration support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-2 text-gray-300">Joint marketing opportunities</span>
                  </li>
                </ul>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mt-auto"
                >
                  <button
                    onClick={() => openApplicationModal('TECHNOLOGY')}
                    className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Explore Technology Partnership
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Join Now CTA section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-indigo-900 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    Ready to grow with ReachGenie?
                  </h2>
                  <p className="mt-4 text-lg text-indigo-100 max-w-3xl">
                    Join our partner ecosystem today and start creating new revenue opportunities while helping businesses transform their sales development process.
                  </p>
                </div>
                <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <button
                      onClick={() => openApplicationModal('RESELLER')}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply for Partnership
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 