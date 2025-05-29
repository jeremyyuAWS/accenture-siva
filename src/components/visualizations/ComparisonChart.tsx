import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { Company } from '../../types';

interface ComparisonChartProps {
  title: string;
  companies: string[];
  metric: 'revenue' | 'employees' | 'growthRate' | 'valuation' | 'score';
  animated?: boolean;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({
  title,
  companies: companyIds,
  metric,
  animated = true
}) => {
  const { filteredCompanies } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const animationRef = useRef<number | null>(null);

  // Format labels and values based on metric
  const formatLabel = (metric: string): string => {
    switch(metric) {
      case 'revenue': return 'Revenue ($ millions)';
      case 'employees': return 'Employees';
      case 'growthRate': return 'Growth Rate (%)';
      case 'valuation': return 'Valuation ($ millions)';
      case 'score': return 'Match Score (%)';
      default: return metric;
    }
  };

  const formatValue = (company: Company, metric: string): number => {
    switch(metric) {
      case 'revenue': return company.revenue / 1000000; // Convert to millions
      case 'employees': return company.employees;
      case 'growthRate': return company.growthRate || 0;
      case 'valuation': return (company.valuation || 0) / 1000000; // Convert to millions
      case 'score': return company.score?.overall || 0;
      default: return 0;
    }
  };

  const animate = () => {
    const startTime = Date.now();
    const duration = 1000; // ms

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
    // Prepare the data
    const selectedCompanies = filteredCompanies.filter(company => 
      companyIds.includes(company.id) || companyIds.length === 0
    );

    // If no companies are explicitly specified, use top 5 by the metric
    const companies = selectedCompanies.length > 0 
      ? selectedCompanies 
      : filteredCompanies
          .sort((a, b) => formatValue(b, metric) - formatValue(a, metric))
          .slice(0, 5);

    const data = companies.map(company => ({
      name: company.name,
      value: formatValue(company, metric) * (animated ? progress : 1),
      tier: company.tier || 3,
      originalValue: formatValue(company, metric)
    }));

    setChartData(data);
  }, [companyIds, filteredCompanies, metric, progress]);

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

  const getTierColor = (tier: number) => {
    switch(tier) {
      case 1: return '#000000';
      case 2: return '#333333';
      case 3: return '#666666';
      default: return '#999999';
    }
  };

  const formatTooltipValue = (value: number): string => {
    if (metric === 'revenue' || metric === 'valuation') {
      return `$${value.toFixed(1)}M`;
    } else if (metric === 'growthRate') {
      return `${value.toFixed(1)}%`;
    } else if (metric === 'score') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-secondary p-2 border border-border text-sm">
          <p className="font-medium text-primary">{label}</p>
          <p className="text-secondary">
            {`${formatLabel(metric)}: ${formatTooltipValue(payload[0].payload.originalValue)}`}
          </p>
          <p className="text-xs text-secondary">
            {`Tier: ${payload[0].payload.tier}`}
          </p>
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
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ 
                value: formatLabel(metric), 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" name={formatLabel(metric)}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getTierColor(entry.tier)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;