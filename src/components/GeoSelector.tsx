import React, { useState } from 'react';
import { X, Search, Globe, MapPin } from 'lucide-react';

interface GeoSelectorProps {
  selectedRegions: string[];
  selectedCountries: string[];
  onRegionChange: (regions: string[]) => void;
  onCountryChange: (countries: string[]) => void;
}

const GeoSelector: React.FC<GeoSelectorProps> = ({
  selectedRegions,
  selectedCountries,
  onRegionChange,
  onCountryChange
}) => {
  const [countrySearch, setCountrySearch] = useState('');
  
  // Sample regions and countries
  const regions = [
    'North America', 
    'Europe', 
    'Asia Pacific', 
    'Latin America', 
    'Middle East & Africa'
  ];
  
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
    'China', 'Japan', 'Singapore', 'Australia', 'Brazil',
    'Mexico', 'Israel', 'UAE', 'India', 'South Korea',
    'Sweden', 'Netherlands', 'Spain', 'Switzerland', 'Italy'
  ];
  
  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(countrySearch.toLowerCase()) &&
    !selectedCountries.includes(country)
  );
  
  // Toggle region selection
  const toggleRegion = (region: string) => {
    const newSelection = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region];
    
    onRegionChange(newSelection);
  };
  
  // Toggle country selection
  const toggleCountry = (country: string) => {
    const newSelection = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    
    onCountryChange(newSelection);
  };

  return (
    <div className="space-y-6">
      {/* Regions */}
      <div>
        <div className="flex items-center mb-3">
          <Globe className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium text-primary">Regions</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedRegions.map((region, index) => (
            <div 
              key={index}
              className="px-3 py-1.5 bg-accent/10 text-accent rounded-full flex items-center"
            >
              <span className="text-sm">{region}</span>
              <button 
                onClick={() => toggleRegion(region)}
                className="ml-2 text-accent hover:text-accent/70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {selectedRegions.length === 0 && (
            <p className="text-secondary text-sm">No regions selected</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {regions.map((region, index) => (
            <button
              key={index}
              onClick={() => toggleRegion(region)}
              className={`p-2 text-sm border rounded-md text-left ${
                selectedRegions.includes(region)
                  ? 'bg-accent text-white border-accent'
                  : 'text-primary border-border hover:bg-accent/5'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
      
      {/* Countries */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center mb-3">
          <MapPin className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium text-primary">Countries (Optional)</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCountries.map((country, index) => (
            <div 
              key={index}
              className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full flex items-center"
            >
              <span className="text-sm">{country}</span>
              <button 
                onClick={() => toggleCountry(country)}
                className="ml-2 text-green-800 hover:text-green-700 dark:text-green-200 dark:hover:text-green-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {selectedCountries.length === 0 && (
            <p className="text-secondary text-sm">No specific countries selected</p>
          )}
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            placeholder="Search countries..."
            className="w-full p-2.5 pl-9 border border-border rounded-md bg-background-primary text-primary"
          />
          <div className="absolute left-3 top-3">
            <Search className="h-4 w-4 text-secondary" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
          {filteredCountries.map((country, index) => (
            <button
              key={index}
              onClick={() => toggleCountry(country)}
              className="p-2 text-sm text-primary border border-border rounded-md hover:bg-accent/5 text-left"
            >
              {country}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeoSelector;