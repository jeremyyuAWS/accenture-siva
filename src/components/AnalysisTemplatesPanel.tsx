import React from 'react';
import { FileSpreadsheet, PieChart, Calendar, TrendingUp, AlignRight, Activity } from 'lucide-react';

interface AnalysisTemplatesPanelProps {
  onSelectTemplate: (template: string) => void;
}

const AnalysisTemplatesPanel: React.FC<AnalysisTemplatesPanelProps> = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 'market-summary',
      title: 'Market Summary',
      description: 'Overview of recent funding and M&A activity in your focus areas',
      icon: <PieChart className="h-5 w-5" />,
      query: 'Generate a market summary of recent funding and M&A activity in my focus areas'
    },
    {
      id: 'weekly-digest',
      title: 'Weekly Digest',
      description: 'Summary of deals and events from the past 7 days',
      icon: <Calendar className="h-5 w-5" />,
      query: 'What deals happened in my watchlist this week?'
    },
    {
      id: 'funding-trends',
      title: 'Funding Trends',
      description: 'Analysis of funding patterns and investment trends',
      icon: <TrendingUp className="h-5 w-5" />,
      query: 'Show me a visualization of recent funding trends by industry'
    },
    {
      id: 'acquisition-landscape',
      title: 'Acquisition Landscape',
      description: 'Overview of recent acquisitions and strategic buyers',
      icon: <Activity className="h-5 w-5" />,
      query: "Who's acquiring startups in my focus areas and why?"
    },
    {
      id: 'investor-analysis',
      title: 'Investor Analysis',
      description: 'Profile of most active investors in your focus areas',
      icon: <FileSpreadsheet className="h-5 w-5" />,
      query: 'Who are the most active investors in my focus areas and what are their investment strategies?'
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'Concise overview for stakeholder presentations',
      icon: <AlignRight className="h-5 w-5" />,
      query: 'Generate an executive summary of market activity for a stakeholder presentation'
    }
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-primary mb-3">Analysis Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.query)}
            className="p-3 bg-background-secondary border border-border rounded-md text-left hover:bg-accent/5 transition-colors group"
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-2 group-hover:bg-accent/20 transition-colors">
                {template.icon}
              </div>
              <div className="font-medium text-primary">{template.title}</div>
            </div>
            <p className="text-xs text-secondary line-clamp-2">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnalysisTemplatesPanel;