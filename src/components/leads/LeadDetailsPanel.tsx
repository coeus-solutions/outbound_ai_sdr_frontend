import React from 'react';
import { X, Building2, Mail, Phone, MapPin, Globe, Briefcase, Users, DollarSign, Calendar, Award, BookOpen, Linkedin, LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { LeadDetail } from '../../services/leads';

interface LeadDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  leadDetails: LeadDetail | null;
}

export function LeadDetailsPanel({ isOpen, onClose, leadDetails }: LeadDetailsPanelProps) {
  if (!isOpen || !leadDetails) return null;

  const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const DetailItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex items-start">
        <Icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="ml-3">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-sm text-gray-900">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Personal Information */}
          <DetailSection title="Personal Information">
            <DetailItem icon={Briefcase} label="Name" value={leadDetails.name} />
            <DetailItem icon={Mail} label="Email" value={leadDetails.email} />
            <DetailItem icon={Phone} label="Phone" value={leadDetails.phone_number} />
            <DetailItem icon={MapPin} label="Location" value={`${leadDetails.city}, ${leadDetails.state}, ${leadDetails.country}`} />
            <DetailItem icon={Award} label="Job Title" value={leadDetails.job_title} />
            <DetailItem icon={BookOpen} label="Education" value={leadDetails.education} />
            {leadDetails.personal_linkedin_url && (
              <a
                href={leadDetails.personal_linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                <span>LinkedIn Profile</span>
              </a>
            )}
          </DetailSection>

          {/* Company Information */}
          <DetailSection title="Company Information">
            <DetailItem icon={Building2} label="Company Name" value={leadDetails.company} />
            <DetailItem icon={Globe} label="Website" value={leadDetails.website} />
            <DetailItem icon={Users} label="Company Size" value={leadDetails.headcount?.toString()} />
            <DetailItem icon={DollarSign} label="Revenue" value={formatCurrency(Number(leadDetails.financials?.value))} />
            <DetailItem icon={Calendar} label="Founded" value={leadDetails.company_founded_year?.toString()} />
            <DetailItem icon={Building2} label="Company Type" value={leadDetails.company_type} />
            {leadDetails.company_linkedin_url && (
              <a
                href={leadDetails.company_linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                <span>Company LinkedIn</span>
              </a>
            )}
          </DetailSection>

          {/* Technologies */}
          {leadDetails.technologies && leadDetails.technologies.length > 0 && (
            <DetailSection title="Technologies">
              <div className="flex flex-wrap gap-2">
                {leadDetails.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Company Description */}
          {leadDetails.company_description && (
            <DetailSection title="Company Description">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{leadDetails.company_description}</p>
            </DetailSection>
          )}
        </div>
      </div>
    </div>
  );
} 