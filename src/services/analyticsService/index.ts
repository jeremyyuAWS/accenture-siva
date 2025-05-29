import { FundingEvent } from '../../types';

/**
 * Service for generating analytics and insights from funding data
 */
export class AnalyticsService {
  private fundingEvents: FundingEvent[] = [];
  private lastUpdate: Date = new Date();
  
  constructor() {
    this.loadInitialData();
  }
  
  /**
   * Load initial mock data
   */
  private loadInitialData(): void {
    // Generate mock funding events for the past year
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    
    this.fundingEvents = this.generateMockFundingEvents(oneYearAgo, now, 200);
    this.lastUpdate = new Date();
  }
  
  /**
   * Generate mock funding events for a date range
   */
  private generateMockFundingEvents(startDate: Date, endDate: Date, count: number): FundingEvent[] {
    const events: FundingEvent[] = [];
    const startTime = startDate.getTime();
    const timeRange = endDate.getTime() - startTime;
    
    const companies = [
      { id: 'company_1', name: 'TechVision AI' },
      { id: 'company_2', name: 'GreenEnergy Solutions' },
      { id: 'company_3', name: 'FinSecure Platform' },
      { id: 'company_4', name: 'CloudSecure Inc' },
      { id: 'company_5', name: 'HealthTech Solutions' },
      { id: 'company_6', name: 'DataSight Analytics' },
      { id: 'company_7', name: 'EcoTech Innovations' },
      { id: 'company_8', name: 'BlockSecure Payments' },
      { id: 'company_9', name: 'MobilityTech Inc' },
      { id: 'company_10', name: 'QuantumAI Solutions' },
      { id: 'company_11', name: 'ClimateGuard Technologies' },
      { id: 'company_12', name: 'CyberDefense Systems' }
    ];
    
    const investors = [
      'Sequoia Capital',
      'Andreessen Horowitz',
      'Breakthrough Energy Ventures',
      'Accel Partners',
      'Y Combinator',
      'SoftBank Vision Fund',
      'Khosla Ventures',
      'Founders Fund',
      'Tiger Global',
      'Insight Partners'
    ];
    
    const eventTypes: FundingEvent['type'][] = [
      'seed',
      'series_a',
      'series_b',
      'series_c_plus',
      'acquisition',
      'ipo',
      'spac',
      'pe_buyout'
    ];
    
    // Distribution of event types (weighted)
    const eventTypeWeights = {
      'seed': 0.3,
      'series_a': 0.25,
      'series_b': 0.15,
      'series_c_plus': 0.1,
      'acquisition': 0.1,
      'ipo': 0.03,
      'spac': 0.02,
      'pe_buyout': 0.05
    };
    
    // Generate random events
    for (let i = 0; i < count; i++) {
      // Random date within range
      const date = new Date(startTime + Math.random() * timeRange);
      
      // Random company
      const company = companies[Math.floor(Math.random() * companies.length)];
      
      // Random event type (weighted)
      const eventType = this.weightedRandom(eventTypeWeights) as FundingEvent['type'];
      
      // Random amount based on event type
      let amount = 0;
      switch (eventType) {
        case 'seed':
          amount = 1000000 + Math.random() * 9000000; // $1M - $10M
          break;
        case 'series_a':
          amount = 10000000 + Math.random() * 20000000; // $10M - $30M
          break;
        case 'series_b':
          amount = 30000000 + Math.random() * 50000000; // $30M - $80M
          break;
        case 'series_c_plus':
          amount = 80000000 + Math.random() * 120000000; // $80M - $200M
          break;
        case 'acquisition':
          amount = 100000000 + Math.random() * 900000000; // $100M - $1B
          break;
        case 'ipo':
          amount = 500000000 + Math.random() * 1500000000; // $500M - $2B
          break;
        case 'spac':
          amount = 300000000 + Math.random() * 700000000; // $300M - $1B
          break;
        case 'pe_buyout':
          amount = 200000000 + Math.random() * 800000000; // $200M - $1B
          break;
      }
      
      // Random investors (1-3)
      const investorCount = Math.floor(Math.random() * 3) + 1;
      const eventInvestors = [];
      for (let j = 0; j < investorCount; j++) {
        const investor = investors[Math.floor(Math.random() * investors.length)];
        if (!eventInvestors.includes(investor)) {
          eventInvestors.push(investor);
        }
      }
      
      // Create event
      const event: FundingEvent = {
        id: `event_${i}`,
        companyId: company.id,
        companyName: company.name,
        date,
        type: eventType,
        amount,
        investors: eventInvestors,
        description: `${company.name} ${this.getEventDescription(eventType, amount, eventInvestors)}`,
        source: 'mock-data',
        sourceUrl: '#'
      };
      
      events.push(event);
    }
    
    // Sort by date (newest first)
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  /**
   * Get a description for an event
   */
  private getEventDescription(type: FundingEvent['type'], amount: number, investors: string[]): string {
    const formattedAmount = amount >= 1000000000
      ? `$${(amount / 1000000000).toFixed(1)}B`
      : `$${(amount / 1000000).toFixed(0)}M`;
    
    const leadInvestor = investors.length > 0 ? investors[0] : 'an undisclosed investor';
    
    switch (type) {
      case 'seed':
        return `raised ${formattedAmount} in Seed funding led by ${leadInvestor}`;
      case 'series_a':
        return `secured ${formattedAmount} in Series A funding led by ${leadInvestor}`;
      case 'series_b':
        return `raised ${formattedAmount} in Series B funding led by ${leadInvestor}`;
      case 'series_c_plus':
        return `closed a ${formattedAmount} Series C+ round led by ${leadInvestor}`;
      case 'acquisition':
        return `was acquired for ${formattedAmount}`;
      case 'ipo':
        return `went public at a ${formattedAmount} valuation`;
      case 'spac':
        return `went public via SPAC at a ${formattedAmount} valuation`;
      case 'pe_buyout':
        return `was acquired by a private equity firm for ${formattedAmount}`;
      default:
        return `raised ${formattedAmount} in funding`;
    }
  }
  
  /**
   * Weighted random selection
   */
  private weightedRandom(weights: Record<string, number>): string {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [_, weight]) => sum + weight, 0);
    let random = Math.random() * total;
    
