import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
  highlight: string;
  avatarColor: string;
  initial: string;
}

const testimonials: Testimonial[] = [
  {
    content: "ReachGenie's ability to identify each prospect's specific pain points and buying triggers is mind-blowing. We're seeing 3x higher response rates because our outreach now speaks directly to what matters most to each individual company.",
    author: "Aiko Tanaka",
    role: "VP of Sales",
    company: "TechScale Solutions",
    highlight: "Prospect Enrichment",
    avatarColor: "bg-blue-500",
    initial: "A"
  },
  {
    content: "The automated reply and meeting booking functionality saved my team 20+ hours per week. When prospects show interest, ReachGenie handles the conversation and schedules meetings instantly - no more back-and-forth emails or missed opportunities.",
    author: "Rahul Sharma",
    role: "Director of Business Development",
    company: "GrowthForge Inc.",
    highlight: "Auto Reply & Booking",
    avatarColor: "bg-purple-500",
    initial: "R"
  },
  {
    content: "Before ReachGenie, we were paying 3x more for lower quality leads. Now we get thousands of highly targeted prospects that match our ideal customer profile, with detailed insights on each one. The ROI is unmatched in the industry.",
    author: "Sofia Rodriguez",
    role: "CMO",
    company: "RevenuePilot",
    highlight: "Lead Generation",
    avatarColor: "bg-green-500",
    initial: "S"
  }
];

export function TestimonialSection() {
  return (
    <section id="testimonials" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Trusted by Sales Teams Everywhere
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            See how ReachGenie transforms outreach and drives results
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700 relative"
            >
              {/* Highlight Badge */}
              <div className="absolute -top-4 left-8 bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                {testimonial.highlight}
              </div>
              
              {/* Quote Icon */}
              <div className="mb-6 text-blue-400">
                <Quote className="w-10 h-10 opacity-50" />
              </div>
              
              {/* Testimonial Content */}
              <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="mr-4">
                  <div className={`${testimonial.avatarColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {testimonial.initial}
                  </div>
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.author}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Metrics Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700"
          >
            <div className="text-4xl font-bold text-blue-400 mb-2">3x</div>
            <div className="text-white">Higher Response Rates</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700"
          >
            <div className="text-4xl font-bold text-blue-400 mb-2">20+</div>
            <div className="text-white">Hours Saved Per Week</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700"
          >
            <div className="text-4xl font-bold text-blue-400 mb-2">70%</div>
            <div className="text-white">Lower Cost Per Lead</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 