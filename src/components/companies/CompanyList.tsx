import React from 'react';
import { Building2, MapPin, Briefcase, Plus, Package, Users, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCompanies } from '../../data/mockData';

export function CompanyList() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Companies</h1>
          <Link
            to="/companies/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Company
          </Link>
        </div>
        <p className="text-gray-600">
          Manage all your companies in one place. View products, track leads, and monitor sales calls for each company.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCompanies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">{company.name}</h3>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{company.address}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="text-sm">{company.industry}</span>
              </div>
            </div>
            <div className="pt-4 space-y-2 border-t">
              <Link
                to={`/companies/${company.id}/products`}
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <Package className="h-4 w-4 mr-2" />
                View Products
              </Link>
              <div>
                <Link
                  to={`/companies/${company.id}/leads`}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Leads
                </Link>
              </div>
              <div>
                <Link
                  to={`/companies/${company.id}/calls`}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  View Calls
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}