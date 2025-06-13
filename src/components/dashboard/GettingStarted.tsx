import React from 'react';
import { Building2, Package, Users, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StepProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  isCompleted?: boolean;
  action?: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ 
  stepNumber,
  icon, 
  title, 
  description,
  isCompleted = false,
  action
}) => (
  <div className="relative flex items-start p-6 rounded-lg transition-all duration-200 bg-white border-2 border-indigo-500 shadow-lg">
    {/* Step Number Circle */}
    <div className="absolute -left-4 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500 text-white">
      {stepNumber}
    </div>
    
    {/* Content */}
    <div className="ml-8 flex-1">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-indigo-900">
              {title}
            </h3>
            {isCompleted && (
              <span className="text-indigo-600 text-sm font-medium">Completed</span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          {action && (
            <div className="mt-4">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export function GettingStarted() {
  // In a real application, you would get this data from your backend
  const steps = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Create Your Company",
      description: "Start by setting up your company. This is where you'll manage all your outreach campaigns and team settings.",
      isCompleted: false,
      action: (
        <Link
          to="/companies/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Company
        </Link>
      )
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Add Your Products",
      description: "Define the products or services you want to promote. This helps us tailor your outreach campaigns for better results.",
      isCompleted: false
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Import Your Leads",
      description: "Upload your target audience or create new leads. You can import from CSV files or add leads manually.",
      isCompleted: false
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Create and Run Campaign",
      description: "Set up your first campaign with personalized messages and automated follow-ups.",
      isCompleted: false
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-indigo-900">Welcome to ReachGenie!</h1>
        <p className="mt-4 text-lg text-gray-500">
          Let's get you set up with everything you need to start connecting with potential customers.
          Follow these steps to configure your account and launch your first campaign.
        </p>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-indigo-200" />
        
        {/* Steps list */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <Step
              key={index}
              stepNumber={index + 1}
              {...step}
            />
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-indigo-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-indigo-900">Need Help?</h3>
        <p className="mt-2 text-sm text-gray-500">
          Our support team is here to help you get started. You can reach out to us directly.
        </p>
        <div className="mt-4">
          <a
            href="mailto:support@workhub.ai"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
} 