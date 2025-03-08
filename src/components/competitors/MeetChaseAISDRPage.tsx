import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const MeetChaseAISDRPage: React.FC = () => {
  const competitorName = "MeetChase AI SDR";
  const features = [
    "Multi-channel lead qualification",
    "Personalized outreach",
    "Automated follow-ups",
    "Performance analytics"
  ];
  const pricing = {
    "basic": "$89/month",
    "pro": "$179/month",
    "enterprise": "Contact for pricing"
  };
  const keyUSPs = [
    "Specialized in B2B lead generation",
    "Adaptive learning from successful campaigns",
    "Easy-to-use dashboard"
  ];
  const reachGenieAdvantages = [
    "ReachGenie offers more advanced conversational AI capabilities",
    "Our platform provides deeper personalization through AI research",
    "ReachGenie's automated meeting booking is more robust and contextual",
    "Our system supports voice calling for enhanced multi-channel outreach",
    "ReachGenie delivers more comprehensive analytics and performance insights"
  ];

  // Customized feature comparison for MeetChase AI SDR
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: 'partial' as const // Some conversation capabilities
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: 'partial' as const // Has multiple channels but less integrated
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: 'partial' as const // Basic personalization
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: true // Has meeting booking features
    },
    {
      feature: "Self-improving AI system",
      reachGenie: true,
      competitor: 'partial' as const // Some adaptive learning
    },
    {
      feature: "B2B lead generation focus",
      reachGenie: true,
      competitor: true // This is their specialty
    },
    {
      feature: "Campaign analytics",
      reachGenie: true,
      competitor: true // Strong in this area
    },
    {
      feature: "Company research capabilities",
      reachGenie: true,
      competitor: false // Limited research functionality
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