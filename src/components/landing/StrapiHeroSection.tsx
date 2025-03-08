import React, { useState, useEffect } from 'react';
import { Sparkles, Mail, Phone, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getHeroSection, HeroSection as HeroSectionType, getStrapiMedia, getSteps, Step } from '../../services/content';

// Fallback step data if Strapi content is not available
const fallbackSteps = [
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

interface StrapiHeroSectionProps {
  pageIdentifier?: string;
}

export function StrapiHeroSection({ pageIdentifier = 'home' }: StrapiHeroSectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [heroData, setHeroData] = useState<HeroSectionType | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch hero section and steps data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [heroData, stepsData] = await Promise.all([
          getHeroSection(pageIdentifier),
          getSteps(pageIdentifier)
        ]);
        
        setHeroData(heroData);
        
        // Sort steps by order if steps data is available
        if (stepsData && stepsData.length > 0) {
          setSteps(stepsData.sort((a, b) => 
            (a.attributes.Order || 0) - (b.attributes.Order || 0)
          ));
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageIdentifier]);
  
  // Auto-advance through steps
  useEffect(() => {
    const maxSteps = steps.length > 0 ? steps.length : fallbackSteps.length;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % maxSteps);
    }, 5000);
    return () => clearInterval(interval);
  }, [steps]);

  const nextStep = () => {
    const maxSteps = steps.length > 0 ? steps.length : fallbackSteps.length;
    setCurrentStep((prev) => (prev + 1) % maxSteps);
  };

  const prevStep = () => {
    const maxSteps = steps.length > 0 ? steps.length : fallbackSteps.length;
    setCurrentStep((prev) => (prev - 1 + maxSteps) % maxSteps);
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    console.error('Error loading content:', error);
    // Fall back to the original implementation
  }

  // If there's no Strapi data, use the original implementation
  const title = heroData?.attributes.Title || "Turn Cold Outreach Into Warm Conversations";
  const subtitle = heroData?.attributes.Subtitle || 
    "ReachGenie is an AI-powered sales development platform that creates authentic, personalized conversations with prospects through email and voice channels. Generate more meetings with less effort while maintaining the human touch that converts.";
  const buttonText = heroData?.attributes.ButtonText || "Start Free Trial";
  const buttonLink = heroData?.attributes.ButtonLink || "/signup";
  // If there's a background image in Strapi, use it, otherwise use the video background
  const hasBackgroundImage = heroData?.attributes.backgroundImage?.data?.attributes?.url;

  // Use Strapi steps if available, otherwise use fallback
  const displaySteps = steps.length > 0 
    ? steps.map(step => ({
        title: step.attributes.Title,
        description: step.attributes.Description,
        detailedDescription: step.attributes.DetailedDescription || step.attributes.Description,
        stepNumber: step.attributes.StepNumber || 0
      }))
    : fallbackSteps.map((step, index) => ({
        title: step.title,
        description: step.description,
        detailedDescription: step.description,
        stepNumber: index + 1
      }));

  return (
    <div className="relative overflow-hidden min-h-[90vh]">
      {/* Background (Video or Image) */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {hasBackgroundImage ? (
          <img 
            src={getStrapiMedia(heroData.attributes.backgroundImage.data.attributes.url)}
            alt="Background"
            className="w-full h-full object-cover"
          />
        ) : (
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
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-24">
        <div className="mx-auto max-w-3xl mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">AI-Powered Sales Development</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-8">
            {title}
          </h1>
          <p className="text-lg text-gray-100 mb-6">
            {subtitle}
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
              to={buttonLink}
              className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {buttonText}
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
              {displaySteps.map((_, index) => (
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
                {/* Step Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {displaySteps[currentStep].stepNumber}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{displaySteps[currentStep].title}</h3>
                  <p className="text-gray-300">{displaySteps[currentStep].description}</p>
                  
                  {/* Detailed Description Box */}
                  <div className="mt-4 p-4 bg-gray-800/70 border border-gray-700 rounded-lg">
                    <p className="text-blue-300">{displaySteps[currentStep].detailedDescription}</p>
                  </div>
                </div>
                
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
                        <img 
                          src="/images/ICP.png" 
                          alt="Ideal Customer Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {currentStep === 3 && (
                      <div className="absolute inset-0 overflow-hidden">
                        <img 
                          src="/images/Leads.png" 
                          alt="Leads Discovery" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {currentStep === 4 && (
                      <div className="absolute inset-0 overflow-hidden">
                        <img 
                          src="/images/EnrichedLeads.png" 
                          alt="Enriched Leads" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {currentStep === 5 && (
                      <div className="absolute inset-0 overflow-hidden">
                        <img 
                          src="/images/Campaigns.png" 
                          alt="Multi-Channel Campaigns" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {currentStep === 6 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-900/40 to-blue-900/40">
                        <div className="text-center p-8">
                          <div className="text-5xl font-bold text-green-400 mb-4">MEETINGS BOOKED</div>
                          <div className="text-white text-lg">Let AI handle meeting booking automatically</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 