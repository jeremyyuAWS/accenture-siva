import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { RefreshCw, Calendar, ArrowDownUp } from 'lucide-react';

interface FundingTrendsChartProps {
  startDate?: Date;
  endDate?: Date;
  interval?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  eventTypes?: string[];
  chartType?: 'line' | 'area';
  showAmount?: boolean;
  showCount?: boolean;
  height?: number;
}

const FundingTrendsChart: React.FC<FundingTrendsChartProps> = ({
  startDate,
  endDate,
  interval = 'month',
  eventTypes,
  chartType = 'line',
  showAmount = true,
  showCount = true,
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
      
      // Get funding trends from analytics service
      const trends = analyticsService.getFundingTrends(
        defaultStartDate,
        defaultEndDate,
        interval,
        eventTypes as any[]
      );
      
      // Format data for chart
      const formattedData = trends.map(trend => ({
        date: trend.date,
        count: trend.count,
        amount: trend.amount / 1000000, // Convert to millions
        averageAmount: trend.averageAmount / 1000000 // Convert to millions
      }));
      
      setData(formattedData);
    } catch (err) {
      console.error('Error loading funding trends:', err);
      setError('Failed to load funding trends data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, interval, eventTypes, showAmount, showCount]);
  
  // Format tooltip values
  const formatTooltipValue = (value: number, name: string): string => {
    if (name === 'amount' || name === 'averageAmount') {
      return `$${value.toFixed(1)}M`;
    }
    return value.toString();
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-secondary p-2 border border-border shadow-sm">
          <p className="font-medium text-primary">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'amount' ? 'Total Amount: ' : 
               entry.name === 'count' ? 'Deal Count: ' : 
               entry.name === 'averageAmount' ? 'Avg Deal Size: ' : 
               `${entry.name}: `}
              {formatTooltipValue(entry.value, entry.name)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-accent animate-spin mr-3" />
        <p className="text-primary">Loading funding trends...</p>
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
          <ArrowDownUp className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium text-primary">Funding Trends</h3>
        </div>
        <div className="flex items-center text-xs text-secondary">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>
            {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString() || 'Present'}
          </span>
        </div>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'var(--primary)' }}
                tickLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tick={{ fill: 'var(--primary)' }}
                tickLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => `$${value}M`}
                domain={['auto', 'auto']}
                hide={!showAmount}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'var(--primary)' }}
                tickLine={{ stroke: 'var(--border)' }}
                domain={['auto', 'auto']}
                hide={!showCount}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {showAmount && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="amount" 
                  name="Total Amount" 
                  stroke="#000000" 
                  activeDot={{ r: 8 }}
                />
              )}
              {showCount && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="count" 
                  name="Deal Count" 
                  stroke="#6b7280" 
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'var(--primary)' }}
                tickLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tick={{ fill: 'var(--primary)' }}
                tickLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => `$${value}M`}
                domain={['auto', 'auto']}
                hide={!showAmount}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'var(--primary)' }}
                tickLine={{ stroke: 'var(--border)' }}
                domain={['auto', 'auto']}
                hide={!showCount}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {showAmount && (
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="amount" 
                  name="Total Amount" 
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.1}
                />
              )}
              {showCount && (
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="count" 
                  name="Deal Count" 
                  stroke="#6b7280"
                  fill="#6b7280"
                  fillOpacity={0.1}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-secondary text-right">
        Data source: Simulated funding events
      </div>
    </div>
  );
};

export default FundingTrendsChart;