import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, ChevronDown, ChevronUp, Users, User, BarChart, Target, CheckCircle, XCircle, Building, Briefcase, Cpu, DollarSign } from 'lucide-react';
import { IdealCustomerProfile, getProductICPs, generateProductICP } from '../../services/products';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';

interface IdealCustomerProfilesProps {
  companyId: string;
  productId: string;
}

export function IdealCustomerProfiles({ companyId, productId }: IdealCustomerProfilesProps) {
  const [profiles, setProfiles] = useState<IdealCustomerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);
  const [icpInput, setIcpInput] = useState('');
  const [showIcpInputForm, setShowIcpInputForm] = useState(false);
  const { showToast } = useToast();

  // Use useCallback to memoize the fetchProfiles function
  const fetchProfiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const icpData = await getProductICPs(token, companyId, productId);
      setProfiles(icpData);
    } catch (error) {
      console.error('Error fetching ideal customer profiles:', error);
      showToast('Failed to fetch ideal customer profiles', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, productId, showToast]);

  // Fetch ICPs when component mounts
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleGenerateProfile = async () => {
    try {
      setIsGenerating(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const newProfiles = await generateProductICP(token, companyId, productId, icpInput || undefined);
      
      // After generating profiles, fetch all profiles to ensure we have the latest data
      await fetchProfiles();
      
      // If we have new profiles, expand the first one
      if (Array.isArray(newProfiles) && newProfiles.length > 0) {
        setExpandedProfileId(newProfiles[0].id);
      } else if (!Array.isArray(newProfiles) && newProfiles) {
        setExpandedProfileId(newProfiles.id);
      }
      
      // Clear the input field after successful generation
      setIcpInput('');
      // Hide the input form
      setShowIcpInputForm(false);
      showToast('New ideal customer profiles generated successfully', 'success');
    } catch (error) {
      console.error('Error generating ideal customer profile:', error);
      showToast('Failed to generate ideal customer profile', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleProfileExpansion = (profileId: string) => {
    setExpandedProfileId(expandedProfileId === profileId ? null : profileId);
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Ideal Customer Profiles</h3>
        </div>
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-sm text-gray-500">Loading customer profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Ideal Customer Profiles</h3>
        {!showIcpInputForm && (
          <button
            type="button"
            onClick={() => setShowIcpInputForm(true)}
            disabled={isLoading || isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Generate Ideal Customer Profile
          </button>
        )}
      </div>

      {/* ICP Input Guidance */}
      {showIcpInputForm && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Focus Your ICP Generation</h4>
          <p className="text-xs text-blue-700 mb-3">
            Enter specific instructions to guide our AI in creating your next ideal customer profiles. 
            You'll receive at least 3 distinct, focused ICPs based on your input.
          </p>
          
          <div className="space-y-2">
            <label htmlFor="icp-input" className="block text-xs font-medium text-blue-700">Your guidance:</label>
            <textarea
              id="icp-input"
              value={icpInput}
              onChange={(e) => setIcpInput(e.target.value)}
              placeholder="E.g., 'Senior marketing executives at healthcare companies in Europe'"
              className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
            
            <div className="text-xs text-blue-600">
              <p className="font-medium mb-1">Examples:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>"Senior marketing executives at healthcare companies in Europe"</li>
                <li>"Operations leaders at manufacturing firms with 500+ employees"</li>
                <li>"IT decision-makers in education sector with budget constraints"</li>
              </ul>
              <p className="mt-2">
                Your specificity helps create more targeted profiles for precise outreach campaigns.
              </p>
            </div>
            
            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setShowIcpInputForm(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateProfile}
                disabled={isGenerating || (icpInput.trim().length > 0 && icpInput.trim().length < 3)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Generate Customer Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No profiles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Generate your first ideal customer profile to get started.
          </p>
          {!showIcpInputForm && (
            <button
              type="button"
              onClick={() => setShowIcpInputForm(true)}
              disabled={isLoading || isGenerating}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Generate Ideal Customer Profile
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => {
            // Skip rendering profiles that don't have the expected structure
            if (!profile || !profile.idealCustomerProfile) {
              console.error('Invalid profile structure:', profile);
              return null;
            }
            
            return (
              <div 
                key={profile.id} 
                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleProfileExpansion(profile.id)}
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-indigo-600 mr-2" />
                    <h4 className="font-medium text-gray-900">
                      {profile.idealCustomerProfile?.name || 'Unnamed Customer Profile'}
                    </h4>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    aria-expanded={expandedProfileId === profile.id}
                    aria-label={expandedProfileId === profile.id ? "Collapse profile" : "Expand profile"}
                  >
                    {expandedProfileId === profile.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {expandedProfileId === profile.id && (
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    {/* Buying Triggers */}
                    {profile.idealCustomerProfile.buyingTriggers && profile.idealCustomerProfile.buyingTriggers.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Target className="h-4 w-4 text-indigo-500 mr-1" />
                          Buying Triggers
                        </h5>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {profile.idealCustomerProfile.buyingTriggers.map((trigger, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{trigger}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Company Attributes */}
                    {profile.idealCustomerProfile.companyAttributes && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Building className="h-4 w-4 text-indigo-500 mr-1" />
                          Company Attributes
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Industries */}
                          {profile.idealCustomerProfile.companyAttributes.industries && 
                           profile.idealCustomerProfile.companyAttributes.industries.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Industries</h6>
                              <div className="flex flex-wrap gap-1">
                                {profile.idealCustomerProfile.companyAttributes.industries.map((industry, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {industry}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Maturity */}
                          {profile.idealCustomerProfile.companyAttributes.maturity && 
                           profile.idealCustomerProfile.companyAttributes.maturity.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Maturity</h6>
                              <div className="flex flex-wrap gap-1">
                                {profile.idealCustomerProfile.companyAttributes.maturity.map((stage, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {stage}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Company Size */}
                          {profile.idealCustomerProfile.companyAttributes.companySize && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Company Size</h6>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <DollarSign className="h-3.5 w-3.5 text-gray-500 mr-1" />
                                  <span>Revenue: {formatCurrency(profile.idealCustomerProfile.companyAttributes.companySize.revenue.min, profile.idealCustomerProfile.companyAttributes.companySize.revenue.currency)} - {formatCurrency(profile.idealCustomerProfile.companyAttributes.companySize.revenue.max, profile.idealCustomerProfile.companyAttributes.companySize.revenue.currency)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-3.5 w-3.5 text-gray-500 mr-1" />
                                  <span>Employees: {profile.idealCustomerProfile.companyAttributes.companySize.employees.min} - {profile.idealCustomerProfile.companyAttributes.companySize.employees.max}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Funding */}
                          {profile.idealCustomerProfile.companyAttributes.funding && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Funding</h6>
                              <div className="text-xs text-gray-600">
                                <div className="flex items-center mb-1">
                                  {profile.idealCustomerProfile.companyAttributes.funding.hasReceivedFunding ? (
                                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1" />
                                  ) : (
                                    <XCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                                  )}
                                  <span>{profile.idealCustomerProfile.companyAttributes.funding.hasReceivedFunding ? 'Has received funding' : 'Has not received funding'}</span>
                                </div>
                                {profile.idealCustomerProfile.companyAttributes.funding.fundingRounds && 
                                 profile.idealCustomerProfile.companyAttributes.funding.fundingRounds.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {profile.idealCustomerProfile.companyAttributes.funding.fundingRounds.map((round, index) => (
                                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {round}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Geographies */}
                          {profile.idealCustomerProfile.companyAttributes.geographies && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Geographies</h6>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div>
                                  <span className="font-medium">Countries: </span>
                                  {profile.idealCustomerProfile.companyAttributes.geographies.countries.join(', ')}
                                </div>
                                <div>
                                  <span className="font-medium">Regions: </span>
                                  {profile.idealCustomerProfile.companyAttributes.geographies.regions.join(', ')}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Technologies */}
                          {profile.idealCustomerProfile.companyAttributes.technologies && 
                           profile.idealCustomerProfile.companyAttributes.technologies.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Technologies</h6>
                              <div className="flex flex-wrap gap-1">
                                {profile.idealCustomerProfile.companyAttributes.technologies.map((tech, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <Cpu className="h-3 w-3 mr-1" />
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Attributes */}
                    {profile.idealCustomerProfile.contactAttributes && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <User className="h-4 w-4 text-indigo-500 mr-1" />
                          Contact Attributes
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Job Titles */}
                          {profile.idealCustomerProfile.contactAttributes.jobTitles && 
                           profile.idealCustomerProfile.contactAttributes.jobTitles.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Job Titles</h6>
                              <div className="flex flex-wrap gap-1">
                                {profile.idealCustomerProfile.contactAttributes.jobTitles.map((title, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Briefcase className="h-3 w-3 mr-1" />
                                    {title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Seniority */}
                          {profile.idealCustomerProfile.contactAttributes.seniority && 
                           profile.idealCustomerProfile.contactAttributes.seniority.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Seniority</h6>
                              <div className="flex flex-wrap gap-1">
                                {profile.idealCustomerProfile.contactAttributes.seniority.map((level, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    {level}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Departments */}
                          {profile.idealCustomerProfile.contactAttributes.departments && 
                           profile.idealCustomerProfile.contactAttributes.departments.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Departments</h6>
                              <div className="flex flex-wrap gap-1">
                                {profile.idealCustomerProfile.contactAttributes.departments.map((dept, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                    {dept}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Responsibilities */}
                          {profile.idealCustomerProfile.contactAttributes.responsibilities && 
                           profile.idealCustomerProfile.contactAttributes.responsibilities.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Responsibilities</h6>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {profile.idealCustomerProfile.contactAttributes.responsibilities.map((resp, index) => (
                                  <li key={index} className="flex items-start">
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Business Challenges */}
                    {profile.idealCustomerProfile.businessChallenges && 
                     profile.idealCustomerProfile.businessChallenges.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <BarChart className="h-4 w-4 text-indigo-500 mr-1" />
                          Business Challenges
                        </h5>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {profile.idealCustomerProfile.businessChallenges.map((challenge, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Exclusion Criteria */}
                    {profile.idealCustomerProfile.exclusionCriteria && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                          Exclusion Criteria
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Excluded Industries */}
                          {profile.idealCustomerProfile.exclusionCriteria.industries && 
                           profile.idealCustomerProfile.exclusionCriteria.industries.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Excluded Industries</h6>
                              <div className="flex flex-wrap gap-1">
                                {profile.idealCustomerProfile.exclusionCriteria.industries.map((industry, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    {industry}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Excluded Company Size */}
                          {profile.idealCustomerProfile.exclusionCriteria.companySize && 
                           profile.idealCustomerProfile.exclusionCriteria.companySize.employees && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Excluded Company Size</h6>
                              <div className="text-xs text-gray-600">
                                <div className="flex items-center">
                                  <Users className="h-3.5 w-3.5 text-red-500 mr-1" />
                                  <span>Employees: {profile.idealCustomerProfile.exclusionCriteria.companySize.employees.min || 0} - {profile.idealCustomerProfile.exclusionCriteria.companySize.employees.max || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 