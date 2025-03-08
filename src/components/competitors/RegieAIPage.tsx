import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const RegieAIPage: React.FC = () => {
  const competitorName = "Regie AI";
  const features = [
    "Personalized outreach automation",
    "Lead qualification",
    "Dynamic messaging adjustment",
    "Multi-channel campaign management"
  ];
  const pricing = {
    "basic": "$99/month",
    "pro": "$199/month",
    "enterprise": "Contact for custom pricing"
  };
  const keyUSPs = [
    "AI-driven content personalization",
    "Behavioral analysis for lead scoring",
    "Continuous optimization of outreach strategies"
  ];
  const reachGenieAdvantages = [
    "ReachGenie offers true conversational AI that maintains context across interactions",
    "Our voice capabilities create a more engaging multi-channel experience",
    "ReachGenie automates meeting scheduling based on natural conversation flow",
    "Our system provides deeper research capabilities for better personalization",
    "ReachGenie's platform learns and improves from real-world conversation outcomes"
  ];

  // Customized feature comparison for Regie AI
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: 'partial' as const // Some conversation abilities
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: true // Good multi-channel support
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: true // Strong in content personalization
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: 'partial' as const // Basic scheduling
    },
    {
      feature: "Self-improving AI system",
      reachGenie: true,
      competitor: true // Continuous optimization is a key feature
    },
    {
      feature: "Contextual follow-up handling",
      reachGenie: true,
      competitor: 'partial' as const // Some capabilities
    },
    {
      feature: "Campaign analytics",
      reachGenie: true,
      competitor: true // Strong in this area
    },
    {
      feature: "Behavioral lead scoring",
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