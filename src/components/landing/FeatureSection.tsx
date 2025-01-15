import React from 'react';
import { Bot, BarChart, Phone, Users } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Insights',
    description: 'Get real-time analysis of customer interactions and actionable insights to improve your sales strategy.'
  },
  {
    icon: Phone,
    title: 'Smart Call Tracking',
    description: 'Automatically record and analyze sales calls with AI-powered sentiment analysis and key takeaways.'
  },
  {
    icon: Users,
    title: 'Lead Management',
    description: 'Efficiently organize and prioritize leads with intelligent scoring and automated follow-ups.'
  },
  {
    icon: BarChart,
    title: 'Performance Analytics',
    description: 'Track team performance with detailed analytics and AI-generated improvement suggestions.'
  }
];

export function FeatureSection() {
  return (
    <div id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Everything you need to supercharge your sales
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features to help your team close more deals efficiently
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}