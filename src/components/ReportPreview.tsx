import React, { useState, useEffect } from 'react';
import { BarChart2, FileText, RefreshCw, ExternalLink, Clock } from 'lucide-react';
import InsightVisualization from './InsightVisualization';
import { reportService } from '../services/reportService';

interface ReportPreviewProps {
  format: 'bullet' | 'paragraph' | 'chart';
  includeVisuals: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ 
  format, 
  includeVisuals,
  frequency = 'weekly'
}) => {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<string>('');
  
  // Generate report preview based on format
  useEffect(() => {
    setLoading(true);
    
    // Use the report service to generate a sample report
    const reportContent = reportService.generateSampleReport({
      id: 'preview',
      userId: '1',
      format,
      frequency,
      delivery: 'in-app',
      includeVisuals,
      includeSources: true
    });
    
    // Simulate API delay
    setTimeout(() => {
      setPreviewData(reportContent);
      setLoading(false);
    }, 600);
  }, [format, includeVisuals, frequency]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 text-accent animate-spin mb-3" />
          <p className="text-primary">Generating report preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-primary">Report Preview</h3>
        <div className="flex items-center text-xs text-secondary">
          <FileText className="h-3.5 w-3.5 mr-1" />
          <span>{format.charAt(0).toUpperCase() + format.slice(1)} Format</span>
          <span className="mx-2">•</span>
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>{frequency.charAt(0).toUpperCase() + frequency.slice(1)} Frequency</span>
        </div>
      </div>
      
      <div className="bg-background-primary rounded-lg border border-border p-6">
        {format === 'chart' ? (
          <div>
            <h2 className="text-xl font-bold text-primary mb-4">
              {frequency === 'daily' ? 'Daily' : frequency === 'weekly' ? 'Weekly' : 'Monthly'} Funding & M&A Update ({new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})
            </h2>
            
            {includeVisuals && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-primary mb-2">Funding Distribution by Industry</h3>
                <p className="text-secondary text-sm mb-3">AI/ML leads with $580M across 8 deals, followed by FinTech and ClimateTech</p>
                <InsightVisualization type="funding" />
              </div>
            )}
            
            {includeVisuals && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-primary mb-2">Deal Activity Timeline</h3>
                <p className="text-secondary text-sm mb-3">Series B rounds dominated early in the week, with acquisitions concentrated on Thursday-Friday</p>
                <InsightVisualization type="timeline" />
              </div>
            )}
            
            <div className="mt-4">
              <h3 className="text-lg font-medium text-primary mb-2">Key Highlights</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="h-5 w-5 text-accent mr-2">•</span>
                  <span>QuantumAI Solutions: $120M Series C (Sequoia Capital)</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 text-accent mr-2">•</span>
                  <span>ClimateGuard Technologies: $85M Series B (Breakthrough Energy Ventures)</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 text-accent mr-2">•</span>
                  <span>TechVision acquisition of DataSight Analytics for $980M</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: previewData?.replace(/\n/g, '<br>') }} />
            
            {format === 'bullet' && includeVisuals && (
              <div className="mt-6">
                <h3>Funding Distribution by Sector</h3>
                <InsightVisualization type="funding" />
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
          <div className="text-xs text-secondary">
            This is a preview based on recent data in your focus areas
          </div>
          
          <button className="text-xs text-accent hover:text-accent/80 flex items-center">
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            View Full Report
          </button>
        </div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-amber-900/20 p-4 rounded-lg border border-yellow-100 dark:border-amber-800/20 text-sm text-yellow-800 dark:text-amber-200">
        <div className="flex items-start">
          <BarChart2 className="h-5 w-5 text-yellow-600 dark:text-amber-300 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            In a production environment, this report would be generated using real-time data from your specified focus areas and watchlist companies. The report would be delivered according to your selected frequency and format.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;