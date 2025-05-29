import { DataSourceConfig, ApiResponse, ConnectionStatus } from './types';

/**
 * Class for connecting to external funding data APIs
 * In a real implementation, this would handle authentication, rate limiting,
 * error handling, and actual API requests
 */
export class ApiConnector {
  private config: DataSourceConfig;
  private status: ConnectionStatus = {
    connected: false,
    lastCheck: new Date()
  };

  constructor(config: DataSourceConfig) {
    this.config = config;
    this.checkConnection();
  }

  /**
   * Simulate checking connection to the API
   */
  async checkConnection(): Promise<ConnectionStatus> {
    console.log(`Checking connection to ${this.config.name}...`);
    
    // Simulate API check with 90% success rate
    const success = Math.random() < 0.9;
    
    this.status = {
      connected: success,
      lastCheck: new Date(),
      error: success ? undefined : 'API key invalid or rate limit exceeded',
      rateLimitRemaining: success ? Math.floor(Math.random() * 1000) : 0
    };
    
    return this.status;
  }
  
  /**
   * Simulate fetching data from the API
   */
  async fetchData<T>(endpoint: string, params: Record<string, any> = {}): Promise<ApiResponse<T>> {
    if (!this.status.connected) {
      await this.checkConnection();
      if (!this.status.connected) {
        return {
          success: false,
          error: `Failed to connect to ${this.config.name}`,
          metadata: {
            timestamp: Date.now(),
            source: this.config.name
          }
        };
      }
    }
    
    console.log(`Fetching data from ${this.config.name} - ${endpoint}...`);
    
    // Build the URL
    const url = this.buildUrl(endpoint, params);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate 95% success rate for data fetching
    const success = Math.random() < 0.95;
    
    if (success) {
      // In a real implementation, we would actually call the API
      // For this simulation, we'll return mock data
      return {
        success: true,
        data: this.getMockData(endpoint) as unknown as T,
        metadata: {
          timestamp: Date.now(),
          source: this.config.name,
          requestId: `req_${Date.now()}`
        }
      };
    }
    
    return {
      success: false,
      error: 'API request failed or timed out',
      metadata: {
        timestamp: Date.now(),
        source: this.config.name,
        requestId: `req_${Date.now()}`
      }
    };
  }
  
  /**
   * Helper method to build the API URL with parameters
   */
  private buildUrl(endpoint: string, params: Record<string, any>): string {
    const baseUrl = this.config.baseUrl;
    const path = this.config.endpoints[endpoint] || endpoint;
    const url = new URL(path, baseUrl);
    
    // Add parameters to the URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    
    return url.toString();
  }
  
  /**
   * Get mock data for simulation purposes
   */
  private getMockData(endpoint: string): unknown {
    // Return different mock data based on the endpoint
    switch(endpoint) {
      case 'funding_rounds':
        return [
          {
            id: 'fr_123456',
            company_name: 'TechVision AI',
            company_id: 'c_987654',
            round_type: 'series_b',
            amount: 45000000,
            currency: 'USD',
            announced_date: '2025-07-02',
            investors: ['Sequoia Capital', 'Andreessen Horowitz', 'Y Combinator'],
            description: 'TechVision AI raised $45M in Series B funding to expand its computer vision technology.'
          },
          {
            id: 'fr_123457',
            company_name: 'GreenEnergy Solutions',
            company_id: 'c_987655',
            round_type: 'series_a',
            amount: 22000000,
            currency: 'USD',
            announced_date: '2025-07-01',
            investors: ['Breakthrough Energy Ventures', 'Khosla Ventures'],
            description: 'GreenEnergy Solutions secured $22M in Series A funding for sustainable energy storage technology.'
          }
        ];
      case 'acquisitions':
        return [
          {
            id: 'acq_123456',
            acquired_company_name: 'DataSight Analytics',
            acquired_company_id: 'c_987656',
            acquirer_name: 'TechVision Corp',
            acquirer_id: 'c_987657',
            price: 980000000,
            currency: 'USD',
            announced_date: '2025-07-03',
            description: 'TechVision Corp acquired DataSight Analytics for $980M to strengthen its data processing capabilities.'
          }
        ];
      default:
        return [];
    }
  }
  
  /**
   * Get current status of the API connection
   */
  getStatus(): ConnectionStatus {
    return this.status;
  }
  
  /**
   * Get configuration for this API connector
   */
  getConfig(): DataSourceConfig {
    return { ...this.config, apiKey: this.config.apiKey ? '****' : undefined };
  }
}