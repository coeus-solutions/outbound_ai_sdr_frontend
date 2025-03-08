import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const JazonByLyzrPage: React.FC = () => {
  const competitorName = "Jazon by Lyzr";
  const features = [
    "Automated outreach processes",
    "Predictive analytics for lead quality",
    "Personalized messaging",
    "Integration with major CRM platforms"
  ];
  const pricing = {
    "starter": "$89/month",
    "growth": "$179/month",
    "enterprise": "Contact for pricing"
  };
  const keyUSPs = [
    "Advanced AI for accurate lead scoring",
    "Easy-to-use interface",
    "Customizable outreach sequences"
  ];
  const reachGenieAdvantages = [
    "ReachGenie's conversational AI creates genuine two-way communication",
    "Our platform combines email and voice channels in a coordinated approach",
    "ReachGenie automatically handles meeting scheduling based on conversation context",
    "Our system continuously improves from real-world interaction outcomes",
    "Deep research capabilities provide truly personalized messaging beyond templates"
  ];

  // Customized feature comparison for Jazon by Lyzr
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: false // Limited conversation capabilities
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: 'partial' as const // Some multi-channel but not as integrated
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: 'partial' as const // Basic personalization
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: 'partial' as const // Has calendar functionality but not as seamless
    },
    {
      feature: "Self-improving AI system",
      reachGenie: true,
      competitor: 'partial' as const // Some learning capabilities
    },
    {
      feature: "Predictive lead scoring",
      reachGenie: true,
      competitor: true // This is a core strength
    },
    {
      feature: "CRM integration",
      reachGenie: true,
      competitor: true // Strong in this area
    },
    {
      feature: "Customizable outreach sequences",
      reachGenie: true,
      competitor: true // A key feature they promote
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