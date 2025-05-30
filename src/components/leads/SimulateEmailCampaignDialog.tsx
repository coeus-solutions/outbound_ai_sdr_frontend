import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Mail, Loader2, ChevronRight } from 'lucide-react';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../services/products';
import { config } from '../../config';

interface SimulateEmailCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  leadId: string;
  products: Product[];
}

interface EmailContent {
  subject: string;
  body: string;
}

interface SimulatedEmails {
  original: EmailContent;
  reminders: EmailContent[];
}

export function SimulateEmailCampaignDialog({
  isOpen,
  onClose,
  companyId,
  leadId,
  products
}: SimulateEmailCampaignDialogProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmails | null>(null);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number>(0);
  const [numberOfReminders, setNumberOfReminders] = useState<number>(7);
  const { showToast } = useToast();

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0].id);
    }
  }, [products, selectedProduct]);

  const handleSimulate = async () => {
    if (!selectedProduct) {
      showToast('Please select a product', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const response = await fetch(`${config.apiUrl}/api/companies/${companyId}/leads/${leadId}/simulate-campaign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: selectedProduct,
          number_of_reminders: numberOfReminders
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to simulate campaign');
      }

      const data = await response.json();
      setSimulatedEmails(data.data);
      setSelectedEmailIndex(0);
      showToast('Campaign simulation generated successfully', 'success');
    } catch (error) {
      console.error('Error simulating campaign:', error);
      showToast(error instanceof Error ? error.message : 'Failed to simulate campaign', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmailLabel = (index: number) => {
    if (index === 0) return 'Original Email';
    return `Reminder ${index}`;
  };

  const renderEmailContent = () => {
    if (!simulatedEmails) return null;

    const email = selectedEmailIndex === 0 
      ? simulatedEmails.original 
      : simulatedEmails.reminders[selectedEmailIndex - 1];

    if (!email) return null;

    return (
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Subject:</h3>
          <p className="text-base font-medium text-gray-900">{email.subject}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Body:</h3>
          <div 
            className="prose prose-sm max-w-none text-gray-900"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Simulate Email Campaign</h2>
            <button
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          {!simulatedEmails ? (
            <div className="flex-1 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a product...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Reminders (Max 7)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={numberOfReminders}
                    onChange={(e) => setNumberOfReminders(Math.min(7, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleSimulate}
                  disabled={isLoading || !selectedProduct}
                  className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Campaign...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Simulate Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden">
              {/* Email List Sidebar */}
              <div className="w-64 border-r border-gray-200 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Campaign Emails</h3>
                  <div className="space-y-1">
                    {[...Array(numberOfReminders + 1)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedEmailIndex(index)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedEmailIndex === index
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{getEmailLabel(index)}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email Content Area */}
              {renderEmailContent()}
            </div>
          )}

          {/* Footer */}
          {simulatedEmails && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSimulatedEmails(null);
                  setSelectedEmailIndex(0);
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Simulate Again
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}