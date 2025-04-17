import React from 'react';
import { Mail, Phone, Calendar, Brain, BarChart, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Mail,
    title: 'AI-Powered Email Personalization',
    description: 'Its AI email agents analyze each lead, identify their unique pain points, and generate highly personalized emails that address each prospect\'s specific needs.'
  },
  {
    icon: MessageSquare,
    title: 'AI-Powered Conversational Emails',
    description: 'It serves as an email automation tool that engages prospects, sends replies, and addresses objections, keeping the conversation smooth and engaging.'
  },
  {
    icon: Phone,
    title: 'AI Voice Calling',
    description: 'Engage prospects with natural-sounding AI voice calls that adapt to responses in real-time, creating authentic conversations that convert.'
  },
  {
    icon: Calendar,
    title: 'Intelligent Meeting Booking',
    description: 'Automatically schedule meetings when prospects express interest, handling time zones, availability, and follow-ups without human intervention.'
  },
  {
    icon: Brain,
    title: 'Multi-Channel Coordination',
    description: 'Seamlessly coordinate email and voice outreach with unified context across channels, creating a cohesive prospect experience.'
  },
  {
    icon: BarChart,
    title: 'In-depth Analytics',
    description: 'Track campaign performance in real-time, measure response rates and conversions, and continuously optimize your outreach strategy based on data.'
  }
];

export function FeatureSection() {
  return (
    <div id="features" className="py-24 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            True Conversational AI for Sales Development
          </h2>
          <p className="text-lg text-gray-300">
            ReachGenie doesn't just send messages — it builds relationships through authentic two-way conversations
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