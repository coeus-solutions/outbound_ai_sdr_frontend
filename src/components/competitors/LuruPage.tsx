import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const LuruPage: React.FC = () => {
  const competitorName = "Luru";
  const features = [
    "Lead qualification automation",
    "Multi-channel engagement",
    "Automated cold email sending",
    "Smart follow-up scheduling"
  ];
  const pricing = {
    "starter": "$79/month",
    "pro": "$159/month",
    "enterprise": "Contact for pricing"
  };
  const keyUSPs = [
    "Comprehensive lead management",
    "Intuitive user interface",
    "Robust reporting and analytics"
  ];
  const reachGenieAdvantages = [
    "ReachGenie's AI can conduct true two-way conversations, not just send messages",
    "Our voice capabilities offer more natural and effective engagement",
    "ReachGenie's automated meeting booking is seamlessly integrated",
    "Our system continuously learns and improves from every conversation",
    "ReachGenie provides deeper AI-powered research for better personalization"
  ];

  // Customized feature comparison for Luru
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: 'partial' as const // Basic reply handling
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: 'partial' as const // Has multiple channels but less integrated
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: false // More template-based
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: true // Has scheduling capabilities
    },
    {
      feature: "Self-improving AI system",
      reachGenie: true,
      competitor: false // Not a key feature
    },
    {
      feature: "Smart follow-up sequences",
      reachGenie: true,
      competitor: true // This is a strength
    },
    {
      feature: "Reporting and analytics",
      reachGenie: true,
      competitor: true // Strong in this area
    },
    {
      feature: "Lead management dashboard",
      reachGenie: true,
      competitor: true // A core feature
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