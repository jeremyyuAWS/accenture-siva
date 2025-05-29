import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { DollarSign, TrendingUp, BarChart2, Users, RefreshCw } from 'lucide-react';

interface MetricsCardsProps {
  startDate?: Date;
  endDate?: Date;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
  startDate,
  endDate
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load data on mount and when props change
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      // Default to last 12 months if dates not provided
      const defaultEndDate = endDate || new Date();
      const defaultStartDate = startDate || new Date(defaultEndDate);
      defaultStartDate.setMonth(defaultStartDate.getMonth() - 12);
      
      // Get dashboard metrics from analytics service
      const dashboardMetrics = analyticsService.getDashboardMetrics(
        defaultStartDate,
        defaultEndDate
      );
      
      setMetrics(dashboardMetrics);
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
      setError('Failed to load metrics data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-background-secondary rounded-lg border border-border p-4 animate-pulse">
            <div className="h-4 bg-background-primary rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-background-primary rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-background-primary rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Funding */}
      <div className="bg-background-secondary rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-secondary">Total Funding</h3>
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(metrics.fundingAmount)}
        </p>
        <p className="text-xs text-secondary mt-1">
          Across {metrics.fundingCount} funding rounds
        </p>
      </div>
      
      {/* Acquisitions */}
      <div className="bg-background-secondary rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-secondary">Acquisitions</h3>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(metrics.acquisitionAmount)}
        </p>
        <p className="text-xs text-secondary mt-1">
          Across {metrics.acquisitionCount} acquisitions
        </p>
      </div>
      
      {/* Average Deal Size */}
      <div className="bg-background-secondary rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-secondary">Avg Deal Size</h3>
          <BarChart2 className="h-5 w-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(metrics.avgDealSize)}
        </p>
        <p className="text-xs text-secondary mt-1">
          {formatCurrency(metrics.avgFundingSize)} for funding rounds
        </p>
      </div>
      
      {/* Companies & Investors */}
      <div className="bg-background-secondary rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-secondary">Activity</h3>
          <Users className="h-5 w-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-primary">
          {metrics.uniqueCompanies}
        </p>
        <p className="text-xs text-secondary mt-1">
          Companies with {metrics.uniqueInvestors} active investors
        </p>
      </div>
    </div>
  );
};

export default MetricsCards;