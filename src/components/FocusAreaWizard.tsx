import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building, 
  Globe, 
  Briefcase, 
  ActivitySquare,
  Save
} from 'lucide-react';
import IndustrySelector from './IndustrySelector';
import GeoSelector from './GeoSelector';
import CompanyWatchlistInput from './CompanyWatchlistInput';
import EventTypeSelector from './EventTypeSelector';

interface FocusAreaWizardProps {
  onComplete: () => void;
}

const FocusAreaWizard: React.FC<FocusAreaWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    industries: [] as string[],
    regions: [] as string[],
    countries: [] as string[],
    companies: [] as string[],
    eventTypes: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const updateFormData = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call to save preferences
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
      
      // Use custom event to change to the knowledge tab
      const tabChangeEvent = new CustomEvent('changeTab', {
        detail: { tab: 'knowledge' }
      });
      document.dispatchEvent(tabChangeEvent);
      
    }, 1500);
  };
  
  const stepIcons = [
    <Building className="h-6 w-6" />,
    <Globe className="h-6 w-6" />,
    <Briefcase className="h-6 w-6" />,
    <ActivitySquare className="h-6 w-6" />,
    <Save className="h-6 w-6" />
  ];
  
  const stepTitles = [
    "Select Industries",
    "Define Geography",
    "Add Company Watchlist",
    "Choose Event Types",
    "Review & Save"
  ];

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <h2 className="text-lg font-semibold">Define Your Focus Area</h2>
        <p className="text-gray-300 text-sm mt-1">
          Tailor your experience by selecting what matters to you
        </p>
      </div>
      
      {/* Stepper */}
      <div className="p-4 border-b border-border bg-background-primary">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  step === stepNumber 
                    ? 'bg-accent text-white' 
                    : step > stepNumber 
                    ? 'bg-green-500 text-white' 
                    : 'bg-background-secondary text-primary border border-border'
                }`}
              >
                {step > stepNumber ? (
                  <Check className="h-4 w-4" />
                ) : (
                  stepNumber
                )}
              </div>
              <span className="text-xs text-secondary hidden md:block">
                {stepTitles[stepNumber-1]}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Step Content */}
      <div className="p-6">
        {step === 1 && (
          <div>
            <div className="flex items-center mb-4">
              {stepIcons[0]}
              <h3 className="text-xl font-medium text-primary ml-2">{stepTitles[0]}</h3>
            </div>
            <p className="text-secondary mb-6">
              Select the industries you want to monitor for investment and acquisition opportunities.
            </p>
            <IndustrySelector 
              selectedIndustries={formData.industries}
              onChange={(industries) => updateFormData('industries', industries)}
            />
          </div>
        )}
        
        {step === 2 && (
          <div>
            <div className="flex items-center mb-4">
              {stepIcons[1]}
              <h3 className="text-xl font-medium text-primary ml-2">{stepTitles[1]}</h3>
            </div>
            <p className="text-secondary mb-6">
              Select regions or specific countries to focus your deal monitoring.
            </p>
            <GeoSelector 
              selectedRegions={formData.regions}
              selectedCountries={formData.countries}
              onRegionChange={(regions) => updateFormData('regions', regions)}
              onCountryChange={(countries) => updateFormData('countries', countries)}
            />
          </div>
        )}
        
        {step === 3 && (
          <div>
            <div className="flex items-center mb-4">
              {stepIcons[2]}
              <h3 className="text-xl font-medium text-primary ml-2">{stepTitles[2]}</h3>
            </div>
            <p className="text-secondary mb-6">
              Add specific companies to your watchlist for targeted monitoring.
            </p>
            <CompanyWatchlistInput
              selectedCompanies={formData.companies}
              onCompaniesChange={(companies) => updateFormData('companies', companies)}
            />
          </div>
        )}
        
        {step === 4 && (
          <div>
            <div className="flex items-center mb-4">
              {stepIcons[3]}
              <h3 className="text-xl font-medium text-primary ml-2">{stepTitles[3]}</h3>
            </div>
            <p className="text-secondary mb-6">
              Select the types of funding and M&A events you want to track.
            </p>
            <EventTypeSelector
              selectedEventTypes={formData.eventTypes}
              onChange={(eventTypes) => updateFormData('eventTypes', eventTypes)}
            />
          </div>
        )}
        
        {step === 5 && (
          <div>
            <div className="flex items-center mb-4">
              {stepIcons[4]}
              <h3 className="text-xl font-medium text-primary ml-2">{stepTitles[4]}</h3>
            </div>
            <p className="text-secondary mb-6">
              Review your selections and save your focus area preferences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background-primary p-4 rounded-lg border border-border">
                <h4 className="font-medium text-primary mb-2">Industries</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.industries.length > 0 ? (
                    formData.industries.map((industry, index) => (
                      <span key={index} className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent">
                        {industry}
                      </span>
                    ))
                  ) : (
                    <span className="text-secondary text-sm">No industries selected</span>
                  )}
                </div>
              </div>
              
              <div className="bg-background-primary p-4 rounded-lg border border-border">
                <h4 className="font-medium text-primary mb-2">Geography</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.regions.length > 0 ? (
                    formData.regions.map((region, index) => (
                      <span key={index} className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent">
                        {region}
                      </span>
                    ))
                  ) : (
                    <span className="text-secondary text-sm">No regions selected</span>
                  )}
                  
                  {formData.countries.length > 0 && (
                    formData.countries.map((country, index) => (
                      <span key={index} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {country}
                      </span>
                    ))
                  )}
                </div>
              </div>
              
              <div className="bg-background-primary p-4 rounded-lg border border-border">
                <h4 className="font-medium text-primary mb-2">Watchlist Companies</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.companies.length > 0 ? (
                    formData.companies.map((company, index) => (
                      <span key={index} className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent">
                        {company}
                      </span>
                    ))
                  ) : (
                    <span className="text-secondary text-sm">No companies in watchlist</span>
                  )}
                </div>
              </div>
              
              <div className="bg-background-primary p-4 rounded-lg border border-border">
                <h4 className="font-medium text-primary mb-2">Event Types</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.eventTypes.length > 0 ? (
                    formData.eventTypes.map((eventType, index) => (
                      <span key={index} className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent">
                        {eventType}
                      </span>
                    ))
                  ) : (
                    <span className="text-secondary text-sm">No event types selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="p-4 bg-background-primary border-t border-border flex justify-between">
        <button
          onClick={handlePrevStep}
          disabled={step === 1}
          className="px-4 py-2 flex items-center text-primary border border-border rounded-md hover:bg-background-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>
        
        {step < 5 ? (
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Saving...
              </>
            ) : (
              <>
                Save & Track
                <Check className="h-4 w-4 ml-2" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FocusAreaWizard;