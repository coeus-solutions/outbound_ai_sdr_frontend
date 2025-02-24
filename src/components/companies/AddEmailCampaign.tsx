import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { getCompanyById, Company } from '../../services/companies';
import { createCampaign, CampaignCreate } from '../../services/emailCampaigns';
import { getCompanyProducts, ProductInDB } from '../../services/products';
import { Mail, MessageSquare, Package, FileText, ChevronDown } from 'lucide-react';

export function AddEmailCampaign() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<ProductInDB[]>([]);
  const quillEditorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'email' as 'email' | 'call',
    product_id: '',
    template: ''
  });

  const initializeEditor = async () => {
    if (!editorContainerRef.current || editorInitialized) return;

    // Load CSS
    if (!document.querySelector('link[href*="quill.snow.css"]')) {
      const snowCSS = document.createElement('link');
      snowCSS.rel = 'stylesheet';
      snowCSS.href = 'https://cdn.quilljs.com/2.0.0-dev.4/quill.snow.css';
      document.head.appendChild(snowCSS);
    }

    if (!document.querySelector('link[href*="github.min.css"]')) {
      const highlightCSS = document.createElement('link');
      highlightCSS.rel = 'stylesheet';
      highlightCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/github.min.css';
      document.head.appendChild(highlightCSS);
    }

    try {
      // Load Scripts
      await Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/highlight.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/languages/xml.min.js'),
        loadScript('https://cdn.quilljs.com/2.0.0-dev.4/quill.min.js'),
        loadScript('https://unpkg.com/quill-html-edit-button@2.2.7/dist/quill.htmlEditButton.min.js')
      ]);

      // Initialize Quill
      if (editorContainerRef.current && (window as any).Quill) {
        const Quill = (window as any).Quill;
        const htmlEditButton = (window as any).htmlEditButton;
        
        Quill.register("modules/htmlEditButton", htmlEditButton);

        // Create toolbar container
        const toolbarContainer = document.createElement('div');
        editorContainerRef.current.parentNode?.insertBefore(toolbarContainer, editorContainerRef.current);

        // Create editor container
        const editorContainer = document.createElement('div');
        editorContainerRef.current.parentNode?.replaceChild(editorContainer, editorContainerRef.current);

        quillEditorRef.current = new Quill(editorContainer, {
          theme: 'snow',
          modules: {
            toolbar: {
              container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link'],
                ['clean']
              ]
            },
            htmlEditButton: {
              syntax: true,
              buttonHTML: '&lt;/&gt;'
            }
          },
          placeholder: 'Start typing your email template...'
        });

        // Set default content
        quillEditorRef.current.root.innerHTML = '{email_body}';
        // Update form data with default content
        setFormData(prev => ({
          ...prev,
          template: '{email_body}'
        }));

        quillEditorRef.current.on('text-change', () => {
          const content = quillEditorRef.current.root.innerHTML;
          setFormData(prev => ({
            ...prev,
            template: content
          }));
        });

        setEditorInitialized(true);
      }
    } catch (error) {
      console.error('Error initializing editor:', error);
    }
  };

  // Initialize editor when loading is complete
  useEffect(() => {
    if (!isLoading && formData.type === 'email') {
      initializeEditor();
    }
  }, [isLoading, formData.type]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (quillEditorRef.current) {
        quillEditorRef.current = null;
        setEditorInitialized(false);
      }
    };
  }, []);

  // Handle type changes
  useEffect(() => {
    if (formData.type !== 'email' && quillEditorRef.current) {
      quillEditorRef.current = null;
      setEditorInitialized(false);
    }
  }, [formData.type]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  };

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
          getCompanyProducts(token, companyId)
        ]);

        setCompany(companyData);
        setProducts(productsData);
        if (productsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            product_id: productsData[0].id
          }));
        }
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
    setIsSaving(true);

    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication token not found', 'error');
        return;
      }

      // Create campaign data without template for Call type
      const campaignData = {
        ...formData,
        template: formData.type === 'email' ? formData.template : undefined
      };

      await createCampaign(token, companyId!, campaignData);
      showToast('Campaign created successfully!', 'success');
      navigate(`/companies/${companyId}/campaigns`);
    } catch (err) {
      console.error('Error creating campaign:', err);
      showToast('Failed to create campaign', 'error');
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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">Please add at least one product before creating a campaign.</div>
        <button
          onClick={() => navigate(`/companies/${companyId}/products`)}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Campaign</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter campaign name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="type"
                id="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="form-input appearance-none"
              >
                <option value="email">Email</option>
                <option value="call">Call</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="product_id"
                id="product_id"
                required
                value={formData.product_id}
                onChange={handleChange}
                className="form-input appearance-none"
              >
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.product_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-gray-500 font-normal"> (Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="form-input !pt-2 !pb-2 min-h-[100px]"
                placeholder="Enter campaign description"
              />
            </div>
          </div>

          {formData.type === 'email' && (
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
                Email Template
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Make sure to include <code className="bg-gray-100 px-1 py-0.5 rounded text-pink-600">{'{email_body}'}</code> placeholder in your template where you want the email content to appear.
              </p>
              <div className="mt-1">
                <div ref={editorContainerRef} style={{ minHeight: '200px' }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/companies/${companyId}/campaigns`)}
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