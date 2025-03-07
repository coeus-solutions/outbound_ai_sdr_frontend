# ReachGenie Component Structure

## Overview

This document provides a detailed overview of the component architecture used in the ReachGenie frontend application. It describes the organization, pattern usage, and interactions between different types of components.

## Component Organization

ReachGenie uses a feature-based organization for components, structured as follows:

```
src/components/
├── auth/                 # Authentication components
├── calls/                # Call management components
├── companies/            # Company management components
├── dashboard/            # Dashboard and layout components
├── emails/               # Email management components
├── landing/              # Landing page components
├── leads/                # Lead management components
├── shared/               # Reusable shared components
└── user/                 # User profile components
```

## Component Types

The application follows a component hierarchy with clear responsibilities:

### 1. Layout Components

Layout components provide structure for the application:

- `DashboardLayout`: Main authenticated application layout
- `UnauthenticatedApp`: Layout for unauthenticated screens

### 2. Page Components

Page components correspond to main application routes:

- `CompanyList`: Companies overview page
- `LeadList`: Leads management page
- `CompanyProducts`: Products page for a company
- `CompanyCallLogs`: Call logs page for a company
- `CompanyEmails`: Email logs page for a company

### 3. Feature Components

Feature components implement specific functionality:

- `AddProduct`: Form for creating a new product
- `AddEmailCampaign`: Form for creating a new email campaign
- `EnrichedProductInfo`: Display for AI-enriched product information

### 4. Shared Components

Reusable UI elements used across the application:

- `Dialog`: Modal dialog component
- `SkeletonLoader`: Loading state visualization
- `Autocomplete`: Input with autocomplete functionality
- `LoadingButton`: Button with loading state

## Component Examples

### Layout Component Example

```tsx
// DashboardLayout.tsx
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  onLogout 
}) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
```

### Page Component Example

```tsx
// CompanyList.tsx (simplified)
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Company, getCompanies } from '../../services/companies';
import { SkeletonLoader } from '../shared/SkeletonLoader';

export function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const token = getToken();
        const data = await getCompanies(token);
        setCompanies(data);
      } catch (err) {
        setError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCompanies();
  }, []);
  
  if (loading) return <SkeletonLoader count={3} />;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Companies</h1>
        <Link 
          to="/companies/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Company
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
```

### Feature Component Example

```tsx
// AddProduct.tsx (simplified)
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct } from '../../services/products';
import { useToast } from '../../context/ToastContext';

export function AddProduct() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('product_name', productName);
      
      if (description) {
        formData.append('description', description);
      }
      
      if (productUrl) {
        formData.append('product_url', productUrl);
      }
      
      if (file) {
        formData.append('file', file);
      }
      
      const token = getToken();
      await createProduct(token, companyId!, formData);
      
      showToast({
        type: 'success',
        message: 'Product created successfully'
      });
      
      navigate(`/companies/${companyId}/products`);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to create product'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
```

### Shared Component Example

```tsx
// Dialog.tsx
import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
```

## Component Patterns

ReachGenie implements several component patterns for maintainability and reuse:

### 1. Container-Presenter Pattern

Many page components follow the container-presenter pattern:

- **Container**: Handles data fetching, state, and business logic
- **Presenter**: Focuses on rendering UI based on provided props

Example:
```tsx
// Container Component
function LeadListContainer() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data
  }, []);
  
  return (
    <LeadListPresenter 
      leads={leads} 
      loading={loading} 
      onDelete={handleDelete} 
    />
  );
}

// Presenter Component
const LeadListPresenter = ({ leads, loading, onDelete }) => {
  if (loading) return <SkeletonLoader />;
  
  return (
    <div>
      {leads.map(lead => (
        <LeadRow key={lead.id} lead={lead} onDelete={onDelete} />
      ))}
    </div>
  );
};
```

### 2. Custom Hooks for Logic Extraction

Logic is often extracted into custom hooks:

```tsx
// Component using a custom hook
function CompanyProducts() {
  const { companyId } = useParams();
  const { 
    products, 
    loading, 
    error, 
    deleteProduct 
  } = useProducts(companyId);
  
  // Rendering logic...
}

// Custom hook implementation
function useProducts(companyId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProducts = useCallback(async () => {
    // Fetch logic
  }, [companyId]);
  
  const deleteProduct = useCallback(async (productId) => {
    // Delete logic
  }, [companyId]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  return { products, loading, error, deleteProduct };
}
```

### 3. Higher-Order Components

For cross-cutting concerns like authentication:

```tsx
// withAuth HOC
function withAuth(Component) {
  return function WithAuth(props) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

### 4. Compound Components

For related UI elements:

```tsx
// Tabs compound component
const Tabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.TabList = ({ children }) => (
  <div className="flex border-b">
    {children}
  </div>
);

