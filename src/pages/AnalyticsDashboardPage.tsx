import React from 'react';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import { BarChart2 } from 'lucide-react';

const AnalyticsDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-black text-white">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            Interactive analytics for funding and M&A activity
          </p>
        </div>
      </div>
      
      <AnalyticsDashboard />
    </div>
  );
};

export default AnalyticsDashboardPage;