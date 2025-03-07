# ReachGenie Frontend Documentation

## Overview

Welcome to the ReachGenie frontend documentation. This repository contains comprehensive documentation about the architecture, component structure, data flow, and key features of the ReachGenie frontend application.

## Documentation Guide

This documentation is organized into several key sections:

1. **[Frontend Architecture](./frontend-architecture.md)**: Overview of the application architecture, technology stack, and key principles.

2. **[Component Structure](./component-structure.md)**: Detailed explanation of the component organization, patterns, and examples.

3. **[Application Data Flow](./application-data-flow.md)**: Comprehensive guide to data flow patterns, API integration, and state management.

4. **[Product Enrichment Flow](./product-enrichment-flow.md)**: Technical documentation of the product enrichment feature using AI.

5. **[Product Enrichment Guide](./product-enrichment-guide.md)**: Implementation guide for the product enrichment feature in the frontend.

6. **[Product Management Guidelines](./product_management_guidelne.md)**: Guidelines for product management within the application.

## Key Features

ReachGenie is a comprehensive outbound sales platform with several key features:

- **Company Management**: Create and manage companies with detailed profiles
- **Product Management**: Track products with AI-powered enrichment
- **Lead Management**: Import, filter, and manage potential leads 
- **Email Campaigns**: Create and track email outreach campaigns
- **Call Management**: Log and analyze sales calls with AI assistance
- **Analytics**: Track performance metrics across activities

## Architecture Overview

ReachGenie follows a modern React architecture with these characteristics:

- **React + TypeScript**: For type-safe component development
- **Feature-based Organization**: Components organized by business domain
- **Custom Hooks**: For encapsulating data fetching and business logic
- **Service Layer**: Clean API for backend communication
- **Responsive Design**: Using Tailwind CSS for adaptive UI

## Getting Started

For developers new to the project, we recommend reviewing the documentation in this order:

1. Start with the [Frontend Architecture](./frontend-architecture.md) document for a high-level overview
2. Review the [Component Structure](./component-structure.md) to understand UI organization
3. Explore the [Application Data Flow](./application-data-flow.md) to learn about data handling
4. Check feature-specific documentation as needed for your work

## Best Practices

The codebase follows these best practices:

- **TypeScript**: Type safety throughout the application
- **Component Patterns**: Consistent patterns for maintainability
- **Error Handling**: Comprehensive error handling strategy
- **Accessibility**: Focus on making components accessible
- **Testing**: Component tests focusing on user behavior
- **Performance**: Optimized rendering and data loading

## Contributing

When contributing to the frontend:

1. Follow the established component and code patterns
2. Ensure proper type definitions for all code
3. Include tests for new components and features
4. Update documentation when adding major features
5. Ensure responsive design across device sizes

## Diagrams

Most documentation includes Mermaid diagrams for visualizing architecture and flows. These diagrams can be rendered in any Markdown viewer that supports Mermaid syntax.

---

For any questions about the frontend architecture or implementation details, please contact the development team. 