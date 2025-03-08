import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PricingSection } from '../landing/PricingSection';
import { ArrowLeft, Check, X, Minus } from 'lucide-react';
import { Footer } from '../shared/Footer';

// Define the type for feature comparison
interface FeatureComparison {
  feature: string;
  reachGenie: boolean;
  competitor: boolean | 'partial';
}

interface CompetitorPageProps {
  competitorName: string;
  features: string[];
  pricing: {
    [key: string]: string;
  };
  keyUSPs: string[];
  reachGenieAdvantages: string[];
  featureComparisons: FeatureComparison[];
}

export const CompetitorPage: React.FC<CompetitorPageProps> = ({
  competitorName,
  features,
  pricing,
  keyUSPs,
  reachGenieAdvantages,
  featureComparisons,
}) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="bg-gray-900 py-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Reach</span><span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Genie</span>
              </span>
            </Link>
          </div>
          <div>
            <Link 
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Comparison Hero */}
      <div className="bg-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mb-6">
            ReachGenie vs {competitorName}
          </h1>
          <p className="text-xl opacity-90 mb-8">
            See how ReachGenie stacks up against {competitorName} for AI-powered sales development
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-700">
            {/* ReachGenie Column */}
            <div className="p-8">
              <div className="mb-4">
                <span className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Reach</span><span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Genie</span>
                </span>
              </div>

              <h3 className="text-lg font-medium text-white mb-6">The AI-powered Sales Development Platform</h3>

              <div className="space-y-4 mb-8">
                <h4 className="font-medium text-white">Key Features:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-gray-300">True conversational AI with two-way email communication</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-gray-300">Multi-channel coordination across email and voice</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-gray-300">AI-powered research and personalization</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-gray-300">Automated meeting booking and follow-up</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-gray-300">Self-improving system that learns from results</p>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-900/50 rounded-lg p-4 border border-indigo-800 mb-8">
                <h4 className="font-medium text-indigo-300 mb-3">Our Advantages:</h4>
                <ul className="space-y-2">
                  {reachGenieAdvantages.map((advantage, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-indigo-400" />
                      </div>
                      <p className="ml-3 text-indigo-200">{advantage}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Link
                  to="/signup"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Try ReachGenie Free
                </Link>
              </div>
            </div>

            {/* Competitor Column */}
            <div className="p-8 bg-gray-700/30">
              <h2 className="text-2xl font-bold text-white mb-4">{competitorName}</h2>
              <h3 className="text-lg font-medium text-gray-300 mb-6">AI Sales Development Solution</h3>

              <div className="space-y-4 mb-8">
                <h4 className="font-medium text-white">Key Features:</h4>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="ml-3 text-gray-400">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h4 className="font-medium text-white mb-3">Pricing:</h4>
                <div className="bg-gray-800/70 p-4 rounded border border-gray-700">
                  <ul className="space-y-2">
                    {Object.entries(pricing).map(([tier, price]) => (
                      <li key={tier} className="flex justify-between">
                        <span className="text-gray-400 capitalize">{tier}:</span>
                        <span className="font-medium text-gray-300">{price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="font-medium text-gray-300 mb-3">USPs:</h4>
                <ul className="space-y-2">
                  {keyUSPs.map((usp, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-gray-500" />
                      </div>
                      <p className="ml-3 text-gray-400">{usp}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Feature Comparison</h2>
        
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-800/70">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Feature</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">ReachGenie</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">{competitorName}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {featureComparisons.map((comparison, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-300">{comparison.feature}</td>
                  <td className="px-6 py-4 text-center">
                    {comparison.reachGenie ? 
                      <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    }
                  </td>
                  <td className="px-6 py-4 text-center">
                    {comparison.competitor === true ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : comparison.competitor === 'partial' ? (
                      <Minus className="h-5 w-5 text-yellow-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ReachGenie Pricing */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">ReachGenie Pricing</h2>
          <PricingSection />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to try a better alternative?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Experience the ReachGenie difference with our 7-day free trial.
          </p>
          <div>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}; 