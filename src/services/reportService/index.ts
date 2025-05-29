import { ReportSettings, FundingEvent } from '../../types';

/**
 * Service for generating and delivering reports based on user settings
 */
export class ReportService {
  private reportSettings: ReportSettings[] = [];
  private reportQueue: any[] = [];
  private reportHistory: any[] = [];
  
  constructor() {
    this.loadInitialData();
  }

  /**
   * Load initial mock data
   */
  private loadInitialData(): void {
    // Mock report settings
    this.reportSettings = [
      {
        id: 'report-weekly',
        userId: '1',
        format: 'bullet',
        frequency: 'weekly',
        delivery: 'in-app',
        includeVisuals: true,
        includeSources: true,
        lastDelivery: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        id: 'report-daily',
        userId: '1',
        format: 'paragraph',
        frequency: 'daily',
        delivery: 'email',
        emailAddress: 'user@example.com',
        includeVisuals: true,
        includeSources: true,
        lastDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];
    
    // Mock report queue
    this.reportQueue = [
      {
        id: 'queue-1',
        reportId: 'report-daily',
        scheduledFor: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        status: 'scheduled'
      }
    ];
    
    // Mock report history
    this.reportHistory = [
      {
        id: 'history-1',
        reportId: 'report-weekly',
        generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'delivered',
        title: 'Weekly Funding & M&A Report (June 24-30, 2025)',
        url: '#'
      },
      {
        id: 'history-2',
        reportId: 'report-daily',
        generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'delivered',
        title: 'Daily Funding & M&A Update (July 6, 2025)',
        url: '#'
      }
    ];
  }
  
  /**
   * Get all report settings for a user
   */
  getReportSettings(userId: string): ReportSettings[] {
    return this.reportSettings.filter(setting => setting.userId === userId);
  }
  
  /**
   * Get a specific report setting by ID
   */
  getReportSettingById(id: string): ReportSettings | undefined {
    return this.reportSettings.find(setting => setting.id === id);
  }
  
  /**
   * Create or update a report setting
   */
  saveReportSetting(setting: ReportSettings): ReportSettings {
    const index = this.reportSettings.findIndex(s => s.id === setting.id);
    
    if (index >= 0) {
      // Update existing setting
      this.reportSettings[index] = { ...setting };
      return this.reportSettings[index];
    } else {
      // Create new setting
      const newSetting: ReportSettings = {
        ...setting,
        id: setting.id || `report-${Date.now()}`
      };
      
      this.reportSettings.push(newSetting);
      return newSetting;
    }
  }
  
  /**
   * Delete a report setting
   */
  deleteReportSetting(id: string): boolean {
    const initialLength = this.reportSettings.length;
    this.reportSettings = this.reportSettings.filter(setting => setting.id !== id);
    return this.reportSettings.length < initialLength;
  }
  
  /**
   * Get upcoming reports in the queue
   */
  getReportQueue(userId: string): any[] {
    // Get report IDs for this user
    const userReportIds = this.reportSettings
      .filter(setting => setting.userId === userId)
      .map(setting => setting.id);
    
    // Return queued reports for this user
    return this.reportQueue
      .filter(item => userReportIds.includes(item.reportId))
      .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  }
  
  /**
   * Get report history for a user
   */
  getReportHistory(userId: string): any[] {
    // Get report IDs for this user
    const userReportIds = this.reportSettings
      .filter(setting => setting.userId === userId)
      .map(setting => setting.id);
    
    // Return report history for this user
    return this.reportHistory
      .filter(item => userReportIds.includes(item.reportId))
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }
  
  /**
   * Generate a report immediately
   */
  async generateReport(settingId: string): Promise<any> {
    const setting = this.getReportSettingById(settingId);
    
    if (!setting) {
      throw new Error(`Report setting with ID ${settingId} not found`);
    }
    
    console.log(`Generating ${setting.frequency} report in ${setting.format} format`);
    
    // In a real implementation, this would generate the actual report
    // For this demo, we'll simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const now = new Date();
    
    // Create a new report history entry
    const reportEntry = {
      id: `history-${Date.now()}`,
      reportId: settingId,
      generatedAt: now,
      deliveredAt: now,
      status: 'delivered',
      title: `${this.capitalizeFirstLetter(setting.frequency)} Funding & M&A ${setting.frequency === 'weekly' ? 'Report' : 'Update'} (${this.formatDate(now)})`,
      url: '#'
    };
    
    this.reportHistory.unshift(reportEntry);
    
    // Update the last delivery time
    const index = this.reportSettings.findIndex(s => s.id === settingId);
    if (index >= 0) {
      this.reportSettings[index].lastDelivery = now;
    }
    
    return reportEntry;
  }
  
  /**
   * Schedule the next report generation
   */
  scheduleNextReport(settingId: string): any {
    const setting = this.getReportSettingById(settingId);
    
    if (!setting) {
      throw new Error(`Report setting with ID ${settingId} not found`);
    }
    
    // Calculate next scheduled time based on frequency
    const nextScheduledTime = this.calculateNextScheduleTime(setting.frequency, setting.lastDelivery);
    
    // Create queue entry
    const queueEntry = {
      id: `queue-${Date.now()}`,
      reportId: settingId,
      scheduledFor: nextScheduledTime,
      status: 'scheduled'
    };
    
    this.reportQueue.push(queueEntry);
    
    return queueEntry;
  }
  
  /**
   * Calculate the next time to run a report based on frequency
   */
  private calculateNextScheduleTime(frequency: 'daily' | 'weekly' | 'monthly', lastRun?: Date): Date {
    const now = new Date();
    
    if (!lastRun) {
      // If never run before, schedule for tomorrow morning
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0);
      return tomorrow;
    }
    
    const next = new Date(lastRun);
    
    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
    }
    