Tabs.Tab = ({ id, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={`px-4 py-2 ${activeTab === id ? 'border-b-2 border-blue-500' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
};

Tabs.TabPanel = ({ id, children }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== id) return null;
  
  return (
    <div className="p-4">
      {children}
    </div>
  );
};

// Usage
<Tabs defaultTab="products">
  <Tabs.TabList>
    <Tabs.Tab id="products">Products</Tabs.Tab>
    <Tabs.Tab id="leads">Leads</Tabs.Tab>
  </Tabs.TabList>
  
  <Tabs.TabPanel id="products">
    <ProductsList />
  </Tabs.TabPanel>
  
  <Tabs.TabPanel id="leads">
    <LeadsList />
  </Tabs.TabPanel>
</Tabs>
```

## Component Props Structure

Components follow a consistent props approach:

1. **Required/Optional Props**: Clearly typed with TypeScript
2. **Event Handlers**: Consistently named (onClick, onChange, etc.)
3. **Render Props**: For customizing rendering when needed
4. **Children**: For composable patterns

```tsx
// Example of well-structured props
interface TableProps<T> {
  // Required props
  data: T[];
  columns: {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  
  // Optional props
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  
  // Event handlers
  onRowClick?: (item: T) => void;
  
  // Render props
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
}
```

## State Management in Components

Components use different state management approaches based on complexity:

1. **useState**: For simple component state
2. **useReducer**: For complex state logic within a component
3. **Context**: For shared state across components
4. **Custom Hooks**: For encapsulating state logic

```tsx
// Complex state with useReducer
function useLeadFilters() {
  const [state, dispatch] = useReducer(reducer, {
    searchTerm: '',
    filters: {
      jobTitle: null,
      companySize: null,
    },
    sort: {
      field: 'name',
      direction: 'asc'
    },
    pagination: {
      page: 1,
      pageSize: 20
    }
  });
  
  const setSearchTerm = (term) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };
  
  const setFilter = (key, value) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  };
  
  // Other actions...
  
  return {
    ...state,
    setSearchTerm,
    setFilter,
    // Other actions...
  };
}
```

## Component Lifecycle Management

Components use React's hooks for lifecycle management:

1. **useEffect**: For side effects and lifecycle events
2. **useCallback**: For memoized callbacks
3. **useMemo**: For memoized values
4. **useRef**: For persistent references

```tsx
// Proper lifecycle management
function LeadList() {
  const [leads, setLeads] = useState([]);
  
  // Data fetching on mount
  useEffect(() => {
    let isMounted = true;
    
    async function fetchLeads() {
      try {
        const data = await getLeads();
        if (isMounted) {
          setLeads(data);
        }
      } catch (error) {
        if (isMounted) {
          // Handle error
        }
      }
    }
    
    fetchLeads();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Memoized handler
  const handleDelete = useCallback(async (id) => {
    // Delete logic
  }, []);
  
  // Memoized computed value
  const totalLeads = useMemo(() => {
    return leads.length;
  }, [leads]);
  
  // Render component...
}
```

## Component Testing

Components are tested using React Testing Library with a focus on user behaviors:

```tsx
// Example component test
describe('LeadList', () => {
  it('displays leads when loaded', async () => {
    // Mock API response
    jest.spyOn(leadService, 'getLeads').mockResolvedValue([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]);
    
    render(<LeadList />);
    
    // Check loading state
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
    
    // Wait for leads to load
    await screen.findByText('John Doe');
    
    // Verify leads are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });
  
  it('handles errors gracefully', async () => {
    // Mock API error
    jest.spyOn(leadService, 'getLeads').mockRejectedValue(new Error('API error'));
    
    render(<LeadList />);
    
    // Wait for error message
    await screen.findByText(/failed to load leads/i);
    
    expect(screen.getByText(/failed to load leads/i)).toBeInTheDocument();
  });
});
```

## Responsive Component Design

Components implement responsive design with Tailwind:

```tsx
// Responsive component example
function CompanyCard({ company }) {
  return (
    <div className="
      bg-white 
      p-4 
      rounded-lg 
      shadow 
      flex 
      flex-col 
      sm:flex-row 
      sm:items-center 
      justify-between
    ">
      <div className="mb-4 sm:mb-0">
        <h3 className="text-lg font-semibold">{company.name}</h3>
        <p className="text-sm text-gray-500 hidden md:block">
          {company.industry}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <span className="text-sm text-gray-500 sm:hidden">
          {company.industry}
        </span>
        
        <div className="flex space-x-2">
          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded">
            <Eye size={16} />
            <span className="sr-only">View</span>
          </button>
          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded">
            <Pencil size={16} />
            <span className="sr-only">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Accessibility

Components implement accessibility best practices:

1. **Semantic HTML**: Using proper HTML elements
2. **ARIA attributes**: Adding accessibility attributes when needed
3. **Keyboard navigation**: Ensuring keyboard accessibility
4. **Focus management**: Proper focus handling in interactive components
5. **Screen reader support**: Providing appropriate text for screen readers

```tsx
// Accessible component example
function Dialog({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);
  
  // Focus trap
  useEffect(() => {
    if (isOpen) {
      // Save previous focus
      const previousFocus = document.activeElement;
      
      // Focus dialog when opened
      dialogRef.current?.focus();
      
      return () => {
        // Restore focus when closed
        if (previousFocus instanceof HTMLElement) {
          previousFocus.focus();
        }
      };
    }
  }, [isOpen]);
  
  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
```

## Conclusion

ReachGenie's component architecture follows modern React patterns with a focus on maintainability, reusability, and clean separation of concerns. The feature-based organization makes it easy to find and update components, while consistent patterns ensure code quality across the codebase.

This architecture allows the team to efficiently develop new features while maintaining high standards for performance, accessibility, and user experience. 