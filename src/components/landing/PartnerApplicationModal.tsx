import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PartnerApplication, PartnershipType } from '../../types';
import { submitPartnerApplication } from '../../services/partners';
import { motion, AnimatePresence } from 'framer-motion';

interface PartnerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPartnershipType?: PartnershipType;
}

const PartnerApplicationModal: React.FC<PartnerApplicationModalProps> = ({
  isOpen,
  onClose,
  initialPartnershipType = 'RESELLER',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PartnerApplication>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    partnershipType: initialPartnershipType,
    companySize: '1-10',
    industry: '',
    motivation: '',
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
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitPartnerApplication(formData);
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      partnershipType: initialPartnershipType,
      companySize: '1-10',
      industry: '',
      motivation: '',
    });
    setIsSuccess(false);
    setErrorMessage(null);
  };

  const handleClose = () => {
    onClose();
    // Reset the form after the modal close animation
    setTimeout(resetForm, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity z-[9999]"
              onClick={handleClose}
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
              className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-xl z-[10000] relative"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl leading-6 font-bold text-white">
                        {isSuccess ? 'Application Submitted!' : 'Partner Application'}
                      </h3>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {isSuccess ? (
                      <div className="mt-8 mb-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900 bg-opacity-50">
                          <svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="mt-4 text-xl font-medium text-white">Thank you for your interest!</p>
                        <p className="mt-2 text-gray-300">
                          Your application has been successfully submitted. We'll review your information and reach out to you soon.
                        </p>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="mt-4">
                        {errorMessage && (
                          <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-md text-red-200">
                            {errorMessage}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label htmlFor="partnershipType" className="block text-sm font-medium text-gray-300">
                              Partnership Type*
                            </label>
                            <select
                              id="partnershipType"
                              name="partnershipType"
                              value={formData.partnershipType}
                              onChange={handleChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            >
                              <option value="RESELLER">Reseller Partner</option>
                              <option value="REFERRAL">Referral Partner</option>
                              <option value="TECHNOLOGY">Technology Partner</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
                              Company Name*
                            </label>
                            <input
                              type="text"
                              id="companyName"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            />
                          </div>

                          <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-gray-300">
                              Industry*
                            </label>
                            <input
                              type="text"
                              id="industry"
                              name="industry"
                              value={formData.industry}
                              onChange={handleChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            />
                          </div>

                          <div>
                            <label htmlFor="companySize" className="block text-sm font-medium text-gray-300">
                              Company Size*
                            </label>
                            <select
                              id="companySize"
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            >
                              <option value="1-10">1-10 employees</option>
                              <option value="11-50">11-50 employees</option>
                              <option value="51-200">51-200 employees</option>
                              <option value="201-500">201-500 employees</option>
                              <option value="501+">501+ employees</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-300">
                              Website
                            </label>
                            <input
                              type="text"
                              id="website"
                              name="website"
                              value={formData.website}
                              onChange={handleChange}
                              placeholder="example.com"
                              className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            />
                          </div>

                          <div>
                            <label htmlFor="contactName" className="block text-sm font-medium text-gray-300">
                              Your Name*
                            </label>
                            <input
                              type="text"
                              id="contactName"
                              name="contactName"
                              value={formData.contactName}
                              onChange={handleChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            />
                          </div>

                          <div>
                            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300">
                              Your Email*
                            </label>
                            <input
                              type="email"
                              id="contactEmail"
                              name="contactEmail"
                              value={formData.contactEmail}
                              onChange={handleChange}
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            />
                          </div>

                          <div>
                            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-300">
                              Your Phone
                            </label>
                            <input
                              type="tel"
                              id="contactPhone"
                              name="contactPhone"
                              value={formData.contactPhone}
                              onChange={handleChange}
                              className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            />
                          </div>

                          <div className="col-span-2">
                            <label htmlFor="motivation" className="block text-sm font-medium text-gray-300">
                              Why are you interested in partnering with ReachGenie?*
                            </label>
                            <textarea
                              id="motivation"
                              name="motivation"
                              value={formData.motivation}
                              onChange={handleChange}
                              required
                              rows={3}
                              className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            />
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-transparent text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PartnerApplicationModal; 