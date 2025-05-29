import React, { useState } from 'react';
import { Calendar, Filter, Download, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import MetricsCards from './MetricsCards';
import FundingTrendsChart from './FundingTrendsChart';
import FundingDistributionChart from './FundingDistributionChart';
import TopInvestorsChart from './TopInvestorsChart';
import IndustryComparisonChart from './IndustryComparisonChart';

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<'3m' | '6m' | '1y' | 'ytd' | 'all'>('1y');
  const [showFilters, setShowFilters] = useState(false);
  const [metric, setMetric] = useState<'count' | 'amount'>('amount');
  const [interval, setInterval] = useState<'month' | 'quarter'>('month');
  const [eventTypes, setEventTypes] = useState<string[]>(['seed', 'series_a', 'series_b', 'series_c_plus']);
  
  // Calculate date range
  const getDateRange = (): { startDate: Date; endDate: Date } => {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '3m':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case 'ytd':
        startDate = new Date(endDate.getFullYear(), 0, 1); // January 1st of current year
        break;
      case 'all':
        startDate.setFullYear(endDate.getFullYear() - 5); // 5 years ago as "all"
        break;
    }
    
    return { startDate, endDate };
  };
  
  const { startDate, endDate } = getDateRange();
  
  // Toggle event type selection
  const toggleEventType = (type: string) => {
    if (eventTypes.includes(type)) {
      setEventTypes(eventTypes.filter(t => t !== type));
    } else {
      setEventTypes([...eventTypes, type]);
    }
  };
  
  // Sample industries for comparison
  const industries = ['AI/ML', 'Fintech', 'ClimateTech', 'Healthtech', 'Cybersecurity'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-black text-white">
          <h2 className="text-lg font-semibold">Funding Analytics Dashboard</h2>
          <p className="text-gray-300 text-sm mt-1">
            Analyze funding trends, compare industries, and track investment activity
          </p>
        </div>
        
        <div className="p-4 bg-background-primary border-b border-border">
          <div className="flex flex-wrap justify-between items-center gap-4">
            {/* Date Range Selector */}
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-secondary mr-1" />
              <div className="flex border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setDateRange('3m')}
                  className={`px-3 py-1.5 text-sm ${
                    dateRange === '3m' 
                      ? 'bg-accent text-white' 
                      : 'bg-background-secondary text-primary hover:bg-background-primary'
                  }`}
                >
                  3M
                </button>
                <button
                  onClick={() => setDateRange('6m')}
                  className={`px-3 py-1.5 text-sm ${
                    dateRange === '6m' 
                      ? 'bg-accent text-white' 
                      : 'bg-background-secondary text-primary hover:bg-background-primary'
                  }`}
                >
                  6M
                </button>
                <button
                  onClick={() => setDateRange('1y')}
                  className={`px-3 py-1.5 text-sm ${
                    dateRange === '1y' 
                      ? 'bg-accent text-white' 
                      : 'bg-background-secondary text-primary hover:bg-background-primary'
                  }`}
                >
                  1Y
                </button>
                <button
                  onClick={() => setDateRange('ytd')}
                  className={`px-3 py-1.5 text-sm ${
                    dateRange === 'ytd' 
                      ? 'bg-accent text-white' 
                      : 'bg-background-secondary text-primary hover:bg-background-primary'
                  }`}
                >
                  YTD
                </button>
                <button
                  onClick={() => setDateRange('all')}
                  className={`px-3 py-1.5 text-sm ${
                    dateRange === 'all' 
                      ? 'bg-accent text-white' 
                      : 'bg-background-secondary text-primary hover:bg-background-primary'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Metric Selector */}
              <div className="flex items-center">
                <span className="text-xs text-secondary mr-2">Metric:</span>
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as 'count' | 'amount')}
                  className="p-1.5 text-sm border border-border rounded-md bg-background-secondary text-primary"
                >
                  <option value="amount">Amount</option>
                  <option value="count">Deal Count</option>
                </select>
              </div>
              
              {/* Interval Selector */}
              <div className="flex items-center">
                <span className="text-xs text-secondary mr-2">Interval:</span>
                <select
                  value={interval}
                  onChange={(e) => setInterval(e.target.value as 'month' | 'quarter')}
                  className="p-1.5 text-sm border border-border rounded-md bg-background-secondary text-primary"
                >
                  <option value="month">Monthly</option>
                  <option value="quarter">Quarterly</option>
                </select>
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-1.5 text-sm border border-border rounded-md bg-background-secondary text-primary hover:bg-background-primary"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4 ml-1.5" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1.5" />
                )}
              </button>
              
              {/* Export Button */}
              <button
                className="flex items-center px-3 py-1.5 text-sm border border-border rounded-md bg-background-secondary text-primary hover:bg-background-primary"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </button>
              
              {/* Refresh Button */}
              <button
                className="p-1.5 border border-border rounded-md bg-background-secondary text-primary hover:bg-background-primary"
                title="Refresh Data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-3 bg-background-secondary rounded-lg border border-border">
              <h3 className="text-sm font-medium text-primary mb-2">Event Types</h3>
              <div className="flex flex-wrap gap-2">
                {['seed', 'series_a', 'series_b', 'series_c_plus', 'acquisition', 'ipo'].map(type => (
                  <button
                    key={type}
                    onClick={() => toggleEventType(type)}
                    className={`px-2.5 py-1 text-xs rounded-md ${
                      eventTypes.includes(type)
                        ? 'bg-accent text-white'
                        : 'bg-background-primary text-primary border border-border hover:bg-accent/5'
                    }`}
                  >
                    {type === 'seed' ? 'Seed' :
                     type === 'series_a' ? 'Series A' :
                     type === 'series_b' ? 'Series B' :
                     type === 'series_c_plus' ? 'Series C+' :
                     type === 'acquisition' ? 'Acquisitions' :
                     type === 'ipo' ? 'IPOs' : type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Metrics Cards */}
      <MetricsCards
        startDate={startDate}
        endDate={endDate}
      />
      
      {/* Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FundingTrendsChart
          startDate={startDate}
          endDate={endDate}
          interval={interval}
          eventTypes={eventTypes}
          chartType="area"
          showAmount={true}
          showCount={true}
        />
        
        <FundingDistributionChart
          startDate={startDate}
          endDate={endDate}
          metric={metric}
        />
      </div>
      
      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopInvestorsChart
          startDate={startDate}
          endDate={endDate}
          limit={10}
          sortBy={metric}
        />
        
        <IndustryComparisonChart
          industries={industries}
          startDate={startDate}
          endDate={endDate}
          metric={metric}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;