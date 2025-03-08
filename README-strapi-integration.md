# ReachGenie Strapi Content Management

This README explains how ReachGenie uses Strapi as a headless CMS to manage content for all non-authenticated (public) pages.

## Overview

ReachGenie's public-facing pages (landing pages, marketing pages, etc.) are powered by content stored in Strapi, allowing for easy updates without code changes. This setup provides:

1. **Content flexibility** - Marketing and product teams can update content without developer involvement
2. **Structured content** - All content is organized into well-defined content types
3. **Media management** - Images and other media are efficiently managed through Strapi
4. **Multi-page support** - Different landing pages can have their own content variations

## Project Structure

- **Backend**: Strapi CMS running as a separate application
- **Frontend**: React app that fetches content from Strapi

## Content Types

The following content types are defined in Strapi:

1. **Hero Section** - Main header section with title, subtitle, and CTA
2. **Feature** - Product features with title, description, and icon
3. **Step** - How It Works steps with title, description, and icon
4. **Testimonial** - Customer testimonials with quotes and images
5. **Pricing Plan** - Pricing information and features
6. **Page** - General page content with SEO information

Each content type includes a `pageIdentifier` field to distinguish which page it belongs to.

## Frontend Integration

The frontend fetches data from Strapi using the functions in `src/services/content.ts`. Key features:

- **Content Services** - API functions to fetch different content types
- **Type Definitions** - TypeScript interfaces for all content types
- **Loading States** - Components handle loading and error states
- **Fallback Content** - Default content if Strapi is unavailable

## Getting Started

### Backend Setup

1. Navigate to the Strapi backend directory (separate from frontend):
   ```
   cd ../backend
   ```

2. Start Strapi:
   ```
   npm run develop
   ```

3. Access the Strapi admin panel at http://localhost:1337/admin

### Frontend Configuration

1. Make sure the environment variables are set:
   - `.env.development`: `VITE_STRAPI_URL=http://localhost:1337`
   - `.env.production`: `VITE_STRAPI_URL=https://your-production-strapi-url.com`

2. Import and use Strapi-powered components:
   ```jsx
   import { StrapiHeroSection } from './components/landing/StrapiHeroSection';
   
   // In your component
   <StrapiHeroSection pageIdentifier="home" />
   ```

## Content Management Workflow

1. Log in to Strapi admin panel
2. Navigate to the content type you want to update
3. Make changes and publish
4. Changes appear on the frontend immediately

## Automating Content Population

Use the `populate-strapi.js` script to automate the initial population of content:

1. Install dependencies:
   ```
   npm install axios form-data
   ```

2. Get an API token from Strapi admin (Settings → API Tokens)

3. Update the token in the script

4. Run the script:
   ```
   node populate-strapi.js
   ```

## Troubleshooting

- **Content not loading**: Check Strapi server status and API permissions
- **Media not displaying**: Verify URLs and CORS settings in Strapi
- **Type errors**: Make sure TypeScript interfaces match Strapi content structure

## Further Reading

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Media Library Documentation](https://docs.strapi.io/user-docs/media-library) 