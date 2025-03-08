import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const AiSDRPage: React.FC = () => {
  const competitorName = "AiSDR";
  const features = [
    "Automated lead prospecting",
    "Lead qualification",
    "Engagement automation",
    "Machine learning-based lead classification"
  ];
  const pricing = {
    "basic": "$99/month",
    "pro": "$199/month",
    "enterprise": "Custom pricing"
  };
  const keyUSPs = [
    "High accuracy in lead qualification",
    "Scalable for businesses of all sizes",
    "Continuous learning and improvement"
  ];
  const reachGenieAdvantages = [
    "ReachGenie offers more comprehensive multi-channel outreach including voice",
    "Our system provides true conversational AI that can handle complex replies",
    "ReachGenie automates meeting scheduling within the natural conversation flow",
    "Our platform includes deeper research capabilities for better personalization",
    "End-to-end solution from research to conversation to meeting booking"
  ];

  // Customized feature comparison for AiSDR
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: 'partial' as const // Basic response capabilities
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: false // Primarily email-focused
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: true // Strong in AI-driven personalization
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: 'partial' as const // Basic calendar functionality
    },
    {
      feature: "Self-improving AI system",
      reachGenie: true,
      competitor: true // Machine learning is a core feature
    },
    {
      feature: "Voice calling capabilities",
      reachGenie: true,
      competitor: false // Not a core feature
    },
    {
      feature: "Advanced lead qualification",
      reachGenie: true,
      competitor: true // This is their specialty
    },
    {
      feature: "Comprehensive analytics dashboard",
      reachGenie: true,
      competitor: 'partial' as const // Basic analytics
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