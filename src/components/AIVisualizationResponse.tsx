import React from 'react';
import ChartComponent from './visualizations/ChartComponent';
import ComparisonChart from './visualizations/ComparisonChart';
import TrendChart from './visualizations/TrendChart';
import RadarChart from './visualizations/RadarChart';
import GaugeChart from './visualizations/GaugeChart';
import { useAppContext } from '../context/AppContext';

interface AIVisualizationResponseProps {
  query: string;
}

const AIVisualizationResponse: React.FC<AIVisualizationResponseProps> = ({ query }) => {
  const { filteredCompanies } = useAppContext();
  
  // Helper function to determine which visualization to show based on the query
  const getVisualizationType = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('show tier') || lowerQuery.includes('tier distribution') || lowerQuery.includes('tier breakdown')) {
      return 'tierDistribution';
    } else if (lowerQuery.includes('compare revenue') || lowerQuery.includes('revenue comparison')) {
      return 'revenueComparison';
    } else if (lowerQuery.includes('growth projection') || lowerQuery.includes('future growth')) {
      return 'growthProjection';
    } else if (lowerQuery.includes('service breakdown') || lowerQuery.includes('service distribution')) {
      return 'serviceDistribution';
    } else if (lowerQuery.includes('deal stages') || lowerQuery.includes('pipeline stages')) {
      return 'dealStages';
    } else if (lowerQuery.includes('industry breakdown') || lowerQuery.includes('industry distribution')) {
      return 'industryDistribution';
    } else if (lowerQuery.includes('company comparison') || lowerQuery.includes('compare companies')) {
      return 'companyComparison';
    } else if (lowerQuery.includes('alignment analysis') || lowerQuery.includes('strategic fit')) {
      return 'alignmentAnalysis';
    } else if (lowerQuery.includes('overall score') || lowerQuery.includes('average score')) {
      return 'overallScore';
    } else if (lowerQuery.includes('region distribution') || lowerQuery.includes('regional breakdown')) {
      return 'regionDistribution';
    }
    
    // When not sure, show tier distribution as default
    return 'tierDistribution';
  };
  
  // Get top companies by tier
  const getTopCompaniesByTier = (tier: number, count: number = 3) => {
    return filteredCompanies
      .filter(company => company.tier === tier)
      .sort((a, b) => (b.score?.overall || 0) - (a.score?.overall || 0))
      .slice(0, count)
      .map(company => company.id);
  };
  
  const renderVisualization = () => {
    const visualizationType = getVisualizationType(query);
    
    switch (visualizationType) {
      case 'tierDistribution':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartComponent
              type="doughnut"
              title="Target Company Distribution by Tier"
              query="tierDistribution"
            />
            <ChartComponent
              type="bar"
              title="Revenue by Tier Category"
              query="revenueByTier"
            />
          </div>
        );
      
      case 'revenueComparison':
        return (
          <div className="grid grid-cols-1 gap-6">
            <ComparisonChart 
              title="Revenue Comparison - Top Companies"
              companies={[]}
              metric="revenue"
            />
            <TrendChart
              title="Revenue Projection by Tier"
              metric="revenue"
              years={3}
            />
          </div>
        );
      
      case 'growthProjection':
        return (
          <div className="grid grid-cols-1 gap-6">
            <TrendChart
              title="Growth Projection by Tier (5 Years)"
              metric="growth"
              years={5}
            />
            <ComparisonChart 
              title="Growth Rate - Top Companies"
              companies={[]}
              metric="growthRate"
            />
          </div>
        );
      
      case 'serviceDistribution':
        return (
          <div className="grid grid-cols-1 gap-6">
            <ChartComponent
              type="bar"
              title="Service Distribution Across Target Companies"
              query="serviceDistribution"
            />
          </div>
        );
      
      case 'dealStages':
        return (
          <div className="grid grid-cols-1 gap-6">
            <ChartComponent
              type="bar"
              title="Companies by Deal Stage"
              query="dealStageProgress"
            />
          </div>
        );
        
      case 'industryDistribution':
        return (
          <div className="grid grid-cols-1 gap-6">
            <ChartComponent
              type="pie"
              title="Industry Distribution"
              query="industryComparison"
            />
          </div>
        );
        
      case 'companyComparison':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComparisonChart 
                title="Revenue Comparison"
                companies={getTopCompaniesByTier(1, 5)}
                metric="revenue"
              />
              <ComparisonChart 
                title="Employees Comparison"
                companies={getTopCompaniesByTier(1, 5)}
                metric="employees"
              />
            </div>
          </div>
        );
        
      case 'alignmentAnalysis':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadarChart
              title="Strategic Alignment Analysis"
              companies={getTopCompaniesByTier(1, 3)}
            />
            <div className="grid grid-cols-2 gap-4">
              <GaugeChart
                title="Avg. Service Fit"
                value={filteredCompanies.reduce((sum, c) => sum + (c.score?.servicesFit || 0), 0) / 
                      (filteredCompanies.length || 1)}
                label="Score"
              />
              <GaugeChart
                title="Avg. Industry Fit"
                value={filteredCompanies.reduce((sum, c) => sum + (c.score?.industryFit || 0), 0) / 
                      (filteredCompanies.length || 1)}
                label="Score"
              />
            </div>
          </div>
        );
        
      case 'overallScore':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GaugeChart
              title="Average Match Score"
              value={filteredCompanies.reduce((sum, c) => sum + (c.score?.overall || 0), 0) / 
                    (filteredCompanies.length || 1)}
              label="Score"
            />
            <ComparisonChart 
              title="Top Companies by Match Score"
              companies={[]}
              metric="score"
            />
          </div>
        );
        
      case 'regionDistribution':
        return (
          <div className="grid grid-cols-1 gap-6">
            <ChartComponent
              type="pie"
              title="Target Distribution by Region"
              query="regionDistribution"
            />
          </div>
        );
        
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartComponent
              type="doughnut"
              title="Target Company Distribution by Tier"
              query="tierDistribution"
            />
            <ChartComponent
              type="bar"
              title="Service Distribution Across Target Companies"
              query="serviceDistribution"
            />
          </div>
        );
    }
  };

  return (
    <div className="p-4 bg-background-secondary rounded-lg shadow-md border border-border">
      <div className="mb-4">
        <h3 className="text-primary font-medium">AI Visualization</h3>
        <p className="text-secondary text-sm">Visual data insights based on your query</p>
      </div>
      
      {renderVisualization()}
      
      <div className="mt-4 pt-3 border-t border-border text-xs text-secondary">
        <p>
          Data shown is aggregated from your target company database. Charts are interactive - hover for more details.
        </p>
      </div>
    </div>
  );
};

export default AIVisualizationResponse;