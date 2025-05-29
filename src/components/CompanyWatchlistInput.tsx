import React, { useState } from 'react';
import { Search, Plus, X, Building2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface CompanyWatchlistInputProps {
  selectedCompanies: string[];
  onCompaniesChange: (companies: string[]) => void;
}

const CompanyWatchlistInput: React.FC<CompanyWatchlistInputProps> = ({
  selectedCompanies,
  onCompaniesChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { companies } = useAppContext();
  
  // Get suggestions based on companies in the app context
  const getCompanySuggestions = () => {
    if (!searchTerm.trim()) return [];
    
    return companies
      .filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedCompanies.includes(company.name)
      )
      .slice(0, 5)
      .map(company => company.name);
  };
  
  const suggestions = getCompanySuggestions();
  
  // Add a company to the watchlist
  const addCompany = (company: string) => {
    if (!selectedCompanies.includes(company)) {
      onCompaniesChange([...selectedCompanies, company]);
    }
    setSearchTerm('');
  };
  
  // Remove a company from the watchlist
  const removeCompany = (company: string) => {
    onCompaniesChange(selectedCompanies.filter(c => c !== company));
  };

  return (
    <div className="space-y-4">
      {/* Selected Companies */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Companies in Your Watchlist
        </label>
        
        {selectedCompanies.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCompanies.map((company, index) => (
              <div 
                key={index}
                className="px-3 py-1.5 bg-accent/10 text-accent rounded-full flex items-center"
              >
                <Building2 className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm">{company}</span>
                <button 
                  onClick={() => removeCompany(company)}
                  className="ml-2 text-accent hover:text-accent/70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary text-sm mb-4">
            No companies added to your watchlist yet
          </p>
        )}
      </div>
      
      {/* Search for Companies */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Add Companies
        </label>
        
        <div className="relative mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for companies..."
            className="w-full p-2.5 pl-9 border border-border rounded-md bg-background-primary text-primary"
          />
          <div className="absolute left-3 top-3">
            <Search className="h-4 w-4 text-secondary" />
          </div>
          {searchTerm && (
            <button
              onClick={() => addCompany(searchTerm)}
              className="absolute right-3 top-2.5 text-accent hover:text-accent/70"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-1 bg-background-primary border border-border rounded-md overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addCompany(suggestion)}
                className="w-full p-2.5 text-left text-primary hover:bg-accent/5 flex items-center border-b border-border last:border-b-0"
              >
                <Building2 className="h-4 w-4 text-secondary mr-2" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Suggested Companies */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-primary mb-3">Suggested Companies</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {companies.slice(0, 6).map((company, index) => (
            <button
              key={index}
              onClick={() => addCompany(company.name)}
              disabled={selectedCompanies.includes(company.name)}
              className={`p-2 text-sm border rounded-md text-left flex items-center ${
                selectedCompanies.includes(company.name)
                  ? 'bg-accent/5 border-accent/20 text-accent/70 cursor-not-allowed'
                  : 'border-border text-primary hover:bg-accent/5'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 mr-1.5" />
              {company.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyWatchlistInput;