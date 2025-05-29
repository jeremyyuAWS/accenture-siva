import React from 'react';
import { useDataIntegration } from '../services/dataIntegration/DataIntegrationService';
import { RefreshCw, Clock, AlertTriangle } from 'lucide-react';

interface IntegrationStatusPanelProps {
  minimal?: boolean;
}

const IntegrationStatusPanel: React.FC<IntegrationStatusPanelProps> = ({ minimal = false }) => {
  const {
    isInitialized,
    isRunning,
    lastRefreshTime,
    startIntegration,
    stopIntegration,
    refreshConnectionStatus
  } = useDataIntegration();
  
  if (!isInitialized) {
    return null;
  }
  
  if (minimal) {
    return (
      <div className="bg-background-secondary rounded-lg p-3 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isRunning ? (
              <>
                <span className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm text-primary">Data Integration Active</span>
              </>
            ) : (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-gray-400 mr-2"></span>
                <span className="text-sm text-secondary">Data Integration Paused</span>
              </>
            )}
          </div>
          
          {lastRefreshTime && (
            <div className="text-xs text-secondary flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last update: {lastRefreshTime.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary rounded-lg p-4 border border-border">
      <h3 className="text-sm font-medium text-primary mb-3">Data Integration Status</h3>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {isRunning ? (
            <>
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-600">Integration Active</span>
            </>
          ) : (
            <>
              <span className="h-3 w-3 rounded-full bg-gray-400 mr-2"></span>
              <span className="text-sm font-medium text-secondary">Integration Paused</span>
            </>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => refreshConnectionStatus()}
            className="p-1 text-secondary hover:text-primary"
            title="Refresh Status"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          {isRunning ? (
            <button
              onClick={() => stopIntegration()}
              className="text-xs px-2 py-1 border border-border rounded hover:bg-background-primary"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={() => startIntegration()}
              className="text-xs px-2 py-1 bg-black text-white rounded hover:bg-gray-800"
            >
              Start
            </button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="text-xs flex justify-between">
          <span className="text-secondary">API Data Sources</span>
          <span className="text-primary font-medium">3 Connected</span>
        </div>
        
        <div className="text-xs flex justify-between">
          <span className="text-secondary">Web Scrapers</span>
          <span className="text-primary font-medium">3 Active</span>
        </div>
        
        <div className="text-xs flex justify-between">
          <span className="text-secondary">ETL Pipelines</span>
          <span className="text-primary font-medium">3 Running</span>
        </div>
        
        {lastRefreshTime && (
          <div className="text-xs flex justify-between pt-1 border-t border-border">
            <span className="text-secondary">Last Data Refresh</span>
            <span className="text-primary">{lastRefreshTime.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-xs text-amber-800 dark:text-amber-200 flex items-start">
        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mr-1.5 mt-0.5" />
        <span>PitchBook API rate limit at 75% - next reset in 4 hours</span>
      </div>
    </div>
  );
};

export default IntegrationStatusPanel;