import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { getCompanyById, Company } from '../../services/companies';
import { getCampaignById, updateCampaign, Campaign, CampaignUpdate } from '../../services/emailCampaigns';
import { Mail, MessageSquare, FileText, Calendar, Phone, Eye, Package } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export function EditCampaign() {
  const { companyId, campaignId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const quillEditorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editorInitialized, setEditorInitialized] = useState(false);

  // Use a separate state for the UI date picker
  const [scheduledAtDate, setScheduledAtDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState<CampaignUpdate>({
    name: '',
    description: '',
    template: '',
    auto_reply_enabled: false,
    scheduled_at: undefined
  });

  useEffect(() => {
    async function fetchData() {
      if (!companyId || !campaignId) return;

      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Fetch company data
        const companyData = await getCompanyById(token, companyId);
        setCompany(companyData);
        
        // Fetch campaign data
        const campaignData = await getCampaignById(token, campaignId);
        setCampaign(campaignData);
        
        // Set form data
        setFormData({
          name: campaignData.name,
          description: campaignData.description || '',
          template: campaignData.template || '',
          auto_reply_enabled: campaignData.auto_reply_enabled,
          scheduled_at: campaignData.scheduled_at
        });

        // Set the date picker value if scheduled_at exists
        if (campaignData.scheduled_at) {
          // Parse the UTC string and create a UTC Date object
          const utcDate = new Date(campaignData.scheduled_at);
          const localDate = new Date(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate(),
            utcDate.getUTCHours(),
            utcDate.getUTCMinutes()
          );
          setScheduledAtDate(localDate);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [companyId, campaignId, showToast]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  };

  const initializeEditor = async () => {
    if (!editorContainerRef.current || editorInitialized || !campaign?.template) return;

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

        // Set initial content
        quillEditorRef.current.root.innerHTML = formData.template;

        // Handle content changes
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
      showToast('Failed to initialize editor', 'error');
    }
  };

  useEffect(() => {
    if (campaign?.type === 'email' || campaign?.type === 'email_and_call') {
      initializeEditor();
    }
  }, [campaign]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);

    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication token not found', 'error');
        return;
      }

      const updateData: CampaignUpdate = {
        name: formData.name,
        description: formData.description,
        template: (campaign?.type === 'email' || campaign?.type === 'email_and_call') ? formData.template : undefined,
        auto_reply_enabled: formData.auto_reply_enabled,
        scheduled_at: formData.scheduled_at
      };

      await updateCampaign(token, companyId!, campaignId!, updateData);
      showToast('Campaign updated successfully!', 'success');
      navigate(`/companies/${companyId}/campaigns`);
    } catch (err) {
      console.error('Error updating campaign:', err);
      const error = err as any;
      if (error?.response?.data?.detail) {
        showToast(error.response.data.detail, 'error');
      } else {
        showToast('Failed to update campaign', 'error');
      }
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

  const handleScheduledAtChange = (date: Date | null) => {
    setScheduledAtDate(date);
    // If date is selected, create a UTC date string
    if (date) {
      // Convert local date to UTC string
      const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      ));
      setFormData(prev => ({
        ...prev,
        scheduled_at: utcDate.toISOString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        scheduled_at: undefined
      }));
    }
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

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">Campaign not found.</div>
        <button
          onClick={() => navigate(`/companies/${companyId}/campaigns`)}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Edit Campaign"
        subtitle={company?.name ? `for ${company.name}` : undefined}
        showBackButton={true}
        onBackClick={() => navigate(`/companies/${companyId}/campaigns`)}
      />
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Campaign Type - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Type
            </label>
            <div className="mt-1 flex items-center space-x-2">
              {campaign.type === 'email' && <Mail className="h-5 w-5 text-blue-500" />}
              {campaign.type === 'call' && <Phone className="h-5 w-5 text-purple-500" />}
              {campaign.type === 'email_and_call' && (
                <>
                  <Mail className="h-5 w-5 text-blue-500" />
                  <Phone className="h-5 w-5 text-purple-500" />
                </>
              )}
              <span className="text-gray-900 capitalize">
                {campaign.type === 'email_and_call' ? 'Email + Call' : campaign.type}
              </span>
            </div>
          </div>

          {/* Campaign Name - Editable */}
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

          {/* Product - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <div className="mt-1">
              <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <Package className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-900">{campaign.product_name}</span>
              </div>
            </div>
          </div>

          {/* Purpose of Campaign - Editable */}
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

          {/* Schedule Campaign - Editable */}
          <div>
            <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Campaign to auto run on:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <DatePicker
                id="scheduled_at"
                selected={scheduledAtDate}
                onChange={handleScheduledAtChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time (UTC)"
                className="form-input !pl-10"
                minDate={new Date()}
                isClearable
              />
            </div>
            <div className="mt-1 space-y-1">
              <p className="text-xs text-gray-500">
                Choose when to automatically run this campaign. Leave empty to run manually.
              </p>
              <p className="text-xs font-medium text-amber-600">
                All times are in UTC timezone
              </p>
            </div>
          </div>

          {/* Email Template - Only for email campaigns */}
          {(campaign.type === 'email' || campaign.type === 'email_and_call') && (
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

          {/* Auto Reply - Only for email campaigns */}
          {(campaign.type === 'email' || campaign.type === 'email_and_call') && (
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
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 