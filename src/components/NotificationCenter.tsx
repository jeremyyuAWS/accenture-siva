import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Settings, ChevronDown, ChevronUp, ExternalLink, Calendar, FileText, RefreshCw } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Load notifications on mount and subscribe to updates
  useEffect(() => {
    setLoading(true);
    
    // Get initial notifications
    setNotifications(notificationService.getNotifications());
    setLoading(false);
    
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Filter notifications
  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };
  
  // Remove a notification
  const removeNotification = (id: string) => {
    notificationService.deleteNotification(id);
  };
  
  // Format notification time
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    
    if (diffMin < 60) {
      return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    }
    
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    }
    
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) {
      return 'Yesterday';
    }
    
    return `${diffDays} days ago`;
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <RefreshCw className="h-4 w-4 text-amber-500" />;
      case 'info':
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Simulate a new notification (for demo purposes)
  const simulateNewNotification = () => {
    notificationService.addNotification({
      title: 'New Simulated Event',
      message: 'This is a simulated notification for demonstration purposes',
      type: 'info',
      relatedTo: {
        type: 'system',
        id: 'demo'
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 rounded-md text-secondary hover:text-primary focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-accent rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-background-secondary rounded-lg shadow-lg z-50 border border-border overflow-hidden">
          <div className="p-3 bg-background-primary border-b border-border flex justify-between items-center">
            <h3 className="font-medium text-primary">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-secondary hover:text-primary p-1"
                  title="Mark all as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-secondary hover:text-primary p-1"
                title="Notification settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 text-sm font-medium ${
                filter === 'all'
                  ? 'text-primary border-b-2 border-accent'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-2 text-sm font-medium ${
                filter === 'unread'
                  ? 'text-primary border-b-2 border-accent'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
          
          {/* Settings Panel (Conditional) */}
          {showSettings && (
            <div className="p-3 bg-background-primary border-b border-border">
              <h4 className="text-sm font-medium text-primary mb-2">Notification Settings</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary">Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary">In-App Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                  </label>
                </div>
                
                <div>
                  <label htmlFor="digest-frequency" className="block text-xs text-secondary mb-1">
                    Digest Frequency
                  </label>
                  <select
                    id="digest-frequency"
                    className="w-full text-sm p-1.5 border border-border bg-background-secondary rounded-md text-primary"
                    defaultValue="daily"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <button
                  onClick={() => {
                    // This would navigate to notification rules in a real implementation
                    alert('This would navigate to notification rules configuration');
                    setShowSettings(false);
                  }}
                  className="w-full py-1.5 mt-2 text-xs bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Configure Alert Rules
                </button>
              </div>
            </div>
          )}
          
          {/* Notification List */}
          <div className={`overflow-y-auto ${filteredNotifications.length > 0 ? 'max-h-96' : ''}`}>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-accent rounded-full mr-3"></div>
                <p className="text-sm text-primary">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div>
                {filteredNotifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 border-b border-border hover:bg-background-primary ${!notification.read ? 'bg-accent/5' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-2">
                          <p className={`text-sm ${!notification.read ? 'font-medium text-primary' : 'text-primary'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-secondary mt-0.5">{notification.message}</p>
                          <div className="flex items-center mt-1 text-xs text-secondary">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatTime(notification.createdAt)}</span>
                            
                            {notification.relatedTo && (
                              <button
                                className="ml-2 text-accent hover:text-accent/80 flex items-center"
                                onClick={e => {
                                  e.stopPropagation();
                                  // This would navigate to the related entity in a real implementation
                                  alert(`This would navigate to ${notification.relatedTo?.type} with ID ${notification.relatedTo?.id}`);
                                }}
                              >
                                <ExternalLink className="h-3 w-3 mr-0.5" />
                                <span>View</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-secondary hover:text-primary p-0.5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-primary font-medium">No notifications</p>
                <p className="text-secondary text-sm mt-1">
                  {filter === 'unread' ? 'You have no unread notifications.' : 'You have no notifications.'}
                </p>
                
                {/* Demo button - for testing only */}
                <button
                  onClick={simulateNewNotification}
                  className="mt-4 px-3 py-1.5 text-xs bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Simulate Notification
                </button>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 bg-background-primary border-t border-border">
            <button
              onClick={() => {
                // This would navigate to the notifications page in a real implementation
                alert('This would navigate to a full notifications history page');
              }}
              className="text-xs flex items-center mx-auto text-accent hover:text-accent/80"
            >
              <span>View All Notifications</span>
              <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;