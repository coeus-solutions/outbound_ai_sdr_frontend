import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const AliceBy11xPage: React.FC = () => {
  const competitorName = "Alice by 11x";
  const features = [
    "Automated prospecting",
    "NLP-powered engagement",
    "Personalized email generation",
    "Adaptive response handling"
  ];
  const pricing = {
    "basic": "$150/month",
    "premium": "$300/month",
    "enterprise": "Custom pricing"
  };
  const keyUSPs = [
    "Human-like conversation abilities",
    "Self-learning capabilities",
    "Seamless integration with existing workflows"
  ];
  const reachGenieAdvantages = [
    "ReachGenie offers multi-channel coordination across email and voice",
    "Our platform provides more comprehensive automated meeting booking",
    "ReachGenie's AI research capabilities deliver deeper personalization",
    "Our solution offers end-to-end workflow from research to conversion",
    "ReachGenie's pricing model aligns better with your sales success"
  ];

  // Customized feature comparison for Alice by 11x
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: true // This is their core strength
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: false // Primarily email-focused
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: true // Strong NLP capabilities
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: 'partial' as const // Basic scheduling
    },
    {
      feature: "Self-improving AI system",
      reachGenie: true,
      competitor: true // Self-learning is a key feature
    },
    {
      feature: "Voice calling capabilities",
      reachGenie: true,
      competitor: false // Not a core feature
    },
    {
      feature: "Workflow integration",
      reachGenie: true,
      competitor: true // Strong in this area
    },
    {
      feature: "Cost-effective pricing",
      reachGenie: true,
      competitor: false // Generally more expensive
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