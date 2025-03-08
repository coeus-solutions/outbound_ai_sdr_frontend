// populate-strapi.js
// Script to automatically populate Strapi with content from the React components
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Strapi connection configuration
const STRAPI_URL = 'http://localhost:1337';
const STRAPI_API = `${STRAPI_URL}/api`;
const STRAPI_TOKEN = '5ce87a3ac406227478ad80a18a77f94a97e0e6430f22785961a54a3673260e7af3c4a6e4c20e9acc430799744d5041f1e469faea343e6501c7f2bc0bad6a7c2a80a080126483fc9011becd30762ae655a77f3e8173779606ead10d0be88168933ec930418acf16a1d12fa6f333eb6dfc71440034f52e2564ad175de7c7d4477e';

// Configuration for HTTP requests
const config = {
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

// Source directory for media files
const PUBLIC_DIR = path.join(__dirname, 'public');

// Hero Section Content
const heroSectionContent = {
  data: {
    Title: "Turn Cold Outreach Into Warm Conversations",
    Subtitle: "ReachGenie is an AI-powered sales development platform that creates authentic, personalized conversations with prospects through email and voice channels. Generate more meetings with less effort while maintaining the human touch that converts.",
    ButtonText: "Start Free Trial",
    ButtonLink: "/signup",
    PageIdentifier: "home"
  }
};

// Features Content
const featuresContent = [
  {
    Title: 'AI-Powered Email Personalization',
    Description: 'Generate highly personalized emails that speak directly to each prospect\'s situation, with AI that researches companies and identifies specific pain points.',
    Icon: 'Mail',
    Order: 1,
    PageIdentifier: 'home'
  },
  {
    Title: 'Conversational Email AI',
    Description: 'Maintain natural conversation threads with prospects through AI that responds to replies intelligently, handles objections, and keeps conversations going.',
    Icon: 'MessageSquare',
    Order: 2,
    PageIdentifier: 'home'
  },
  {
    Title: 'AI Voice Calling',
    Description: 'Engage prospects with natural-sounding AI voice calls that adapt to responses in real-time, creating authentic conversations that convert.',
    Icon: 'Phone',
    Order: 3,
    PageIdentifier: 'home'
  },
  {
    Title: 'Intelligent Meeting Booking',
    Description: 'Automatically schedule meetings when prospects express interest, handling time zones, availability, and follow-ups without human intervention.',
    Icon: 'Calendar',
    Order: 4,
    PageIdentifier: 'home'
  },
  {
    Title: 'Multi-Channel Coordination',
    Description: 'Seamlessly coordinate email and voice outreach with unified context across channels, creating a cohesive prospect experience.',
    Icon: 'Brain',
    Order: 5,
    PageIdentifier: 'home'
  },
  {
    Title: 'In-depth Analytics',
    Description: 'Track campaign performance in real-time, measure response rates and conversions, and continuously optimize your outreach strategy based on data.',
    Icon: 'BarChart',
    Order: 6,
    PageIdentifier: 'home'
  }
];

// How It Works Content
const howItWorksContent = [
  {
    Title: 'Creating Authentic Conversations',
    Description: 'ReachGenie doesn\'t just send messages - it builds meaningful two-way conversations with prospects through intelligent, contextual engagement.',
    Icon: 'PersonalizeIcon',
    Order: 1,
    StepNumber: 1,
    DetailedDescription: 'ReachGenie creates natural, flowing conversations that feel human and respond intelligently to prospect replies, adapting to their unique needs and concerns.',
    PageIdentifier: 'home'
  },
  {
    Title: 'Deep Personalization',
    Description: 'Our AI researches each company and contact to identify specific pain points, creating outreach that speaks directly to each prospect\'s unique situation.',
    Icon: 'EnrichIcon',
    Order: 2,
    StepNumber: 2,
    DetailedDescription: 'Say goodbye to generic outreach. ReachGenie researches each company to identify their specific challenges and tailors messaging that directly addresses their needs.',
    PageIdentifier: 'home'
  },
  {
    Title: 'Multi-Channel Coordination',
    Description: 'Seamlessly mix email and voice outreach with unified context across channels, ensuring a cohesive prospect experience that feels natural and human.',
    Icon: 'CampaignIcon',
    Order: 3,
    StepNumber: 3,
    DetailedDescription: 'Create a seamless experience as prospects interact with you across different channels, with each interaction building on previous conversations.',
    PageIdentifier: 'home'
  },
  {
    Title: 'Quality Prospect Discovery',
    Description: 'Find thousands of high-quality prospects matching your ICPs',
    Icon: 'StrategyIcon',
    Order: 4,
    StepNumber: 4,
    DetailedDescription: 'Find thousands of high-quality prospects matching your ideal customer profiles, with accurate contact information ready for outreach.',
    PageIdentifier: 'home'
  },
  {
    Title: 'Self-Improving System',
    Description: 'The platform learns from every interaction to continuously improve outreach effectiveness, analyzing which messages generate responses and which calls lead to meetings.',
    Icon: 'CleanIcon',
    Order: 5,
    StepNumber: 5,
    DetailedDescription: 'ReachGenie gets smarter with every interaction, learning what works and what doesn\'t to continuously improve your results over time.',
    PageIdentifier: 'home'
  }
];

// Testimonials Content
const testimonialsContent = [
  {
    Quote: "ReachGenie's ability to identify each prospect's specific pain points and buying triggers is mind-blowing. We're seeing 3x higher response rates because our outreach now speaks directly to what matters most to each individual company.",
    Name: "Aiko Tanaka",
    Title: "VP of Sales",
    Company: "TechScale Solutions",
    PageIdentifier: 'home'
  },
  {
    Quote: "The automated reply and meeting booking functionality saved my team 20+ hours per week. When prospects show interest, ReachGenie handles the conversation and schedules meetings instantly - no more back-and-forth emails or missed opportunities.",
    Name: "Rahul Sharma",
    Title: "Director of Business Development",
    Company: "GrowthForge Inc.",
    PageIdentifier: 'home'
  },
  {
    Quote: "Before ReachGenie, we were paying 3x more for lower quality leads. Now we get thousands of highly targeted prospects that match our ideal customer profile, with detailed insights on each one. The ROI is unmatched in the industry.",
    Name: "Sofia Rodriguez",
    Title: "CMO",
    Company: "RevenuePilot",
    PageIdentifier: 'home'
  }
];

// Pricing Plans Content
const pricingPlansContent = [
  {
    Name: "Performance Based",
    Price: "Variable",
    Description: "Pay $60 per successful conversion",
    Features: "<ul><li>Enrichment at $0.03 per lead</li><li>Email campaigns at $0.02 per lead</li><li>Phone campaigns at $0.60 per lead</li><li>$60 per successful conversion</li></ul>",
    IsPopular: true,
    ButtonText: "Get Started Free",
    PageIdentifier: 'home'
  },
  {
    Name: "Fixed Plan",
    Price: "$800/month",
    Description: "Plus enrichment, emails and calls",
    Features: "<ul><li>$800 base fee</li><li>Enrichment at $0.03 per lead</li><li>Email campaigns at $0.02 per lead</li><li>Phone campaigns at $0.60 per lead</li></ul>",
    IsPopular: false,
    ButtonText: "Get Started Free",
    PageIdentifier: 'home'
  }
];

// Main Page Content
const pageContent = {
  data: {
    title: "ReachGenie - AI-Powered Sales Development",
    slug: "home",
    seo_title: "ReachGenie - Turn Cold Outreach Into Warm Conversations",
    seo_description: "ReachGenie is an AI-powered sales development platform that creates authentic, personalized conversations with prospects through email and voice channels.",
    content: "<p>ReachGenie helps sales teams generate more meetings with less effort while maintaining the human touch that converts.</p>"
  }
};

// Function to upload an image to Strapi
async function uploadImage(imagePath, refId, ref, field) {
  try {
    const formData = new FormData();
    formData.append('files', fs.createReadStream(imagePath));
    
    // If we're attaching to an existing entity
    if (refId && ref && field) {
      formData.append('refId', refId);
      formData.append('ref', ref);
      formData.append('field', field);
    }
    
    const uploadConfig = {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        ...formData.getHeaders()
      }
    };
    
    const response = await axios.post(`${STRAPI_URL}/api/upload`, formData, uploadConfig);
    console.log(`Image uploaded successfully: ${imagePath}`);
    return response.data;
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error.response?.data || error.message);
    throw error;
  }
}

