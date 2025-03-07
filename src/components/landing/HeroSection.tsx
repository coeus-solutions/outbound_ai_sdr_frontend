import React, { useState, useEffect } from 'react';
import { Sparkles, Mail, Phone, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Step data
const steps = [
  {
    title: "Add Your Product",
    description: "Enter your product details or value proposition"
  },
  {
    title: "Automatic Analysis",
    description: "ReachGenie analyzes and finds your USPs, competitors, pricing, and reviews"
  },
  {
    title: "Ideal Customer Profiles",
    description: "AI identifies your perfect customer personas based on product fit"
  },
  {
    title: "Quality Prospect Discovery",
    description: "Find thousands of high-quality prospects matching your ICPs"
  },
  {
    title: "Individual Insights",
    description: "Discover unique buying triggers and pain points for each prospect"
  },
  {
    title: "Multi-Channel Campaigns",
    description: "Create hyper-personalized pitches across email, voice, LinkedIn, and WhatsApp"
  },
  {
    title: "Automated Engagement",
    description: "Start outreach and let AI book demos or generate signups automatically"
  }
];

export function HeroSection() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Auto-advance through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <div className="relative overflow-hidden min-h-[90vh]">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/3129977/3129977-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-24">
        <div className="mx-auto max-w-3xl mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">AI-Powered Sales Development</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-8">
            Turn Cold Outreach Into Warm Conversations
          </h1>
          <p className="text-lg text-gray-100 mb-6">
            ReachGenie is an AI-powered sales development platform that creates authentic, personalized conversations with prospects through email and voice channels. Generate more meetings with less effort while maintaining the human touch that converts.
          </p>

          {/* Outreach Channels */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-400/20 rounded-lg">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-blue-400 font-medium">Email</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center bg-green-400/20 rounded-lg">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-green-400 font-medium">Voice</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-400/20 rounded-lg">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/72px-LinkedIn_icon.svg.png?20210220164014" 
                  alt="LinkedIn"
                  className="w-5 h-5"
                />
              </div>
              <span className="text-blue-400 font-medium">LinkedIn</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center bg-green-400/20 rounded-lg">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/72px-WhatsApp.svg.png" 
                  alt="WhatsApp"
                  className="w-5 h-5"
                />
              </div>
              <span className="text-green-400 font-medium">WhatsApp</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* Step Animation Section */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700 p-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">See How ReachGenie Works</h2>
          
          {/* Step Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={prevStep}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentStep === index ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextStep}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Main Step Animation */}
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-8 p-4"
              >
                {/* Step Image */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-md aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                    {currentStep === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-indigo-900/40">
                        <div className="text-center p-8">
                          <div className="text-5xl font-bold text-blue-400 mb-4">YOUR PRODUCT</div>
                          <div className="text-white text-lg">Start by describing what makes your offering unique</div>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-indigo-900/40">
                        <div className="text-center p-8">
                          <div className="flex justify-center mb-4">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="text-blue-400"
                            >
                              <Sparkles className="w-16 h-16" />
                            </motion.div>
                          </div>
                          <div className="text-white text-lg">AI analyzing your product...</div>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 2 && (
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.img 
                          src="/images/ICP.png" 
                          alt="Ideal Customer Profile" 
                          className="w-full h-full object-cover"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 3, ease: "easeOut" }}
                        />
                      </div>
                    )}
                    
                    {currentStep === 3 && (
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.img 
                          src="/images/Leads.png" 
                          alt="Leads Discovery" 
                          className="w-full h-full object-cover"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 3, ease: "easeOut" }}
                        />
                      </div>
                    )}
                    
                    {currentStep === 4 && (
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.img 
                          src="/images/EnrichedLeads.png" 
                          alt="Enriched Leads" 
                          className="w-full h-full object-cover"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 3, ease: "easeOut" }}
                        />
                      </div>
                    )}
                    
                    {currentStep === 5 && (
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.img 
                          src="/images/Campaigns.png" 
                          alt="Multi-Channel Campaigns" 
                          className="w-full h-full object-cover"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 3, ease: "easeOut" }}
                        />
                      </div>
                    )}
                    
                    {currentStep === 6 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                        <div className="text-center p-8">
                          <div className="flex justify-center space-x-4 mb-6">
                            <motion.div 
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="text-green-400"
                            >
                              <Phone className="w-10 h-10" />
                            </motion.div>
                            <motion.div 
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                              className="text-blue-400"
                            >
                              <Mail className="w-10 h-10" />
                            </motion.div>
                            <motion.div 
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                              className="text-blue-400"
                            >
                              <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/72px-LinkedIn_icon.svg.png?20210220164014" 
                                alt="LinkedIn"
                                className="w-10 h-10"
                              />
                            </motion.div>
                          </div>
                          <div className="text-white text-lg">AI engaging with prospects in real-time across multiple channels</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Step Text */}
                <div className="w-full lg:w-1/2 text-left">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold mb-4">
                    {currentStep + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{steps[currentStep].title}</h3>
                  <p className="text-gray-300 mb-6">{steps[currentStep].description}</p>
                  
                  {/* Highlight for the current step */}
                  {currentStep === 0 && (
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-xl p-4">
                      <p className="text-blue-300">
                        Simply tell us about your product or service, and ReachGenie takes care of the rest. No complicated setup required.
                      </p>
                    </div>
                  )}
                  
                  {currentStep === 1 && (
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-xl p-4">
                      <p className="text-blue-300">
                        Our AI researches your market, competitors, and unique selling points - automatically creating a comprehensive analysis.
                      </p>
                    </div>
                  )}
                  
                  {currentStep === 2 && (
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-xl p-4">
                      <p className="text-blue-300">
                        ReachGenie identifies detailed customer profiles with industry, size, pain points, and buying triggers most likely to need your solution.
                      </p>
                    </div>
                  )}
                  
                  {currentStep === 3 && (
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-xl p-4">
                      <p className="text-blue-300">
                        Find thousands of high-quality prospects matching your ideal customer profiles, with accurate contact information ready for outreach.
                      </p>
                    </div>
                  )}
                  
                  {currentStep === 4 && (
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-xl p-4">
                      <p className="text-blue-300">
                        <strong>Key differentiator:</strong> ReachGenie researches each individual prospect to understand their specific needs, challenges, and buying motivations.
                      </p>
                    </div>
                  )}
                  
                  {currentStep === 5 && (
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-xl p-4">
                      <p className="text-blue-300">
                        Create multi-channel campaigns with hyper-personalized messaging tailored to each prospect's unique situation and pain points.
                      </p>
                    </div>
                  )}
                  
                  {currentStep === 6 && (
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-xl p-4">
                      <p className="text-blue-300">
                        ReachGenie maintains natural conversations across channels, responding to inquiries, handling objections, and automatically booking meetings when interest is detected.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}