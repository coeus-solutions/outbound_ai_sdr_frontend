import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Product } from '../../services/products';
import { Lead } from '../../services/leads';
import { Dialog } from '../shared/Dialog';

interface CallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  lead: Lead | null;
  onInitiateCall: (productId: string) => void;
}

export function CallDialog({ isOpen, onClose, products, lead, onInitiateCall }: CallDialogProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Reset selection when dialog opens/closes or lead changes
  useEffect(() => {
    setSelectedProductId('');
  }, [isOpen, lead]);

  if (!lead) return null;

  const handleInitiateCall = () => {
    if (selectedProductId) {
      onInitiateCall(selectedProductId);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedProductId('');
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={`Call ${lead.name}`}
    >
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500">
            Initiating call with <span className="font-medium text-gray-900">{lead.name}</span>
          </p>
          {lead.job_title && lead.company && (
            <p className="text-sm text-gray-500 mt-1">
              {lead.job_title} at {lead.company}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Select a product to discuss:
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
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{product.product_name}</h3>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleInitiateCall}
            disabled={!selectedProductId}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Phone className="h-4 w-4 mr-2" />
            Start Call
          </button>
        </div>
      </div>
    </Dialog>
  );
}