// Function to create a hero section entry
async function createHeroSection() {
  try {
    const response = await axios.post(`${STRAPI_API}/hero-sections`, heroSectionContent, config);
    console.log('Hero section created successfully');
    
    // Upload hero image after creating the entry
    const heroId = response.data.data.id;
    const heroImagePath = path.join(PUBLIC_DIR, 'images', 'logo.png'); // Placeholder image
    
    if (fs.existsSync(heroImagePath)) {
      await uploadImage(heroImagePath, heroId, 'api::hero-section.hero-section', 'backgroundImage');
      console.log('Hero image uploaded successfully');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating hero section:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create feature entries
async function createFeatures() {
  try {
    const createdFeatures = [];
    
    for (const feature of featuresContent) {
      const response = await axios.post(`${STRAPI_API}/features`, { data: feature }, config);
      console.log(`Feature "${feature.Title}" created successfully`);
      createdFeatures.push(response.data);
    }
    
    return createdFeatures;
  } catch (error) {
    console.error('Error creating features:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create how-it-works steps
async function createSteps() {
  try {
    const createdSteps = [];
    
    for (const step of howItWorksContent) {
      const response = await axios.post(`${STRAPI_API}/steps`, { data: step }, config);
      console.log(`Step "${step.Title}" created successfully`);
      createdSteps.push(response.data);
    }
    
    return createdSteps;
  } catch (error) {
    console.error('Error creating steps:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create testimonials
async function createTestimonials() {
  try {
    const createdTestimonials = [];
    
    for (const testimonial of testimonialsContent) {
      const response = await axios.post(`${STRAPI_API}/testimonials`, { data: testimonial }, config);
      console.log(`Testimonial from "${testimonial.Name}" created successfully`);
      
      // Use placeholder image for testimonials
      const testimonialId = response.data.data.id;
      const avatarPath = path.join(PUBLIC_DIR, 'images', 'logo.png'); // Placeholder image
      
      if (fs.existsSync(avatarPath)) {
        await uploadImage(avatarPath, testimonialId, 'api::testimonial.testimonial', 'image');
        console.log(`Avatar for "${testimonial.Name}" uploaded successfully`);
      }
      
      createdTestimonials.push(response.data);
    }
    
    return createdTestimonials;
  } catch (error) {
    console.error('Error creating testimonials:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create pricing plans
async function createPricingPlans() {
  try {
    const createdPlans = [];
    
    for (const plan of pricingPlansContent) {
      const response = await axios.post(`${STRAPI_API}/pricing-plans`, { data: plan }, config);
      console.log(`Pricing plan "${plan.Name}" created successfully`);
      createdPlans.push(response.data);
    }
    
    return createdPlans;
  } catch (error) {
    console.error('Error creating pricing plans:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create main page
async function createPage() {
  try {
    const response = await axios.post(`${STRAPI_API}/pages`, pageContent, config);
    console.log('Page created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating page:', error.response?.data || error.message);
    throw error;
  }
}

// Main function to populate all content
async function populateStrapi() {
  console.log('Starting Strapi content population...');
  
  try {
    await createHeroSection();
  } catch (error) {
    console.error('Error creating hero section:', error.message);
  }
  
  try {
    await createFeatures();
  } catch (error) {
    console.error('Error creating features:', error.message);
  }
  
  try {
    await createSteps();
  } catch (error) {
    console.error('Error creating steps:', error.message);
  }
  
  try {
    await createTestimonials();
  } catch (error) {
    console.error('Error creating testimonials:', error.message);
  }
  
  try {
    await createPricingPlans();
  } catch (error) {
    console.error('Error creating pricing plans:', error.message);
  }
  
  try {
    await createPage();
  } catch (error) {
    console.error('Error creating page:', error.message);
  }
  
  console.log('Content population completed! Some content types may have failed to populate completely. Check the logs for details.');
}

// Run the population script
populateStrapi(); 