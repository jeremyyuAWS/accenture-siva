import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Pie, PolarArea, Radar } from 'react-chartjs-2';
import { useAppContext } from '../../context/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polar';

interface ChartComponentProps {
  type: ChartType;
  title: string;
  query: string;
  height?: number;
  animated?: boolean;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  type,
  title,
  query,
  height = 300,
  animated = true
}) => {
  const { filteredCompanies } = useAppContext();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  const getRandomColor = (alpha: number = 1) => {
    // Use grayscale colors for our black/white theme
    const shade = Math.floor(Math.random() * 200);
    return `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
  };

  const getColorArray = (count: number, alpha: number = 1) => {
    return Array(count).fill(0).map(() => getRandomColor(alpha));
  };

  const animate = () => {
    const startTime = Date.now();
    const duration = 800; // ms

    const updateAnimation = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateAnimation);
      }
    };

    animationRef.current = requestAnimationFrame(updateAnimation);
  };

  useEffect(() => {
    if (animated) {
      animate();
    } else {
      setAnimationProgress(1);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animated]);

  // Process data based on query
  useEffect(() => {
    setLoading(true);

    const processData = () => {
      switch(query) {
        case 'tierDistribution':
          return processTierDistribution();
        case 'regionDistribution':
          return processRegionDistribution();
        case 'revenueByTier':
          return processRevenueByTier();
        case 'serviceDistribution':
          return processServiceDistribution();
        case 'dealStageProgress':
          return processDealStageProgress();
        case 'industryComparison':
          return processIndustryComparison();
        case 'growthProjections':
          return processGrowthProjections();
        default:
          return processTierDistribution(); // Default fallback
      }
    };

    // Small delay to allow animation to be noticeable
    setTimeout(() => {
      setData(processData());
      setLoading(false);
    }, 300);
  }, [query, filteredCompanies]);

  const processTierDistribution = () => {
    // Count companies by tier
    const tierCounts = {
      "Tier 1": filteredCompanies.filter(c => c.tier === 1).length,
      "Tier 2": filteredCompanies.filter(c => c.tier === 2).length,
      "Tier 3": filteredCompanies.filter(c => c.tier === 3).length,
    };

    return {
      labels: Object.keys(tierCounts),
      datasets: [
        {
          label: 'Companies by Tier',
          data: Object.values(tierCounts).map(count => count * animationProgress),
          backgroundColor: ['rgba(0, 0, 0, 0.8)', 'rgba(50, 50, 50, 0.7)', 'rgba(100, 100, 100, 0.6)'],
          borderColor: ['rgba(0, 0, 0, 1)', 'rgba(50, 50, 50, 1)', 'rgba(100, 100, 100, 1)'],
          borderWidth: 1,
        },
      ],
    };
  };

  const processRegionDistribution = () => {
    // Group companies by region
    const regions = filteredCompanies.reduce<Record<string, number>>((acc, company) => {
      acc[company.region] = (acc[company.region] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(regions),
      datasets: [
        {
          label: 'Companies by Region',
          data: Object.values(regions).map(count => count * animationProgress),
          backgroundColor: getColorArray(Object.keys(regions).length, 0.7),
          borderColor: getColorArray(Object.keys(regions).length, 1),
          borderWidth: 1,
        },
      ],
    };
  };

  const processRevenueByTier = () => {
    // Calculate total revenue by tier
    const revenueByTier = filteredCompanies.reduce<Record<string, number>>((acc, company) => {
      const tierLabel = `Tier ${company.tier || 3}`;
      acc[tierLabel] = (acc[tierLabel] || 0) + company.revenue;
      return acc;
    }, {});

    // Convert to millions for better readability
    const dataInMillions = Object.fromEntries(
      Object.entries(revenueByTier).map(([tier, revenue]) => [tier, (revenue / 1000000) * animationProgress])
    );

    return {
      labels: Object.keys(dataInMillions),
      datasets: [
        {
          label: 'Revenue by Tier (Millions $)',
          data: Object.values(dataInMillions),
          backgroundColor: ['rgba(0, 0, 0, 0.8)', 'rgba(50, 50, 50, 0.7)', 'rgba(100, 100, 100, 0.6)'],
          borderColor: ['rgba(0, 0, 0, 1)', 'rgba(50, 50, 50, 1)', 'rgba(100, 100, 100, 1)'],
          borderWidth: 1,
        },
      ],
    };
  };

  const processServiceDistribution = () => {
    // Count service occurrences across all companies
    const serviceDistribution: Record<string, number> = {};
    
    filteredCompanies.forEach(company => {
      company.services.forEach(service => {
        serviceDistribution[service] = (serviceDistribution[service] || 0) + 1;
      });
    });
    
    // Sort by count and take top 7 for readability
    const sortedServices = Object.entries(serviceDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);
    
    return {
      labels: sortedServices.map(([service]) => service),
      datasets: [
        {
          label: 'Service Distribution',
          data: sortedServices.map(([_, count]) => count * animationProgress),
          backgroundColor: getColorArray(sortedServices.length, 0.7),
          borderColor: getColorArray(sortedServices.length, 1),
          borderWidth: 1,
        },
      ],
    };
  };

  const processDealStageProgress = () => {
    // Count companies in each deal stage
    const dealStages = {
      'Identification': filteredCompanies.filter(c => !c.dealStage || c.dealStage === 'identification').length,
      'Initial Interest': filteredCompanies.filter(c => c.dealStage === 'initial_interest').length,
      'Evaluation': filteredCompanies.filter(c => c.dealStage === 'evaluation').length,
      'Due Diligence': filteredCompanies.filter(c => c.dealStage === 'due_diligence').length,
      'Negotiation': filteredCompanies.filter(c => c.dealStage === 'negotiation').length,
      'Agreement': filteredCompanies.filter(c => c.dealStage === 'agreement').length,
      'Closing': filteredCompanies.filter(c => c.dealStage === 'closing').length,
    };

    return {
      labels: Object.keys(dealStages),
      datasets: [
        {
          label: 'Companies by Deal Stage',
          data: Object.values(dealStages).map(count => count * animationProgress),
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const processIndustryComparison = () => {
    // Group companies by industry
    const industries = filteredCompanies.reduce<Record<string, number>>((acc, company) => {
      acc[company.industry] = (acc[company.industry] || 0) + 1;
      return acc;
    }, {});

    // Sort and take top 6 for readability
    const sortedIndustries = Object.entries(industries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      labels: sortedIndustries.map(([industry]) => industry),
      datasets: [
        {
          label: 'Companies by Industry',
          data: sortedIndustries.map(([_, count]) => count * animationProgress),
          backgroundColor: getColorArray(sortedIndustries.length, 0.7),
          borderColor: getColorArray(sortedIndustries.length, 1),
          borderWidth: 1,
        },
      ],
    };
  };

  const processGrowthProjections = () => {
    // Use companies with growth rates
    const companiesWithGrowth = filteredCompanies
      .filter(c => c.growthRate !== undefined)
      .sort((a, b) => (b.growthRate || 0) - (a.growthRate || 0))
      .slice(0, 5); // Take top 5 for readability

    return {
      labels: companiesWithGrowth.map(company => company.name),
      datasets: [
        {
          label: 'Growth Rate (%)',
          data: companiesWithGrowth.map(company => (company.growthRate || 0) * animationProgress),
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1,
          fill: false,
        },
      ],
    };
  };

  const renderChart = () => {
    if (loading || !data) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
      },
      animation: {
        duration: 500,
      }
    };

    switch (type) {
      case 'bar':
        return <Bar data={data} options={commonOptions} />;
      case 'line':
        return <Line data={data} options={commonOptions} />;
      case 'pie':
        return <Pie data={data} options={commonOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={commonOptions} />;
      case 'radar':
        return <Radar data={data} options={commonOptions} />;
      case 'polar':
        return <PolarArea data={data} options={commonOptions} />;
      default:
        return <Bar data={data} options={commonOptions} />;
    }
  };

  return (
    <div className="bg-background-secondary p-4 rounded-lg shadow-sm border border-border h-full">
      <div style={{ height: height }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartComponent;