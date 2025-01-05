import React, { useState } from 'react';
import { Lead, Product } from '../../types';
import { Facebook, Twitter, Phone } from 'lucide-react';
import { CallDialog } from './CallDialog';

// Mock products data - replace with actual data fetching
const mockProducts: Product[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Enterprise CRM',
    description: 'Complete customer relationship management solution',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    companyId: '1',
    name: 'Analytics Suite',
    description: 'Advanced business analytics and reporting',
    createdAt: new Date().toISOString(),
  },
];

interface LeadTableProps {
  leads: Lead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);

  const handleInitiateCall = (productId: string) => {
    if (selectedLead) {
      console.log(`Initiating call with ${selectedLead.name} for product ${productId}`);
      // Add your call initiation logic here
      setIsCallDialogOpen(false);
      setSelectedLead(null);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Social</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.jobTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Size: {lead.companySize}</div>
                    <div className="text-sm text-gray-500">Revenue: {lead.companyRevenue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      {lead.companyFacebook && (
                        <a
                          href={`https://${lead.companyFacebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {lead.companyTwitter && (
                        <a
                          href={`https://${lead.companyTwitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsCallDialogOpen(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CallDialog
        isOpen={isCallDialogOpen}
        onClose={() => {
          setIsCallDialogOpen(false);
          setSelectedLead(null);
        }}
        products={mockProducts}
        lead={selectedLead}
        onInitiateCall={handleInitiateCall}
      />
    </>
  );
}