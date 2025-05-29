import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RefreshCw, PieChart as PieChartIcon } from 'lucide-react';

interface FundingDistributionChartProps {
  startDate?: Date;
  endDate?: Date;
  metric?: 'count' | 'amount';
  height?: number;
}

const FundingDistributionChart: React.FC<FundingDistributionChartProps> = ({
  startDate,
  endDate,
  metric = 'count',
  height = 300
}) => {
  const [data, setData] = useState<any[]>([]);
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
      
      // Get funding distribution from analytics service
      const distribution = analyticsService.getFundingDistributionByType(
        defaultStartDate,
        defaultEndDate
      );
      
      // Format data for chart
      const formattedData = distribution.map(item => ({
        name: formatEventType(item.type),
        value: metric === 'count' ? item.count : item.amount / 1000000, // Convert to millions for amount
        rawAmount: item.amount,
        rawCount: item.count
      }));
      
      setData(formattedData);
    } catch (err) {
      console.error('Error loading funding distribution:', err);
      setError('Failed to load funding distribution data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, metric]);
  
  // Format event type for display
  const formatEventType = (type: string): string => {
    switch (type) {
      case 'seed': return 'Seed';
      case 'series_a': return 'Series A';
      case 'series_b': return 'Series B';
      case 'series_c_plus': return 'Series C+';
      case 'acquisition': return 'Acquisition';
      case 'ipo': return 'IPO';
      case 'spac': return 'SPAC';
      case 'pe_buyout': return 'PE Buyout';
      default: return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
    }
  };
  
  // Colors for pie chart
  const COLORS = ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#4b5563', '#9ca3af', '#e5e7eb'];
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background-secondary p-2 border border-border shadow-sm">
          <p className="font-medium text-primary">{data.name}</p>
          {metric === 'count' ? (
            <>
              <p className="text-sm text-primary">Deals: {data.rawCount}</p>
              <p className="text-sm text-secondary">
                Amount: ${(data.rawAmount / 1000000).toFixed(1)}M
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-primary">Amount: ${data.value.toFixed(1)}M</p>
              <p className="text-sm text-secondary">
                Deals: {data.rawCount}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-accent animate-spin mr-3" />
        <p className="text-primary">Loading distribution data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary p-4 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <PieChartIcon className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium text-primary">
            Funding Distribution by {metric === 'count' ? 'Deal Count' : 'Amount'}
          </h3>
        </div>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-secondary text-right">
        {metric === 'count' ? 'Distribution by number of deals' : 'Distribution by funding amount'}
      </div>
    </div>
  );
};

export default FundingDistributionChart;