import React from 'react';
import { CompetitorPage } from './CompetitorPage';

export const JasonAIPage: React.FC = () => {
  const competitorName = "Jason AI (Reply.io)";
  const features = [
    "Personalized communication at scale",
    "Automated workflow streamlining",
    "AI-powered email writing",
    "Multi-channel outreach",
    "Lead scoring"
  ];
  const pricing = {
    "starter": "$70/month",
    "professional": "$120/month",
    "custom": "Contact for enterprise pricing"
  };
  const keyUSPs = [
    "Advanced NLP for human-like conversations",
    "Seamless integration with CRM systems",
    "Real-time performance analytics"
  ];
  const reachGenieAdvantages = [
    "ReachGenie offers true two-way conversational abilities, not just sending messages",
    "Our voice capabilities provide deeper personalization than Jason AI's outreach",
    "ReachGenie offers automated meeting booking integrated directly within conversations",
    "Our system continuously learns and improves from every interaction",
    "Purpose-built for sales development with specialized workflows"
  ];
  
  // Customized feature comparison for Jason AI
  const featureComparisons = [
    {
      feature: "True two-way conversation capabilities",
      reachGenie: true,
      competitor: 'partial' as const // They have some conversational abilities but not as advanced
    },
    {
      feature: "Multi-channel coordination (email + voice)",
      reachGenie: true,
      competitor: true // They do offer multi-channel including email and calls
    },
    {
      feature: "Deep AI-powered personalization",
      reachGenie: true,
      competitor: 'partial' as const // Their personalization is more template-based
    },
    {
      feature: "Automated meeting booking",
      reachGenie: true,
      competitor: true // They do have calendar integration
    },
    {
      feature: "Self-improving AI system",
      reachGenie: true,
      competitor: false // Not a emphasized feature of Jason AI
    },
    {
      feature: "Voice calling capabilities",
      reachGenie: true,
      competitor: 'partial' as const // They have basic calling but not as conversational
    },
    {
      feature: "Company and contact research",
      reachGenie: true,
      competitor: false // Not a core feature they advertise
    },
    {
      feature: "CRM integration",
      reachGenie: true,
      competitor: true // Strong in this area
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