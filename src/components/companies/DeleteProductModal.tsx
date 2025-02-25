import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Dialog } from '../shared/Dialog';
import { deleteProduct } from '../../services/products';
import { useToast } from '../../context/ToastContext';
import { getToken } from '../../utils/auth';

interface DeleteProductModalProps {
  companyId: string;
  product: {
    id: string;
    product_name: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteProductModal({
  companyId,
  product,
  isOpen,
  onClose,
  onSuccess
}: DeleteProductModalProps) {
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!companyId || !product.id) return;
    
    setIsDeleting(true);
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      await deleteProduct(token, companyId, product.id);
      showToast('Product deleted successfully', 'success');
      onSuccess();
    } catch (error) {
      console.error('Error deleting product:', error);
      if ((error as Error & { response?: { status: number } }).response?.status === 404) {
        showToast('Product not found', 'error');
      } else if ((error as Error & { response?: { status: number } }).response?.status === 403) {
        showToast('You do not have permission to delete this product', 'error');
      } else {
        showToast('Failed to delete product. Please try again later.', 'error');
      }
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="Delete Product"
    >
      <div className="p-4 space-y-4">
        <p className="text-gray-700">
          Are you sure you want to delete <strong>{product.product_name}</strong>?
        </p>
        <p className="text-red-500 text-sm">
          This action cannot be undone.
        </p>
        <p className="text-gray-600 text-sm">
          Note: All related data like call logs and campaign statistics will be preserved.
        </p>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
} 