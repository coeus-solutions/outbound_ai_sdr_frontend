# ReachGenie Strapi Integration Guide

This guide walks you through setting up Strapi as a headless CMS for ReachGenie's public-facing content pages.

## Prerequisites

- Node.js installed (v18 or higher recommended)
- Strapi backend project already created and running at http://localhost:1337
- Admin user for Strapi already set up

## Step 1: Create Content Types in Strapi

Before populating data, you need to create the appropriate content types in Strapi. Follow these steps:

1. **Log in to Strapi Admin** at http://localhost:1337/admin

2. **Create the Hero Section Content Type:**
   - Go to Content-Type Builder → Create new collection type
   - Name: "Hero Section"
   - Fields:
     - Title (Text - Short text)
     - Subtitle (Text - Long text)
     - Button Text (Text - Short text)
     - Button Link (Text - Short text)
     - Background Image (Media - Single media)
     - Page Identifier (Text - Short text)

3. **Create the Feature Content Type:**
   - Collection Type: "Feature"
   - Fields:
     - Title (Text - Short text)
     - Description (Text - Long text)
     - Icon (Text - Short text)
     - Order (Number - Integer)
     - Page Identifier (Text - Short text)

4. **Create the Step Content Type:**
   - Collection Type: "Step"
   - Fields:
     - Title (Text - Short text)
     - Description (Text - Long text)
     - Icon (Text - Short text)
     - Order (Number - Integer)
     - Page Identifier (Text - Short text)

5. **Create the Testimonial Content Type:**
   - Collection Type: "Testimonial"
   - Fields:
     - Quote (Text - Long text)
     - Name (Text - Short text)
     - Title (Text - Short text)
     - Company (Text - Short text)
     - Highlight (Text - Short text)
     - Image (Media - Single media)
     - Page Identifier (Text - Short text)

6. **Create the Pricing Plan Content Type:**
   - Collection Type: "Pricing Plan"
   - Fields:
     - Name (Text - Short text)
     - Price (Text - Short text)
     - Description (Text - Short text)
     - Features (Text - Long text with Rich Text editor)
     - Is Popular (Boolean)
     - Button Text (Text - Short text)
     - Page Identifier (Text - Short text)

7. **Create the Page Content Type:**
   - Collection Type: "Page"
   - Fields:
     - Title (Text - Short text)
     - Slug (UID - based on Title)
     - SEO Title (Text - Short text)
     - SEO Description (Text - Long text)
     - Content (Text - Long text with Rich Text editor)

8. **Deploy the Content Types:**
   - Save all content types
   - Apply changes when prompted

## Step 2: Set Up API Permissions

Configure public access for your content types:

1. Go to Settings → Roles → Public
2. For each content type, enable the following permissions:
   - find
   - findOne
3. Save your changes

## Step 3: Create an API Token

1. Go to Settings → API Tokens → Create new API Token
2. Name: "Content Population"
3. Description: "Token for populating ReachGenie content"
4. Token duration: Unlimited or set an expiry date
5. Token type: Full access
6. Save to generate the token
7. Copy the generated token for later use

## Step 4: Prepare Dependencies for the Population Script

1. In your frontend project, install required dependencies:

```bash
npm install axios form-data
```

## Step 5: Configure and Run the Population Script

1. Open `populate-strapi.js` in your project
2. Replace `YOUR_API_TOKEN` with the token you created in Step 3
3. Run the script:

```bash
node populate-strapi.js
```

4. The script will:
   - Create all the content entries
   - Upload images from your public directory
   - Log progress and any errors

## Step 6: Update the Frontend to Use Strapi Content

1. Create a new service file at `src/services/content.ts` to fetch Strapi content
2. Update your environment variables:
   - Add `REACT_APP_STRAPI_URL=http://localhost:1337` to `.env.development`
   - Add appropriate production URL to `.env.production`
3. Update your components to fetch and display content from Strapi

## Using the Content in React Components

Example of using Strapi content in a component:

```typescript
import React, { useEffect, useState } from 'react';
import { getHeroSection } from '../../services/content';

export function HeroSection() {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHeroSection('home');
        setHeroData(data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!heroData) return <div>Content not available</div>;

  return (
    <div>
      <h1>{heroData.attributes.title}</h1>
      <p>{heroData.attributes.subtitle}</p>
      <a href={heroData.attributes.buttonLink}>
        {heroData.attributes.buttonText}
      </a>
    </div>
  );
}
```

## Troubleshooting

- **API Errors:** Check that your API token has the correct permissions
- **Image Upload Issues:** Make sure the upload directory in Strapi is writable
- **Connection Errors:** Verify Strapi is running and accessible at the configured URL
- **Content Type Errors:** Ensure all content types match the expected structure in the script

## Next Steps

- Set up internationalization if needed
- Create additional content types for other pages
- Configure the media library settings for better image optimization
- Set up webhooks to trigger content updates
- Implement content versioning strategy

For more advanced features, refer to the [Strapi Documentation](https://docs.strapi.io). 