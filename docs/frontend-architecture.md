# ReachGenie Frontend Architecture

## Overview

ReachGenie is a React-based web application that helps businesses manage their outbound sales and marketing efforts. The application provides functionality for managing companies, products, leads, email campaigns, and call logs. It leverages modern React patterns and libraries to create a responsive and intuitive user interface.

## Technology Stack

- **React**: Frontend library for building user interfaces
- **TypeScript**: For type-safe code
- **React Router**: For client-side routing
- **Tailwind CSS**: For styling components
- **Axios**: For making HTTP requests
- **Radix UI**: For accessible UI components
- **Lucide Icons**: For consistent iconography

## Application Structure

The application follows a feature-based organization with clear separation of concerns:

```
src/
├── components/        # UI components organized by feature
│   ├── auth/          # Authentication components
│   ├── calls/         # Call logging and management
│   ├── companies/     # Company management
│   ├── dashboard/     # Dashboard layout and components
│   ├── emails/        # Email campaign components
│   ├── landing/       # Landing page components
│   ├── leads/         # Lead management components
│   ├── shared/        # Reusable components
│   └── user/          # User profile components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── services/          # API service functions
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── config/            # Configuration settings
```

## Authentication Flow

The application uses token-based authentication:

1. User signs up or logs in via `LoginForm` or `SignUpForm` components
2. Authentication token is stored in localStorage
3. Authenticated users are directed to the application dashboard
4. Unauthenticated users are redirected to login or landing pages
5. The auth token is included in all API requests

## Core Components

### App Component

The `App` component is the root component that handles routing and authentication state:

- Uses React Router for navigation
- Provides different routes for authenticated and unauthenticated users
- Handles authentication status checking and redirects

### Dashboard Layout

The `DashboardLayout` component provides a consistent layout for authenticated users:

- Navigation sidebar
- Header with user profile and logout
- Main content area for nested routes

### Company Management

Companies are a core entity in the application:

- `CompanyList`: Displays all companies with key metrics
- `AddCompany`: Form for creating new companies
- `CompanyDetailsPanel`: Detailed view of company information
- `CompanySettings`: Company configuration settings

### Product Management

Products belong to companies:

- `CompanyProducts`: Lists products for a company
- `AddProduct`: Form for creating new products
- `EditProduct`: Form for editing existing products
- `EnrichedProductInfo`: Displays AI-enriched product information

### Lead Management

Leads are managed in context of companies:

- `LeadList`: Displays leads with filtering and search
- `LeadTable`: Table view of leads with actions
- `CompanyLeads`: Company-specific lead management

### Communication Features

The application supports email and call interactions:

- `CompanyEmails`: Email activity for a company
- `CompanyCallLogs`: Call activity for a company
- `AddEmailCampaign`: Create and configure email campaigns
- `EmailSidePanel`: Detailed view of email interactions

## Data Flow

1. **API Services**: Located in `src/services/` directory, service functions handle API communication
2. **React Hooks**: Custom hooks in `src/hooks/` encapsulate data fetching and state management
3. **Components**: UI components consume hooks and display data
4. **Context Providers**: Global state is managed through React Context

## State Management

The application uses a combination of:

1. **React Context**: For application-wide state (themes, toasts, auth)
2. **React Hooks**: For component-level state and API interactions
3. **URL Parameters**: For navigation state

## API Integration

The application communicates with a backend API:

1. **Service Functions**: Encapsulate API endpoints for different features
2. **Type Definitions**: Ensure type safety for API responses
3. **Authentication**: Auth token is included in API requests
4. **Error Handling**: Consistent error handling with toast notifications

## Key User Flows

### Authentication Flow

1. User visits landing page
2. User signs up or logs in
3. After successful authentication, user is directed to the dashboard

### Company Management Flow

1. User views list of companies
2. User can create a new company
3. User can view company details, edit settings, or delete a company
4. User can navigate to various company features (products, leads, emails, calls)

### Product Management Flow

1. User navigates to products for a specific company
2. User can create, edit, or delete products
3. Products can be enriched with AI-generated information
4. User can view product-specific leads and campaigns

### Lead Management Flow

1. User navigates to leads for a specific company or product
2. User can view, search, and filter leads
3. User can import leads via CSV upload
4. User can view detailed lead information

### Communication Flow

1. User can create email campaigns for a company
2. User can view email and call logs
3. User can analyze communication metrics 
4. User can view detailed call transcripts and email interactions

## UI Components Structure

The application follows a component hierarchy:

1. **Layout Components**: Provide structure (DashboardLayout)
2. **Page Components**: Represent full pages (CompanyList, LeadList)
3. **Feature Components**: Implement specific features (AddProduct, EmailCampaign)
4. **Shared Components**: Reusable UI elements (Dialog, SkeletonLoader, Button)

## Error Handling

The application implements consistent error handling:

1. **Toast Notifications**: User-friendly error messages
2. **API Error Handling**: Centralized error handling in service functions
3. **Form Validation**: Client-side validation with error messages
4. **Loading States**: Visual indicators during async operations

## Responsive Design

The application is fully responsive:

1. **Tailwind Classes**: Responsive utility classes
2. **Mobile-First Approach**: Components designed for mobile first
3. **Adaptive Layouts**: Different layouts for different screen sizes

## Performance Considerations

1. **Code Splitting**: React Router handles code splitting
2. **Optimized Rendering**: Careful use of memoization and useCallback
3. **Pagination**: Used for large data sets (leads, emails, calls)
4. **Lazy Loading**: Applied to images and non-critical components

## Conclusion

The ReachGenie frontend architecture follows modern React patterns with a focus on component reusability, type safety, and user experience. The feature-based organization makes the codebase maintainable and scalable. 