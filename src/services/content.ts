import axios from 'axios';

// Get Strapi URL from environment variables
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

// Interfaces for the content types
export interface HeroSection {
  id: number;
  attributes: {
    Title: string;
    Subtitle: string;
    ButtonText: string;
    ButtonLink: string;
    PageIdentifier: string;
    backgroundImage: {
      data: {
        id: number;
        attributes: {
          url: string;
          formats: {
            thumbnail: { url: string };
            small: { url: string };
            medium: { url: string };
            large: { url: string };
          };
        };
      };
    };
  };
}

export interface Feature {
  id: number;
  attributes: {
    Title: string;
    Description: string;
    Icon: string;
    Order: number;
    PageIdentifier: string;
  };
}

export interface Step {
  id: number;
  attributes: {
    Title: string;
    Description: string;
    Icon: string;
    Order: number;
    PageIdentifier: string;
    StepNumber?: number;
    DetailedDescription?: string;
  };
}

export interface Testimonial {
  id: number;
  attributes: {
    Quote: string;
    Name: string;
    Title: string;
    Company: string;
    PageIdentifier: string;
    image: {
      data: {
        id: number;
        attributes: {
          url: string;
          formats: {
            thumbnail: { url: string };
            small: { url: string };
          };
        };
      };
    };
  };
}

export interface PricingPlan {
  id: number;
  attributes: {
    Name: string;
    Price: string;
    Description: string;
    Features: string;
    IsPopular: boolean;
    ButtonText: string;
    PageIdentifier: string;
  };
}

export interface Page {
  id: number;
  attributes: {
    title: string;
    slug: string;
    seoTitle: string;
    seoDescription: string;
    content: string;
  };
}

// Utility function to construct full URL for media
export const getStrapiMedia = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return `${STRAPI_URL}${url}`;
};

// Functions to fetch content from Strapi
export const getHeroSection = async (pageIdentifier = 'home'): Promise<HeroSection | null> => {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/hero-sections?filters[pageIdentifier][$eq]=${pageIdentifier}&populate=*`
    );
    return response.data.data[0] || null;
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return null;
  }
};

export const getFeatures = async (pageIdentifier = 'home'): Promise<Feature[]> => {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/features?filters[pageIdentifier][$eq]=${pageIdentifier}&sort=order&populate=*`
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching features:', error);
    return [];
  }
};

export const getSteps = async (pageIdentifier = 'home'): Promise<Step[]> => {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/steps?filters[pageIdentifier][$eq]=${pageIdentifier}&sort=order&populate=*`
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching steps:', error);
    return [];
  }
};

export const getTestimonials = async (pageIdentifier = 'home'): Promise<Testimonial[]> => {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/testimonials?filters[pageIdentifier][$eq]=${pageIdentifier}&populate=*`
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

export const getPricingPlans = async (pageIdentifier = 'home'): Promise<PricingPlan[]> => {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/pricing-plans?filters[pageIdentifier][$eq]=${pageIdentifier}&populate=*`
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return [];
  }
};

export const getPage = async (slug: string): Promise<Page | null> => {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate=*`
    );
    return response.data.data[0] || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
};

// Function to fetch all content for a specific page in one call
export const getPageContent = async (pageIdentifier = 'home') => {
  try {
    const [heroSection, features, steps, testimonials, pricingPlans, page] = await Promise.all([
      getHeroSection(pageIdentifier),
      getFeatures(pageIdentifier),
      getSteps(pageIdentifier),
      getTestimonials(pageIdentifier),
      getPricingPlans(pageIdentifier),
      getPage(pageIdentifier)
    ]);

    return {
      heroSection,
      features,
      steps,
      testimonials,
      pricingPlans,
      page
    };
  } catch (error) {
    console.error('Error fetching page content:', error);
    return {
      heroSection: null,
      features: [],
      steps: [],
      testimonials: [],
      pricingPlans: [],
      page: null
    };
  }
}; 