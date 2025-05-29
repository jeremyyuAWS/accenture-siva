import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { InfoIcon, Download, ArrowUpRight } from 'lucide-react';

interface InsightVisualizationProps {
  type: string;
  node?: any;
  data?: any;
}

const InsightVisualization: React.FC<InsightVisualizationProps> = ({ type, node, data }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Use the provided data or generate mock data based on visualization type
  useEffect(() => {
    setLoading(true);
    
    let newData: any[] = [];
    let newTitle = '';
    
    if (data) {
      // Use provided data
      newData = data.data || [];
      newTitle = data.title || formatTitle(type, node);
    } else {
      // Generate mock data
      const mockData = generateMockData(type, node);
      newData = mockData.data;
      newTitle = mockData.title;
    }
    
    // Simulate API delay
    setTimeout(() => {
      setChartData(newData);
      setTitle(newTitle);
      setLoading(false);
    }, 300);
  }, [type, node, data]);
  
  // Format title based on type and node
  const formatTitle = (type: string, node?: any): string => {
    if (node) {
      if (type === 'timeline') {
        return `${node.name} - Event Timeline`;
      }
      return `${node.name} - ${formatType(type)}`;
    }
    return `${formatType(type)} in Focus Areas`;
  };
  
  // Format the type for display
  const formatType = (type: string): string => {
    switch (type) {
      case 'timeline': return 'Event Timeline';
      case 'funding': return 'Funding Distribution';
      case 'acquisitions': return 'Acquisition Activity';
      case 'overview': return 'Event Distribution';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  // Generate mock data
  const generateMockData = (type: string, node?: any): { data: any[]; title: string } => {
    switch(type) {
      case 'timeline':
        return {
          data: node ? [
            { name: '2020 Q1', Funding: 3, Valuation: 15 },
            { name: '2020 Q3', Funding: 8, Valuation: 32 },
            { name: '2021 Q2', Funding: 15, Valuation: 60 },
            { name: '2022 Q2', Funding: 50, Valuation: 120 },
            { name: '2023 Q1', Funding: 0, Valuation: 150 }
          ] : [
            { name: 'Jan', Funding: 125, Acquisitions: 5 },
            { name: 'Feb', Funding: 90, Acquisitions: 3 },
            { name: 'Mar', Funding: 150, Acquisitions: 7 },
            { name: 'Apr', Funding: 210, Acquisitions: 8 },
            { name: 'May', Funding: 180, Acquisitions: 6 },
            { name: 'Jun', Funding: 220, Acquisitions: 10 }
          ],
          title: node ? `${node.name} - Event Timeline` : 'Activity Timeline - Last 6 Months'
        };
        
      case 'funding':
        if (node?.type === 'industry') {
          return {
            data: [
              { name: 'Seed', value: 45 },
              { name: 'Series A', value: 75 },
              { name: 'Series B', value: 120 },
              { name: 'Series C+', value: 80 }
            ],
            title: `Funding Distribution in ${node.name}`
          };
        } else if (node?.type === 'investor') {
          return {
            data: [
              { name: 'AI/ML', value: 120 },
              { name: 'Fintech', value: 85 },
              { name: 'ClimateTech', value: 45 },
              { name: 'Other', value: 30 }
            ],
            title: `${node.name} Investment Focus`
          };
        } else {
          return {
            data: [
              { name: 'AI/ML', value: 320 },
              { name: 'Fintech', value: 280 },
              { name: 'ClimateTech', value: 190 },
              { name: 'HealthTech', value: 230 },
              { name: 'Cybersecurity', value: 170 }
            ],
            title: 'Funding by Industry (Millions USD)'
          };
        }
        
      case 'acquisitions':
        return {
          data: [
            { name: 'Big Tech', value: 45 },
            { name: 'Private Equity', value: 30 },
            { name: 'Industry Leaders', value: 25 },
            { name: 'Other', value: 15 }
          ],
          title: 'Acquisition Distribution by Acquirer Type'
        };
        
      case 'overview':
      default:
        return {
          data: [
            { name: 'Seed', value: 35 },
            { name: 'Series A', value: 42 },
            { name: 'Series B', value: 28 },
            { name: 'Series C+', value: 15 },
            { name: 'Acquisition', value: 23 }
          ],
          title: 'Event Distribution in Your Focus Areas'
        };
    }
  };

  // Render the appropriate chart based on type
  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      );
    }
    
    if (type === 'overview' || type === 'acquisitions') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`rgb(${index * 30 % 128 + 64}, ${index * 30 % 128 + 64}, ${index * 30 % 128 + 64})`} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--border)' 
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    if (type === 'funding') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--border)' 
              }}
            />
            <Bar dataKey="value" fill="#000000" name="Value" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    if (type === 'timeline') {
      if (chartData[0]?.Funding !== undefined && chartData[0]?.Acquisitions !== undefined) {
        // Timeline for industry/general view
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#000000" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderColor: 'var(--border)' 
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Funding" stroke="#000000" activeDot={{ r: 8 }} name="Funding ($M)" />
              <Line yAxisId="right" type="monotone" dataKey="Acquisitions" stroke="#6b7280" name="Acquisition Count" />
            </LineChart>
          </ResponsiveContainer>
        );
      } else if (chartData[0]?.Funding !== undefined && chartData[0]?.Valuation !== undefined) {
        // Timeline for company view
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#000000" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderColor: 'var(--border)' 
                }}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="Funding" fill="#000000" stroke="#000000" fillOpacity={0.3} name="Funding ($M)" />
              <Area yAxisId="right" type="monotone" dataKey="Valuation" fill="#6b7280" stroke="#6b7280" fillOpacity={0.3} name="Valuation ($M)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      } else {
        // Fallback
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderColor: 'var(--border)' 
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#000000" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }
    }
    
    // Fallback to bar chart
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border)' 
            }}
          />
          <Legend />
          <Bar dataKey="value" fill="#000000" name="Value" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-background-secondary p-4 rounded-lg border border-border">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium text-primary">{title}</h3>
        <div className="flex space-x-2">
          <button className="p-1 text-secondary hover:text-primary">
            <InfoIcon className="h-4 w-4" />
          </button>
          <button className="p-1 text-secondary hover:text-primary">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {renderChart()}
      
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs text-secondary">
          Data source: Simulated market data
        </div>
        <button className="text-xs flex items-center text-accent hover:text-accent/80 transition-colors">
          <span>View detailed analysis</span>
          <ArrowUpRight className="h-3 w-3 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default InsightVisualization;