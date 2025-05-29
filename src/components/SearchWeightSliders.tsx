import React from 'react';
import { SearchWeights } from '../types';

interface SearchWeightSlidersProps {
  weights: SearchWeights;
  onChange: (weights: SearchWeights) => void;
}

const SearchWeightSliders: React.FC<SearchWeightSlidersProps> = ({ weights, onChange }) => {
  // Handle individual slider changes
  const handleWeightChange = (key: keyof SearchWeights, value: number) => {
    // Create a copy of weights
    const newWeights = { ...weights };
    
    // Assign the new value to the specific key
    newWeights[key] = value;
    
    // Normalize weights so they sum to 1
    const sum = Object.values(newWeights).reduce((acc, val) => acc + val, 0);
    
    // If not a valid sum, normalize
    if (sum !== 1) {
      // Normalize each weight
      Object.keys(newWeights).forEach((weightKey) => {
        newWeights[weightKey as keyof SearchWeights] = 
          newWeights[weightKey as keyof SearchWeights] / sum;
      });
    }
    
    // Call the onChange handler with the normalized weights
    onChange(newWeights);
  };

  // Format a weight as a percentage
  const formatWeight = (weight: number): string => {
    return `${Math.round(weight * 100)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Weight Distribution</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Services/Offerings Fit</label>
            <span className="text-sm font-medium text-gray-600">{formatWeight(weights.servicesFit)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.7"
            step="0.05"
            value={weights.servicesFit}
            onChange={(e) => handleWeightChange('servicesFit', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Industry Fit</label>
            <span className="text-sm font-medium text-gray-600">{formatWeight(weights.industryFit)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.7"
            step="0.05"
            value={weights.industryFit}
            onChange={(e) => handleWeightChange('industryFit', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Geography Fit</label>
            <span className="text-sm font-medium text-gray-600">{formatWeight(weights.geographyFit)}</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={weights.geographyFit}
            onChange={(e) => handleWeightChange('geographyFit', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Financial Health</label>
            <span className="text-sm font-medium text-gray-600">{formatWeight(weights.financialHealth)}</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={weights.financialHealth}
            onChange={(e) => handleWeightChange('financialHealth', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
          />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <div>
            <span className="text-xs text-gray-500">Note: Weights automatically balance to total 100%</span>
          </div>
          <button 
            onClick={() => onChange({
              servicesFit: 0.5,
              industryFit: 0.3,
              geographyFit: 0.1,
              financialHealth: 0.1
            })}
            className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchWeightSliders;