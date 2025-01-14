import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Package, Wand2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { getCompanyById, Company } from '../../services/companies';
import { createEmailCampaign } from '../../services/emailCampaigns';
import { apiEndpoints } from '../../config';

export function AddEmailCampaign() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratedFields, setShowGeneratedFields] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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

        const [companyData] = await Promise.all([
          getCompanyById(token, companyId),
        ]);

        setCompany(companyData);
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

  const handleGenerate = async () => {
    const achievementText = (document.getElementById('achievement') as HTMLTextAreaElement)?.value;
    if (!achievementText) {
      showToast('Please enter what you would like to achieve first', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(apiEndpoints.generate.campaign, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ achievement_text: achievementText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate campaign content');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        name: data.campaign_name,
        description: data.description,
        email_subject: data.email_subject,
        email_body: data.email_body,
      }));
      setShowGeneratedFields(true);
      showToast('Campaign content generated successfully!', 'success');
    } catch (err) {
      showToast('Failed to generate campaign content. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link'
  ];

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
            <label htmlFor="achievement" className="block text-sm font-medium text-gray-700">
              What would you like to achieve?
            </label>
            <div className="mt-1">
              <textarea
                name="achievement"
                id="achievement"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your campaign goal"
              />
              <button
                type="button"
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <Wand2 className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Let\'s make it awesome'}
              </button>
            </div>
          </div>

          {showGeneratedFields && (
            <>
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
                  <ReactQuill
                    theme="snow"
                    value={formData.email_body}
                    onChange={(content) => setFormData(prev => ({ ...prev, email_body: content }))}
                    modules={modules}
                    formats={formats}
                    className="h-64 bg-white"
                  />
                  <div className="h-16" /> {/* Spacer for Quill toolbar */}
                </div>
              </div>
            </>
          )}
        </div>

        {showGeneratedFields && (
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
        )}
      </form>
    </div>
  );
} 