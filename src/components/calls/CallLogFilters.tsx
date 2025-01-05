import React from 'react';
import { Search, Calendar } from 'lucide-react';

interface CallLogFilters {
  search: string;
  dateRange: 'all' | 'today' | 'week' | 'month';
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface CallLogFiltersProps {
  filters: CallLogFilters;
  onFilterChange: (filters: CallLogFilters) => void;
}

export function CallLogFilters({ filters, onFilterChange }: CallLogFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search leads or products..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-400" />
        <select
          value={filters.dateRange}
          onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as CallLogFilters['dateRange'] })}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All time</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </select>
      </div>

      <select
        value={filters.sentiment || ''}
        onChange={(e) => onFilterChange({ 
          ...filters, 
          sentiment: e.target.value as CallLogFilters['sentiment'] || undefined 
        })}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">All sentiments</option>
        <option value="positive">Positive</option>
        <option value="neutral">Neutral</option>
        <option value="negative">Negative</option>
      </select>
    </div>
  );
}