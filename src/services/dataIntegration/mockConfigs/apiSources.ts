import { DataSourceConfig } from '../types';

export const defaultApiSources: DataSourceConfig[] = [
  {
    id: 'crunchbase-api',
    name: 'Crunchbase API',
    type: 'crunchbase',
    apiKey: '********',
    baseUrl: 'https://api.crunchbase.com/api/v4/',
    endpoints: {
      funding_rounds: 'funding-rounds',
      acquisitions: 'acquisitions',
      companies: 'entities/organizations',
      investors: 'entities/investors'
    },
    headers: {
      'X-cb-user-key': '********'
    },
    rateLimits: {
      requestsPerMinute: 25,
      requestsPerDay: 2500
    }
  },
  {
    id: 'pitchbook-api',
    name: 'PitchBook API',
    type: 'pitchbook',
    apiKey: '********',
    baseUrl: 'https://api.pitchbook.com/v1/',
    endpoints: {
      deals: 'deals',
      companies: 'companies',
      investors: 'investors'
    },
    headers: {
      'Authorization': 'Bearer ********'
    },
    rateLimits: {
      requestsPerMinute: 30,
      requestsPerDay: 5000
    }
  },
  {
    id: 'cbinsights-api',
    name: 'CB Insights API',
    type: 'cbinsights',
    apiKey: '********',
    baseUrl: 'https://api.cbinsights.com/v2/',
    endpoints: {
      funding_rounds: 'funding-rounds',
      acquisitions: 'acquisitions',
      companies: 'companies',
      investors: 'investors'
    },
    headers: {
      'X-API-Key': '********'
    },
    rateLimits: {
      requestsPerMinute: 20,
      requestsPerDay: 1500
    }
  }
];