import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { CreateLeadPayload, createLead } from '../../services/leads';
import { useToast } from '../../context/ToastContext';
import { getToken } from '../../utils/auth';

interface AddLeadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onLeadAdded: () => void;
}

export function AddLeadPanel({ isOpen, onClose, companyId, onLeadAdded }: AddLeadPanelProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateLeadPayload>({
    name: '',
    email: '',
    company: '',
    phone_number: '',
    job_title: '',
    company_size: '',
    website: '',
    personal_linkedin_url: '',
    lead_source: '',
    country: '',
    city: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      showToast('Name is required', 'error');
      return;
    }

    if (!formData.email) {
      showToast('Email is required', 'error');
      return;
    }

    if (!formData.company) {
      showToast('Company is required', 'error');
      return;
    }

    if (!formData.website) {
      showToast('Website is required', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed', 'error');
        return;
      }
      
      await createLead(token, companyId, formData);
      showToast('Lead added successfully', 'success');
      onLeadAdded();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone_number: '',
        job_title: '',
        company_size: '',
        website: '',
        personal_linkedin_url: '',
        lead_source: '',
        country: '',
        city: '',
      });
    } catch (error) {
      console.error('Error adding lead:', error);
      showToast(error instanceof Error ? error.message : 'Failed to add lead', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Add New Lead</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company*
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website*
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="company_size" className="block text-sm font-medium text-gray-700">
                Company Size
              </label>
              <input
                type="text"
                id="company_size"
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="personal_linkedin_url" className="block text-sm font-medium text-gray-700">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="personal_linkedin_url"
                name="personal_linkedin_url"
                value={formData.personal_linkedin_url}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="lead_source" className="block text-sm font-medium text-gray-700">
                Lead Source
              </label>
              <input
                type="text"
                id="lead_source"
                name="lead_source"
                value={formData.lead_source}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 