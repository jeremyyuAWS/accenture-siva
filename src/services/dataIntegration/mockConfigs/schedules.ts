import { ScheduleConfig } from '../types';

export const defaultSchedules: ScheduleConfig[] = [
  {
    id: 'funding-daily',
    jobType: 'api',
    jobId: 'crunchbase-api',
    frequency: 'daily',
    time: '06:00',
    enabled: true
  },
  {
    id: 'news-hourly',
    jobType: 'scraper',
    jobId: 'techcrunch-scraper',
    frequency: 'hourly',
    enabled: true
  },
  {
    id: 'process-funding-etl',
    jobType: 'etl',
    jobId: 'funding-rounds-etl',
    frequency: 'daily',
    time: '08:00',
    enabled: true
  },
  {
    id: 'process-acquisitions-etl',
    jobType: 'etl',
    jobId: 'acquisitions-etl',
    frequency: 'daily',
    time: '08:30',
    enabled: true
  },
  {
    id: 'sec-filings-daily',
    jobType: 'scraper',
    jobId: 'sec-filings-scraper',
    frequency: 'daily',
    time: '10:00',
    enabled: true
  }
];