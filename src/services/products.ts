import { apiEndpoints } from '../config';

export interface Product {
  id: string;
  product_name: string;
  description?: string;
  company_id: string;
}

export interface ProductCreate {
  product_name: string;
  description?: string;
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

  return response.json();
}

export async function createProduct(token: string, companyId: string, product: ProductCreate): Promise<Product> {
  const response = await fetch(apiEndpoints.companies.products(companyId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
} 