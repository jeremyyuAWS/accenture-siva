import React, { useState, useEffect } from 'react';
import { X, Check, FileText, CalendarDays, Mail, Clock, BarChart2, LayoutList, FileIcon, RefreshCw } from 'lucide-react';
import CompanyWatchlistInput from './CompanyWatchlistInput';
import ReportPreview from './ReportPreview';
import { reportService } from '../services/reportService';

interface ReportSettingsModalProps {
  onClose: () => void;
}

const ReportSettingsModal: React.FC<ReportSettingsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'preview' | 'watchlist' | 'history'>('settings');
  const [formData, setFormData] = useState({
    id: '',
    userId: '1', // Mock user ID
    format: 'bullet',
    frequency: 'weekly',
    delivery: 'in-app',
    emailAddress: '',
    includeVisuals: true,
    includeSources: true
  });
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportHistory, setReportHistory] = useState<any[]>([]);
  const [upcomingReports, setUpcomingReports] = useState<any[]>([]);
  
  // Load existing report settings and history on mount
  useEffect(() => {
    // Get report settings for current user
    const settings = reportService.getReportSettings('1');
    if (settings.length > 0) {
      // Use the first report settings
      setFormData({
        ...settings[0],
        emailAddress: settings[0].emailAddress || ''
      });
    }
    
    // Get report history
    setReportHistory(reportService.getReportHistory('1'));
    
    // Get upcoming reports
    setUpcomingReports(reportService.getReportQueue('1'));
  }, []);
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      
      // Save report settings
      const savedSettings = reportService.saveReportSetting(formData);
      
      // Schedule next report
      reportService.scheduleNextReport(savedSettings.id);
      
      // In a real implementation, this would save the watchlist as well
      console.log('Saving watchlist:', selectedCompanies);
      
      // Update report queue
      setUpcomingReports(reportService.getReportQueue('1'));
      
      // Simulate API delay
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving report settings:', error);
      setIsSaving(false);
      alert('Failed to save report settings. Please try again.');
    }
  };
  
  const handleGenerateNow = async () => {
    try {
      setIsGenerating(true);
      
      // Save settings first if this is a new report
      if (!formData.id) {
        const savedSettings = reportService.saveReportSetting(formData);
        setFormData(prev => ({ ...prev, id: savedSettings.id }));
      }
      
      // Generate report
      await reportService.generateReport(formData.id);
      
      // Update report history
      setReportHistory(reportService.getReportHistory('1'));
      
      setTimeout(() => {
        setIsGenerating(false);
        setActiveTab('history');
      }, 1000);
    } catch (error) {
      console.error('Error generating report:', error);
      setIsGenerating(false);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 bg-black text-white flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Report Builder Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'settings'
                  ? 'border-accent text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              Report Settings
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'watchlist'
                  ? 'border-accent text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              Company Watchlist
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'preview'
                  ? 'border-accent text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              Report Preview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'history'
                  ? 'border-accent text-primary'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              Report History
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-primary mb-4">Report Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.format === 'bullet'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:bg-background-primary'
                    }`}
                    onClick={() => updateFormData('format', 'bullet')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <LayoutList className="h-5 w-5 text-primary" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.format === 'bullet'
                          ? 'border-accent'
                          : 'border-border'
                      }`}>
                        {formData.format === 'bullet' && <Check className="h-3 w-3 text-accent" />}
                      </div>
                    </div>
                    <h4 className="font-medium text-primary">Bullet Points</h4>
                    <p className="text-secondary text-sm mt-1">
                      Concise, scannable summaries of key events
                    </p>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.format === 'paragraph'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:bg-background-primary'
                    }`}
                    onClick={() => updateFormData('format', 'paragraph')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <FileIcon className="h-5 w-5 text-primary" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.format === 'paragraph'
                          ? 'border-accent'
                          : 'border-border'
                      }`}>
                        {formData.format === 'paragraph' && <Check className="h-3 w-3 text-accent" />}
                      </div>
                    </div>
                    <h4 className="font-medium text-primary">Paragraphs</h4>
                    <p className="text-secondary text-sm mt-1">
                      Detailed narrative with context and analysis
                    </p>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.format === 'chart'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:bg-background-primary'
                    }`}
                    onClick={() => updateFormData('format', 'chart')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.format === 'chart'
                          ? 'border-accent'
                          : 'border-border'
                      }`}>
                        {formData.format === 'chart' && <Check className="h-3 w-3 text-accent" />}
                      </div>
                    </div>
                    <h4 className="font-medium text-primary">Visual Charts</h4>
                    <p className="text-secondary text-sm mt-1">
                      Data-rich visualizations with brief explanations
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-primary mb-4">Report Frequency</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.frequency === 'daily'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:bg-background-primary'
                    }`}
                    onClick={() => updateFormData('frequency', 'daily')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.frequency === 'daily'
                          ? 'border-accent'
                          : 'border-border'
                      }`}>
                        {formData.frequency === 'daily' && <Check className="h-3 w-3 text-accent" />}
                      </div>
                    </div>
                    <h4 className="font-medium text-primary">Daily</h4>
                    <p className="text-secondary text-sm mt-1">
                      Daily updates on new activity
                    </p>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.frequency === 'weekly'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:bg-background-primary'
                    }`}
                    onClick={() => updateFormData('frequency', 'weekly')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.frequency === 'weekly'
                          ? 'border-accent'
                          : 'border-border'
                      }`}>
                        {formData.frequency === 'weekly' && <Check className="h-3 w-3 text-accent" />}
                      </div>
                    </div>
                    <h4 className="font-medium text-primary">Weekly</h4>
                    <p className="text-secondary text-sm mt-1">
                      Weekly digest of key events
                    </p>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.frequency === 'monthly'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:bg-background-primary'
                    }`}
                    onClick={() => updateFormData('frequency', 'monthly')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.frequency === 'monthly'
                          ? 'border-accent'
                          : 'border-border'
                      }`}>
                        {formData.frequency === 'monthly' && <Check className="h-3 w-3 text-accent" />}
                      </div>
                    </div>
                    <h4 className="font-medium text-primary">Monthly</h4>
                    <p className="text-secondary text-sm mt-1">
                      Comprehensive monthly analysis
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-primary mb-4">Delivery Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.delivery === 'in-app'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:bg-background-primary'
                    }`}
                    onClick={() => updateFormData('delivery', 'in-app')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.delivery === 'in-app'
                          ? 'border-accent'
                          : 'border-border'
                      }`}>
                        {formData.delivery === 'in-app' && <Check className="h-3 w-3 text-accent" />}
                      </div>
                    </div>
                    <h4 className="font-medium text-primary">In-App</h4>
                    <p className="text-secondary text-sm mt-1">
                      Access reports directly in the application
                    </p>
                  </div>
                  
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      formData.delivery === 'email'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:bg-background-primary'
                    }`}
                    onClick={() => updateFormData('delivery', 'email')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.delivery === 'email'
                          ? 'border-accent'
                          : 'border-border'
                      }`}>
                        {formData.delivery === 'email' && <Check className="h-3 w-3 text-accent" />}
                      </div>
                    </div>
                    <h4 className="font-medium text-primary">Email</h4>
                    <p className="text-secondary text-sm mt-1">
                      Receive reports directly in your inbox
                    </p>
                  </div>
                </div>
                
                {formData.delivery === 'email' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-primary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => updateFormData('emailAddress', e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full p-2.5 border border-border rounded-md bg-background-primary text-primary"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-primary mb-4">Additional Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeVisuals"
                      checked={formData.includeVisuals}
                      onChange={(e) => updateFormData('includeVisuals', e.target.checked)}
                      className="h-4 w-4 border-border text-accent rounded focus:ring-accent"
                    />
                    <label htmlFor="includeVisuals" className="ml-2 text-sm text-primary">
                      Include data visualizations in reports
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeSources"
                      checked={formData.includeSources}
                      onChange={(e) => updateFormData('includeSources', e.target.checked)}
                      className="h-4 w-4 border-border text-accent rounded focus:ring-accent"
                    />
                    <label htmlFor="includeSources" className="ml-2 text-sm text-primary">
                      Include source links for each event
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-accent/5 rounded-lg border border-accent/10 p-4">
                <h4 className="text-sm font-medium text-primary mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1.5" />
                  Next Scheduled Report
                </h4>
                
                {upcomingReports.length > 0 ? (
                  <div className="text-sm text-primary">
                    <p>
                      Your next {formData.frequency} report will be delivered{' '}
                      <span className="font-medium">{upcomingReports[0].scheduledFor.toLocaleString()}</span>
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-primary">
                    <p>
                      Your first {formData.frequency} report will be scheduled after saving these settings.
                    </p>
                  </div>
                )}
                
                <div className="mt-3">
                  <button
                    onClick={handleGenerateNow}
                    disabled={isGenerating}
                    className="inline-flex items-center px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Generate Report Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'watchlist' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-primary mb-4">Company Watchlist</h3>
              <p className="text-secondary mb-4">
                Add specific companies to your watchlist to receive targeted reports about their funding, acquisitions, and other activities.
              </p>
              
              <CompanyWatchlistInput
                selectedCompanies={selectedCompanies}
                onCompaniesChange={setSelectedCompanies}
              />
            </div>
          )}
          
          {activeTab === 'preview' && (
            <ReportPreview 
              format={formData.format}
              includeVisuals={formData.includeVisuals}
              frequency={formData.frequency}
            />
          )}
          
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary mb-4">Report History</h3>
              
              {reportHistory.length > 0 ? (
                <div className="space-y-3">
                  {reportHistory.map((report, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-background-primary rounded-lg border border-border hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-primary">{report.title}</h4>
                          <p className="text-xs text-secondary mt-1">
                            Generated: {new Date(report.generatedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="px-2.5 py-1.5 text-xs bg-background-secondary border border-border rounded hover:bg-background-primary transition-colors"
                            onClick={() => setActiveTab('preview')}
                          >
                            Preview
                          </button>
                          <button
                            className="px-2.5 py-1.5 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
                            onClick={() => window.open('#', '_blank')}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-background-primary rounded-lg border border-border text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-primary mb-2">No Reports Yet</h4>
                  <p className="text-secondary mb-4">
                    You haven't generated any reports yet. Configure your settings and generate your first report.
                  </p>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Configure Reports
                  </button>
                </div>
              )}
              
              {upcomingReports.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-primary mb-3">Upcoming Reports</h4>
                  <div className="space-y-2">
                    {upcomingReports.map((report, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-background-primary rounded-md border border-border"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-primary">
                              {report.reportId === 'report-daily' ? 'Daily Report' : 
                               report.reportId === 'report-weekly' ? 'Weekly Report' : 'Monthly Report'}
                            </p>
                            <p className="text-xs text-secondary mt-0.5">
                              Scheduled for: {new Date(report.scheduledFor).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center text-xs text-accent">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>Scheduled</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-background-primary border-t border-border flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border text-primary rounded-md hover:bg-background-primary transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:bg-gray-400"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportSettingsModal;