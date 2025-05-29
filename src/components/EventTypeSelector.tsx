import React from 'react';
import { Check } from 'lucide-react';

interface EventTypeSelectorProps {
  selectedEventTypes: string[];
  onChange: (eventTypes: string[]) => void;
}

const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
  selectedEventTypes,
  onChange
}) => {
  // Event types available for selection
  const eventTypes = [
    {
      id: 'seed',
      name: 'Seed Funding',
      description: 'Early-stage funding for concept validation and initial development'
    },
    {
      id: 'series_a',
      name: 'Series A',
      description: 'Funding for business model validation and early growth'
    },
    {
      id: 'series_b',
      name: 'Series B',
      description: 'Funding for market expansion and scaling operations'
    },
    {
      id: 'series_c_plus',
      name: 'Series C and Beyond',
      description: 'Later stage funding for significant expansion or pre-IPO'
    },
    {
      id: 'acquisition',
      name: 'Acquisitions',
      description: 'Company acquisitions and mergers'
    },
    {
      id: 'ipo',
      name: 'IPOs',
      description: 'Initial Public Offerings'
    },
    {
      id: 'spac',
      name: 'SPACs',
      description: 'Special Purpose Acquisition Companies'
    },
    {
      id: 'pe_buyout',
      name: 'PE Buyouts',
      description: 'Private Equity buyout transactions'
    }
  ];
  
  // Toggle event type selection
  const toggleEventType = (eventId: string) => {
    const newSelection = selectedEventTypes.includes(eventId)
      ? selectedEventTypes.filter(id => id !== eventId)
      : [...selectedEventTypes, eventId];
    
    onChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <p className="text-secondary mb-2">
        Select the types of funding and M&A events you want to track. This will help personalize your dashboard and reports.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {eventTypes.map((eventType) => (
          <div 
            key={eventType.id}
            onClick={() => toggleEventType(eventType.id)}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedEventTypes.includes(eventType.id)
                ? 'bg-accent/10 border-accent/20'
                : 'bg-background-primary border-border hover:bg-accent/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className={`font-medium ${
                selectedEventTypes.includes(eventType.id) 
                  ? 'text-accent' 
                  : 'text-primary'
              }`}>
                {eventType.name}
              </h4>
              <div className={`w-5 h-5 flex items-center justify-center rounded border ${
                selectedEventTypes.includes(eventType.id)
                  ? 'bg-accent border-accent text-white'
                  : 'border-border'
              }`}>
                {selectedEventTypes.includes(eventType.id) && <Check className="h-3.5 w-3.5" />}
              </div>
            </div>
            <p className="text-secondary text-sm">
              {eventType.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <div className="text-sm text-secondary">
          Selected: {selectedEventTypes.length} of {eventTypes.length}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onChange([])}
            className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-background-primary"
          >
            Clear All
          </button>
          <button
            onClick={() => onChange(eventTypes.map(e => e.id))}
            className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-background-primary"
          >
            Select All
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventTypeSelector;