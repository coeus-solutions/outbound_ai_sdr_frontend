import React from 'react';
import { motion } from 'framer-motion';
import { CleanIcon, EnrichIcon, PersonalizeIcon, CampaignIcon, StrategyIcon } from './Icons';

const steps = [
  {
    icon: CleanIcon,
    title: 'Clean & Organize',
    description: 'ReachGenie automatically cleans and organizes your leads, ensuring data quality and consistency.',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    icon: EnrichIcon,
    title: 'Enrich & Analyze',
    description: 'Leads are enriched with valuable insights to understand how they can benefit from your product or service.',
    color: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    icon: PersonalizeIcon,
    title: 'Hyper Personalization',
    description: 'Creates highly personalized pitches based on your product features and lead characteristics.',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    icon: CampaignIcon,
    title: 'Execute Campaigns',
    description: 'Runs targeted campaigns and continuously tracks success rates for optimization.',
    color: 'bg-orange-50',
    iconColor: 'text-orange-600'
  },
  {
    icon: StrategyIcon,
    title: 'Strategic Control',
    description: 'You define the strategy, ReachGenie handles the execution with precision.',
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
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
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            How ReachGenie Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Let AI handle the manual tasks while you focus on strategy
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
              className={`${step.color} rounded-xl p-8 transform transition-transform duration-300 hover:scale-105`}
            >
              <div className={`${step.iconColor} mb-6`}>
                <step.icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
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
          <p className="text-2xl font-medium text-gray-900">
            You define the strategy, ReachGenie executes with precision
          </p>
        </motion.div>
      </div>
    </section>
  );
} 