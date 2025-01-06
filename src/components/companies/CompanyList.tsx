import React, { useEffect, useState } from 'react';
import { Building2, Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { Company, getCompanies } from '../../services/companies';

export function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          return;
        }
        const data = await getCompanies(token);
        setCompanies(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch companies');
        console.error('Error fetching companies:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, []); // Only run once on mount

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
        <Link
          to="/companies/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No companies</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new company.</p>
          <div className="mt-6">
            <Link
              to="/companies/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className="relative bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                    {company.industry && (
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    )}
                  </div>
                </div>
                {company.address && (
                  <p className="mt-4 text-sm text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    {company.address}
                  </p>
                )}
                <div className="mt-6 flex space-x-4">
                  <Link
                    to={`/companies/${company.id}/products`}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View Products
                  </Link>
                  <Link
                    to={`/companies/${company.id}/leads`}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View Leads
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}