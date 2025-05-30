import React from 'react';
import { Sparkles, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CognismHeroSection() {
  return (
    <div className="relative overflow-hidden min-h-[80vh]">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/50 z-10" />
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
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">AI-Powered Sales Development</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-8">
            Transform Your Cognism Outreach Campaigns with Human-assisted AI Agents
          </h1>
          <p className="text-lg text-gray-100 mb-6">
            Combine Cognism's world-class B2B data with AI-powered outreach to connect with the right decision-makers and close more deals.
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
              <span className="text-green-400 font-medium">Phone</span>
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 rounded-lg text-blue-600 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 