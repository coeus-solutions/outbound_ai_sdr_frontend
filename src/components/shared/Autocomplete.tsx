import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface AutocompleteProps<T> {
  items: T[];
  value: T | null;
  onChange: (item: T | null) => void;
  getItemLabel: (item: T) => string;
  getItemValue: (item: T) => string;
  getItemSubLabel?: (item: T) => string;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
}

export function Autocomplete<T>({
  items,
  value,
  onChange,
  getItemLabel,
  getItemValue,
  getItemSubLabel,
  placeholder = 'Search...',
  isLoading = false,
  className = '',
  onSearch
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setQuery(getItemLabel(value));
    }
  }, [value, getItemLabel]);

  // Remove client-side filtering and use items directly
  const filteredItems = items;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (!newQuery) {
      onChange(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (item: T) => {
    onChange(item);
    setQuery(getItemLabel(item));
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    onChange(null);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No results found
            </div>
          ) : (
            <ul>
              {filteredItems.map((item, index) => (
                <li
                  key={getItemValue(item)}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                    index === highlightedIndex ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium truncate">
                      {getItemLabel(item)}
                    </span>
                    {getItemSubLabel && (
                      <span className={`text-sm truncate ${
                        index === highlightedIndex ? 'text-indigo-100' : 'text-gray-500'
                      }`}>
                        {getItemSubLabel(item)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 