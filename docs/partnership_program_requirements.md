# ReachGenie Partnership Program - Backend Requirements

This document outlines the technical requirements for implementing the backend services to support ReachGenie's partnership program.

## 1. Data Model Requirements

### Partner Application Model

```typescript
PartnerApplication {
  id: UUID
  companyName: String (required)
  contactName: String (required)
  contactEmail: String (required)
  contactPhone: String (optional)
  website: String (optional)
  partnershipType: Enum["RESELLER", "REFERRAL", "TECHNOLOGY"] (required)
  companySize: Enum["1-10", "11-50", "51-200", "201-500", "501+"] (required)
  industry: String (required)
  currentSolutions: String (optional)
  targetMarket: String (optional)
  motivation: String (required)
  additionalInformation: String (optional)
  status: Enum["PENDING", "REVIEWING", "APPROVED", "REJECTED"] (default: "PENDING")
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Partner Account Model (for Approved Resellers)

```typescript
PartnerAccount {
  id: UUID
  partnerId: UUID (foreign key to PartnerApplication)
  companyName: String (required)
  adminEmail: String (required)
  adminPassword: String (required, hashed)
  tier: Enum["SILVER", "GOLD", "PLATINUM"] (default: "SILVER")
  isActive: Boolean (default: true)
  clientManagementEnabled: Boolean (default: true)
  whitelabelEnabled: Boolean (default: false)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Client Account Model (Managed by Reseller Partners)

```typescript
ClientAccount {
  id: UUID
  resellerId: UUID (foreign key to PartnerAccount)
  companyName: String (required)
  contactName: String (required)
  contactEmail: String (required)
  contactPhone: String (optional)
  subscriptionTier: String (required)
  subscriptionStatus: Enum["ACTIVE", "SUSPENDED", "CANCELED"] (default: "ACTIVE")
  billingOwnedByReseller: Boolean (default: true)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Partner Application Note Model (for internal use)

```typescript
PartnerApplicationNote {
  id: UUID
  applicationId: UUID (foreign key to PartnerApplication)
  authorName: String (required)
  note: String (required)
  createdAt: DateTime
}
```

## 2. API Endpoint Requirements

### Public Endpoints

#### Submit Partner Application
- **Endpoint**: `POST /api/partner-applications`
- **Description**: Allows potential partners to submit their application
- **Request Body**: Partner application data (except status, createdAt, updatedAt)
- **Response**: 
  - Success (201): Application ID and confirmation
  - Error (400): Validation errors
  - Error (500): Server error

### Protected Endpoints (Admin Only)

#### List Partner Applications
- **Endpoint**: `GET /api/admin/partner-applications`
- **Description**: Retrieve a list of partner applications with filtering and pagination
- **Query Parameters**: 
  - `status`: Filter by status
  - `partnershipType`: Filter by partnership type
  - `page`: Page number
  - `limit`: Number of items per page
  - `sortBy`: Field to sort by
  - `sortOrder`: "asc" or "desc"
- **Response**: List of applications with pagination metadata

#### Get Partner Application Details
- **Endpoint**: `GET /api/admin/partner-applications/{id}`
- **Description**: Get detailed information about a specific application
- **Response**: Complete application data including notes

#### Update Partner Application Status
- **Endpoint**: `PATCH /api/admin/partner-applications/{id}/status`
- **Description**: Update the status of a partner application
- **Request Body**: `{ status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" }`
- **Response**: Updated application

#### Add Note to Partner Application
- **Endpoint**: `POST /api/admin/partner-applications/{id}/notes`
- **Description**: Add an internal note to a partner application
- **Request Body**: `{ authorName: string, note: string }`
- **Response**: Created note data

#### Get Application Statistics
- **Endpoint**: `GET /api/admin/partner-applications/statistics`
- **Description**: Get statistics about partner applications (counts by status, type, etc.)
- **Response**: Statistics object

### Reseller Partner Endpoints

#### List Client Accounts
- **Endpoint**: `GET /api/partner/clients`
- **Description**: Retrieve a list of all client accounts managed by the reseller partner
- **Query Parameters**: 
  - `status`: Filter by subscription status
  - `page`: Page number
  - `limit`: Number of items per page
- **Response**: List of client accounts with pagination metadata

#### Create Client Account
- **Endpoint**: `POST /api/partner/clients`
- **Description**: Create a new client account under the reseller's management
- **Request Body**: Client account data
- **Response**: Created client account data

#### Get Client Account Details
- **Endpoint**: `GET /api/partner/clients/{id}`
- **Description**: Get detailed information about a specific client account
- **Response**: Complete client account data

#### Update Client Account
- **Endpoint**: `PUT /api/partner/clients/{id}`
- **Description**: Update client account information
- **Request Body**: Updated client account data
- **Response**: Updated client account

#### Manage Client Subscription
- **Endpoint**: `PATCH /api/partner/clients/{id}/subscription`
- **Description**: Update client subscription status or tier
- **Request Body**: `{ subscriptionTier: string, subscriptionStatus: string }`
- **Response**: Updated subscription information

#### Access Client Account (Impersonation)
- **Endpoint**: `POST /api/partner/clients/{id}/access`
- **Description**: Generate temporary credentials for accessing a client's account
- **Response**: Temporary access token and URL

## 3. Notification Requirements

### Email Notifications

#### Application Received Confirmation
- **Trigger**: When a new partner application is submitted
- **Recipient**: Partner's contact email
- **Content**: Confirmation of application receipt, expected timeline, next steps

#### Application Status Change
- **Trigger**: When an application status changes
- **Recipient**: Partner's contact email
- **Content**: Information about the new status and next steps if applicable

#### Internal Notification
- **Trigger**: When a new partner application is submitted
- **Recipient**: Admin team email(s)
- **Content**: Summary of the new application with a link to view details

## 4. Security Requirements

- Authentication for admin endpoints using JWT or similar
- Rate limiting for public submission endpoint to prevent abuse
- Data validation for all inputs
- CORS configuration to allow only approved origins
- Secure storage of sensitive partner information
- Role-based access control for reseller partners to manage their client accounts
- Secure impersonation mechanism for resellers to access client accounts
- Audit logging of all client management actions by resellers

## 5. Integration Requirements

- Connect with the existing user system if approved partners need accounts
- Email service integration for notifications
- Optional CRM integration to track partner relationships
- Optional document storage for partnership agreements
- Billing system integration for reseller partners to manage client subscriptions
- White-labeling capabilities for qualified reseller partners

## 6. Implementation Considerations

### Database
- PostgreSQL or similar relational database is recommended due to the structured nature of the data
- Add proper indexing for fields commonly used in queries (partnershipType, status, createdAt)

### API Implementation
- Use FastAPI or similar framework for building the REST API
- Implement proper error handling and logging
- Add pagination for list endpoints to handle large datasets
- Include proper data validation using Pydantic models

### Security
- Implement proper authentication middleware for protected endpoints
- Add validation to prevent common web attacks (XSS, CSRF, etc.)
- Implement proper logging for security events

### Multi-tenancy Architecture
- Implement a robust multi-tenant system to support reseller-client relationships
- Ensure data isolation between different resellers and their clients
- Design the permission system to enable resellers to fully manage their client accounts

## 7. Deployment and Operations

- Environment-specific configurations for development, staging, and production
- Automated tests for critical functionality
- Monitoring for API performance and errors
- Regular backups of application data

## 8. Partner Dashboard (Future Enhancement)

For a future phase, consider implementing a partner dashboard where approved partners can:

- View their application status
- Update their company information
- Access marketing materials
- Track referrals and commissions
- Register new deals
- Access training and certification materials

### Reseller-Specific Dashboard Features
- Comprehensive client management interface
- Client account creation and onboarding tools
- Usage and performance monitoring across all client accounts
- Centralized billing and subscription management
- White-label customization options
- Client success metrics and reporting

## 9. Partner Tiers (Future Enhancement)

Consider implementing a tier-based partner program with different benefits:

### Silver Partners
- Basic referral commissions
- Access to standard marketing materials
- Basic training resources
- Client management capabilities (for resellers)

### Gold Partners
- Higher commission rates
- Co-marketing opportunities
- Dedicated partner manager
- Advanced training and certification
- Enhanced client management with priority support (for resellers)
- Basic white-labeling options (for resellers)

### Platinum Partners
- Premium commission structure
- Strategic business planning
- Joint marketing events
- Early access to new features
- Full white-labeling capabilities (for resellers)
- Custom integration support for client management
- Dedicated technical account manager for client support

## 10. Reseller Partner Benefits

Reseller partners enjoy unique benefits in the ReachGenie partner ecosystem:

- **Full Client Account Control**: Resellers can create, manage, and control all aspects of their client accounts within ReachGenie
- **Multi-tenant Management**: A unified dashboard to manage all clients from a single interface
- **Custom Pricing Control**: Ability to set custom pricing for clients with flexible margin structures
- **White-label Options**: Present ReachGenie as their own solution with custom branding (available at higher partner tiers)
- **Client Success Management**: Tools to monitor client success metrics and identify upsell opportunities
- **Account Impersonation**: Secure ability to access client accounts for troubleshooting and support
- **Billing Management**: Control over client billing and subscription management
- **Automated Provisioning**: Quick and easy client account setup and configuration
- **Usage Analytics**: Detailed usage statistics across all client accounts
- **Client Communication Tools**: Branded communication templates and tools

## 11. Implementation Phases

### Phase 1: Core Application System
- Implement partner application submission
- Create admin interface for application review
- Set up basic email notifications

### Phase 2: Enhanced Management
- Implement detailed analytics
- Add CRM integration
- Expand notification system
- Build reseller client management capabilities

### Phase 3: Partner Portal
- Build partner dashboard
- Implement tier-based system
- Add training and resource center
- Implement white-labeling for reseller partners
- Add advanced client management tools

## 12. Success Metrics

- Number of partner applications
- Application approval rate
- Partner-generated revenue
- Partner satisfaction score
- Partner program ROI
- Reseller client retention rate
- Average number of clients per reseller
- Revenue per reseller 