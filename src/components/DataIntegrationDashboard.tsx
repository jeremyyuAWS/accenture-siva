import React, { useState, useEffect } from 'react';
import { useDataIntegration } from '../services/dataIntegration/DataIntegrationService';
import { defaultSchedules } from '../services/dataIntegration/mockConfigs/schedules';
import { 
  Database, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  X, 
  Globe, 
  FileText, 
  Clock,
  Play,
  Pause,
  Settings
} from 'lucide-react';

const DataIntegrationDashboard: React.FC = () => {
  const {
    isInitialized,
    isRunning,
    lastRefreshTime,
    startIntegration,
    stopIntegration,
    runNow,
    refreshConnectionStatus,
    getStatusSummary
  } = useDataIntegration();
  
  const [statusSummary, setStatusSummary] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get status summary when component mounts or integration state changes
  useEffect(() => {
    if (isInitialized) {
      setStatusSummary(getStatusSummary());
    }
  }, [isInitialized, isRunning, lastRefreshTime, getStatusSummary]);
  
  // Handle refresh click
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshConnectionStatus();
    setStatusSummary(getStatusSummary());
    setRefreshing(false);
  };

  // Get status icon based on connection status
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'connected':
      case 'idle':
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <X className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // If not initialized, show loading state
  if (!isInitialized) {
    return (
      <div className="bg-background-secondary rounded-lg shadow-md p-6 flex items-center justify-center">
        <RefreshCw className="h-6 w-6 text-accent animate-spin mr-3" />
        <p className="text-primary">Initializing data integration services...</p>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Data Integration Hub</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Manage connections to external data sources for funding intelligence
        </p>
      </div>
      
      <div className="p-4 bg-background-primary border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isRunning ? (
              <div className="flex items-center text-green-600">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-medium">Integration Active</span>
              </div>
            ) : (
              <div className="flex items-center text-secondary">
                <span className="h-3 w-3 rounded-full bg-gray-400 mr-2"></span>
                <span>Integration Idle</span>
              </div>
            )}
            
            {lastRefreshTime && (
              <div className="text-sm text-secondary flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Last update: {lastRefreshTime.toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3 py-1.5 bg-background-secondary border border-border text-primary rounded-md hover:bg-background-primary transition-colors flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>
            
            {isRunning ? (
              <button
                onClick={stopIntegration}
                className="px-3 py-1.5 bg-background-secondary border border-border text-primary rounded-md hover:bg-background-primary transition-colors flex items-center"
              >
                <Pause className="h-4 w-4 mr-1.5" />
                Pause Integration
              </button>
            ) : (
              <button
                onClick={startIntegration}
                className="px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
              >
                <Play className="h-4 w-4 mr-1.5" />
                Start Integration
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Status Summary */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* API Connectors */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-3 bg-background-primary border-b border-border">
              <h3 className="font-medium text-primary flex items-center">
                <Database className="h-4 w-4 mr-1.5" />
                API Connectors
              </h3>
            </div>
            
            <div className="divide-y divide-border">
              {statusSummary?.apiConnectors?.map((connector: any, index: number) => (
                <div key={index} className="p-3 hover:bg-background-primary">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-primary">{connector.name}</div>
                    <div className="flex items-center">
                      {getStatusIcon(connector.status.connected ? 'connected' : 'error')}
                      <span className="ml-1.5 text-sm text-secondary">
                        {connector.status.connected ? 'Connected' : 'Error'}
                      </span>
                    </div>
                  </div>
                  
                  {connector.status.lastCheck && (
                    <div className="text-xs text-secondary mt-1">
                      Last check: {new Date(connector.status.lastCheck).toLocaleString()}
                    </div>
                  )}
                  
                  {connector.status.error && (
                    <div className="text-xs text-red-600 mt-1">
                      {connector.status.error}
                    </div>
                  )}
                  
                  {connector.status.rateLimitRemaining !== undefined && (
                    <div className="text-xs text-secondary mt-1">
                      Rate limit remaining: {connector.status.rateLimitRemaining}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Web Scrapers */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-3 bg-background-primary border-b border-border">
              <h3 className="font-medium text-primary flex items-center">
                <Globe className="h-4 w-4 mr-1.5" />
                Web Scrapers
              </h3>
            </div>
            
            <div className="divide-y divide-border">
              {statusSummary?.webScrapers?.map((scraper: any, index: number) => (
                <div key={index} className="p-3 hover:bg-background-primary">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-primary">{scraper.name}</div>
                    <div className="flex items-center">
                      {getStatusIcon(scraper.status.status)}
                      <span className="ml-1.5 text-sm text-secondary">
                        {scraper.status.status.charAt(0).toUpperCase() + scraper.status.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {scraper.status.lastScraped && (
                    <div className="text-xs text-secondary mt-1">
                      Last scraped: {new Date(scraper.status.lastScraped).toLocaleString()}
                    </div>
                  )}
                  
                  {scraper.status.error && (
                    <div className="text-xs text-red-600 mt-1">
                      {scraper.status.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* ETL Pipelines */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-3 bg-background-primary border-b border-border">
              <h3 className="font-medium text-primary flex items-center">
                <FileText className="h-4 w-4 mr-1.5" />
                ETL Pipelines
              </h3>
            </div>
            
            <div className="divide-y divide-border">
              {statusSummary?.etlPipelines?.map((pipeline: any, index: number) => (
                <div key={index} className="p-3 hover:bg-background-primary">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-primary">{pipeline.name}</div>
                    <div className="flex items-center">
                      {getStatusIcon(pipeline.status.status)}
                      <span className="ml-1.5 text-sm text-secondary">
                        {pipeline.status.status.charAt(0).toUpperCase() + pipeline.status.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {pipeline.status.lastRun && (
                    <div className="text-xs text-secondary mt-1">
                      Last run: {new Date(pipeline.status.lastRun).toLocaleString()}
                    </div>
                  )}
                  
                  {pipeline.status.processedRecords > 0 && (
                    <div className="text-xs text-secondary mt-1">
                      Processed records: {pipeline.status.processedRecords}
                    </div>
                  )}
                  
                  {pipeline.status.error && (
                    <div className="text-xs text-red-600 mt-1">
                      {pipeline.status.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scheduled Jobs */}
        <div className="mt-6 border border-border rounded-lg overflow-hidden">
          <div className="p-3 bg-background-primary border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-primary flex items-center">
              <Clock className="h-4 w-4 mr-1.5" />
              Scheduled Jobs
            </h3>
            <div className="text-sm text-secondary">
              {statusSummary?.scheduler?.running ? 'Scheduler active' : 'Scheduler inactive'}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-background-primary">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-secondary">Schedule ID</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-secondary">Job Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-secondary">Frequency</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-secondary">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {defaultSchedules.map((schedule, index) => (
                  <tr key={index} className="hover:bg-background-primary">
                    <td className="px-3 py-2 text-sm text-primary">{schedule.id}</td>
                    <td className="px-3 py-2 text-sm text-primary">
                      {schedule.jobType.charAt(0).toUpperCase() + schedule.jobType.slice(1)}
                      {schedule.jobId && ` - ${schedule.jobId}`}
                    </td>
                    <td className="px-3 py-2 text-sm text-primary">
                      {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
                      {schedule.time && ` at ${schedule.time}`}
                      {schedule.dayOfWeek !== undefined && ` (Day ${schedule.dayOfWeek})`}
                    </td>
                    <td className="px-3 py-2 text-sm text-primary">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full ${schedule.enabled ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                        {schedule.enabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-primary">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => runNow(schedule.id)}
                          className="p-1 text-secondary hover:text-primary"
                          title="Run Now"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-secondary hover:text-primary"
                          title="Configure"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Data Processing Logs */}
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-medium text-primary mb-3">Recent Processing Logs</h3>
        <div className="bg-background-primary p-3 rounded-lg border border-border max-h-36 overflow-y-auto font-mono text-xs text-secondary">
          <p>[{new Date().toISOString()}] Data refresh scheduler started</p>
          <p>[{new Date(Date.now() - 30000).toISOString()}] Connected to Crunchbase API</p>
          <p>[{new Date(Date.now() - 60000).toISOString()}] TechCrunch scraper completed - 12 articles processed</p>
          <p>[{new Date(Date.now() - 90000).toISOString()}] Running ETL job: Funding Rounds ETL</p>
          <p>[{new Date(Date.now() - 120000).toISOString()}] ETL job completed - 35 records processed</p>
          <p>[{new Date(Date.now() - 150000).toISOString()}] Refreshed knowledge graph with new data</p>
        </div>
      </div>
    </div>
  );
};

export default DataIntegrationDashboard;