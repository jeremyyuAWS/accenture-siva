import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, Users } from 'lucide-react';

interface TopInvestorsChartProps {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  sortBy?: 'count' | 'amount';
  height?: number;
}

const TopInvestorsChart: React.FC<TopInvestorsChartProps> = ({
  startDate,
  endDate,
  limit = 10,
  sortBy = 'count',
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
      
      // Get top investors from analytics service
      const investors = analyticsService.getTopInvestors(
        defaultStartDate,
        defaultEndDate,
        limit,
        sortBy
      );
      
      // Format data for chart
      const formattedData = investors.map(investor => ({
        name: investor.investor,
        deals: investor.count,
        amount: investor.amount / 1000000 // Convert to millions
      }));
      
      setData(formattedData);
    } catch (err) {
      console.error('Error loading top investors:', err);
      setError('Failed to load top investors data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, limit, sortBy]);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-secondary p-2 border border-border shadow-sm">
          <p className="font-medium text-primary">{label}</p>
          <p className="text-sm text-primary">
            Deals: {payload.find((p: any) => p.name === 'deals')?.value || 0}
          </p>
          <p className="text-sm text-primary">
            Amount: ${payload.find((p: any) => p.name === 'amount')?.value.toFixed(1)}M
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-accent animate-spin mr-3" />
        <p className="text-primary">Loading top investors...</p>
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
          <Users className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium text-primary">
            Top Investors by {sortBy === 'count' ? 'Deal Count' : 'Investment Amount'}
          </h3>
        </div>
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis 
              type="number"
              tick={{ fill: 'var(--primary)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              tick={{ fill: 'var(--primary)' }}
              tickLine={{ stroke: 'var(--border)' }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey={sortBy === 'count' ? 'deals' : 'amount'} 
              name={sortBy === 'count' ? 'Deal Count' : 'Amount ($M)'} 
              fill="#000000" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-secondary text-right">
        Based on {data.reduce((sum, investor) => sum + investor.deals, 0)} deals across {data.length} investors
      </div>
    </div>
  );
};

export default TopInvestorsChart;