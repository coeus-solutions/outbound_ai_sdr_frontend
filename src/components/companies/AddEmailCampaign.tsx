import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { getCompanyById, Company } from '../../services/companies';
import { createCampaign, CampaignCreate } from '../../services/emailCampaigns';
import { getCompanyProducts, ProductInDB } from '../../services/products';
import { Mail, MessageSquare, Package, FileText, ChevronDown, Calendar, Eye, Phone } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';

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
    type: 'email' as 'email' | 'call' | 'both',
    product_id: '',
    template: '',
    number_of_reminders: 0,
    days_between_reminders: 0,
    auto_reply_enabled: false,
    call_trigger: 'after_email_sent' as 'after_email_sent' | 'when_opened',
    stop_on_any_reply: false
  });

  // Add state for active tab
  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'combined'>('email');

  const [validationErrors, setValidationErrors] = useState<{
    number_of_reminders?: string;
    days_between_reminders?: string;
  }>({});

  // Handler for number of reminders changes
  const handleRemindersChange = (value: number) => {
    const isValid = !isNaN(value) && value >= 0 && value <= 10;
    const newValue = isValid ? value : 0;

    setFormData(prev => ({
      ...prev,
      number_of_reminders: newValue,
      // If reminders are set to 0, automatically set days to 0
      days_between_reminders: newValue === 0 ? 0 : prev.days_between_reminders
    }));

    // Clear validation errors when valid
    if (isValid) {
      setValidationErrors(prev => ({
        ...prev,
        number_of_reminders: undefined
      }));
    }
  };

  // Handler for days between reminders changes
  const handleDaysChange = (value: number) => {
    const isValid = !isNaN(value) && value >= 0 && value <= 30;
    const newValue = isValid ? value : 0;

    setFormData(prev => ({
      ...prev,
      days_between_reminders: newValue
    }));

    // Clear validation errors when valid
    if (isValid) {
      setValidationErrors(prev => ({
        ...prev,
        days_between_reminders: undefined
      }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const errors: { number_of_reminders?: string; days_between_reminders?: string } = {};
    
    // Validate reminder settings
    if (formData.number_of_reminders > 0 && formData.days_between_reminders === 0) {
      errors.days_between_reminders = 'Days between reminders must be set when reminders are enabled';
    }
    if (formData.number_of_reminders === 0 && formData.days_between_reminders > 0) {
      errors.days_between_reminders = 'Days must be 0 when no reminders are set';
    }
    if (formData.days_between_reminders > 30) {
      errors.days_between_reminders = 'Days between reminders cannot exceed 30';
    }
    if (formData.number_of_reminders > 10) {
      errors.number_of_reminders = 'Number of reminders cannot exceed 10';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    if (!isLoading && (formData.type === 'email' || (formData.type === 'both' && activeTab === 'email'))) {
      initializeEditor();
    }
  }, [isLoading, formData.type, activeTab]);

  // Handle type changes and tab changes
  useEffect(() => {
    if (formData.type === 'call' || (formData.type === 'both' && activeTab !== 'email')) {
      if (quillEditorRef.current) {
        quillEditorRef.current = null;
        setEditorInitialized(false);
      }
    } else if ((formData.type === 'email' || (formData.type === 'both' && activeTab === 'email')) && !editorInitialized) {
      initializeEditor();
    }
  }, [formData.type, activeTab]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (quillEditorRef.current) {
        quillEditorRef.current = null;
        setEditorInitialized(false);
      }
    };
  }, []);

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

    // Validate form before submission
    if (!validateForm()) {
      showToast('Please fix the validation errors before submitting', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication token not found', 'error');
        return;
      }

      // For 'both' type campaigns, send as 'email' type to backend for now
      // Later we can update the backend to handle 'both' type properly
      const campaignType = formData.type === 'both' ? 'email' : formData.type;

      // Create campaign data without template for Call type
      const campaignData = {
        ...formData,
        type: campaignType,
        template: formData.type === 'call' ? undefined : formData.template
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

  // Update the reminder input fields to use the new handlers and show validation errors
  const renderReminderInputs = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="number_of_reminders" className="block text-sm font-medium text-gray-700 mb-1">
          {formData.type === 'call' ? 'Number of Retries' : 'Number of Reminders'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            name="number_of_reminders"
            id="number_of_reminders"
            min="0"
            max="10"
            value={formData.number_of_reminders}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              handleRemindersChange(value);
            }}
            className={`form-input ${validationErrors.number_of_reminders ? 'border-red-300' : ''}`}
            placeholder="Number of follow-up emails"
          />
        </div>
        {validationErrors.number_of_reminders && (
          <p className="mt-1 text-xs text-red-500">
            {validationErrors.number_of_reminders}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.type === 'call' 
            ? 'How many retries to perform if no response (0-10)'
            : 'How many follow-up emails to send if no response (0-10)'}
        </p>
      </div>

      <div>
        <label htmlFor="days_between_reminders" className="block text-sm font-medium text-gray-700 mb-1">
          {formData.type === 'call' ? 'Days Between Retries' : 'Days Between Reminders'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            name="days_between_reminders"
            id="days_between_reminders"
            min="0"
            max="30"
            value={formData.days_between_reminders}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              handleDaysChange(value);
            }}
            className={`form-input ${validationErrors.days_between_reminders ? 'border-red-300' : ''}`}
            placeholder="Days between emails"
            disabled={formData.number_of_reminders === 0}
          />
        </div>
        {validationErrors.days_between_reminders && (
          <p className="mt-1 text-xs text-red-500">
            {validationErrors.days_between_reminders}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.type === 'call'
            ? 'Number of days to wait between retries (1-30)'
            : 'Number of days to wait between follow-up emails (1-30)'}
        </p>
      </div>
    </div>
  );

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
      <PageHeader
        title="New Campaign"
        subtitle={company?.name ? `for ${company.name}` : undefined}
      />
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
                <option value="call">Phone</option>
                <option value="both">Both Phone and Email</option>
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
              Purpose of campaign
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Describe what you would like to achieve with this campaign (e.g., book demos, engage customers, generate leads, etc.)
            </p>
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
                placeholder="Enter the purpose of your campaign"
              />
            </div>
          </div>

          {/* Remove the top-level reminder settings */}
          {formData.type === 'email' && (
            <>
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

              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-900">Reminder Settings</h3>
                {renderReminderInputs()}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="auto_reply_enabled"
                    id="auto_reply_enabled"
                    checked={formData.auto_reply_enabled}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      auto_reply_enabled: e.target.checked
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto_reply_enabled" className="ml-2 block text-sm text-gray-900">
                    Enable Auto-Reply
                  </label>
                  <p className="ml-8 text-xs text-gray-500">
                    When enabled, AI will automatically handle prospect replies
                  </p>
                </div>
              </div>
            </>
          )}

          {formData.type === 'call' && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Phone Campaign Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderReminderInputs()}
              </div>
            </div>
          )}

          {formData.type === 'both' && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="mb-4">
                <nav className="flex space-x-2 border-b">
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'email'
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    type="button"
                  >
                    Email Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('phone')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'phone'
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    type="button"
                  >
                    Phone Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('combined')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'combined'
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    type="button"
                  >
                    Combined Settings
                  </button>
                </nav>
              </div>

              {activeTab === 'email' && (
                <>
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

                  <div className="space-y-4 border-t pt-4 mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Reminder Settings</h3>
                    {renderReminderInputs()}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="auto_reply_enabled"
                        id="auto_reply_enabled"
                        checked={formData.auto_reply_enabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          auto_reply_enabled: e.target.checked
                        }))}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="auto_reply_enabled" className="ml-2 block text-sm text-gray-900">
                        Enable Auto-Reply
                      </label>
                      <p className="ml-8 text-xs text-gray-500">
                        When enabled, AI will automatically handle prospect replies
                      </p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'phone' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Phone Campaign Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderReminderInputs()}
                  </div>
                </div>
              )}

              {activeTab === 'combined' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Combined Campaign Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        When to Trigger Call
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="after_email_sent"
                            name="call_trigger"
                            type="radio"
                            checked={formData.call_trigger === 'after_email_sent'}
                            onChange={() => {
                              setFormData(prev => ({
                                ...prev,
                                call_trigger: 'after_email_sent'
                              }));
                            }}
                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <label htmlFor="after_email_sent" className="ml-3 block text-sm font-medium text-gray-700">
                            After email is sent
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="when_opened"
                            name="call_trigger"
                            type="radio"
                            checked={formData.call_trigger === 'when_opened'}
                            onChange={() => {
                              setFormData(prev => ({
                                ...prev,
                                call_trigger: 'when_opened'
                              }));
                            }}
                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <label htmlFor="when_opened" className="ml-3 block text-sm font-medium text-gray-700">
                            When user opens email
                          </label>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Choose when the phone call should be triggered
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center">
                        <input
                          id="stop_on_any_reply"
                          name="stop_on_any_reply"
                          type="checkbox"
                          checked={formData.stop_on_any_reply}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              stop_on_any_reply: e.target.checked
                            }));
                          }}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="stop_on_any_reply" className="ml-3 block text-sm font-medium text-gray-700">
                          If customer replies to phone or email, stop campaign
                        </label>
                      </div>
                      <p className="mt-1 ml-7 text-xs text-gray-500">
                        Automatically stop all campaign activities if the prospect responds through any channel
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end items-center mt-8">
          <div className="flex space-x-4">
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
        </div>
      </form>
    </div>
  );
} 