import React, { useState } from 'react';
import { SavedSearch } from '../types';
import { Clock, Search, Trash2, Star, Heart, Bookmark, ChevronDown, ChevronUp, BarChart3, Filter } from 'lucide-react';

interface SavedSearchesProps {
  savedSearches: SavedSearch[];
  onLoadSearch: (searchId: string) => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({
  savedSearches,
  onLoadSearch
}) => {
  const [expandedState, setExpandedState] = useState<{ [key: string]: boolean }>({});
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'favorites' | 'recent'>('all');
  const [showArchived, setShowArchived] = useState(false);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Toggle expanded state for a search
  const toggleExpanded = (searchId: string) => {
    setExpandedState(prev => ({
      ...prev,
      [searchId]: !prev[searchId]
    }));
  };
  
  // Filter searches by category
  const filteredSearches = savedSearches.filter(search => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'favorites') return search.isFavorite;
    if (categoryFilter === 'recent') {
      // Show searches from the last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return search.createdAt > oneWeekAgo;
    }
    return true;
  });

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <Bookmark className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Saved Searches</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Access your previously saved search criteria
        </p>
      </div>
      
      <div className="px-4 pt-3 pb-2 border-b border-border">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 text-xs rounded-md ${
              categoryFilter === 'all' 
                ? 'bg-accent text-white' 
                : 'bg-background-primary text-primary hover:bg-background-primary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter('favorites')}
            className={`px-2.5 py-1 text-xs rounded-md flex items-center ${
              categoryFilter === 'favorites' 
                ? 'bg-accent text-white' 
                : 'bg-background-primary text-primary hover:bg-background-primary'
            }`}
          >
            <Heart className="h-3 w-3 mr-1" />
            Favorites
          </button>
          <button
            onClick={() => setCategoryFilter('recent')}
            className={`px-2.5 py-1 text-xs rounded-md flex items-center ${
              categoryFilter === 'recent' 
                ? 'bg-accent text-white' 
                : 'bg-background-primary text-primary hover:bg-background-primary'
            }`}
          >
            <Clock className="h-3 w-3 mr-1" />
            Recent
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {filteredSearches.length === 0 ? (
          <div className="text-center py-8">
            <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-secondary">No saved searches {categoryFilter !== 'all' ? 'in this category' : ''}.</p>
            <p className="text-sm text-secondary mt-1">
              Save searches to quickly access them later.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSearches.map((search) => (
              <div 
                key={search.id}
                className="border border-border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div 
                  className="p-3 cursor-pointer"
                  onClick={() => toggleExpanded(search.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-md font-medium text-primary hover:text-accent transition-colors mr-2">
                          {search.name}
                        </h3>
                        {search.isFavorite && (
                          <Heart className="h-3.5 w-3.5 text-accent fill-current" />
                        )}
                      </div>
                      
                      <div className="flex items-center mt-1 text-sm text-secondary">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{formatDate(search.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadSearch(search.id);
                        }}
                        className="bg-accent/10 p-1.5 rounded-md text-accent hover:text-accent hover:bg-accent/20 transition-colors flex items-center"
                        title="Run this search"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // In a real implementation, this would delete the search
                          alert(`This would delete the saved search "${search.name}" in a real implementation.`);
                        }}
                        className="bg-red-50 p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
                        title="Delete search"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(search.id);
                        }}
                        className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-background-primary transition-colors"
                      >
                        {expandedState[search.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {search.params.industry && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                        Industry: {search.params.industry}
                      </span>
                    )}
                    
                    {search.params.region && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                        Region: {search.params.region}
                      </span>
                    )}
                    
                    {search.params.services && search.params.services.length > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                        Services: {search.params.services.length}
                      </span>
                    )}
                    
                    {search.results && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Results: {search.results?.totalResults}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Expanded details */}
                {expandedState[search.id] && (
                  <div className="p-3 pt-0 border-t border-border mt-2">
                    <div className="text-sm text-primary mt-2">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="text-secondary">Industry:</span> {search.params.industry || 'All'}
                        </div>
                        <div>
                          <span className="text-secondary">Region:</span> {search.params.region || 'All'}
                        </div>
                        
                        <div>
                          <span className="text-secondary">Services Priority:</span> {Math.round(search.params.weights.servicesFit * 100)}%
                        </div>
                        <div>
                          <span className="text-secondary">Financial Health:</span> {Math.round(search.params.weights.financialHealth * 100)}%
                        </div>
                      </div>
                      
                      {search.params.services && search.params.services.length > 0 && (
                        <div className="mt-2">
                          <span className="text-secondary">Services:</span> {search.params.services.join(', ')}
                        </div>
                      )}
                      
                      {search.results && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-secondary">Results:</span>
                            <div className="flex space-x-3 text-xs">
                              <span className="text-accent">Tier 1: {search.results.tierCounts.tier1}</span>
                              <span className="text-accent">Tier 2: {search.results.tierCounts.tier2}</span>
                              <span className="text-accent">Tier 3: {search.results.tierCounts.tier3}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 flex justify-between">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // In a real implementation, this would toggle favorite status
                              alert(`This would ${search.isFavorite ? 'remove from' : 'add to'} favorites in a real implementation.`);
                            }}
                            className="flex items-center text-xs text-secondary hover:text-primary"
                          >
                            {search.isFavorite ? (
                              <>
                                <Heart className="h-3 w-3 mr-1 text-accent fill-current" />
                                Remove favorite
                              </>
                            ) : (
                              <>
                                <Heart className="h-3 w-3 mr-1" />
                                Add to favorites
                              </>
                            )}
                          </button>
                        </div>
                        
                        <button
                          className="text-xs text-accent hover:text-accent/80 flex items-center"
                          onClick={() => onLoadSearch(search.id)}
                        >
                          <Search className="h-3 w-3 mr-1" />
                          Run Search
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearches;