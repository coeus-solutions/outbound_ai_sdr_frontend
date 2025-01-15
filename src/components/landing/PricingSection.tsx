import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const tiers = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for small teams getting started with AI-powered sales',
    features: [
      'Up to 2 team members',
      '500 AI-powered lead analyses per month',
      'Basic sales analytics',
      'Email campaign automation',
      'Standard support'
    ],
    cta: 'Start Free Trial',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    description: 'Ideal for growing teams that need more power and features',
    features: [
      'Up to 10 team members',
      '2,000 AI-powered lead analyses per month',
      'Advanced analytics & reporting',
      'Custom email campaigns',
      'Priority support',
      'Sales performance insights',
      'CRM integration'
    ],
    cta: 'Get Started',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations with custom needs',
    features: [
      'Unlimited team members',
      'Unlimited AI-powered lead analyses',
      'Custom analytics solutions',
      'Advanced API access',
      'Dedicated account manager',
      'Custom integrations',
      '24/7 premium support',
      'Custom training sessions'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

export function PricingSection() {
  return (
    <div id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600">
            Choose the perfect plan for your team's needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${
                tier.highlighted
                  ? 'bg-white shadow-xl ring-1 ring-indigo-600 scale-105'
                  : 'bg-white shadow-lg'
              }`}
            >
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-600 ml-1">{tier.period}</span>
                </div>
                <p className="text-gray-600">{tier.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                to="/signup"
                className={`w-full inline-flex justify-center items-center px-6 py-3 rounded-lg text-center transition-colors ${
                  tier.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 