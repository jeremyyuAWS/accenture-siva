import React from 'react';
import { BarChart2, TrendingUp, Calendar, PieChart } from 'lucide-react';

interface GraphStatsPanelProps {
  stats: {
    nodeCount: number;
    edgeCount: number;
    fundingAmount: number;
    acquisitionAmount: number;
    eventCounts: Record<string, number>;
    timeRange: { start: Date; end: Date };
  };
}

const GraphStatsPanel: React.FC<GraphStatsPanelProps> = ({ stats }) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background-secondary">
      <div className="p-3 bg-background-primary border-b border-border">
        <h3 className="font-medium text-primary flex items-center">
          <BarChart2 className="h-4 w-4 mr-1.5" />
          Graph Statistics
        </h3>
      </div>
      
      <div className="p-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div className="p-2 bg-background-primary rounded-md border border-border">
            <div className="text-xs text-secondary">Nodes</div>
            <div className="text-lg font-medium text-primary">{stats.nodeCount}</div>
          </div>
          <div className="p-2 bg-background-primary rounded-md border border-border">
            <div className="text-xs text-secondary">Connections</div>
            <div className="text-lg font-medium text-primary">{stats.edgeCount}</div>
          </div>
          <div className="p-2 bg-background-primary rounded-md border border-border">
            <div className="text-xs text-secondary">Total Funding</div>
            <div className="text-lg font-medium text-primary">{formatCurrency(stats.fundingAmount)}</div>
          </div>
          <div className="p-2 bg-background-primary rounded-md border border-border">
            <div className="text-xs text-secondary">Acquisitions</div>
            <div className="text-lg font-medium text-primary">{formatCurrency(stats.acquisitionAmount)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-2">
              <PieChart className="h-4 w-4 mr-1.5 text-secondary" />
              <div className="text-sm font-medium text-primary">Event Distribution</div>
            </div>
            <div className="bg-background-primary p-2 rounded-md border border-border">
              <div className="space-y-2">
                {Object.entries(stats.eventCounts).map(([eventType, count]) => (
                  <div key={eventType} className="flex justify-between items-center">
                    <div className="text-xs text-primary">{formatEventType(eventType)}</div>
                    <div className="text-xs font-medium text-primary">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-1.5 text-secondary" />
              <div className="text-sm font-medium text-primary">Time Range</div>
            </div>
            <div className="bg-background-primary p-2 rounded-md border border-border">
              <div className="flex justify-between">
                <div className="text-xs text-secondary">From</div>
                <div className="text-xs text-primary">{stats.timeRange.start.toLocaleDateString()}</div>
              </div>
              <div className="flex justify-between mt-1">
                <div className="text-xs text-secondary">To</div>
                <div className="text-xs text-primary">{stats.timeRange.end.toLocaleDateString()}</div>
              </div>
              <div className="mt-2 pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-secondary">Activity Trend</div>
                  <div className="flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">+24%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format event types for display
function formatEventType(eventType: string): string {
  switch(eventType) {
    case 'seed': return 'Seed Funding';
    case 'series_a': return 'Series A';
    case 'series_b': return 'Series B';
    case 'series_c_plus': return 'Series C+';
    case 'acquisition': return 'Acquisitions';
    case 'ipo': return 'IPO';
    case 'spac': return 'SPAC';
    case 'pe_buyout': return 'PE Buyout';
    default: return eventType.charAt(0).toUpperCase() + eventType.slice(1).replace(/_/g, ' ');
  }
}

export default GraphStatsPanel;