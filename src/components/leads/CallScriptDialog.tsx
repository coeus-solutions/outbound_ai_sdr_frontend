import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog } from '../shared/Dialog';
import { Product } from '../../services/products';
import { getToken } from '../../utils/auth';
import { getLeadCallScript, CallScriptResponse } from '../../services/leads';
import { useToast } from '../../context/ToastContext';

interface CallScriptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  leadId: string;
  products: Product[];
}

export function CallScriptDialog({ isOpen, onClose, companyId, leadId, products }: CallScriptDialogProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [callScript, setCallScript] = useState<CallScriptResponse | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setSelectedProductId('');
      setCallScript(null);
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
      
      const script = await getLeadCallScript(token, companyId, leadId, productId);
      setCallScript(script);
    } catch (error) {
      console.error('Error fetching call script:', error);
      showToast('Failed to fetch call script', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!callScript) return;
    
    navigator.clipboard.writeText(callScript.script).then(
      () => {
        showToast('Call script copied to clipboard', 'success');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        showToast('Failed to copy to clipboard', 'error');
      }
    );
  };

  const formatCallScript = (script: string) => {
    // Split the script by newlines and process each line
    return script.split('\n').map((line, index) => {
      // If line has a colon, format as a speaker line
      if (line.includes(':')) {
        const [speaker, text] = line.split(':', 2);
        return (
          <div key={index} className="mb-4">
            <span className="font-semibold text-gray-900">{speaker}:</span>
            <span className="text-gray-700">{text}</span>
          </div>
        );
      }
      // Return empty lines as line breaks
      if (line.trim() === '') {
        return <br key={index} />;
      }
      // Return other lines as plain text
      return <p key={index} className="mb-4 text-gray-700">{line}</p>;
    });
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="Call Script Generator"
      size="2xl"
    >
      <div className="p-4 space-y-6">
        {!callScript && (
          <>
            <p className="text-gray-700 mb-4">
              Select a product to generate a call script for this lead.
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
            <p className="text-gray-600">Generating call script...</p>
          </div>
        )}

        {callScript && !isLoading && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Call Script</h3>
                <button
                  onClick={handleCopyToClipboard}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Copy to clipboard
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                {formatCallScript(callScript.script)}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setCallScript(null)}
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

        {!callScript && !isLoading && (
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
              Generate Call Script
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
} 