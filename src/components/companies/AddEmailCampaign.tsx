import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Package } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { getCompanyById, Company } from '../../services/companies';
import { getProducts, Product } from '../../services/products';
import { createEmailCampaign } from '../../services/emailCampaigns';

export function AddEmailCampaign() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    product_id: '',
    email_subject: '',
    email_body: '',
  });

  useEffect(() => {
    async function fetchData() {
      if (!companyId) return;

      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const [companyData, productsData] = await Promise.all([
          getCompanyById(token, companyId),
          getProducts(token, companyId)
        ]);

        setCompany(companyData);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        const errorMessage = 'Failed to fetch data';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [companyId, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    setIsSaving(true);
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found');
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      await createEmailCampaign(token, companyId, {
        name: formData.name,
        description: formData.description || undefined,
        product_id: formData.product_id,
        email_subject: formData.email_subject,
        email_body: formData.email_body,
      });

      showToast('Email campaign created successfully!', 'success');
      navigate(`/companies/${companyId}/email-campaigns`);
    } catch (err) {
      const errorMessage = 'Failed to create email campaign';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      email_body: content
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Email Campaign</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Campaign Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter campaign name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter campaign description"
              />
            </div>
          </div>

          <div>
            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">
              Product
            </label>
            <div className="mt-1">
              <select
                name="product_id"
                id="product_id"
                required
                value={formData.product_id}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.product_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="email_subject" className="block text-sm font-medium text-gray-700">
              Email Subject
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="email_subject"
                id="email_subject"
                required
                value={formData.email_subject}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter email subject"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email_body" className="block text-sm font-medium text-gray-700">
              Email Body
            </label>
            <div className="mt-1">
              <Editor
                id="email_body"
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                }}
                value={formData.email_body}
                onEditorChange={handleEditorChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/companies/${companyId}/email-campaigns`)}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
} 