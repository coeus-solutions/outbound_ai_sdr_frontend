import React from 'react';
import { motion } from 'framer-motion';
import { CleanIcon, EnrichIcon, PersonalizeIcon, CampaignIcon, StrategyIcon } from './Icons';

const steps = [
  {
    icon: PersonalizeIcon,
    title: 'Creating Authentic Conversations',
    description: 'ReachGenie doesn\'t just send messages - it builds meaningful two-way conversations with prospects through intelligent, contextual engagement.',
    color: 'bg-gray-800',
    iconColor: 'text-blue-400'
  },
  {
    icon: EnrichIcon,
    title: 'Deep Personalization',
    description: 'Our AI researches each company and contact to identify specific pain points, creating outreach that speaks directly to each prospect\'s unique situation.',
    color: 'bg-gray-800',
    iconColor: 'text-green-400'
  },
  {
    icon: CampaignIcon,
    title: 'Multi-Channel Coordination',
    description: 'Seamlessly mix email and voice outreach with unified context across channels, ensuring a cohesive prospect experience that feels natural and human.',
    color: 'bg-gray-800',
    iconColor: 'text-purple-400'
  },
  {
    icon: StrategyIcon,
    title: 'Automated Meeting Booking',
    description: 'ReachGenie detects meeting interest in emails and calls, then automatically handles scheduling without human intervention, all within the natural flow of conversation.',
    color: 'bg-gray-800',
    iconColor: 'text-orange-400'
  },
  {
    icon: CleanIcon,
    title: 'Self-Improving System',
    description: 'The platform learns from every interaction to continuously improve outreach effectiveness, analyzing which messages generate responses and which calls lead to meetings.',
    color: 'bg-gray-800',
    iconColor: 'text-indigo-400'
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-4"
          >
            What Makes ReachGenie Special
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            ReachGenie is a complete AI-powered platform that autonomously manages sales development with human-like precision.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className={`${step.color} rounded-xl p-8 transform transition-transform duration-300 hover:scale-105 border border-gray-700`}
            >
              <div className={`${step.iconColor} mb-6`}>
                <step.icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 