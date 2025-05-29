import { ETLJobConfig, Transformation, FundingEvent } from './types';

/**
 * Class for Extract, Transform, Load pipeline to process funding data
 */
export class ETLPipeline {
  private config: ETLJobConfig;
  private status: 'idle' | 'running' | 'completed' | 'error' = 'idle';
  private progress: number = 0;
  private error?: string;
  private lastRun?: Date;
  private processedRecords: number = 0;

  constructor(config: ETLJobConfig) {
    this.config = config;
  }

  /**
   * Simulate running the ETL pipeline
   */
  async run(data: any[]): Promise<{ success: boolean; processedRecords: number; error?: string }> {
    this.status = 'running';
    this.progress = 0;
    this.error = undefined;
    this.processedRecords = 0;
    
    console.log(`Running ETL job: ${this.config.name}...`);
    
    try {
      // 1. Extract (data is already provided)
      console.log(`Extracted ${data.length} records`);
      this.progress = 25;
      await this.simulateDelay(500);
      
      // 2. Transform
      let transformedData = [...data];
      
      for (const transformation of this.config.transformations) {
        transformedData = await this.applyTransformation(transformedData, transformation);
        this.progress += 10;
        await this.simulateDelay(300);
      }
      
      console.log(`Transformed data: ${transformedData.length} records`);
      this.progress = 75;
      
      // 3. Load
      this.processedRecords = transformedData.length;
      console.log(`Loaded ${this.processedRecords} records to ${this.config.destination}`);
      
      this.progress = 100;
      this.status = 'completed';
      this.lastRun = new Date();
      
      return {
        success: true,
        processedRecords: this.processedRecords
      };
      
    } catch (err) {
      this.status = 'error';
      this.error = err instanceof Error ? err.message : 'Unknown error during ETL process';
      console.error(`ETL job failed: ${this.error}`);
      
      return {
        success: false,
        processedRecords: 0,
        error: this.error
      };
    }
  }
  
  /**
   * Apply a transformation to the data
   */
  private async applyTransformation(data: any[], transformation: Transformation): Promise<any[]> {
    switch (transformation.type) {
      case 'filter':
        return data.filter(item => {
          // Apply filter conditions from transformation.config
          if (transformation.config.field && transformation.config.value) {
            return item[transformation.config.field] === transformation.config.value;
          }
          return true;
        });
        
      case 'map':
        return data.map(item => {
          // Map fields according to transformation.config.mapping
          if (transformation.config.mapping) {
            const result: Record<string, any> = {};
            for (const [targetField, sourceField] of Object.entries(transformation.config.mapping)) {
              result[targetField] = item[sourceField as string];
            }
            return result;
          }
          return item;
        });
        
      case 'normalize':
        return data.map(item => {
          // Normalize fields to standard format
          const normalized = { ...item };
          
          // Normalize dates to ISO format
          if (transformation.config.dateFields) {
            for (const field of transformation.config.dateFields) {
              if (normalized[field]) {
                normalized[field] = new Date(normalized[field]).toISOString();
              }
            }
          }
          
          // Normalize monetary values
          if (transformation.config.monetaryFields) {
            for (const field of transformation.config.monetaryFields) {
              if (normalized[field]) {
                // Convert to number if it's a string with currency symbol
                if (typeof normalized[field] === 'string') {
                  normalized[field] = Number(normalized[field].replace(/[^0-9.-]+/g, ''));
                }
              }
            }
          }
          
          return normalized;
        });
        
      case 'deduplicate':
        // Remove duplicates based on key field(s)
        const keyField = transformation.config.keyField || 'id';
        const seen = new Set();
        return data.filter(item => {
          const key = item[keyField];
          if (seen.has(key)) {
            return false;
          }
          seen.add(key);
          return true;
        });
        
      case 'enrich':
        // Simulate enriching data with additional information
        return data.map(item => {
          // Example: add sentiment score, categorize by amount, etc.
          return {
            ...item,
            sentimentScore: Math.random() * 100,
            category: item.amount > 50000000 ? 'major' : 'minor',
            enriched: true,
            enrichmentSource: transformation.config.source || 'internal'
          };
        });
        
      case 'merge':
        // This would merge data from multiple sources
        // In a real implementation, we would have logic to match records
        return data;
        
      default:
        return data;
    }
  }
  
  /**
   * Helper method to simulate processing delay
   */
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Get current status of the ETL job
   */
  getStatus(): { status: string; progress: number; lastRun?: Date; processedRecords: number; error?: string } {
    return {
      status: this.status,
      progress: this.progress,
      lastRun: this.lastRun,
      processedRecords: this.processedRecords,
      error: this.error
    };
  }
  
  /**
   * Convert raw funding data to standardized format
   * This is a helper method that would be used in a real implementation
   */
  convertToFundingEvents(rawData: any[]): FundingEvent[] {
    // Implementation would depend on the source data format
    // This is a simplified example
    return rawData.map(item => {
      return {
        id: item.id || `event_${Date.now()}`,
        companyId: item.company_id || item.companyId || '',
        companyName: item.company_name || item.companyName || '',
        date: new Date(item.date || item.announced_date || Date.now()),
        type: this.mapEventType(item.round_type || item.type || ''),
        amount: Number(item.amount || 0),
        investors: Array.isArray(item.investors) ? item.investors : [],
        description: item.description || '',
        source: this.config.name,
        sourceUrl: item.url
      };
    });
  }
  
  /**
   * Map various funding round types to standardized types
   */
  private mapEventType(type: string): FundingEvent['type'] {
    type = type.toLowerCase();
    
    if (type.includes('seed')) return 'seed';
    if (type.includes('series a')) return 'series_a';
    if (type.includes('series b')) return 'series_b';
    if (type.includes('series c') || type.includes('series d') || 
        type.includes('series e') || type.includes('late stage')) return 'series_c_plus';
    if (type.includes('acquisition') || type.includes('acquired')) return 'acquisition';
    if (type.includes('ipo')) return 'ipo';
    if (type.includes('spac')) return 'spac';
    if (type.includes('buyout') || type.includes('private equity')) return 'pe_buyout';
    
    return 'seed'; // Default fallback
  }
  
  /**
   * Get configuration for this ETL pipeline
   */
  getConfig(): ETLJobConfig {
    return { ...this.config };
  }
}