    for (const [key, weight] of entries) {
      random -= weight;
      if (random <= 0) {
        return key;
      }
    }
    
    return entries[0][0]; // Fallback
  }
  
  /**
   * Get all funding events
   */
  getAllFundingEvents(): FundingEvent[] {
    return [...this.fundingEvents];
  }
  
  /**
   * Get funding events for a specific time period
   */
  getFundingEventsByDateRange(startDate: Date, endDate: Date): FundingEvent[] {
    return this.fundingEvents.filter(event => 
      event.date >= startDate && event.date <= endDate
    );
  }
  
  /**
   * Get funding events by type
   */
  getFundingEventsByType(type: FundingEvent['type']): FundingEvent[] {
    return this.fundingEvents.filter(event => event.type === type);
  }
  
  /**
   * Get funding events for a specific company
   */
  getFundingEventsByCompany(companyId: string): FundingEvent[] {
    return this.fundingEvents.filter(event => event.companyId === companyId);
  }
  
  /**
   * Get funding events by investor
   */
  getFundingEventsByInvestor(investor: string): FundingEvent[] {
    return this.fundingEvents.filter(event => 
      event.investors.includes(investor)
    );
  }
  
  /**
   * Get funding trends over time
   */
  getFundingTrends(
    startDate: Date, 
    endDate: Date, 
    interval: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month',
    eventTypes?: FundingEvent['type'][]
  ): any[] {
    // Filter events by date range and event types
    let events = this.fundingEvents.filter(event => 
      event.date >= startDate && event.date <= endDate
    );
    
    if (eventTypes && eventTypes.length > 0) {
      events = events.filter(event => eventTypes.includes(event.type));
    }
    
    // Group events by interval
    const groupedEvents: Record<string, { count: number; amount: number }> = {};
    
    events.forEach(event => {
      const key = this.getIntervalKey(event.date, interval);
      
      if (!groupedEvents[key]) {
        groupedEvents[key] = { count: 0, amount: 0 };
      }
      
      groupedEvents[key].count++;
      groupedEvents[key].amount += event.amount;
    });
    
    // Convert to array and sort by date
    return Object.entries(groupedEvents)
      .map(([key, data]) => ({
        date: key,
        count: data.count,
        amount: data.amount,
        averageAmount: data.amount / data.count
      }))
      .sort((a, b) => {
        // Sort by date
        if (interval === 'month') {
          // For month format (YYYY-MM)
          return a.date.localeCompare(b.date);
        } else if (interval === 'quarter') {
          // For quarter format (YYYY-Q#)
          return a.date.localeCompare(b.date);
        } else {
          // For other formats
          return a.date.localeCompare(b.date);
        }
      });
  }
  
  /**
   * Get funding distribution by type
   */
  getFundingDistributionByType(
    startDate?: Date, 
    endDate?: Date
  ): { type: string; count: number; amount: number }[] {
    // Filter events by date range if provided
    let events = this.fundingEvents;
    if (startDate && endDate) {
      events = events.filter(event => 
        event.date >= startDate && event.date <= endDate
      );
    }
    
    // Group events by type
    const distribution: Record<string, { count: number; amount: number }> = {};
    
    events.forEach(event => {
      if (!distribution[event.type]) {
        distribution[event.type] = { count: 0, amount: 0 };
      }
      
      distribution[event.type].count++;
      distribution[event.type].amount += event.amount;
    });
    
    // Convert to array
    return Object.entries(distribution)
      .map(([type, data]) => ({
        type,
        count: data.count,
        amount: data.amount
      }))
      .sort((a, b) => b.count - a.count); // Sort by count (descending)
  }
  
  /**
   * Get top investors by deal count or amount
   */
  getTopInvestors(
    startDate?: Date, 
    endDate?: Date,
    limit: number = 10,
    sortBy: 'count' | 'amount' = 'count'
  ): { investor: string; count: number; amount: number }[] {
    // Filter events by date range if provided
    let events = this.fundingEvents;
    if (startDate && endDate) {
      events = events.filter(event => 
        event.date >= startDate && event.date <= endDate
      );
    }
    
    // Only include funding events (not acquisitions, IPOs, etc.)
    events = events.filter(event => 
      ['seed', 'series_a', 'series_b', 'series_c_plus'].includes(event.type)
    );
    
    // Group events by investor
    const investorData: Record<string, { count: number; amount: number }> = {};
    
    events.forEach(event => {
      event.investors.forEach(investor => {
        if (!investorData[investor]) {
          investorData[investor] = { count: 0, amount: 0 };
        }
        
        investorData[investor].count++;
        investorData[investor].amount += event.amount;
      });
    });
    
    // Convert to array and sort
    return Object.entries(investorData)
      .map(([investor, data]) => ({
        investor,
        count: data.count,
        amount: data.amount
      }))
      .sort((a, b) => sortBy === 'count' 
        ? b.count - a.count 
        : b.amount - a.amount
      )
      .slice(0, limit);
  }
  
  /**
   * Get valuation trends for companies
   */
  getValuationTrends(
    companyIds: string[],
    startDate?: Date,
    endDate?: Date
  ): any[] {
    // Filter events by date range if provided
    let events = this.fundingEvents;
    if (startDate && endDate) {
      events = events.filter(event => 
        event.date >= startDate && event.date <= endDate
      );
    }
    
    // Filter events by company IDs
    events = events.filter(event => companyIds.includes(event.companyId));
    
    // Group events by company and sort by date
    const companyEvents: Record<string, FundingEvent[]> = {};
    
    companyIds.forEach(companyId => {
      companyEvents[companyId] = events
        .filter(event => event.companyId === companyId)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    });
    
    // Calculate valuations based on funding rounds
    const valuationTrends: any[] = [];
    
    Object.entries(companyEvents).forEach(([companyId, events]) => {
      let valuation = 0;
      
      events.forEach(event => {
        // Calculate implied valuation based on event type and amount
        let newValuation = 0;
        
        switch (event.type) {
          case 'seed':
            newValuation = event.amount * 5; // 5x multiple for seed
            break;
          case 'series_a':
            newValuation = event.amount * 4; // 4x multiple for Series A
            break;
          case 'series_b':
            newValuation = event.amount * 3.5; // 3.5x multiple for Series B
            break;
          case 'series_c_plus':
            newValuation = event.amount * 3; // 3x multiple for Series C+
            break;
          case 'acquisition':
          case 'ipo':
          case 'spac':
          case 'pe_buyout':
            newValuation = event.amount; // Direct valuation for exits
            break;
        }
        
        // Only update if the new valuation is higher
        if (newValuation > valuation) {
          valuation = newValuation;
        }
        
        valuationTrends.push({
          companyId,
          companyName: event.companyName,
          date: event.date,
          eventType: event.type,
          amount: event.amount,
          valuation
        });
      });
    });
    
    // Sort by date
    return valuationTrends.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  /**
   * Get funding comparison between industries
   */
  getIndustryComparison(
    industries: string[],
    startDate?: Date,
    endDate?: Date
  ): any[] {
    // This would typically use industry data from the events
    // For this mock implementation, we'll generate random data
    
    return industries.map(industry => {
      const seedCount = Math.floor(Math.random() * 50) + 10;
      const seriesACount = Math.floor(Math.random() * 30) + 5;
      const seriesBCount = Math.floor(Math.random() * 15) + 3;
      const seriesCCount = Math.floor(Math.random() * 8) + 1;
      const acquisitionCount = Math.floor(Math.random() * 10) + 1;
      
      const totalCount = seedCount + seriesACount + seriesBCount + seriesCCount + acquisitionCount;
      
      const seedAmount = (Math.random() * 100 + 50) * seedCount * 1000000;
      const seriesAAmount = (Math.random() * 200 + 100) * seriesACount * 1000000;
      const seriesBAmount = (Math.random() * 400 + 200) * seriesBCount * 1000000;
      const seriesCAmount = (Math.random() * 800 + 400) * seriesCCount * 1000000;
      const acquisitionAmount = (Math.random() * 1000 + 500) * acquisitionCount * 1000000;
      
      const totalAmount = seedAmount + seriesAAmount + seriesBAmount + seriesCAmount + acquisitionAmount;
      
      return {
        industry,
        totalCount,
        totalAmount,
        distribution: {
          seed: { count: seedCount, amount: seedAmount },
          series_a: { count: seriesACount, amount: seriesAAmount },
          series_b: { count: seriesBCount, amount: seriesBAmount },
          series_c_plus: { count: seriesCCount, amount: seriesCAmount },
          acquisition: { count: acquisitionCount, amount: acquisitionAmount }
        }
      };
    });
  }
  
  /**
   * Get key metrics for dashboard
   */
  getDashboardMetrics(
    startDate?: Date,
    endDate?: Date
  ): any {
    // Filter events by date range if provided
    let events = this.fundingEvents;
    if (startDate && endDate) {
      events = events.filter(event => 
        event.date >= startDate && event.date <= endDate
      );
    }
    
    // Calculate metrics
    const totalEvents = events.length;
    const totalAmount = events.reduce((sum, event) => sum + event.amount, 0);
    
    const fundingEvents = events.filter(event => 
      ['seed', 'series_a', 'series_b', 'series_c_plus'].includes(event.type)
    );
    const fundingCount = fundingEvents.length;
    const fundingAmount = fundingEvents.reduce((sum, event) => sum + event.amount, 0);
    
    const acquisitionEvents = events.filter(event => event.type === 'acquisition');
    const acquisitionCount = acquisitionEvents.length;
    const acquisitionAmount = acquisitionEvents.reduce((sum, event) => sum + event.amount, 0);
    
    const ipoEvents = events.filter(event => event.type === 'ipo' || event.type === 'spac');
    const ipoCount = ipoEvents.length;
    const ipoAmount = ipoEvents.reduce((sum, event) => sum + event.amount, 0);
    
    // Calculate average deal sizes
    const avgDealSize = totalEvents > 0 ? totalAmount / totalEvents : 0;
    const avgFundingSize = fundingCount > 0 ? fundingAmount / fundingCount : 0;
    const avgAcquisitionSize = acquisitionCount > 0 ? acquisitionAmount / acquisitionCount : 0;
    
    // Count unique companies and investors
    const uniqueCompanies = new Set(events.map(event => event.companyId)).size;
    const uniqueInvestors = new Set(
      events.flatMap(event => event.investors)
    ).size;
    
    return {
      totalEvents,
      totalAmount,
      fundingCount,
      fundingAmount,
      acquisitionCount,
      acquisitionAmount,
      ipoCount,
      ipoAmount,
      avgDealSize,
      avgFundingSize,
      avgAcquisitionSize,
      uniqueCompanies,
      uniqueInvestors
    };
  }
  
  /**
   * Helper method to get interval key for a date
   */
  private getIntervalKey(date: Date, interval: 'day' | 'week' | 'month' | 'quarter' | 'year'): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    switch (interval) {
      case 'day':
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      case 'week':
        // Get ISO week number
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        const week = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000 / 7) + 1;
        return `${year}-W${week.toString().padStart(2, '0')}`;
      case 'month':
        return `${year}-${month.toString().padStart(2, '0')}`;
      case 'quarter':
        const quarter = Math.floor((month - 1) / 3) + 1;
        return `${year}-Q${quarter}`;
      case 'year':
        return `${year}`;
      default:
        return `${year}-${month.toString().padStart(2, '0')}`;
    }
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();