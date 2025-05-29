import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

interface GaugeChartProps {
  value: number;
  minValue?: number;
  maxValue?: number;
  title: string;
  label?: string;
  animated?: boolean;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  minValue = 0,
  maxValue = 100,
  title,
  label = '%',
  animated = true
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const animationRef = useRef<number | null>(null);

  const normalizedValue = Math.min(Math.max(value, minValue), maxValue);
  const percentage = ((normalizedValue - minValue) / (maxValue - minValue)) * 100;
  
  const animate = () => {
    const startTime = Date.now();
    const duration = 1000; // ms

    const updateAnimation = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimatedValue(percentage * progress);
      
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
      setAnimatedValue(percentage);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [percentage, animated]);

  // Prepare data for gauge chart
  const data = {
    datasets: [
      {
        data: [animatedValue, 100 - animatedValue],
        backgroundColor: [
          getColorByPercentage(animatedValue),
          'rgba(220, 220, 220, 0.2)'
        ],
        borderColor: [
          getColorByPercentage(animatedValue, 1),
          'rgba(220, 220, 220, 0.5)'
        ],
        borderWidth: 1,
        circumference: 180,
        rotation: 270,
      }
    ]
  };

  // Get color based on percentage (use our grayscale theme)
  function getColorByPercentage(percentage: number, alpha: number = 0.7) {
    // For grayscale, we'll make higher values darker
    const shade = Math.max(0, Math.min(255, 255 - Math.floor(percentage * 2.2)));
    return `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
  }

  return (
    <div className="bg-background-secondary p-4 rounded-lg shadow-sm border border-border">
      <h3 className="text-primary font-medium mb-2 text-center">{title}</h3>
      <div className="relative" style={{ height: 150 }}>
        <Doughnut
          data={data}
          options={{
            cutout: '80%',
            plugins: {
              tooltip: {
                enabled: false,
              },
              legend: {
                display: false,
              },
            },
            layout: {
              padding: 15,
            },
            maintainAspectRatio: false,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-primary">
            {Math.round(normalizedValue * (animatedValue / percentage || 1))}
          </span>
          <span className="text-sm text-secondary">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;