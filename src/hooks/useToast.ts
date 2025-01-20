import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export function useToast() {
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // For now, we'll use console.log as a placeholder
    // In a real application, you would integrate with a toast library
    console.log(`[${type.toUpperCase()}] ${message}`);
  }, []);

  return { showToast };
} 