import { useState, useEffect } from 'react';
import { X, Mail, Phone } from 'lucide-react';

interface TestRunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignType: 'email' | 'call';
  campaignName: string;
  onSubmit: (value: string) => void;
}

export function TestRunDialog({ isOpen, onClose, campaignType, campaignName, onSubmit }: TestRunDialogProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // Reset form state when dialog opens or closes
  useEffect(() => {
    setValue('');
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!value.trim()) {
      setError(`Please enter ${campaignType === 'email' ? 'an email address' : 'a phone number'}`);
      return;
    }

    if (campaignType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      // Basic phone number validation (can be enhanced based on requirements)
      const phoneRegex = /^\+?[\d\s-()]+$/;
      if (!phoneRegex.test(value)) {
        setError('Please enter a valid phone number');
        return;
      }
    }

    onSubmit(value);
    setValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Test Run "{campaignName}"</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="test-value" className="block text-sm font-medium text-gray-700">
              {campaignType === 'email' ? 'On which email address should we send the test email?' : 'On which number should we call?'}
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {campaignType === 'email' ? (
                  <Mail className="h-5 w-5 text-gray-400" />
                ) : (
                  <Phone className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <input
                type={campaignType === 'email' ? 'email' : 'tel'}
                name="test-value"
                id="test-value"
                className="form-input"
                placeholder={campaignType === 'email' ? 'Enter email address' : 'Enter phone number'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Run Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 