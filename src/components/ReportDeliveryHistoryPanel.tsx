import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { FileText, Download, Calendar, BarChart2, ExternalLink, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const ReportDeliveryHistoryPanel: React.FC = () => {
  const [reportHistory, setReportHistory] = useState<any[]>([]);
  const [upcomingReports, setUpcomingReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandUpcoming, setExpandUpcoming] = useState(true);
  const [expandHistory, setExpandHistory] = useState(true);
  
  // Load report history and queue on mount
  useEffect(() => {
    setLoading(true);
    
    // Get report history for current user
    const history = reportService.getReportHistory('1');
    setReportHistory(history);
    
    // Get upcoming reports
    const queue = reportService.getReportQueue('1');
    setUpcomingReports(queue);
    
    setLoading(false);
  }, []);
  
  // Function to generate a report now
  const handleGenerateNow = async (reportId: string) => {
    try {
      // Generate report
      await reportService.generateReport(reportId);
      
      // Update report history and queue
      const history = reportService.getReportHistory('1');
      setReportHistory(history);
      
      const queue = reportService.getReportQueue('1');
      setUpcomingReports(queue);
      
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-background-secondary rounded-lg shadow-md p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-background-primary rounded w-1/3"></div>
          <div className="h-20 bg-background-primary rounded"></div>
          <div className="h-5 bg-background-primary rounded w-1/2"></div>
          <div className="h-32 bg-background-primary rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Report Delivery Center</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Access your scheduled reports and delivery history
        </p>
      </div>
      
      {/* Upcoming Reports */}
      <div className="border-b border-border">
        <div 
          className="p-4 bg-background-primary flex justify-between items-center cursor-pointer"
          onClick={() => setExpandUpcoming(!expandUpcoming)}
        >
          <h3 className="font-medium text-primary flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Reports
            {upcomingReports.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-accent/10 text-accent text-xs rounded">
                {upcomingReports.length}
              </span>
            )}
          </h3>
          {expandUpcoming ? (
            <ChevronUp className="h-4 w-4 text-secondary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-secondary" />
          )}
        </div>
        
        {expandUpcoming && (
          <div className="p-4">
            {upcomingReports.length > 0 ? (
              <div className="space-y-3">
                {upcomingReports.map((report, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-background-primary rounded-md border border-border flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-accent mr-1.5" />
                        <p className="text-sm font-medium text-primary">
                          {report.reportId === 'report-daily' ? 'Daily Report' : 
                          report.reportId === 'report-weekly' ? 'Weekly Report' : 'Monthly Report'}
                        </p>
                      </div>
                      <p className="text-xs text-secondary mt-1">
                        Scheduled for {new Date(report.scheduledFor).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleGenerateNow(report.reportId)}
                      className="px-2.5 py-1.5 text-xs bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors"
                    >
                      Generate Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-secondary">No upcoming reports scheduled</p>
                <button
                  onClick={() => {
                    // This would open the report settings modal in a real implementation
                    alert('This would open the report settings modal to schedule a new report');
                  }}
                  className="mt-3 px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Schedule a Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Report History */}
      <div>
        <div 
          className="p-4 bg-background-primary flex justify-between items-center cursor-pointer"
          onClick={() => setExpandHistory(!expandHistory)}
        >
          <h3 className="font-medium text-primary flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Report History
            {reportHistory.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-background-secondary text-primary text-xs rounded border border-border">
                {reportHistory.length}
              </span>
            )}
          </h3>
          {expandHistory ? (
            <ChevronUp className="h-4 w-4 text-secondary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-secondary" />
          )}
        </div>
        
        {expandHistory && (
          <div className="p-4">
            {reportHistory.length > 0 ? (
              <div className="space-y-3">
                {reportHistory.map((report, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-background-primary rounded-md border border-border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          {report.reportId === 'report-weekly' ? (
                            <BarChart2 className="h-4 w-4 text-accent mr-1.5" />
                          ) : (
                            <FileText className="h-4 w-4 text-accent mr-1.5" />
                          )}
                          <h4 className="text-sm font-medium text-primary">{report.title}</h4>
                        </div>
                        <p className="text-xs text-secondary mt-1">
                          Generated on {new Date(report.generatedAt).toLocaleDateString()} • {
                            report.reportId === 'report-daily' ? 'Daily Report' : 
                            report.reportId === 'report-weekly' ? 'Weekly Report' : 'Monthly Report'
                          }
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => window.open(report.url, '_blank')}
                          className="px-2.5 py-1 text-xs bg-black text-white rounded flex items-center"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-border">
                      <button
                        onClick={() => {
                          // This would open the report preview in a real implementation
                          alert('This would open the full report preview');
                        }}
                        className="text-xs text-accent hover:text-accent/80 flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Full Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-secondary">No report history found</p>
                <p className="text-secondary text-sm mt-1">
                  Reports will appear here after they are generated
                </p>
              </div>
            )}
            
            {reportHistory.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    // This would show all reports in a real implementation
                    alert('This would show all reports in a paginated view');
                  }}
                  className="text-sm text-accent hover:text-accent/80 flex items-center mx-auto"
                >
                  <span>View All Reports</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDeliveryHistoryPanel;