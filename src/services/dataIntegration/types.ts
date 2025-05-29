export type DataSourceType = 'crunchbase' | 'pitchbook' | 'cbinsights' | 'custom';

export interface DataSourceConfig {
  id: string;
  name: string;
  type: DataSourceType;
  apiKey?: string;
  baseUrl: string;
  endpoints: {
    [key: string]: string;
  };
  headers?: Record<string, string>;
  rateLimits?: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
}

export interface ScraperConfig {
  id: string;
  name: string;
  targetUrl: string;
  selectors: {
    [key: string]: string;
  };
  frequency: 'hourly' | 'daily' | 'weekly';
  cookies?: Record<string, string>;
  userAgent?: string;
  proxyConfig?: {
    host: string;
    port: number;
    auth?: {
      username: string;
      password: string;
    };
  };
}

export interface ETLJobConfig {
  id: string;
  name: string;
  sourceType: 'api' | 'scraper' | 'file';
  sourceId: string;
  transformations: Transformation[];
  outputFormat: 'json' | 'csv';
  destination: 'database' | 'file';
  destinationPath?: string;
}

export type TransformationType = 
  | 'filter'
  | 'map'
  | 'normalize'
  | 'deduplicate'
  | 'enrich'
  | 'merge';

export interface Transformation {
  type: TransformationType;
  config: any;
}

export interface ScheduleConfig {
  id: string;
  jobType: 'api' | 'scraper' | 'etl' | 'all';
  jobId?: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  time?: string; // Format: 'HH:MM'
  dayOfWeek?: number; // 0-6, where 0 is Sunday
  enabled: boolean;
}

export interface FundingEvent {
  id: string;
  companyId: string;
  companyName: string;
  date: Date;
  type: 'seed' | 'series_a' | 'series_b' | 'series_c_plus' | 'acquisition' | 'ipo' | 'spac' | 'pe_buyout';
  amount: number;
  investors: string[];
  description: string;
  source: string;
  sourceUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: number;
    source: string;
    requestId?: string;
  };
}

export interface ConnectionStatus {
  connected: boolean;
  lastCheck: Date;
  error?: string;
  rateLimitRemaining?: number;
}