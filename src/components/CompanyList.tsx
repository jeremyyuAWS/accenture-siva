import React, { useState, useEffect } from 'react';
import { Company } from '../types';
import CompanyCard from './CompanyCard';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Search, 
  Filter, 
  X, 
  Check,
  Eye,
  Grid,
  Table
} from 'lucide-react';

interface CompanyListProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, onSelectCompany }) => {
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'revenue' | 'employees'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterTier, setFilterTier] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact' | 'table'>('grid');
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [servicesFilter, setServicesFilter] = useState<string[]>([]);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Get all unique services and regions for filters
  const allServices = React.useMemo(() => {
    const services = new Set<string>();
    companies.forEach(company => {
      company.services.forEach(service => services.add(service));
    });
    return Array.from(services);
  }, [companies]);
  
  const allRegions = React.useMemo(() => {
    const regions = new Set<string>();
    companies.forEach(company => {
      regions.add(company.region);
    });
    return Array.from(regions);
  }, [companies]);
  
  // Apply text search filter
  const textFilteredCompanies = searchText.trim() === '' 
    ? companies 
    : companies.filter(company => 
        company.name.toLowerCase().includes(searchText.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchText.toLowerCase()) ||
        company.description.toLowerCase().includes(searchText.toLowerCase()) ||
        company.services.some(s => s.toLowerCase().includes(searchText.toLowerCase()))
      );
  
  // Apply tier filter
  const tierFilteredCompanies = filterTier 
    ? textFilteredCompanies.filter(company => company.tier === filterTier)
    : textFilteredCompanies;
  
  // Apply services filter
  const servicesFilteredCompanies = servicesFilter.length > 0
    ? tierFilteredCompanies.filter(company => 
        servicesFilter.some(service => company.services.includes(service))
      )
    : tierFilteredCompanies;
  
  // Apply region filter
  const regionFilteredCompanies = regionFilter
    ? servicesFilteredCompanies.filter(company => company.region === regionFilter)
    : servicesFilteredCompanies;
  
  // Sort companies
  const sortedCompanies = [...regionFilteredCompanies].sort((a, b) => {
    if (sortBy === 'score') {
      const scoreA = a.score?.overall || 0;
      const scoreB = b.score?.overall || 0;
      return sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    } else if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'revenue') {
      return sortOrder === 'asc' ? a.revenue - b.revenue : b.revenue - a.revenue;
    } else if (sortBy === 'employees') {
      return sortOrder === 'asc' ? a.employees - b.employees : b.employees - a.employees;
    }
    return 0;
  });
  
  // Check if any filter is active
  useEffect(() => {
    setIsFiltering(
      searchText.trim() !== '' || 
      filterTier !== null || 
      servicesFilter.length > 0 || 
      regionFilter !== null
    );
  }, [searchText, filterTier, servicesFilter, regionFilter]);
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  // Handle sort change
  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      toggleSortOrder();
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };
  
  // Toggle service filter
  const toggleServiceFilter = (service: string) => {
    if (servicesFilter.includes(service)) {
      setServicesFilter(prev => prev.filter(s => s !== service));
    } else {
      setServicesFilter(prev => [...prev, service]);
    }
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchText('');
    setFilterTier(null);
    setServicesFilter([]);
    setRegionFilter(null);
  };

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-background-primary border-b border-border">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary">
            Target Companies {filterTier ? `(Tier ${filterTier})` : ''}
          </h2>
          <span className="text-sm text-secondary">{sortedCompanies.length} companies</span>
        </div>
      </div>
      
      {/* Search Box - New Feature */}
      <div className="p-4 bg-background-secondary border-b border-border">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search companies by name, industry, or services..."
              className="w-full p-2 pl-9 border border-border bg-background-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
            />
            <div className="absolute left-3 top-2.5 text-secondary">
              <Search className="h-5 w-5" />
            </div>
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-3 top-2.5 text-secondary hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center px-3 py-2 text-sm rounded-md ${
                  isFiltering
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'bg-background-primary text-primary border border-border hover:bg-background-primary'
                }`}
              >
                <Filter className="h-4 w-4 mr-1" />
                <span>Filters</span>
                {isFiltering && (
                  <span className="ml-1 bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {(filterTier ? 1 : 0) + (servicesFilter.length > 0 ? 1 : 0) + (regionFilter ? 1 : 0)}
                  </span>
                )}
              </button>
              
              {showDropdown && (
                <div className="absolute mt-1 right-0 w-64 bg-background-secondary rounded-md shadow-lg z-20 border border-border">
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-primary">Filter Companies</h3>
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-accent hover:text-blue-700"
                      >
                        Clear all
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-primary mb-1">
                        Company Tier
                      </label>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setFilterTier(null)}
                          className={`px-2 py-1 text-xs rounded ${
                            filterTier === null
                              ? 'bg-accent text-white'
                              : 'bg-background-primary text-primary hover:bg-background-primary'
                          }`}
                        >
                          All
                        </button>
                        
                        <button
                          onClick={() => setFilterTier(1)}
                          className={`px-2 py-1 text-xs rounded ${
                            filterTier === 1
                              ? 'bg-accent text-white'
                              : 'bg-background-primary text-primary hover:bg-background-primary'
                          }`}
                        >
                          Tier 1
                        </button>
                        
                        <button
                          onClick={() => setFilterTier(2)}
                          className={`px-2 py-1 text-xs rounded ${
                            filterTier === 2
                              ? 'bg-accent text-white'
                              : 'bg-background-primary text-primary hover:bg-background-primary'
                          }`}
                        >
                          Tier 2
                        </button>
                        
                        <button
                          onClick={() => setFilterTier(3)}
                          className={`px-2 py-1 text-xs rounded ${
                            filterTier === 3
                              ? 'bg-accent text-white'
                              : 'bg-background-primary text-primary hover:bg-background-primary'
                          }`}
                        >
                          Tier 3
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-primary mb-1">
                        Region
                      </label>
                      <select
                        value={regionFilter || ''}
                        onChange={(e) => setRegionFilter(e.target.value || null)}
                        className="w-full p-1.5 text-sm border border-border bg-background-primary text-primary rounded-md"
                      >
                        <option value="">All Regions</option>
                        {allRegions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-primary mb-1">
                        Services (top 5)
                      </label>
                      <div className="max-h-32 overflow-y-auto">
                        {allServices.slice(0, 5).map(service => (
                          <div key={service} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              id={`service-${service}`}
                              checked={servicesFilter.includes(service)}
                              onChange={() => toggleServiceFilter(service)}
                              className="h-3 w-3 text-accent rounded"
                            />
                            <label htmlFor={`service-${service}`} className="ml-2 text-xs text-primary">
                              {service}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sort Button */}
            <div className="relative">
              <button
                className="flex items-center px-3 py-2 text-sm bg-background-primary border border-border rounded-md text-primary hover:bg-background-primary"
              >
                <ArrowUpDown className="h-4 w-4 mr-1" />
                <span>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
              </button>
              
              <div className="absolute mt-1 right-0 w-48 bg-background-secondary rounded-md shadow-lg z-20 border border-border">
                <div className="py-1">
                  <button
                    onClick={() => handleSortChange('score')}
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      sortBy === 'score' ? 'bg-accent/10 text-accent' : 'text-primary hover:bg-background-primary'
                    }`}
                  >
                    Match Score {sortBy === 'score' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </button>
                  <button
                    onClick={() => handleSortChange('name')}
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      sortBy === 'name' ? 'bg-accent/10 text-accent' : 'text-primary hover:bg-background-primary'
                    }`}
                  >
                    Company Name {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </button>
                  <button
                    onClick={() => handleSortChange('revenue')}
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      sortBy === 'revenue' ? 'bg-accent/10 text-accent' : 'text-primary hover:bg-background-primary'
                    }`}
                  >
                    Revenue {sortBy === 'revenue' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </button>
                  <button
                    onClick={() => handleSortChange('employees')}
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      sortBy === 'employees' ? 'bg-accent/10 text-accent' : 'text-primary hover:bg-background-primary'
                    }`}
                  >
                    Employees {sortBy === 'employees' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </button>
                </div>
              </div>
            </div>
            
            {/* View Mode Selector - Enhanced */}
            <div className="flex rounded-md overflow-hidden border border-border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' 
                    ? 'bg-accent text-white' 
                    : 'bg-background-secondary text-secondary hover:bg-background-primary'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' 
                    ? 'bg-accent text-white' 
                    : 'bg-background-secondary text-secondary hover:bg-background-primary'
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 ${
                  viewMode === 'compact' 
                    ? 'bg-accent text-white' 
                    : 'bg-background-secondary text-secondary hover:bg-background-primary'
                }`}
                title="Compact view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${
                  viewMode === 'table' 
                    ? 'bg-accent text-white' 
                    : 'bg-background-secondary text-secondary hover:bg-background-primary'
                }`}
                title="Table view"
              >
                <Table className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Active Filters Display - New Feature */}
        {isFiltering && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-secondary">Active filters:</span>
            
            {filterTier && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/20 text-accent">
                Tier {filterTier}
                <button 
                  onClick={() => setFilterTier(null)}
                  className="ml-1 text-accent hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {regionFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {regionFilter}
                <button 
                  onClick={() => setRegionFilter(null)}
                  className="ml-1 text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {servicesFilter.map(service => (
              <span 
                key={service}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                {service}
                <button 
                  onClick={() => toggleServiceFilter(service)}
                  className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {searchText && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-background-primary text-primary">
                Search: "{searchText}"
                <button 
                  onClick={() => setSearchText('')}
                  className="ml-1 text-secondary hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            <button
              onClick={clearAllFilters}
              className="text-xs text-accent hover:text-blue-800 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {/* Company Cards */}
      <div className="p-4 bg-background-primary min-h-[400px]">
        {sortedCompanies.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-primary mb-1">No companies found</h3>
            <p className="text-secondary mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-3 px-4 py-2 bg-accent text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedCompanies.map((company) => (
                  <CompanyCard 
                    key={company.id} 
                    company={company} 
                    onClick={onSelectCompany} 
                  />
                ))}
              </div>
            )}
            
            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {sortedCompanies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => onSelectCompany(company)}
                    className="bg-background-secondary rounded-lg shadow-sm border border-border p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`} 
                            className="w-16 h-16 rounded object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                            <span className="text-accent text-xl font-bold">{company.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-primary">{company.name}</h3>
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                            Tier {company.tier}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-secondary mt-1">
                          <span>{company.industry}</span>
                          <span className="mx-2">•</span>
                          <span>{company.region}</span>
                          <span className="mx-2">•</span>
                          <span>{company.employees.toLocaleString()} employees</span>
                        </div>
                        
                        <p className="text-secondary text-sm mt-2 line-clamp-2">{company.description}</p>
                        
                        {company.score && (
                          <div className="mt-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-medium text-secondary">Match Score</span>
                              <span className="text-xs font-semibold text-accent">{Math.round(company.score.overall)}%</span>
                            </div>
                            <div className="w-full bg-background-primary rounded-full h-1.5">
                              <div 
                                className="bg-accent h-1.5 rounded-full" 
                                style={{ width: `${Math.round(company.score.overall)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Compact View */}
            {viewMode === 'compact' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sortedCompanies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => onSelectCompany(company)}
                    className="bg-background-secondary rounded-lg border border-border p-3 cursor-pointer hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 mr-2">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`} 
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                            <span className="text-accent text-sm font-bold">{company.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow overflow-hidden">
                        <h3 className="text-sm font-medium text-primary truncate">{company.name}</h3>
                        <p className="text-xs text-secondary truncate">{company.industry}</p>
                      </div>
                      
                      <div className="ml-2 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium bg-accent/10 text-accent">
                        {company.tier}
                      </div>
                    </div>
                    
                    {company.score && (
                      <div className="w-full bg-background-primary rounded-full h-1">
                        <div 
                          className="bg-accent h-1 rounded-full" 
                          style={{ width: `${Math.round(company.score.overall)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-background-secondary border border-border">
                  <thead className="bg-background-primary">
                    <tr>
                      <th className="py-2 px-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                        Company
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                        Region
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                        Tier
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                        Match
                      </th>
                      <th className="py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-background-primary">
                        <td className="py-2 px-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-6 w-6 mr-2">
                              {company.logo ? (
                                <img 
                                  src={company.logo} 
                                  alt={`${company.name} logo`} 
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-6 w-6 bg-accent/10 rounded-full flex items-center justify-center">
                                  <span className="text-accent text-xs font-bold">{company.name.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-medium text-primary truncate max-w-[150px]">
                              {company.name}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-sm text-secondary">
                          {company.industry}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-sm text-secondary">
                          {company.region}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-sm text-secondary">
                          ${(company.revenue / 1000000).toFixed(1)}M
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent/10 text-accent">
                            Tier {company.tier}
                          </span>
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-sm text-secondary">
                          {company.score ? (
                            <div className="flex items-center">
                              <div className="w-16 bg-background-primary rounded-full h-1.5 mr-2">
                                <div 
                                  className="bg-accent h-1.5 rounded-full" 
                                  style={{ width: `${Math.round(company.score.overall)}%` }}
                                ></div>
                              </div>
                              <span>{Math.round(company.score.overall)}%</span>
                            </div>
                          ) : '-'}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => onSelectCompany(company)}
                            className="text-accent hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Raw Data Toggle - For Developers */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowRawData(!showRawData)}
                className="text-xs text-secondary flex items-center"
              >
                {showRawData ? <Check className="h-3 w-3 mr-1" /> : null}
                {showRawData ? 'Hide raw data' : 'Show raw data'}
              </button>
            </div>
            
            {showRawData && (
              <div className="mt-2 p-3 bg-gray-800 rounded text-gray-300 text-xs font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(sortedCompanies[0], null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyList;