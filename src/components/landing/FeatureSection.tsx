import React from 'react';
import { Mail, Phone, Database, Shield, BarChart, Zap } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Premium B2B Data',
    description: 'Access Cognism\'s comprehensive database of verified business contacts and company information.'
  },
  {
    icon: Mail,
    title: 'AI-Powered Email Outreach',
    description: 'Create personalized, compliant email campaigns that resonate with your target audience.'
  },
  {
    icon: Phone,
    title: 'Intelligent Phone Outreach',
    description: 'Leverage AI to optimize your calling strategy and increase connection rates.'
  },
  {
    icon: Shield,
    title: 'Global Compliance',
    description: 'Stay compliant with GDPR, CCPA, and other regulations with built-in compliance features.'
  },
  {
    icon: BarChart,
    title: 'Advanced Analytics',
    description: 'Track campaign performance and optimize your outreach with detailed analytics and insights.'
  },
  {
    icon: Zap,
    title: 'Sales Acceleration',
    description: 'Automate repetitive tasks and focus on what matters - closing deals and growing revenue.'
  }
];

export function FeatureSection() {
  return (
    <div id="features" className="py-24 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Everything you need to supercharge your sales
          </h2>
          <p className="text-lg text-gray-300">
            Powerful features to help your team close more deals efficiently
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-900 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-gray-800/50 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}