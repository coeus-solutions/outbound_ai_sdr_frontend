import { apiEndpoints } from '../config';

export interface Product {
  id: string;
  name: string;
  product_name: string;
  description?: string;
  company_id: string;
  product_url?: string;
  file_name?: string;
  original_filename?: string;
  enriched_information?: {
    overview?: string;
    key_value_proposition?: string;
    pricing?: string;
    reviews?: string[];
    market_overview?: string;
    competitors?: string;
  };
  total_campaigns: number;
  total_calls: number;
  total_positive_calls: number;
  total_sent_emails: number;
  total_opened_emails: number;
  total_replied_emails: number;
  unique_leads_contacted: number;
  total_meetings_booked_in_calls: number;
  total_meetings_booked_in_emails: number;
}

export interface ProductCreate {
  product_name: string;
  description?: string;
  product_url?: string;
  file?: File;
}

export interface ProductInDB {
  id: string;
  company_id: string;
  product_name: string;
  file_name?: string;
  original_filename?: string;
}

interface ProductResponse {
  id: string;
  name?: string;
  product_name: string;
  description?: string;
  company_id: string;
  product_url?: string;
  file_name?: string;
  original_filename?: string;
  enriched_information?: {
    overview?: string;
    key_value_proposition?: string;
    pricing?: string;
    reviews?: string[];
    market_overview?: string;
    competitors?: string;
  };
  total_campaigns?: number;
  total_calls?: number;
  total_positive_calls?: number;
  total_sent_emails?: number;
  total_opened_emails?: number;
  total_replied_emails?: number;
  unique_leads_contacted?: number;
  total_meetings_booked_in_calls?: number;
  total_meetings_booked_in_emails?: number;
}

export async function getProducts(token: string, companyId: string): Promise<Product[]> {
  const response = await fetch(apiEndpoints.companies.products(companyId), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const products = await response.json() as ProductResponse[];
  return products.map((product) => ({
    id: product.id,
    name: product.name || product.product_name,
    product_name: product.product_name,
    description: product.description,
    company_id: product.company_id,
    product_url: product.product_url,
    file_name: product.file_name,
    original_filename: product.original_filename,
    enriched_information: product.enriched_information,
    total_campaigns: product.total_campaigns || 0,
    total_calls: product.total_calls || 0,
    total_positive_calls: product.total_positive_calls || 0,
    total_sent_emails: product.total_sent_emails || 0,
    total_opened_emails: product.total_opened_emails || 0,
    total_replied_emails: product.total_replied_emails || 0,
    unique_leads_contacted: product.unique_leads_contacted || 0,
    total_meetings_booked_in_calls: product.total_meetings_booked_in_calls || 0,
    total_meetings_booked_in_emails: product.total_meetings_booked_in_emails || 0,
  }));
}

export async function createProduct(token: string, companyId: string, product: ProductCreate): Promise<Product> {
  const formData = new FormData();
  formData.append('product_name', product.product_name);
  if (product.description) {
    formData.append('description', product.description);
  }
  if (product.product_url) {
    formData.append('product_url', product.product_url);
  }
  if (product.file) {
    formData.append('file', product.file);
  }

  const response = await fetch(apiEndpoints.companies.products(companyId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type header, let the browser set it with the boundary
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
}

export async function updateProduct(
  token: string,
  companyId: string,
  productId: string,
  data: {
    product_name: string;
    description: string;
  }
): Promise<Product> {
  const response = await fetch(
    `${apiEndpoints.companies.products(companyId)}/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return response.json();
}

export async function getCompanyProducts(token: string, companyId: string): Promise<ProductInDB[]> {
  const response = await fetch(apiEndpoints.companies.products(companyId), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export async function getProduct(token: string, companyId: string, productId: string): Promise<Product> {
  const response = await fetch(`${apiEndpoints.companies.products(companyId)}/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  const product = await response.json();
  return {
    id: product.id,
    name: product.name || product.product_name,
    product_name: product.product_name,
    description: product.description,
    company_id: product.company_id,
    product_url: product.product_url,
    file_name: product.file_name,
    original_filename: product.original_filename,
    enriched_information: product.enriched_information,
    total_campaigns: product.total_campaigns || 0,
    total_calls: product.total_calls || 0,
    total_positive_calls: product.total_positive_calls || 0,
    total_sent_emails: product.total_sent_emails || 0,
    total_opened_emails: product.total_opened_emails || 0,
    total_replied_emails: product.total_replied_emails || 0,
    unique_leads_contacted: product.unique_leads_contacted || 0,
    total_meetings_booked_in_calls: product.total_meetings_booked_in_calls || 0,
    total_meetings_booked_in_emails: product.total_meetings_booked_in_emails || 0,
  };
}

export async function deleteProduct(token: string, companyId: string, productId: string): Promise<void> {
  const response = await fetch(
    `${apiEndpoints.companies.products(companyId)}/${productId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
} 