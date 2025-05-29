import React, { useState } from 'react';
import { X, Plus, Search } from 'lucide-react';

interface IndustrySelectorProps {
  selectedIndustries: string[];
  onChange: (industries: string[]) => void;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({ 
  selectedIndustries, 
  onChange 
}) => {
  const [customIndustry, setCustomIndustry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample industries for selection
  const predefinedIndustries = [
    'AI/ML', 'Fintech', 'ClimateTech', 'Healthtech', 'Edtech',
    'Cybersecurity', 'Blockchain', 'Quantum Computing', 'IoT',
    'Robotics', 'AR/VR', 'Clean Energy', 'Space Tech', 'Mobility',
    'Logistics', 'Retail Tech', 'AgTech', 'Biotech', 'PropTech'
  ];
  
  // Filter industries based on search term
  const filteredIndustries = predefinedIndustries.filter(industry => 
    industry.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedIndustries.includes(industry)
  );
  
  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    const newSelection = selectedIndustries.includes(industry)
      ? selectedIndustries.filter(i => i !== industry)
      : [...selectedIndustries, industry];
    
    onChange(newSelection);
  };
  
  // Add custom industry
  const addCustomIndustry = () => {
    if (customIndustry.trim() && !selectedIndustries.includes(customIndustry.trim())) {
      onChange([...selectedIndustries, customIndustry.trim()]);
      setCustomIndustry('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Industries */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Selected Industries
        </label>
        {selectedIndustries.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedIndustries.map((industry, index) => (
              <div 
                key={index}
                className="px-3 py-1.5 bg-accent/10 text-accent rounded-full flex items-center"
              >
                <span className="text-sm">{industry}</span>
                <button 
                  onClick={() => toggleIndustry(industry)}
                  className="ml-2 text-accent hover:text-accent/70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary text-sm mb-4">No industries selected yet</p>
        )}
      </div>
      
      {/* Search Industries */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Find Industries
        </label>
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search industries..."
            className="w-full p-2.5 pl-9 border border-border rounded-md bg-background-primary text-primary"
          />
          <div className="absolute left-3 top-3">
            <Search className="h-4 w-4 text-secondary" />
          </div>
        </div>
      </div>
      
      {/* Industry Options */}
      <div className="max-h-40 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filteredIndustries.map((industry, index) => (
            <button
              key={index}
              onClick={() => toggleIndustry(industry)}
              className="p-2 text-sm text-primary border border-border rounded-md hover:bg-accent/5 text-left"
            >
              {industry}
            </button>
          ))}
        </div>
        
        {filteredIndustries.length === 0 && searchTerm && (
          <p className="text-secondary text-sm mt-2">
            No matching industries found
          </p>
        )}
      </div>
      
      {/* Custom Industry */}
      <div className="pt-4 border-t border-border mt-4">
        <label className="block text-sm font-medium text-primary mb-2">
          Add Custom Industry
        </label>
        <div className="flex">
          <input
            type="text"
            value={customIndustry}
            onChange={(e) => setCustomIndustry(e.target.value)}
            placeholder="Enter industry name"
            className="flex-grow p-2.5 border border-border rounded-l-md bg-background-primary text-primary"
          />
          <button
            onClick={addCustomIndustry}
            disabled={!customIndustry.trim()}
            className="px-4 py-2 bg-black text-white rounded-r-md hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustrySelector;