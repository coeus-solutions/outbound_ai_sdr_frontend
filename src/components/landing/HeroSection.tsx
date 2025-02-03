import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden min-h-[80vh]">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Increased overlay opacity */}
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
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">AI-Powered Sales Development</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-8">
            Transform Your Outreach Campaigns with Human-assisted AI Agents
          </h1>
          <p className="text-lg text-gray-100 mb-10">
          Empower your sales team with intelligent automation, real-time insights, and data-driven decision-making. Deliver hyper-personalized, multi-channel campaigns that convert more prospects into customers with minimal effort.
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
              className="inline-flex items-center px-6 py-3 rounded-lg text-indigo-600 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}