import React, { useState, useEffect, useRef } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppContext } from '../../context/AppContext';
import { Company } from '../../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  companies: string[];
  title: string;
  animated?: boolean;
}

const RadarChartComponent: React.FC<RadarChartProps> = ({ companies: companyIds, title, animated = true }) => {
  const { filteredCompanies } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const animationRef = useRef<number | null>(null);
  
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

  useEffect(() => {
    // Select the companies to display
    const selectedCompanies = companyIds.length > 0
      ? filteredCompanies.filter(c => companyIds.includes(c.id))
      : filteredCompanies
          .filter(c => c.score?.overall) // Only companies with scores
          .sort((a, b) => (b.score?.overall || 0) - (a.score?.overall || 0))
          .slice(0, 3); // Top 3 by score
    
    // Define radar chart attributes
    const attributes = [
      'Services Fit', 
      'Industry Fit', 
      'Geography Fit', 
      'Financial Health', 
      'Growth Rate'
    ];
    
    // Prepare data for the chart
    const datasets = selectedCompanies.map((company, index) => {
      // Get attribute values (normalize between 0-100)
      const values = [
        company.score?.servicesFit || 0,
        company.score?.industryFit || 0, 
        company.score?.geographyFit || 0,
        company.score?.financialHealth || 0,
        (company.growthRate || 0) * 4 // Normalize growth rate to 0-100 scale
      ].map(val => val * progress);
      
      // Get grayscale color based on tier
      const shade = company.tier === 1 ? 0 : (company.tier === 2 ? 100 : 200);
      const color = `rgba(${shade}, ${shade}, ${shade}`;
      
      return {
        label: company.name,
        data: values,
        backgroundColor: `${color}, 0.2)`,
        borderColor: `${color}, 1)`,
        borderWidth: 2,
        pointBackgroundColor: `${color}, 1)`,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: `${color}, 1)`,
        pointRadius: 3,
      };
    });
    
    setChartData({
      labels: attributes,
      datasets,
    });
  }, [companyIds, filteredCompanies, progress]);

  return (
    <div className="bg-background-secondary p-4 rounded-lg shadow-sm border border-border">
      <h3 className="text-primary font-medium mb-3">{title}</h3>
      <div style={{ height: 300 }}>
        <Radar 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 20,
                  color: 'var(--secondary)',
                  backdropColor: 'transparent'
                },
                pointLabels: {
                  color: 'var(--primary)',
                  font: {
                    size: 11
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                angleLines: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: 'var(--primary)',
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              title: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw.toFixed(1)}`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default RadarChartComponent;