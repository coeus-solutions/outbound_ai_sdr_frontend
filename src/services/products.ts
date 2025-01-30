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
  file?: File;
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
  const formData = new FormData();
  formData.append('product_name', product.product_name);
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