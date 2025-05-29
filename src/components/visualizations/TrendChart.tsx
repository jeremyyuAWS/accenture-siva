import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext';

interface TrendChartProps {
  title: string;
  metric: 'revenue' | 'growth' | 'valuation';
  years: number;
  animated?: boolean;
}

const TrendChart: React.FC<TrendChartProps> = ({
  title,
  metric,
  years = 5,
  animated = true
}) => {
  const { filteredCompanies } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const animationRef = useRef<number | null>(null);

  // Format metric label
  const formatMetricLabel = (metric: string): string => {
    switch(metric) {
      case 'revenue': return 'Revenue';
      case 'growth': return 'Growth Rate';
      case 'valuation': return 'Valuation';
      default: return metric;
    }
  };

  const animate = () => {
    const startTime = Date.now();
    const duration = 1500; // ms

    const updateAnimation = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateAnimation);
      }
    };

    animationRef.current = requestAnimationFrame(updateAnimation);
  };

  useEffect(() => {
    // Generate trend data
    const currentYear = new Date().getFullYear();
    const data = [];

    // Generate historical and projected data points
    for (let i = -2; i <= years; i++) {
      const year = currentYear + i;
      const isProjected = i >= 0;
      const point: any = { year, isProjected };

      // Calculate averages for tier 1, tier 2, and tier 3 companies
      const tier1Companies = filteredCompanies.filter(c => c.tier === 1);
      const tier2Companies = filteredCompanies.filter(c => c.tier === 2);
      const tier3Companies = filteredCompanies.filter(c => c.tier === 3);

      if (metric === 'revenue') {
        // Base multiplier on historical growth or projected growth
        const multiplier = isProjected 
          ? Math.pow(1.15, i) // 15% growth projected
          : Math.pow(0.9, Math.abs(i)); // Historical data shows smaller past values
        
        point.tier1 = (tier1Companies.reduce((sum, c) => sum + c.revenue, 0) / 
          (tier1Companies.length || 1) / 1000000) * multiplier * (animated ? progress : 1);
          
        point.tier2 = (tier2Companies.reduce((sum, c) => sum + c.revenue, 0) / 
          (tier2Companies.length || 1) / 1000000) * multiplier * (animated ? progress : 1);
          
        point.tier3 = (tier3Companies.reduce((sum, c) => sum + c.revenue, 0) / 
          (tier3Companies.length || 1) / 1000000) * multiplier * (animated ? progress : 1);
      } else if (metric === 'growth') {
        // Growth rates tend to converge over time
        const baseGrowth = isProjected ? (5 + i) : (10 - Math.abs(i) * 2);
        
        point.tier1 = ((tier1Companies.reduce((sum, c) => sum + (c.growthRate || 0), 0) / 
          (tier1Companies.length || 1)) + baseGrowth) * (animated ? progress : 1);
          
        point.tier2 = ((tier2Companies.reduce((sum, c) => sum + (c.growthRate || 0), 0) / 
          (tier2Companies.length || 1)) + baseGrowth - 2) * (animated ? progress : 1);
          
        point.tier3 = ((tier3Companies.reduce((sum, c) => sum + (c.growthRate || 0), 0) / 
          (tier3Companies.length || 1)) + baseGrowth - 5) * (animated ? progress : 1);
      } else if (metric === 'valuation') {
        // Valuation typically grows faster than revenue
        const multiplier = isProjected 
          ? Math.pow(1.2, i) 
          : Math.pow(0.85, Math.abs(i));
        
        point.tier1 = (tier1Companies.reduce((sum, c) => sum + (c.valuation || c.revenue * 4), 0) / 
          (tier1Companies.length || 1) / 1000000) * multiplier * (animated ? progress : 1);
          
        point.tier2 = (tier2Companies.reduce((sum, c) => sum + (c.valuation || c.revenue * 3), 0) / 
          (tier2Companies.length || 1) / 1000000) * multiplier * (animated ? progress : 1);
          
        point.tier3 = (tier3Companies.reduce((sum, c) => sum + (c.valuation || c.revenue * 2), 0) / 
          (tier3Companies.length || 1) / 1000000) * multiplier * (animated ? progress : 1);
      }

      data.push(point);
    }

    setChartData(data);
  }, [filteredCompanies, metric, years, progress, animated]);

  // Start animation
  useEffect(() => {
    if (animated) {
      animate();
    } else {
      setProgress(1);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animated]);

  const formatYAxis = (value: number): string => {
    if (metric === 'revenue' || metric === 'valuation') {
      return `$${value.toFixed(0)}M`;
    } else if (metric === 'growth') {
      return `${value.toFixed(1)}%`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isProjected = payload[0].payload.isProjected;
      return (
        <div className="bg-background-secondary p-2 border border-border shadow-sm">
          <p className="font-medium text-primary">{label} {isProjected ? '(Projected)' : ''}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: {formatYAxis(item.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-background-secondary p-4 rounded-lg shadow-sm border border-border">
      <h3 className="text-primary font-medium mb-3">{title}</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: 'var(--primary)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fill: 'var(--primary)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="tier1" 
              name="Tier 1" 
              stroke="#000000" 
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="tier2" 
              name="Tier 2" 
              stroke="#666666"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="tier3" 
              name="Tier 3" 
              stroke="#999999"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-secondary mt-2 text-center">
        {metric === 'revenue' || metric === 'valuation' ? 
          'Values in millions of dollars' : 
          metric === 'growth' ? 
          'Annual growth rate percentage' : 
          ''}
      </p>
    </div>
  );
};

export default TrendChart;