import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const ArtisanAIPage: React.FC = () => {
  const competitorName = "Artisan AI";
  const features = [
    "AI agents for BDR tasks (Ava)",
    "Customer success automation (Elijah)",
    "Workflow enhancement",
    "Task automation"
  ];
  const pricing = {
    "starter": "$149/month",
    "team": "$299/month",
    "enterprise": "Custom pricing available"
  };
  const keyUSPs = [
    "Specialized AI agents for different roles",
    "Seamless integration with existing tools",
    "Continuous learning and improvement"
  ];
  const reachGenieAdvantages = [
    "ReachGenie offers more advanced conversational AI for natural interactions",
    "Our platform provides voice capabilities for more comprehensive outreach",
    "ReachGenie includes deeper personalization through AI research",
    "Our system offers integrated meeting booking within conversation flow",
    "ReachGenie delivers a more unified platform rather than separate agents"
  ];

  // Customized feature comparison for Artisan AI
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: 'partial' as const // Some conversational capabilities
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: false // Primarily email-focused
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: 'partial' as const // Some personalization but less research-driven
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: 'partial' as const // Basic scheduling capabilities
    },
    {
      feature: "Self-improving AI system",
      reachGenie: true,
      competitor: true // Continuous learning is a key feature
    },
    {
      feature: "Role-specific AI capabilities",
      reachGenie: true,
      competitor: true // This is a core strength
    },
    {
      feature: "Workflow automation",
      reachGenie: true,
      competitor: true // Strong in this area
    },
    {
      feature: "Unified platform approach",
      reachGenie: true,
      competitor: false // Uses separate agents for different tasks
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