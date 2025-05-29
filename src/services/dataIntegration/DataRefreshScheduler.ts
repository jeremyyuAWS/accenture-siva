import { ScheduleConfig } from './types';

/**
 * Class for scheduling and managing regular data refreshes
 */
export class DataRefreshScheduler {
  private schedules: ScheduleConfig[] = [];
  private timers: Record<string, NodeJS.Timeout> = {};
  private listeners: Record<string, Function[]> = {};
  private isRunning: boolean = false;

  constructor() {
    this.isRunning = false;
  }

  /**
   * Add a new schedule
   */
  addSchedule(schedule: ScheduleConfig): void {
    // Check if schedule with this ID already exists
    const existingIndex = this.schedules.findIndex(s => s.id === schedule.id);
    
    if (existingIndex >= 0) {
      // Update existing schedule
      this.schedules[existingIndex] = schedule;
      
      // Clear existing timer
      if (this.timers[schedule.id]) {
        clearInterval(this.timers[schedule.id]);
        delete this.timers[schedule.id];
      }
    } else {
      // Add new schedule
      this.schedules.push(schedule);
    }
    
    // Create timer if scheduler is running and schedule is enabled
    if (this.isRunning && schedule.enabled) {
      this.createTimer(schedule);
    }
  }

  /**
   * Start the scheduler
   */
  start(): void {
    if (this.isRunning) return;
    
    console.log('Starting data refresh scheduler...');
    this.isRunning = true;
    
    // Create timers for all enabled schedules
    this.schedules.forEach(schedule => {
      if (schedule.enabled) {
        this.createTimer(schedule);
      }
    });
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (!this.isRunning) return;
    
    console.log('Stopping data refresh scheduler...');
    this.isRunning = false;
    
    // Clear all timers
    Object.values(this.timers).forEach(timer => clearInterval(timer));
    this.timers = {};
  }

  /**
   * Register a listener for a schedule
   */
  onScheduleRun(scheduleId: string, callback: Function): void {
    if (!this.listeners[scheduleId]) {
      this.listeners[scheduleId] = [];
    }
    
    this.listeners[scheduleId].push(callback);
  }

  /**
   * Simulate running a job immediately
   */
  runNow(scheduleId: string): void {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    
    if (!schedule) {
      console.error(`Schedule with ID ${scheduleId} not found`);
      return;
    }
    
    console.log(`Manually running schedule: ${schedule.id}`);
    this.executeSchedule(schedule);
  }

  /**
   * Create a timer for a schedule
   */
  private createTimer(schedule: ScheduleConfig): void {
    // Calculate the interval based on frequency
    const interval = this.getIntervalForFrequency(schedule.frequency);
    
    // Create the timer
    this.timers[schedule.id] = setInterval(() => {
      this.executeSchedule(schedule);
    }, interval);
    
    console.log(`Created timer for schedule ${schedule.id} with interval ${interval}ms`);
  }

  /**
   * Execute a scheduled job
   */
  private executeSchedule(schedule: ScheduleConfig): void {
    console.log(`Executing schedule: ${schedule.id} (${schedule.jobType})`);
    
    // Notify listeners
    if (this.listeners[schedule.id]) {
      this.listeners[schedule.id].forEach(callback => {
        try {
          callback(schedule);
        } catch (error) {
          console.error(`Error in schedule listener for ${schedule.id}:`, error);
        }
      });
    }
    
    // Emit a custom event for the UI to react to
    const event = new CustomEvent('dataRefresh', {
      detail: {
        scheduleId: schedule.id,
        jobType: schedule.jobType,
        jobId: schedule.jobId,
        timestamp: new Date()
      }
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Get millisecond interval for a frequency
   */
  private getIntervalForFrequency(frequency: string): number {
    switch (frequency) {
      case 'hourly':
        // For demo purposes, make "hourly" every 5 minutes (300,000ms)
        return 300000;
      case 'daily':
        // For demo purposes, make "daily" every 15 minutes (900,000ms)
        return 900000;
      case 'weekly':
        // For demo purposes, make "weekly" every 30 minutes (1,800,000ms)
        return 1800000;
      default:
        return 900000; // Default to 15 minutes
    }
  }

  /**
   * Get all scheduled jobs
   */
  getSchedules(): ScheduleConfig[] {
    return [...this.schedules];
  }

  /**
   * Get status of the scheduler
   */
  getStatus(): { running: boolean; scheduleCount: number; activeTimers: number } {
    return {
      running: this.isRunning,
      scheduleCount: this.schedules.length,
      activeTimers: Object.keys(this.timers).length
    };
  }
}