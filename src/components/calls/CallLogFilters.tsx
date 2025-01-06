import React from 'react';
import { Calendar } from 'lucide-react';

interface CallLogFilters {
  dateRange: 'all' | 'today' | 'week' | 'month';
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface CallLogFiltersProps {
  filters: CallLogFilters;
  onFilterChange: (filters: CallLogFilters) => void;
}

export function CallLogFilters({ filters, onFilterChange }: CallLogFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
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