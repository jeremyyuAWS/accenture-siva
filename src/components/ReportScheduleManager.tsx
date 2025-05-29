import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { Calendar, Clock, FileText, BarChart2, FileIcon, RefreshCw, X, Check, Settings } from 'lucide-react';

const ReportScheduleManager: React.FC = () => {
  const [reportSettings, setReportSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  
  // Load report settings on mount
  useEffect(() => {
    setLoading(true);
    
    // Get report settings for current user
    const settings = reportService.getReportSettings('1');
    setReportSettings(settings);
    
    setLoading(false);
  }, []);
  
  // Start editing a report
  const handleEdit = (reportId: string) => {
    const report = reportSettings.find(r => r.id === reportId);
    if (report) {
      setEditingReport(reportId);
      setEditForm({
        ...report,
        emailAddress: report.emailAddress || ''
      });
    }
  };
  
  // Save edited report
  const handleSave = () => {
    try {
      // Save report settings
      reportService.saveReportSetting(editForm);
      
      // Update local state
      setReportSettings(reportService.getReportSettings('1'));
      
      // Close edit form
      setEditingReport(null);
      setEditForm(null);
      
      // Show success message
      alert('Report settings updated successfully!');
    } catch (error) {
      console.error('Error saving report settings:', error);
      alert('Failed to update report settings. Please try again.');
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    setEditingReport(null);
    setEditForm(null);
  };
  
  // Update form data
  const updateFormData = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Delete a report
  const handleDelete = (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report schedule?')) {
      try {
        reportService.deleteReportSetting(reportId);
        setReportSettings(reportService.getReportSettings('1'));
        alert('Report schedule deleted successfully!');
      } catch (error) {
        console.error('Error deleting report schedule:', error);
        alert('Failed to delete report schedule. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-background-secondary rounded-lg shadow-md p-4">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin h-8 w-8 text-accent mr-3" />
          <p className="text-primary">Loading report schedules...</p>
        </div>
      </div>
    );
  }

  // Format based on report format
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'bullet':
        return <BarChart2 className="h-4 w-4 text-accent" />;
      case 'paragraph':
        return <FileText className="h-4 w-4 text-primary" />;
      case 'chart':
        return <BarChart2 className="h-4 w-4 text-blue-500" />;
      default:
        return <FileIcon className="h-4 w-4 text-primary" />;
    }
  };
  
  // Format frequency for display
  const formatFrequency = (frequency: string): string => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Report Schedule Manager</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Configure and manage your scheduled reports
        </p>
      </div>
      
      <div className="p-4">
        {reportSettings.length > 0 ? (
          <div className="space-y-4">
            {reportSettings.map((report) => (
              <div 
                key={report.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                {editingReport === report.id ? (
                  // Edit form
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-primary mb-4">Edit Report Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          Report Format
                        </label>
                        <select
                          value={editForm.format}
                          onChange={(e) => updateFormData('format', e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                        >
                          <option value="bullet">Bullet Points</option>
                          <option value="paragraph">Paragraphs</option>
                          <option value="chart">Visual Charts</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          Frequency
                        </label>
                        <select
                          value={editForm.frequency}
                          onChange={(e) => updateFormData('frequency', e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          Delivery Method
                        </label>
                        <select
                          value={editForm.delivery}
                          onChange={(e) => updateFormData('delivery', e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                        >
                          <option value="in-app">In-App</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                      
                      {editForm.delivery === 'email' && (
                        <div>
                          <label className="block text-sm font-medium text-primary mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={editForm.emailAddress}
                            onChange={(e) => updateFormData('emailAddress', e.target.value)}
                            placeholder="Enter email address"
                            className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="includeVisuals"
                          checked={editForm.includeVisuals}
                          onChange={(e) => updateFormData('includeVisuals', e.target.checked)}
                          className="h-4 w-4 border-border text-accent rounded focus:ring-accent"
                        />
                        <label htmlFor="includeVisuals" className="ml-2 text-sm text-primary">
                          Include visualizations
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="includeSources"
                          checked={editForm.includeSources}
                          onChange={(e) => updateFormData('includeSources', e.target.checked)}
                          className="h-4 w-4 border-border text-accent rounded focus:ring-accent"
                        />
                        <label htmlFor="includeSources" className="ml-2 text-sm text-primary">
                          Include source links
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-background-primary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="p-4 bg-background-primary border-b border-border">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {report.frequency === 'daily' ? (
                            <Clock className="h-5 w-5 text-primary mr-2" />
                          ) : report.frequency === 'weekly' ? (
                            <Calendar className="h-5 w-5 text-primary mr-2" />
                          ) : (
                            <Calendar className="h-5 w-5 text-primary mr-2" />
                          )}
                          <h3 className="font-medium text-primary">{formatFrequency(report.frequency)} Report</h3>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(report.id)}
                            className="p-1 text-secondary hover:text-primary"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="p-1 text-secondary hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-background-primary p-3 rounded-md border border-border">
                          <div className="flex items-center mb-1">
                            {getFormatIcon(report.format)}
                            <span className="text-xs font-medium text-primary ml-1.5">Format</span>
                          </div>
                          <p className="text-sm text-primary">
                            {report.format === 'bullet' ? 'Bullet Points' : 
                             report.format === 'paragraph' ? 'Paragraphs' : 'Visual Charts'}
                          </p>
                        </div>
                        
                        <div className="bg-background-primary p-3 rounded-md border border-border">
                          <div className="flex items-center mb-1">
                            <Clock className="h-4 w-4 text-secondary" />
                            <span className="text-xs font-medium text-primary ml-1.5">Frequency</span>
                          </div>
                          <p className="text-sm text-primary">{formatFrequency(report.frequency)}</p>
                        </div>
                        
                        <div className="bg-background-primary p-3 rounded-md border border-border">
                          <div className="flex items-center mb-1">
                            <FileText className="h-4 w-4 text-secondary" />
                            <span className="text-xs font-medium text-primary ml-1.5">Delivery</span>
                          </div>
                          <p className="text-sm text-primary">
                            {report.delivery === 'in-app' ? 'In-App' : `Email (${report.emailAddress})`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center text-xs text-secondary">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {report.lastDelivery ? (
                            <span>Last delivery: {new Date(report.lastDelivery).toLocaleString()}</span>
                          ) : (
                            <span>No reports delivered yet</span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // This would preview the report in a real implementation
                              alert('This would show a preview of the report');
                            }}
                            className="px-2.5 py-1 text-xs border border-border rounded hover:bg-background-primary"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => {
                              // This would generate the report immediately
                              handleGenerateNow(report.id);
                            }}
                            className="px-2.5 py-1 text-xs bg-black text-white rounded hover:bg-gray-800"
                          >
                            Generate Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-primary mb-2">No Reports Scheduled</h3>
            <p className="text-secondary max-w-md mx-auto mb-4">
              You haven't configured any report schedules yet. Set up a new report to receive regular updates on your focus areas.
            </p>
            <button
              onClick={() => {
                // This would open the report settings modal in a real implementation
                alert('This would open the report settings modal to create a new report schedule');
              }}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Create Report Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
  // Helper function to generate a report immediately
  async function handleGenerateNow(reportId: string) {
    try {
      // Generate the report
      await reportService.generateReport(reportId);
      
      // Update report settings to refresh lastDelivery
      setReportSettings(reportService.getReportSettings('1'));
      
      // Show success message
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  }
};

export default ReportScheduleManager;