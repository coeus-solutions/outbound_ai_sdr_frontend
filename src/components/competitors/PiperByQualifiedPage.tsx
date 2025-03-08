import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const PiperByQualifiedPage: React.FC = () => {
  const competitorName = "Piper by Qualified";
  const features = [
    "Customer behavior analysis",
    "Intent identification",
    "Lead segmentation",
    "Conversion likelihood prediction"
  ];
  const pricing = {
    "starter": "$99/month",
    "business": "$199/month",
    "enterprise": "Custom pricing"
  };
  const keyUSPs = [
    "Real-time lead qualification",
    "Integration with popular CRM systems",
    "Customizable scoring models"
  ];
  const reachGenieAdvantages = [
    "ReachGenie offers comprehensive outreach capabilities, not just lead qualification",
    "Our platform provides true conversational AI for authentic engagement",
    "ReachGenie includes voice calling capabilities for multi-channel outreach",
    "Our system automates meeting booking based on conversation context",
    "ReachGenie delivers end-to-end automation from research to meeting booking"
  ];

  // Customized feature comparison for Piper by Qualified
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: false // Focused on qualification, not conversation
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: false // Primarily qualification-focused
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: 'partial' as const // Good at behavior analysis but limited personalization
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: false // Not a core feature
    },
    {
      feature: "Advanced lead qualification",
      reachGenie: true,
      competitor: true // This is their specialty
    },
    {
      feature: "Behavioral analysis & intent prediction",
      reachGenie: true,
      competitor: true // Core strength
    },
    {
      feature: "CRM integration",
      reachGenie: true,
      competitor: true // Strong in this area
    },
    {
      feature: "Outreach automation",
      reachGenie: true,
      competitor: false // More focused on qualification than outreach
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