    // Ensure the next time is in the future
    if (next <= now) {
      switch (frequency) {
        case 'daily':
          next.setDate(now.getDate() + 1);
          break;
        case 'weekly':
          next.setDate(now.getDate() + 7);
          break;
        case 'monthly':
          next.setMonth(now.getMonth() + 1);
          break;
      }
    }
    
    // Set time to 8:00 AM
    next.setHours(8, 0, 0, 0);
    
    return next;
  }
  
  /**
   * Generate a sample report based on settings
   */
  generateSampleReport(settings: ReportSettings): string {
    const date = new Date();
    let reportContent = '';
    
    // Generate title based on frequency
    const title = `${this.capitalizeFirstLetter(settings.frequency)} Funding & M&A ${settings.frequency === 'weekly' ? 'Report' : 'Update'} (${this.formatDate(date)})`;
    
    // Generate report based on format
    if (settings.format === 'bullet') {
      reportContent = this.generateBulletReport(title);
    } else if (settings.format === 'paragraph') {
      reportContent = this.generateParagraphReport(title);
    } else {
      reportContent = this.generateChartReport(title);
    }
    
    return reportContent;
  }
  
  /**
   * Generate a bullet-point style report
   */
  private generateBulletReport(title: string): string {
    return `
## ${title}

### Key Highlights
- **22 funding events** totaling **$1.2B** in your focus areas
- **5 acquisitions** with a combined value of **$3.5B**
- **Top Sector**: AI/ML with 8 deals worth $580M

### Notable Funding Rounds
- **QuantumAI Solutions** secured $120M Series C led by Sequoia Capital
- **ClimateGuard Technologies** raised $85M Series B from Breakthrough Energy Ventures
- **FinSecure Platform** closed $45M Series A with Accel Partners

### Acquisition Activity
- **TechVision Corp** acquired **DataSight Analytics** for $980M
- **GreenFuture Holdings** acquired **EcoTech Innovations** for $750M
- **CloudSecure Inc** acquired by **Enterprise Solutions Group** for $1.2B

### Emerging Trends
- Increasing consolidation in cybersecurity space
- Rising valuations for AI startups specializing in enterprise applications
- Growth in climate tech funding, particularly in carbon capture technologies
    `;
  }
  
  /**
   * Generate a paragraph style report
   */
  private generateParagraphReport(title: string): string {
    return `
## ${title}

Your focus areas saw significant activity this week, with 22 funding events totaling $1.2B and 5 acquisitions with a combined value of $3.5B. AI/ML emerged as the dominant sector, accounting for 8 deals worth $580M, demonstrating the continued strong investor appetite for artificial intelligence technologies.

In notable funding rounds, QuantumAI Solutions secured a substantial $120M Series C led by Sequoia Capital, valuing the company at $1.1B and marking its entry into unicorn status. The company's quantum machine learning platform has gained significant enterprise adoption over the past year. ClimateGuard Technologies raised $85M in Series B funding from Breakthrough Energy Ventures to scale its carbon capture technology, while FinSecure Platform closed a $45M Series A with Accel Partners to expand its financial fraud prevention solution.

Acquisition activity was headlined by TechVision Corp's purchase of DataSight Analytics for $980M, representing a 5.2x multiple on DataSight's annual recurring revenue. This strategic acquisition strengthens TechVision's data processing capabilities. Meanwhile, GreenFuture Holdings acquired EcoTech Innovations for $750M to enhance its renewable energy portfolio, and CloudSecure Inc was acquired by Enterprise Solutions Group in a deal valued at $1.2B.

Market trends indicate increasing consolidation in the cybersecurity space as larger players seek to offer comprehensive security solutions. AI startups focused on enterprise applications are commanding higher valuations, while climate tech funding continues to grow, particularly for companies developing carbon capture and sustainable manufacturing technologies.
    `;
  }
  
  /**
   * Generate a chart-focused report
   */
  private generateChartReport(title: string): string {
    return `
## ${title}

[VISUALIZATION: Funding Distribution by Industry]
AI/ML leads with $580M across 8 deals, followed by FinTech and ClimateTech.

[VISUALIZATION: Deal Activity Timeline]
Series B rounds dominated early in the week, with acquisitions concentrated on Thursday-Friday.

### Key Highlights
- QuantumAI Solutions: $120M Series C (Sequoia Capital)
- ClimateGuard Technologies: $85M Series B (Breakthrough Energy Ventures)
- TechVision acquisition of DataSight Analytics for $980M

[VISUALIZATION: Acquisition Value by Sector]
Cybersecurity leads with $1.2B in acquisition value, followed by AI/ML with $980M.
    `;
  }
  
  /**
   * Helper to capitalize the first letter of a string
   */
  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  /**
   * Format a date for report titles
   */
  private formatDate(date: Date): string {
    // For weekly reports, show date range
    if (this.isWithinPastWeek(date)) {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - 7);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }
    
    // For daily reports, show single date
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  
  /**
   * Check if a date is within the past week
   */
  private isWithinPastWeek(date: Date): boolean {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    
    return date >= weekAgo && date <= now;
  }
}

// Create singleton instance
export const reportService = new ReportService();