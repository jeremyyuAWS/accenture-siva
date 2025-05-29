import React, { useState } from 'react';
import { Filter, Calendar, DollarSign, Activity, Building2, Globe, ArrowRight, X } from 'lucide-react';

interface GraphFilterPanelProps {
  onApplyFilters: (filters: {
    timeframe?: { start?: Date; end?: Date };
    dealSize?: { min?: number; max?: number };
    eventTypes?: string[];
    industries?: string[];
    regions?: string[];
  }) => void;
  defaultFilters?: {
    timeframe?: { start?: Date; end?: Date };
    dealSize?: { min?: number; max?: number };
    eventTypes?: string[];
    industries?: string[];
    regions?: string[];
  };
}

const GraphFilterPanel: React.FC<GraphFilterPanelProps> = ({ onApplyFilters, defaultFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeStart, setTimeStart] = useState<string>(
    defaultFilters.timeframe?.start 
      ? defaultFilters.timeframe.start.toISOString().split('T')[0]
      : ''
  );
  const [timeEnd, setTimeEnd] = useState<string>(
    defaultFilters.timeframe?.end 
      ? defaultFilters.timeframe.end.toISOString().split('T')[0]
      : ''
  );
  const [minDealSize, setMinDealSize] = useState<number | undefined>(
    defaultFilters.dealSize?.min
  );
  const [maxDealSize, setMaxDealSize] = useState<number | undefined>(
    defaultFilters.dealSize?.max
  );
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(
    defaultFilters.eventTypes || []
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    defaultFilters.industries || []
  );
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    defaultFilters.regions || []
  );
  
  const eventTypes = [
    { id: 'seed', label: 'Seed' },
    { id: 'series_a', label: 'Series A' },
    { id: 'series_b', label: 'Series B' },
    { id: 'series_c_plus', label: 'Series C+' },
    { id: 'acquisition', label: 'Acquisitions' },
    { id: 'ipo', label: 'IPO' }
  ];
  
  const industries = [
    { id: 'AI/ML', label: 'AI/ML' },
    { id: 'Fintech', label: 'Fintech' },
    { id: 'ClimateTech', label: 'ClimateTech' },
    { id: 'Cybersecurity', label: 'Cybersecurity' },
    { id: 'Healthtech', label: 'Healthtech' },
    { id: 'Mobility', label: 'Mobility' }
  ];
  
  const regions = [
    { id: 'North America', label: 'North America' },
    { id: 'Europe', label: 'Europe' },
    { id: 'Asia Pacific', label: 'Asia Pacific' },
    { id: 'Latin America', label: 'Latin America' },
    { id: 'Middle East & Africa', label: 'Middle East & Africa' }
  ];
  
  const toggleEventType = (eventType: string) => {
    setSelectedEventTypes(prev => 
      prev.includes(eventType) 
        ? prev.filter(t => t !== eventType)
        : [...prev, eventType]
    );
  };
  
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };
  
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };
  
  const applyFilters = () => {
    onApplyFilters({
      timeframe: (timeStart || timeEnd) ? {
        start: timeStart ? new Date(timeStart) : undefined,
        end: timeEnd ? new Date(timeEnd) : undefined
      } : undefined,
      dealSize: (minDealSize !== undefined || maxDealSize !== undefined) ? {
        min: minDealSize,
        max: maxDealSize
      } : undefined,
      eventTypes: selectedEventTypes.length > 0 ? selectedEventTypes : undefined,
      industries: selectedIndustries.length > 0 ? selectedIndustries : undefined,
      regions: selectedRegions.length > 0 ? selectedRegions : undefined
    });
  };
  
  const resetFilters = () => {
    setTimeStart('');
    setTimeEnd('');
    setMinDealSize(undefined);
    setMaxDealSize(undefined);
    setSelectedEventTypes([]);
    setSelectedIndustries([]);
    setSelectedRegions([]);
    
    onApplyFilters({});
  };
  
  const hasActiveFilters = 
    timeStart || 
    timeEnd || 
    minDealSize !== undefined || 
    maxDealSize !== undefined || 
    selectedEventTypes.length > 0 || 
    selectedIndustries.length > 0 || 
    selectedRegions.length > 0;
  
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background-secondary">
      <div 
        className="p-3 bg-background-primary flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-1.5 text-secondary" />
          <h3 className="font-medium text-primary">Graph Filters</h3>
          {hasActiveFilters && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-accent text-white rounded-full">
              {[
                selectedEventTypes.length > 0 ? 1 : 0,
                selectedIndustries.length > 0 ? 1 : 0,
                selectedRegions.length > 0 ? 1 : 0,
                (timeStart || timeEnd) ? 1 : 0,
                (minDealSize !== undefined || maxDealSize !== undefined) ? 1 : 0
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </div>
        <div>
          {isExpanded ? (
            <X className="h-4 w-4 text-secondary" />
          ) : (
            <ArrowRight className="h-4 w-4 text-secondary" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Timeframe Filter */}
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-1.5 text-secondary" />
                <h4 className="text-sm font-medium text-primary">Timeframe</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="time-start" className="block text-xs text-secondary mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="time-start"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="w-full p-2 text-sm border border-border rounded-md bg-background-primary text-primary"
                  />
                </div>
                <div>
                  <label htmlFor="time-end" className="block text-xs text-secondary mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="time-end"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full p-2 text-sm border border-border rounded-md bg-background-primary text-primary"
                  />
                </div>
              </div>
            </div>
            
            {/* Deal Size Filter */}
            <div>
              <div className="flex items-center mb-2">
                <DollarSign className="h-4 w-4 mr-1.5 text-secondary" />
                <h4 className="text-sm font-medium text-primary">Deal Size</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="min-deal-size" className="block text-xs text-secondary mb-1">
                    Min Amount ($M)
                  </label>
                  <input
                    type="number"
                    id="min-deal-size"
                    value={minDealSize !== undefined ? minDealSize / 1000000 : ''}
                    onChange={(e) => setMinDealSize(e.target.value ? Number(e.target.value) * 1000000 : undefined)}
                    placeholder="0"
                    className="w-full p-2 text-sm border border-border rounded-md bg-background-primary text-primary"
                  />
                </div>
                <div>
                  <label htmlFor="max-deal-size" className="block text-xs text-secondary mb-1">
                    Max Amount ($M)
                  </label>
                  <input
                    type="number"
                    id="max-deal-size"
                    value={maxDealSize !== undefined ? maxDealSize / 1000000 : ''}
                    onChange={(e) => setMaxDealSize(e.target.value ? Number(e.target.value) * 1000000 : undefined)}
                    placeholder="Unlimited"
                    className="w-full p-2 text-sm border border-border rounded-md bg-background-primary text-primary"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Event Types Filter */}
            <div>
              <div className="flex items-center mb-2">
                <Activity className="h-4 w-4 mr-1.5 text-secondary" />
                <h4 className="text-sm font-medium text-primary">Event Types</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map(event => (
                  <button
                    key={event.id}
                    onClick={() => toggleEventType(event.id)}
                    className={`px-2.5 py-1 text-xs rounded-md ${
                      selectedEventTypes.includes(event.id)
                        ? 'bg-accent text-white'
                        : 'bg-background-primary text-primary border border-border hover:bg-accent/5'
                    }`}
                  >
                    {event.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Industries Filter */}
            <div>
              <div className="flex items-center mb-2">
                <Building2 className="h-4 w-4 mr-1.5 text-secondary" />
                <h4 className="text-sm font-medium text-primary">Industries</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {industries.map(industry => (
                  <button
                    key={industry.id}
                    onClick={() => toggleIndustry(industry.id)}
                    className={`px-2.5 py-1 text-xs rounded-md ${
                      selectedIndustries.includes(industry.id)
                        ? 'bg-accent text-white'
                        : 'bg-background-primary text-primary border border-border hover:bg-accent/5'
                    }`}
                  >
                    {industry.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Regions Filter */}
            <div>
              <div className="flex items-center mb-2">
                <Globe className="h-4 w-4 mr-1.5 text-secondary" />
                <h4 className="text-sm font-medium text-primary">Regions</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {regions.map(region => (
                  <button
                    key={region.id}
                    onClick={() => toggleRegion(region.id)}
                    className={`px-2.5 py-1 text-xs rounded-md ${
                      selectedRegions.includes(region.id)
                        ? 'bg-accent text-white'
                        : 'bg-background-primary text-primary border border-border hover:bg-accent/5'
                    }`}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border flex justify-between">
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-background-primary transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={applyFilters}
              className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphFilterPanel;