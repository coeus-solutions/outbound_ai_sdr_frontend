import React from 'react';
import { motion } from 'framer-motion';
import { CleanIcon, EnrichIcon, PersonalizeIcon, CampaignIcon, StrategyIcon } from './Icons';

const steps = [
  {
    icon: CleanIcon,
    title: 'Clean & Organize',
    description: 'Automatically consolidate and normalize leads from multiple sources (Cognism, ZoomInfo, etc.) to keep your pipeline accurate and clutter-free.',
    color: 'bg-gray-800',
    iconColor: 'text-blue-400'
  },
  {
    icon: EnrichIcon,
    title: 'Enrich & Analyze',
    description: 'Tap into AI-powered search engines that enrich every lead with deep insights and identify unique pain points relevant to your product or service.',
    color: 'bg-gray-800',
    iconColor: 'text-green-400'
  },
  {
    icon: PersonalizeIcon,
    title: 'Hyper Personalization',
    description: 'Transform generic outreach into tailored conversations. ReachGenie dynamically crafts pitches that speak directly to each lead’s needs and motivations.',
    color: 'bg-gray-800',
    iconColor: 'text-purple-400'
  },
  {
    icon: CampaignIcon,
    title: 'Execute Campaigns',
    description: 'Launch drip campaigns via email, phone, LinkedIn, or WhatsApp—complete with follow-ups and real-time performance tracking to continually optimize.',
    color: 'bg-gray-800',
    iconColor: 'text-orange-400'
  },
  {
    icon: StrategyIcon,
    title: 'Strategic Control',
    description: 'You define the overall strategy; ReachGenie does the heavy lifting. Monitor progress, adjust on the fly, and watch conversions soar with actionable analytics.',
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
            How ReachGenie Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            AI-Driven Efficiency Meets Human-Centric Strategy
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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-2xl font-medium text-white">
            Execute your outreach across{' '}
            <span className="text-indigo-400">Emails</span>,{' '}
            <span className="text-green-400">Phone</span>,{' '}
            <span className="text-blue-400">LinkedIn</span>, and{' '}
            <span className="text-emerald-400">WhatsApp</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
} 