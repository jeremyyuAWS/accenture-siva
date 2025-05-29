import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface GraphSearchInputProps {
  onSearch: (query: string) => void;
}

const GraphSearchInput: React.FC<GraphSearchInputProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  // Example search suggestions
  const suggestions = [
    'Fintech', 'AI Startups', 'Recent Acquisitions', 'Series B', 'Cybersecurity'
  ];

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search the knowledge graph..."
            className="w-full p-2.5 pl-9 pr-9 border border-border rounded-md bg-background-primary text-primary"
          />
          <div className="absolute left-3 top-3">
            <Search className="h-4 w-4 text-secondary" />
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-3 text-secondary hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              setSearchTerm(suggestion);
              onSearch(suggestion);
            }}
            className="px-2 py-1 text-xs rounded-full bg-background-primary border border-border text-secondary hover:bg-accent/5 hover:text-primary"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GraphSearchInput;