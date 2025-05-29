import { Notification } from '../../types';

/**
 * Service for managing notifications and alerts
 */
export class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private rules: NotificationRule[] = [];
  private channels: NotificationChannel[] = [];
  
  constructor() {
    this.loadInitialData();
    this.setupEventListeners();
  }
  
  /**
   * Load initial mock data
   */
  private loadInitialData(): void {
    // Mock notifications
    this.notifications = [
      {
        id: '1',
        title: 'New Funding Event',
        message: 'TechVision AI secured a $45M Series B led by Sequoia Capital',
        type: 'info',
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        relatedTo: {
          type: 'company',
          id: 'company_1'
        }
      },
      {
        id: '2',
        title: 'Weekly Report Generated',
        message: 'Your weekly funding report is now available',
        type: 'success',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        read: true,
        relatedTo: {
          type: 'report',
          id: 'report-weekly'
        }
      },
      {
        id: '3',
        title: 'Acquisition Alert',
        message: 'TechVision Corp acquired DataSight Analytics for $980M',
        type: 'warning',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false,
        relatedTo: {
          type: 'company',
          id: 'company_6'
        }
      }
    ];
    
    // Mock notification rules
    this.rules = [
      {
        id: 'rule-1',
        name: 'Funding Events',
        description: 'Notify me about new funding events in my focus areas',
        eventType: 'funding',
        conditions: {
          minAmount: 10000000, // $10M
          industries: ['AI/ML', 'Fintech', 'ClimateTech'],
          regions: ['North America', 'Europe']
        },
        channels: ['in-app', 'email'],
        enabled: true
      },
      {
        id: 'rule-2',
        name: 'Acquisitions',
        description: 'Notify me about acquisitions in my focus areas',
        eventType: 'acquisition',
        conditions: {
          minAmount: 100000000, // $100M
          industries: ['AI/ML', 'Fintech', 'ClimateTech', 'Cybersecurity'],
          regions: ['North America', 'Europe', 'Asia Pacific']
        },
        channels: ['in-app', 'email'],
        enabled: true
      },
      {
        id: 'rule-3',
        name: 'Watchlist Companies',
        description: 'Notify me about any events related to companies in my watchlist',
        eventType: 'any',
        conditions: {
          watchlistOnly: true
        },
        channels: ['in-app', 'email'],
        enabled: true
      }
    ];
    
    // Mock notification channels
    this.channels = [
      {
        id: 'channel-1',
        type: 'in-app',
        enabled: true
      },
      {
        id: 'channel-2',
        type: 'email',
        config: {
          address: 'user@example.com',
          frequency: 'immediate'
        },
        enabled: true
      },
      {
        id: 'channel-3',
        type: 'mobile',
        config: {
          deviceToken: 'mock-device-token',
          silent: false
        },
        enabled: false
      }
    ];
  }
  
  /**
   * Set up event listeners for various data sources
   */
  private setupEventListeners(): void {
    // Listen for data refresh events
    document.addEventListener('dataRefresh', (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Data refresh event detected:', customEvent.detail);
      
      // Generate a notification for the data refresh
      if (customEvent.detail.jobType === 'api' || customEvent.detail.jobType === 'scraper') {
        this.addNotification({
          title: 'Data Refresh Complete',
          message: `New data has been fetched from ${customEvent.detail.jobType === 'api' ? 'external APIs' : 'web sources'}`,
          type: 'info',
          relatedTo: {
            type: 'system',
            id: customEvent.detail.jobId || 'data-refresh'
          }
        });
      }
    });
    
    // Simulate periodic funding events
    setInterval(() => {
      // Only add a notification 10% of the time to avoid spamming
      if (Math.random() < 0.1) {
        this.simulateFundingEvent();
      }
    }, 60000); // Check every minute
  }
  
  /**
   * Simulate a funding event for demonstration purposes
   */
  private simulateFundingEvent(): void {
    const companies = [
      'QuantumAI Solutions',
      'ClimateGuard Technologies',
      'FinSecure Platform',
      'CloudSecure Inc',
      'HealthTech Solutions'
    ];
    
    const investors = [
      'Sequoia Capital',
      'Andreessen Horowitz',
      'Breakthrough Energy Ventures',
      'Accel Partners',
      'Y Combinator'
    ];
    
    const amounts = [
      5000000,
      10000000,
      25000000,
      50000000,
      100000000
    ];
    
    const rounds = [
      'Seed',
      'Series A',
      'Series B',
      'Series C'
    ];
    
    // Randomly select elements
    const company = companies[Math.floor(Math.random() * companies.length)];
    const investor = investors[Math.floor(Math.random() * investors.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const round = rounds[Math.floor(Math.random() * rounds.length)];
    
    // Format amount
    const formattedAmount = amount >= 1000000000
      ? `$${(amount / 1000000000).toFixed(1)}B`
      : `$${(amount / 1000000).toFixed(0)}M`;
    
    // Create notification
    this.addNotification({
      title: `New ${round} Funding Round`,
      message: `${company} secured ${formattedAmount} in ${round} funding led by ${investor}`,
      type: 'info',
      relatedTo: {
        type: 'company',
        id: company.replace(/\s+/g, '_').toLowerCase()
      }
    });
  }
  
  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  
  /**
   * Get unread notifications
   */
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  
  /**
   * Add a new notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      createdAt: new Date(),
      read: false,
      relatedTo: notification.relatedTo
    };
    
    this.notifications.unshift(newNotification);
    
    // Notify listeners
    this.notifyListeners();
    
    // Check if this notification should be delivered via other channels
    this.deliverToChannels(newNotification);
    
    return newNotification;
  }
  
  /**
   * Mark a notification as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.notifyListeners();
  }
  
  /**
   * Delete a notification
   */
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }
  
  /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    this.notifications = [];
    this.notifyListeners();
  }
  
  /**
   * Subscribe to notification changes
   */
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    const notifications = this.getNotifications();
    this.listeners.forEach(listener => listener(notifications));
  }
  
  /**
   * Get all notification rules
   */
  getNotificationRules(): NotificationRule[] {
    return [...this.rules];
  }
  
  /**
   * Add or update a notification rule
   */
  saveNotificationRule(rule: NotificationRule): NotificationRule {
    const index = this.rules.findIndex(r => r.id === rule.id);
    
    if (index >= 0) {
      // Update existing rule
      this.rules[index] = rule;
      return rule;
    } else {
      // Add new rule
      const newRule = {
        ...rule,
        id: rule.id || `rule-${Date.now()}`
      };
      this.rules.push(newRule);
      return newRule;
    }
  }
  
  /**
   * Delete a notification rule
   */
  deleteNotificationRule(id: string): void {
    this.rules = this.rules.filter(r => r.id !== id);
  }
  
  /**
   * Get all notification channels
   */
  getNotificationChannels(): NotificationChannel[] {
    return [...this.channels];
  }
  
  /**
   * Add or update a notification channel
   */
  saveNotificationChannel(channel: NotificationChannel): NotificationChannel {
    const index = this.channels.findIndex(c => c.id === channel.id);
    
    if (index >= 0) {
      // Update existing channel
      this.channels[index] = channel;
      return channel;
    } else {
      // Add new channel
      const newChannel = {
        ...channel,
        id: channel.id || `channel-${Date.now()}`
      };
      this.channels.push(newChannel);
      return newChannel;
    }
  }
  
  /**
   * Delete a notification channel
   */
  deleteNotificationChannel(id: string): void {
    this.channels = this.channels.filter(c => c.id !== id);
  }
  
  /**
   * Deliver a notification to configured channels
   */
  private deliverToChannels(notification: Notification): void {
    // Check which rules apply to this notification
    const applicableRules = this.rules.filter(rule => {
      // Skip disabled rules
      if (!rule.enabled) return false;
      
      // Check event type
      if (rule.eventType !== 'any') {
        if (notification.relatedTo?.type === 'company') {
          // For company-related notifications, check if it's a funding or acquisition event
          if (notification.title.toLowerCase().includes('funding') && rule.eventType !== 'funding') {
            return false;
          }
          if (notification.title.toLowerCase().includes('acquisition') && rule.eventType !== 'acquisition') {
            return false;
          }
        }
      }
      
      // Check conditions
      if (rule.conditions) {
        // Check watchlist
        if (rule.conditions.watchlistOnly && notification.relatedTo?.type !== 'company') {
          return false;
        }
        
        // More condition checks would go here in a real implementation
      }
      
      return true;
    });
    
    // Get unique channels from applicable rules
    const channelsToUse = new Set<string>();
    applicableRules.forEach(rule => {
      rule.channels.forEach(channel => channelsToUse.add(channel));
    });
    
    // Deliver to each channel
    channelsToUse.forEach(channelType => {
      const channel = this.channels.find(c => c.type === channelType && c.enabled);
      if (channel) {
        this.deliverToChannel(notification, channel);
      }
    });
  }
  
  /**
   * Deliver a notification to a specific channel
   */
  private deliverToChannel(notification: Notification, channel: NotificationChannel): void {
    console.log(`Delivering notification to ${channel.type} channel:`, notification.title);
    
    switch (channel.type) {
      case 'in-app':
        // In-app notifications are already handled by adding to this.notifications
        break;
        
      case 'email':
        // In a real implementation, this would send an email
        console.log(`Would send email to ${channel.config?.address} with subject: ${notification.title}`);
        break;
        
      case 'mobile':
        // In a real implementation, this would send a push notification
        console.log(`Would send push notification to device ${channel.config?.deviceToken}`);
        break;
    }
  }
}

/**
 * Notification rule interface
 */
interface NotificationRule {
  id: string;
  name: string;
  description: string;
  eventType: 'funding' | 'acquisition' | 'any';
  conditions?: {
    minAmount?: number;
    industries?: string[];
    regions?: string[];
    watchlistOnly?: boolean;
  };
  channels: ('in-app' | 'email' | 'mobile')[];
  enabled: boolean;
}

/**
 * Notification channel interface
 */
interface NotificationChannel {
  id: string;
  type: 'in-app' | 'email' | 'mobile';
  config?: any;
  enabled: boolean;
}

// Create singleton instance
export const notificationService = new NotificationService();