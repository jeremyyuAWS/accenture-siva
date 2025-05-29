import React, { useState } from 'react';
import { SearchParams } from '../types';
import { 
  Search, 
  Filter, 
  Building2, 
  Globe, 
  Briefcase, 
  Package, 
  Users, 
  Calendar, 
  TrendingUp, 
  Save, 
  RefreshCw,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SearchWeightSliders from './SearchWeightSliders';

interface SearchPanelProps {
  searchParams: SearchParams;
  onUpdateSearchParams: (params: Partial<SearchParams>) => void;
  onSearch: () => void;
  onSaveSearch: (name: string) => void;
  totalResults: number;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  searchParams,
  onUpdateSearchParams,
  onSearch,
  onSaveSearch,
  totalResults,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWeights, setShowWeights] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { industries, regions, services, offerings } = useAppContext();
  
  // Handle search button click
  const handleSearch = () => {
    setIsSearching(true);
    onSearch();
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };
  
  // Handle saving search
  const handleSaveSearch = () => {
    if (searchName.trim()) {
      onSaveSearch(searchName);
      setSearchName('');
      setSaveDialogOpen(false);
    }
  };
  
  // Handle changes to search parameters
  const handleParamChange = (key: keyof SearchParams, value: any) => {
    onUpdateSearchParams({ [key]: value });
  };
  
  // Toggle selection in an array
  const toggleArraySelection = (key: keyof SearchParams, value: string) => {
    const currentArray = searchParams[key] as string[] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    onUpdateSearchParams({ [key]: newArray });
  };
  
  // Reset search parameters
  const resetSearch = () => {
    onUpdateSearchParams({
      industry: undefined,
      region: undefined,
      services: [],
      offerings: [],
      minRevenue: undefined,
      maxRevenue: undefined,
      minEmployees: undefined,
      maxEmployees: undefined,
      foundedAfter: undefined,
      foundedBefore: undefined,
      minGrowthRate: undefined,
      maxGrowthRate: undefined,
    });
  };

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <Search className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">M&A Target Search</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Find potential acquisition targets based on strategic fit
        </p>
      </div>
      
      <div className="p-4">
        {/* Essential Filters - Always Visible */}
        <div className="space-y-4 mb-5">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-primary mb-1">
              Industry
            </label>
            <div className="relative">
              <select
                id="industry"
                value={searchParams.industry || ''}
                onChange={(e) => handleParamChange('industry', e.target.value || undefined)}
                className="w-full p-2.5 pr-8 border border-border bg-background-primary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-secondary">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-primary mb-1">
              Region
            </label>
            <div className="relative">
              <select
                id="region"
                value={searchParams.region || ''}
                onChange={(e) => handleParamChange('region', e.target.value || undefined)}
                className="w-full p-2.5 pr-8 border border-border bg-background-primary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-secondary">
                <Globe className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 mb-4">
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center disabled:bg-gray-400"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Targets
              </>
            )}
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 py-2 border border-border text-primary rounded-md hover:bg-background-primary transition-colors flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              {isExpanded ? 'Less Filters' : 'More Filters'}
            </button>
            
            <button
              onClick={() => setShowWeights(!showWeights)}
              className="flex-1 py-2 border border-border text-primary rounded-md hover:bg-background-primary transition-colors flex items-center justify-center"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1.5" />
              {showWeights ? 'Hide Weights' : 'Set Weights'}
            </button>
          </div>
          
          {totalResults > 0 && (
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-secondary">Found </span>
                <span className="font-medium text-primary">{totalResults} companies</span>
              </div>
              
              <button
                onClick={() => setSaveDialogOpen(true)}
                className="text-accent hover:text-accent/80 transition-colors flex items-center text-sm"
              >
                <Save className="h-4 w-4 mr-1" />
                Save Search
              </button>
            </div>
          )}
        </div>
        
        {/* Weight Sliders - Shown when weight button is clicked */}
        {showWeights && (
          <div className="p-4 my-4 bg-background-primary rounded-lg border border-border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-primary">Strategic Match Weights</h3>
              <button 
                onClick={() => setShowWeights(false)}
                className="text-secondary hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SearchWeightSliders
              weights={searchParams.weights}
              onChange={(weights) => onUpdateSearchParams({ weights })}
            />
          </div>
        )}
        
        {/* Advanced Search Filters - Expanded on demand */}
        {isExpanded && (
          <div className="mt-5 p-4 bg-background-primary rounded-lg border border-border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-primary">Advanced Filters</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-secondary hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-medium text-primary mb-2 flex items-center">
                  <Briefcase className="h-4 w-4 mr-1.5" />
                  Services & Capabilities
                </h3>
                
                <div className="space-y-2">
                  <label className="block text-xs text-secondary">Select target services:</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2.5 bg-background-secondary border border-border rounded-md">
                    {services.map((service) => (
                      <button
                        key={service}
                        onClick={() => toggleArraySelection('services', service)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          searchParams.services?.includes(service)
                            ? 'bg-accent text-white'
                            : 'bg-background-primary text-primary hover:bg-accent/10'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-primary mb-2 flex items-center">
                  <Package className="h-4 w-4 mr-1.5" />
                  Delivery Models
                </h3>
                
                <div className="space-y-2">
                  <label className="block text-xs text-secondary">Select delivery models:</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2.5 bg-background-secondary border border-border rounded-md">
                    {offerings.map((offering) => (
                      <button
                        key={offering}
                        onClick={() => toggleArraySelection('offerings', offering)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          searchParams.offerings?.includes(offering)
                            ? 'bg-accent text-white'
                            : 'bg-background-primary text-primary hover:bg-accent/10'
                        }`}
                      >
                        {offering}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-primary mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1.5" />
                    Company Size
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="minEmployees" className="block text-xs text-secondary mb-1">
                        Min Employees
                      </label>
                      <input
                        id="minEmployees"
                        type="number"
                        placeholder="0"
                        value={searchParams.minEmployees || ''}
                        onChange={(e) => handleParamChange('minEmployees', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full p-2 border border-border bg-background-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="maxEmployees" className="block text-xs text-secondary mb-1">
                        Max Employees
                      </label>
                      <input
                        id="maxEmployees"
                        type="number"
                        placeholder="No limit"
                        value={searchParams.maxEmployees || ''}
                        onChange={(e) => handleParamChange('maxEmployees', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full p-2 border border-border bg-background-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-primary mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Founded Year
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="foundedAfter" className="block text-xs text-secondary mb-1">
                        Founded After
                      </label>
                      <input
                        id="foundedAfter"
                        type="number"
                        placeholder="Any year"
                        value={searchParams.foundedAfter || ''}
                        onChange={(e) => handleParamChange('foundedAfter', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full p-2 border border-border bg-background-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="foundedBefore" className="block text-xs text-secondary mb-1">
                        Founded Before
                      </label>
                      <input
                        id="foundedBefore"
                        type="number"
                        placeholder="Any year"
                        value={searchParams.foundedBefore || ''}
                        onChange={(e) => handleParamChange('foundedBefore', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full p-2 border border-border bg-background-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-primary mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1.5" />
                    Growth Rate
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="minGrowthRate" className="block text-xs text-secondary mb-1">
                        Min Growth (%)
                      </label>
                      <input
                        id="minGrowthRate"
                        type="number"
                        placeholder="0"
                        value={searchParams.minGrowthRate || ''}
                        onChange={(e) => handleParamChange('minGrowthRate', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full p-2 border border-border bg-background-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="maxGrowthRate" className="block text-xs text-secondary mb-1">
                        Max Growth (%)
                      </label>
                      <input
                        id="maxGrowthRate"
                        type="number"
                        placeholder="No limit"
                        value={searchParams.maxGrowthRate || ''}
                        onChange={(e) => handleParamChange('maxGrowthRate', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full p-2 border border-border bg-background-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-primary mb-2">Revenue Range ($M)</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="minRevenue" className="block text-xs text-secondary mb-1">
                        Min Revenue
                      </label>
                      <input
                        id="minRevenue"
                        type="number"
                        placeholder="0"
                        value={searchParams.minRevenue ? searchParams.minRevenue / 1000000 : ''}
                        onChange={(e) => handleParamChange('minRevenue', e.target.value ? parseInt(e.target.value) * 1000000 : undefined)}
                        className="w-full p-2 border border-border bg-background-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="maxRevenue" className="block text-xs text-secondary mb-1">
                        Max Revenue
                      </label>
                      <input
                        id="maxRevenue"
                        type="number"
                        placeholder="No limit"
                        value={searchParams.maxRevenue ? searchParams.maxRevenue / 1000000 : ''}
                        onChange={(e) => handleParamChange('maxRevenue', e.target.value ? parseInt(e.target.value) * 1000000 : undefined)}
                        className="w-full p-2 border border-border bg-background-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetSearch}
                  className="text-sm text-secondary hover:text-primary transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Save Search Dialog */}
        {saveDialogOpen && (
          <div className="mt-4 p-4 bg-background-primary border border-border rounded-lg">
            <h3 className="text-sm font-medium text-primary mb-3">Save Current Search</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter a name for this search"
                className="flex-grow p-2 border border-border bg-background-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-primary"
              />
              
              <button
                onClick={handleSaveSearch}
                disabled={!searchName.trim()}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              
              <button
                onClick={() => setSaveDialogOpen(false)}
                className="px-4 py-2 border border-border text-primary rounded-md hover:bg-background-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;