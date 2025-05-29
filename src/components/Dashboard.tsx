import React, { useState } from 'react';
import { Download, FileText, BarChart3, Share2 } from 'lucide-react';
import { Company, SearchResult, SearchParams, User } from '../types';

interface DashboardProps {
  currentUser: User | null;
  searchResults: SearchResult | null;
  searchParams: SearchParams;
  onGenerateReport: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  searchResults,
  searchParams,
  onGenerateReport
}) => {
  // If no search results yet, show empty state
  if (!searchResults) {
    return (
      <div className="bg-background-secondary p-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">No Search Results Yet</h3>
          <p className="text-secondary max-w-md">
            Use the search panel to find potential M&A targets based on your criteria.
          </p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get tier distribution data for chart
  const tierData = [
    searchResults.tierCounts.tier1,
    searchResults.tierCounts.tier2,
    searchResults.tierCounts.tier3
  ];
  
  // Calculate total to get percentages
  const totalCompanies = tierData.reduce((sum, count) => sum + count, 0);
  
  // Calculate tier percentages
  const tierPercentages = tierData.map(count => 
    totalCompanies > 0 ? ((count / totalCompanies) * 100).toFixed(0) + '%' : '0%'
  );

  return (
    <div className="p-4">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-background-primary rounded-lg p-4 border border-border">
          <h3 className="text-sm font-medium text-primary mb-1">Total Targets</h3>
          <p className="text-3xl font-bold text-primary">{searchResults.totalResults}</p>
          <p className="text-xs text-secondary mt-1">
            Based on your current search criteria
          </p>
        </div>
        
        <div className="bg-background-primary rounded-lg p-4 border border-border">
          <h3 className="text-sm font-medium text-primary mb-1">Tier 1 Companies</h3>
          <p className="text-3xl font-bold text-primary">{searchResults.tierCounts.tier1}</p>
          <p className="text-xs text-secondary mt-1">
            High-priority acquisition targets
          </p>
        </div>
        
        <div className="bg-background-primary rounded-lg p-4 border border-border">
          <h3 className="text-sm font-medium text-primary mb-1">Service Match Priority</h3>
          <p className="text-3xl font-bold text-primary">{Math.round(searchParams.weights.servicesFit * 100)}%</p>
          <p className="text-xs text-secondary mt-1">
            Current weighting for service alignment
          </p>
        </div>
      </div>
      
      {/* Tier Distribution */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-primary mb-3">Target Distribution by Tier</h3>
        <div className="bg-background-primary p-4 rounded-lg border border-border">
          <div className="flex h-6 mb-2 rounded-lg overflow-hidden">
            {searchResults.tierCounts.tier1 > 0 && (
              <div 
                className="bg-gray-800 h-full" 
                style={{ width: `${(searchResults.tierCounts.tier1 / totalCompanies) * 100}%` }}
              ></div>
            )}
            {searchResults.tierCounts.tier2 > 0 && (
              <div 
                className="bg-gray-500 h-full" 
                style={{ width: `${(searchResults.tierCounts.tier2 / totalCompanies) * 100}%` }}
              ></div>
            )}
            {searchResults.tierCounts.tier3 > 0 && (
              <div 
                className="bg-gray-300 h-full" 
                style={{ width: `${(searchResults.tierCounts.tier3 / totalCompanies) * 100}%` }}
              ></div>
            )}
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-gray-800 mr-1"></span>
              <span className="text-primary">Tier 1: {searchResults.tierCounts.tier1} ({tierPercentages[0]})</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-gray-500 mr-1"></span>
              <span className="text-primary">Tier 2: {searchResults.tierCounts.tier2} ({tierPercentages[1]})</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-gray-300 mr-1"></span>
              <span className="text-primary">Tier 3: {searchResults.tierCounts.tier3} ({tierPercentages[2]})</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onGenerateReport}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate PowerPoint Report
        </button>
        
        <button
          className="px-4 py-2 bg-background-primary border border-border text-primary rounded-md hover:bg-background-primary transition-colors flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Results (.csv)
        </button>
        
        <button
          className="px-4 py-2 bg-background-primary border border-border text-primary rounded-md hover:bg-background-primary transition-colors flex items-center"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Results
        </button>
      </div>
      
      {/* Footer */}
      <div className="text-xs text-secondary mt-4 pt-4 border-t border-border">
        <div className="flex justify-between">
          <span>Last updated: {formatDate(new Date())}</span>
          {currentUser && (
            <span>User: {currentUser.name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;