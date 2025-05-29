import { ETLJobConfig } from '../types';

export const defaultEtlJobs: ETLJobConfig[] = [
  {
    id: 'funding-rounds-etl',
    name: 'Funding Rounds ETL',
    sourceType: 'api',
    sourceId: 'crunchbase-api',
    transformations: [
      {
        type: 'filter',
        config: {
          field: 'round_type',
          operator: 'in',
          value: ['seed', 'series_a', 'series_b', 'series_c', 'series_d', 'series_e']
        }
      },
      {
        type: 'map',
        config: {
          mapping: {
            id: 'id',
            companyId: 'company_id',
            companyName: 'company_name',
            date: 'announced_date',
            type: 'round_type',
            amount: 'amount',
            investors: 'investors',
            description: 'description'
          }
        }
      },
      {
        type: 'normalize',
        config: {
          dateFields: ['date'],
          monetaryFields: ['amount']
        }
      },
      {
        type: 'deduplicate',
        config: {
          keyField: 'id'
        }
      }
    ],
    outputFormat: 'json',
    destination: 'database'
  },
  {
    id: 'acquisitions-etl',
    name: 'Acquisitions ETL',
    sourceType: 'api',
    sourceId: 'pitchbook-api',
    transformations: [
      {
        type: 'filter',
        config: {
          field: 'deal_type',
          operator: 'equals',
          value: 'acquisition'
        }
      },
      {
        type: 'map',
        config: {
          mapping: {
            id: 'id',
            companyId: 'acquired_company_id',
            companyName: 'acquired_company_name',
            acquirerId: 'acquirer_id',
            acquirerName: 'acquirer_name',
            date: 'announced_date',
            type: 'acquisition',
            amount: 'price',
            description: 'description'
          }
        }
      },
      {
        type: 'normalize',
        config: {
          dateFields: ['date'],
          monetaryFields: ['amount']
        }
      }
    ],
    outputFormat: 'json',
    destination: 'database'
  },
  {
    id: 'news-etl',
    name: 'News Articles ETL',
    sourceType: 'scraper',
    sourceId: 'techcrunch-scraper',
    transformations: [
      {
        type: 'map',
        config: {
          mapping: {
            id: 'url', // Use URL as ID
            title: 'title',
            date: 'date',
            content: 'content',
            url: 'url'
          }
        }
      },
      {
        type: 'normalize',
        config: {
          dateFields: ['date']
        }
      },
      {
        type: 'enrich',
        config: {
          source: 'internal'
        }
      }
    ],
    outputFormat: 'json',
    destination: 'database'
  }
];