import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog } from '../shared/Dialog';
import { Product } from '../../services/products';
import { getToken } from '../../utils/auth';
import { getLeadEmailScript, EmailScriptResponse } from '../../services/leads';
import { useToast } from '../../context/ToastContext';

interface EmailScriptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  leadId: string;
  products: Product[];
}

export function EmailScriptDialog({ isOpen, onClose, companyId, leadId, products }: EmailScriptDialogProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailScript, setEmailScript] = useState<EmailScriptResponse | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setSelectedProductId('');
      setEmailScript(null);
    }
  }, [isOpen]);

  const handleProductSelect = async (productId: string) => {
    setSelectedProductId(productId);
    
    if (!productId) return;
    
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }
      
      const script = await getLeadEmailScript(token, companyId, leadId, productId);
      setEmailScript(script);
    } catch (error) {
      console.error('Error fetching email script:', error);
      showToast('Failed to fetch email script', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string, type: 'subject' | 'body') => {
    navigator.clipboard.writeText(text).then(
      () => {
        showToast(`${type === 'subject' ? 'Subject' : 'Email body'} copied to clipboard`, 'success');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        showToast('Failed to copy to clipboard', 'error');
      }
    );
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="Email Script Generator"
      size="2xl"
    >
      <div className="p-4 space-y-6">
        {!emailScript && (
          <>
            <p className="text-gray-700 mb-4">
              Select a product to generate an email script for this lead.
            </p>
            
            <div className="space-y-2">
              {products.map((product) => (
                <label
                  key={product.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProductId === product.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="product"
                    value={product.id}
                    checked={selectedProductId === product.id}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">{product.product_name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Generating email script...</p>
          </div>
        )}

        {emailScript && !isLoading && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Subject Line</h3>
                <button
                  onClick={() => handleCopyToClipboard(emailScript.subject, 'subject')}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Copy to clipboard
                </button>
              </div>
              <p className="text-sm text-gray-900 p-3 bg-white border border-gray-200 rounded">{emailScript.subject}</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Email Body</h3>
                <button
                  onClick={() => handleCopyToClipboard(emailScript.body.replace(/<[^>]*>/g, ''), 'body')}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Copy to clipboard (plain text)
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="text-sm p-4 max-h-96 overflow-y-auto bg-white"
                  dangerouslySetInnerHTML={{ __html: emailScript.body }}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setEmailScript(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back to Product Selection
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {!emailScript && !isLoading && (
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleProductSelect(selectedProductId)}
              disabled={!selectedProductId}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Email Script
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
} 