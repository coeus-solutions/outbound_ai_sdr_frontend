import React from 'react';
import { Target, Mail, Phone, Goal } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Generate targeted leads',
    description: 'Our AI Agents generate targeted leads for your product / service and demographics.'
  },
  {
    icon: Mail,
    title: 'Smart email outreach',
    description: 'Our AI agents create a hyper personalized outbound campaign to reach out and engage your prospects.'
  },
  {
    icon: Phone,
    title: 'Smart call outreach',
    description: 'Our AI agents define personalized pitch for prospects and then make calls to reach out.'
  },
  {
    icon: Goal,
    title: 'Personalize goals',
    description: "You can define whether you want meetings, engagement, or just spread out a message. It's completely up to you."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-900 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-gray-800/50 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-indigo-400" />
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