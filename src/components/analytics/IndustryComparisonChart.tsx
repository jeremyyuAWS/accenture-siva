import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, BarChart2 } from 'lucide-react';

interface IndustryComparisonChartProps {
  industries: string[];
  startDate?: Date;
  endDate?: Date;
  metric?: 'count' | 'amount';
  height?: number;
}

const IndustryComparisonChart: React.FC<IndustryComparisonChartProps> = ({
  industries,
  startDate,
  endDate,
  metric = 'amount',
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
      
      // Get industry comparison from analytics service
      const comparison = analyticsService.getIndustryComparison(
        industries,
        defaultStartDate,
        defaultEndDate
      );
      
      // Format data for chart
      const formattedData = comparison.map(industry => {
        const result: any = {
          name: industry.industry
        };
        
        // Add data for each event type
        Object.entries(industry.distribution).forEach(([type, data]) => {
          const { count, amount } = data as { count: number; amount: number };
          result[`${type}_${metric}`] = metric === 'count' ? count : amount / 1000000; // Convert to millions for amount
        });
        
        return result;
      });
      
      setData(formattedData);
    } catch (err) {
      console.error('Error loading industry comparison:', err);
      setError('Failed to load industry comparison data');
    } finally {
      setLoading(false);
    }
  }, [industries, startDate, endDate, metric]);
  
  // Event types to display
  const eventTypes = ['seed', 'series_a', 'series_b', 'series_c_plus', 'acquisition'];
  
  // Colors for different event types
  const eventColors = {
    seed: '#000000',
    series_a: '#333333',
    series_b: '#666666',
    series_c_plus: '#999999',
    acquisition: '#cccccc'
  };
  
  // Format event type for display
  const formatEventType = (type: string): string => {
    switch (type) {
      case 'seed': return 'Seed';
      case 'series_a': return 'Series A';
      case 'series_b': return 'Series B';
      case 'series_c_plus': return 'Series C+';
      case 'acquisition': return 'Acquisition';
      default: return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
    }
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-secondary p-2 border border-border shadow-sm">
          <p className="font-medium text-primary">{label}</p>
          {payload.map((entry: any, index: number) => {
            const eventType = entry.dataKey.split('_')[0];
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {formatEventType(eventType)}: {metric === 'amount' ? `$${entry.value.toFixed(1)}M` : entry.value}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-accent animate-spin mr-3" />
        <p className="text-primary">Loading industry comparison...</p>
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
          <BarChart2 className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium text-primary">
            Industry Comparison by {metric === 'count' ? 'Deal Count' : 'Funding Amount'}
          </h3>
        </div>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'var(--primary)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--primary)' }}
              tickLine={{ stroke: 'var(--border)' }}
              tickFormatter={metric === 'amount' ? (value) => `$${value}M` : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {eventTypes.map(type => (
              <Bar 
                key={type}
                dataKey={`${type}_${metric}`}
                name={formatEventType(type)}
                stackId="a"
                fill={eventColors[type as keyof typeof eventColors]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-secondary text-right">
        Comparison across {industries.length} industries
      </div>
    </div>
  );
};

export default IndustryComparisonChart;