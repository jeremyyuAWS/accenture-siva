import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ChevronDown, Database } from 'lucide-react';

interface GraphSearchProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

const GraphSearch: React.FC<GraphSearchProps> = ({ 
  onSearch, 
  isSearching = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'AI companies in healthcare',
    'Recent acquisitions in fintech',
    'Climate tech funding rounds'
  ]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
      }
    }
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex w-full">
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowRecent(true)}
            placeholder="Search the knowledge graph..."
            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            disabled={isSearching}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className={`ml-2 px-4 py-2 ${
            isSearching
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gray-800 hover:bg-black'
          } text-white rounded-lg flex items-center`}
          disabled={isSearching}
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>
      
      {/* Recent searches dropdown */}
      {showRecent && (
        <div 
          ref={dropdownRef}
          className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10"
        >
          <div className="p-2 border-b border-gray-100 flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Recent Searches</h4>
            <button 
              onClick={() => setRecentSearches([])}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {recentSearches.length > 0 ? (
              recentSearches.map((search, index) => (
                <button
                  key={index}
                  className="flex items-center w-full p-2 hover:bg-gray-50 text-left"
                  onClick={() => {
                    setSearchQuery(search);
                    setShowRecent(false);
                    setTimeout(() => handleSearch(), 0);
                  }}
                >
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 text-sm">{search}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No recent searches
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100">
            <button
              className="flex items-center w-full p-2 hover:bg-gray-50 text-left text-gray-600 text-sm"
              onClick={() => {
                setShowRecent(false);
                // This would open advanced search options in a real app
              }}
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Advanced Search Options
            </button>
            <div className="flex items-center text-xs text-gray-400 mt-1 pl-2">
              <Database className="h-3 w-3 mr-1" />
              Searching across 12,450 companies and investors
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphSearch;