import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const GemEByUserGemsPage: React.FC = () => {
  const competitorName = "Gem-E by UserGems";
  const features = [
    "Lead interaction tracking",
    "Conversion potential prediction",
    "Automated outreach sequences",
    "Integration with sales intelligence tools"
  ];
  const pricing = {
    "starter": "$119/month",
    "growth": "$239/month",
    "enterprise": "Custom pricing"
  };
  const keyUSPs = [
    "Advanced machine learning algorithms",
    "Comprehensive lead lifecycle tracking",
    "Actionable insights for sales teams"
  ];
  const reachGenieAdvantages = [
    "ReachGenie offers true two-way conversational capabilities not just sequences",
    "Our platform includes voice channel capabilities for more effective outreach",
    "ReachGenie's automated meeting booking is integrated within natural conversations",
    "Our system researches companies and prospects for deeper personalization",
    "ReachGenie provides a more complete end-to-end sales development solution"
  ];

  // Customized feature comparison for Gem-E by UserGems
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: false // More focused on sequences than conversations
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: false // Primarily email-focused
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: 'partial' as const // Some personalization capabilities
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: 'partial' as const // Basic functionality
    },
    {
      feature: "Lead lifecycle tracking",
      reachGenie: true,
      competitor: true // This is a core strength
    },
    {
      feature: "Conversion prediction",
      reachGenie: true,
      competitor: true // Strong in this area
    },
    {
      feature: "Sales intelligence integration",
      reachGenie: true,
      competitor: true // Key feature
    },
    {
      feature: "Voice calling capabilities",
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