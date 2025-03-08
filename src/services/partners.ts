import { PartnerApplication } from '../types';

/**
 * Get the API base URL from environment variables
 */
const getApiBaseUrl = () => {
  // Use the correct environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Log a warning if the environment variable is not set
  console.warn('VITE_API_URL is not defined in environment variables');
  
  // Return empty string which will make the service fall back to simulation
  return '';
};

/**
 * Convert camelCase keys to snake_case
 */
function camelToSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  Object.keys(obj).forEach(key => {
    // Convert key from camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snakeKey] = obj[key];
  });
  
  return result;
}

/**
 * Submit a partner application
 * @param application - The partner application data
 * @returns A promise that resolves to the submission response
 */
export async function submitPartnerApplication(application: PartnerApplication): Promise<{ success: boolean; message: string }> {
  try {
    // Format website URL if provided
    if (application.website) {
      application.website = formatWebsiteUrl(application.website);
    }
    
    // Convert camelCase keys to snake_case for the backend
    const formattedApplication = camelToSnakeCase(application as unknown as Record<string, unknown>);
    
    // Log the application data being sent (for debugging)
    console.log('Original application data:', application);
    console.log('Formatted application data for backend:', formattedApplication);
    
    // For development without a backend, simulate a successful API call
    if (process.env.NODE_ENV === 'development' && !getApiBaseUrl()) {
      console.log('Dev mode: Simulating API call');
      return new Promise((resolve) => {
        // Simulate a network delay
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Application submitted successfully. We will review your application and contact you soon.'
          });
        }, 1000);
      });
    }

    // Make the actual API call for both dev and prod when API is available
    const apiUrl = `${getApiBaseUrl()}/api/partner-applications`;
    console.log(`Making API request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedApplication),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API error response:', data);
      throw new Error(data.detail?.[0]?.msg || data.message || 'Failed to submit partner application');
    }

    return {
      success: true,
      message: 'Application submitted successfully. We will review your application and contact you soon.'
    };
  } catch (error) {
    console.error('Error submitting partner application:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

/**
 * Format website URL to ensure it has a protocol
 */
function formatWebsiteUrl(url: string): string {
  if (!url) return url;
  
  // If URL already has a protocol, return as is
  if (url.match(/^https?:\/\//i)) {
    return url;
  }
  
  // Otherwise, add https:// as the default protocol
  return `https://${url}`;
} 