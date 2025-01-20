import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Package, Users, Mail, Phone } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

const Step: React.FC<StepProps> = ({ icon, title, description, link, buttonText }) => (
  <div className="relative flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-4">
        <Link
          to={link}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  </div>
);

export function GettingStarted() {
  const steps = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Set up your company",
      description: "Create your company profile and configure basic settings to get started.",
      link: "/companies/new",
      buttonText: "Create Company"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Add your products",
      description: "Add the products or services you want to promote to potential leads.",
      link: "/companies",
      buttonText: "Manage Products"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Upload leads",
      description: "Import your leads from a CSV file or add them manually to start reaching out.",
      link: "/leads/upload",
      buttonText: "Upload Leads"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Run email campaigns",
      description: "Create and manage email campaigns to engage with your leads effectively.",
      link: "/campaigns/email/new",
      buttonText: "Create Email Campaign"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Start phone campaigns",
      description: "Set up phone campaigns to connect with leads through voice calls.",
      link: "/campaigns/phone/new",
      buttonText: "Create Phone Campaign"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Getting Started</h2>
        <p className="mt-4 text-lg text-gray-500">
          Follow these steps to set up your outreach campaigns and start connecting with potential customers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {steps.map((step, index) => (
          <Step key={index} {...step} />
        ))}
      </div>


    </div>
  );
} 