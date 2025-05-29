import { DataSourceConfig, ScraperConfig, ETLJobConfig, ScheduleConfig } from './types';
import { ApiConnector } from './ApiConnector';
import { WebScraper } from './WebScraper';
import { ETLPipeline } from './ETLPipeline';
import { DataRefreshScheduler } from './DataRefreshScheduler';

// Export the main components
export {
  ApiConnector,
  WebScraper,
  ETLPipeline,
  DataRefreshScheduler
};

// Export a convenient function to initialize all data integration services
export const initializeDataIntegration = (
  apiSources: DataSourceConfig[],
  scrapers: ScraperConfig[],
  etlJobs: ETLJobConfig[],
  schedules: ScheduleConfig[]
) => {
  // Initialize API connectors
  const apiConnectors = apiSources.map(source => new ApiConnector(source));
  
  // Initialize web scrapers
  const webScrapers = scrapers.map(config => new WebScraper(config));
  
  // Initialize ETL pipelines
  const etlPipelines = etlJobs.map(job => new ETLPipeline(job));
  
  // Initialize data refresh scheduler
  const scheduler = new DataRefreshScheduler();
  schedules.forEach(schedule => {
    scheduler.addSchedule(schedule);
  });
  
  return {
    apiConnectors,
    webScrapers,
    etlPipelines,
    scheduler
  };
};