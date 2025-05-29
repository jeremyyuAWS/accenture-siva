import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeDataIntegration } from './index';
import { DataSourceConfig, ScraperConfig, ETLJobConfig, ScheduleConfig } from './types';
import { defaultApiSources } from './mockConfigs/apiSources';
import { defaultScrapers } from './mockConfigs/scrapers';
import { defaultEtlJobs } from './mockConfigs/etlJobs';
import { defaultSchedules } from './mockConfigs/schedules';

// Define the context type
interface DataIntegrationContextType {
  isInitialized: boolean;
  isRunning: boolean;
  lastRefreshTime?: Date;
  apiSources: DataSourceConfig[];
  scrapers: ScraperConfig[];
  etlJobs: ETLJobConfig[];
  schedules: ScheduleConfig[];
  
  startIntegration: () => void;
  stopIntegration: () => void;
  runNow: (scheduleId: string) => void;
  refreshConnectionStatus: () => Promise<void>;
  getStatusSummary: () => any;
}

// Create the context
const DataIntegrationContext = createContext<DataIntegrationContextType | undefined>(undefined);

// Provider component
export const DataIntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | undefined>(undefined);
  const [apiSources, setApiSources] = useState<DataSourceConfig[]>(defaultApiSources);
  const [scrapers, setScrapers] = useState<ScraperConfig[]>(defaultScrapers);
  const [etlJobs, setEtlJobs] = useState<ETLJobConfig[]>(defaultEtlJobs);
  const [schedules, setSchedules] = useState<ScheduleConfig[]>(defaultSchedules);
  const [services, setServices] = useState<any>(null);

  // Initialize services
  useEffect(() => {
    const initServices = async () => {
      try {
        const initializedServices = initializeDataIntegration(apiSources, scrapers, etlJobs, schedules);
        setServices(initializedServices);
        setIsInitialized(true);
        console.log('Data integration services initialized');
      } catch (error) {
        console.error('Failed to initialize data integration services:', error);
      }
    };

    initServices();
    
    // Listen for data refresh events
    const handleDataRefresh = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Data refresh event:', customEvent.detail);
      setLastRefreshTime(new Date(customEvent.detail.timestamp));
    };
    
    document.addEventListener('dataRefresh', handleDataRefresh);
    
    return () => {
      document.removeEventListener('dataRefresh', handleDataRefresh);
      if (services?.scheduler) {
        services.scheduler.stop();
      }
    };
  }, []);
  
  // Start integration
  const startIntegration = () => {
    if (!isInitialized || isRunning) return;
    
    services.scheduler.start();
    setIsRunning(true);
    setLastRefreshTime(new Date());
    console.log('Data integration services started');
  };
  
  // Stop integration
  const stopIntegration = () => {
    if (!isInitialized || !isRunning) return;
    
    services.scheduler.stop();
    setIsRunning(false);
    console.log('Data integration services stopped');
  };
  
  // Run a specific schedule now
  const runNow = (scheduleId: string) => {
    if (!isInitialized) return;
    
    services.scheduler.runNow(scheduleId);
    setLastRefreshTime(new Date());
  };
  
  // Refresh connection status for all API sources
  const refreshConnectionStatus = async () => {
    if (!isInitialized) return;
    
    for (const connector of services.apiConnectors) {
      await connector.checkConnection();
    }
  };
  
  // Get status summary for all services
  const getStatusSummary = () => {
    if (!isInitialized) return null;
    
    return {
      apiConnectors: services.apiConnectors.map((connector: any) => ({
        name: connector.getConfig().name,
        status: connector.getStatus()
      })),
      webScrapers: services.webScrapers.map((scraper: any) => ({
        name: scraper.getConfig().name,
        status: scraper.getStatus()
      })),
      etlPipelines: services.etlPipelines.map((pipeline: any) => ({
        name: pipeline.getConfig().name,
        status: pipeline.getStatus()
      })),
      scheduler: services.scheduler.getStatus()
    };
  };

  // Expose the context value
  const contextValue: DataIntegrationContextType = {
    isInitialized,
    isRunning,
    lastRefreshTime,
    apiSources,
    scrapers,
    etlJobs,
    schedules,
    startIntegration,
    stopIntegration,
    runNow,
    refreshConnectionStatus,
    getStatusSummary
  };

  return (
    <DataIntegrationContext.Provider value={contextValue}>
      {children}
    </DataIntegrationContext.Provider>
  );
};

// Custom hook for using the data integration context
export const useDataIntegration = () => {
  const context = useContext(DataIntegrationContext);
  if (context === undefined) {
    throw new Error('useDataIntegration must be used within a DataIntegrationProvider');
  }
  return context;
};