import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const DynamicPricingCalculator = () => {
  const [leads, setLeads] = useState(2500);
  const [pricingModel, setPricingModel] = useState<'performance' | 'base'>('performance');
  const [channels, setChannels] = useState({
    email: true,
    phone: false,
    linkedin: false,
    whatsapp: false,
  });

  const handleLeadsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeads(Number(e.target.value));
  };

  const channelConfig = {
    email: { name: 'Email', icon: '📧', available: true },
    phone: { name: 'Phone', icon: '📞', available: true },
    linkedin: { name: 'LinkedIn', icon: '💼', available: false },
    whatsapp: { name: 'WhatsApp', icon: '💬', available: false },
  };

  const toggleChannel = (channelName: keyof typeof channels) => {
    if (!channelConfig[channelName].available) return;
    setChannels((prev) => ({
      ...prev,
      [channelName]: !prev[channelName],
    }));
  };

  const basePrice = pricingModel === 'base' ? 800 : 0;
  const enrichmentCost = leads * 0.03; // Always include enrichment cost
  const emailCost = channels.email ? leads * 0.02 : 0;  // Email cost for both models
  const phoneCost = channels.phone ? leads * 0.60 : 0;  // Phone cost for both models
  const conversionRate = 0.02; // 2% conversion rate
  const estimatedSuccesses = Math.round(leads * conversionRate);
  const successFee = pricingModel === 'performance' && (channels.email || channels.phone)
    ? estimatedSuccesses * 60
    : 0;
  const totalCost = basePrice + enrichmentCost + emailCost + phoneCost + successFee;

  return (
    <div className="bg-gray-800 rounded-3xl p-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-white mb-4">Flexible Pricing for Your Needs</h3>
        <p className="text-lg text-gray-300">Choose between performance-based or fixed pricing</p>
      </div>

      <div className="space-y-8">
        {/* Pricing Model Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPricingModel('performance')}
            className={`p-6 rounded-xl border-2 transition-all ${
              pricingModel === 'performance'
                ? 'border-indigo-400 bg-gray-700'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <h4 className="text-xl font-semibold text-white mb-2">Performance Based</h4>
            <p className="text-gray-300 text-sm">Pay $60 per successful conversion</p>
          </button>
          <button
            onClick={() => setPricingModel('base')}
            className={`p-6 rounded-xl border-2 transition-all ${
              pricingModel === 'base'
                ? 'border-indigo-400 bg-gray-700'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <h4 className="text-xl font-semibold text-white mb-2">Fixed Plan</h4>
            <p className="text-gray-300 text-sm">$800/month + enrichment, emails and calls</p>
          </button>
        </div>

        {/* Leads Slider */}
        <div>
          <label className="block text-gray-300 mb-4">
            <span className="font-medium text-lg">Enriched Leads per Month: {leads.toLocaleString()}</span>
            <input
              type="range"
              min="2500"
              max="10000"
              step="100"
              value={leads}
              onChange={handleLeadsChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-4"
            />
          </label>
          <div className="flex justify-between text-sm text-gray-400">
            <span>2,500</span>
            <span>10,000</span>
          </div>
        </div>

        {/* Campaign Channels */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Campaign Channels</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(channelConfig).map(([key, value]) => (
              <button
                key={key}
                onClick={() => toggleChannel(key as keyof typeof channels)}
                className={`p-4 rounded-xl border transition-all relative ${
                  value.available
                    ? channels[key as keyof typeof channels]
                      ? 'border-indigo-400 bg-gray-700'
                      : 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-700 opacity-75 cursor-not-allowed'
                }`}
                disabled={!value.available}
              >
                <div className="text-2xl mb-2">{value.icon}</div>
                <div className="text-white font-medium">{value.name}</div>
                {!value.available && (
                  <div className="absolute inset-0 bg-gray-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-indigo-400 font-medium text-sm">Coming Soon</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price Calculation */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="text-center">
            <h4 className="text-3xl font-bold text-white mb-4">
              Estimated Monthly Cost: ${totalCost.toFixed(2)}
            </h4>
            <p className="text-gray-300">
              {pricingModel === 'performance' ? (
                <>
                  ${enrichmentCost.toFixed(2)} for enrichment
                  {emailCost > 0 && ` + $${emailCost.toFixed(2)} for email campaigns`}
                  {phoneCost > 0 && ` + $${phoneCost.toFixed(2)} for phone campaigns`}
                  {successFee > 0 && (
                    <>
                      <br />
                      Plus estimated {estimatedSuccesses} successes at $60 each = ${successFee.toFixed(2)}
                    </>
                  )}
                </>
              ) : (
                <>
                  $800 base fee
                  {enrichmentCost > 0 && ` + $${enrichmentCost.toFixed(2)} for enrichment`}
                  {emailCost > 0 && ` + $${emailCost.toFixed(2)} for email campaigns`}
                  {phoneCost > 0 && ` + $${phoneCost.toFixed(2)} for phone campaigns`}
                </>
              )}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors text-lg font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started Free
          </Link>
          <p className="text-gray-400 mt-4">7-day free trial capped at 500 lead enrichment + email engagement and phone (no custom number).</p>
        </div>
      </div>
    </div>
  );
};

export function PricingSection() {
  return (
    <div id="pricing" className="py-24 bg-gray-900">

        
        {/* Dynamic Pricing Calculator */}
        <DynamicPricingCalculator />

    </div>
  );
} 