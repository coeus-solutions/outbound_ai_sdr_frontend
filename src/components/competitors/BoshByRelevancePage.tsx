import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const BoshByRelevancePage: React.FC = () => {
  const competitorName = "Bosh by Relevance";
  const features = [
    "AI-powered lead prioritization",
    "Automated personalized email content",
    "Machine learning for lead scoring",
    "Integration with major sales tools"
  ];
  const pricing = {
    "basic": "$129/month",
    "advanced": "$249/month",
    "custom": "Enterprise pricing available"
  };
  const keyUSPs = [
    "High-precision lead scoring",
    "Time-saving email content generation",
    "Adaptive learning from sales outcomes"
  ];
  const reachGenieAdvantages = [
    "ReachGenie offers true conversational AI, not just email content generation",
    "Our platform integrates both email and voice channels in a unified approach",
    "ReachGenie provides automated meeting booking based on conversation context",
    "Our system offers more comprehensive personalization through AI research",
    "ReachGenie provides a more cost-effective solution with flexible pricing"
  ];

  // Customized feature comparison for Bosh by Relevance
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: false // Limited to content generation
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: false // Primarily email-focused
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: 'partial' as const // Good content personalization but limited context
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: 'partial' as const // Basic calendar functionality
    },
    {
      feature: "Self-improving AI system",
      reachGenie: true,
      competitor: true // Adaptive learning is a key feature
    },
    {
      feature: "Lead prioritization",
      reachGenie: true,
      competitor: true // This is a core strength
    },
    {
      feature: "Enterprise integration capabilities",
      reachGenie: true,
      competitor: true // Strong in integration with sales tools
    },
    {
      feature: "Voice outreach capabilities",
      reachGenie: true,
      competitor: false // Not a core feature
    }
  ];

  return (
    <CompetitorPage
      competitorName={competitorName}
      features={features}
      pricing={pricing}
      keyUSPs={keyUSPs}
      reachGenieAdvantages={reachGenieAdvantages}
      featureComparisons={featureComparisons}
    />
  );
}; 