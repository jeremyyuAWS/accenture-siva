import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { Settings, Bell, Monitor, Eye, Moon, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const CustomPreferencesPanel: React.FC = () => {
  const [preferences, setPreferences] = useState<any>({
    darkMode: false,
    notifications: {
      email: true,
      inApp: true,
      digest: 'daily'
    },
    ui: {
      compactView: false,
      showWelcome: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  
  // Load user preferences on mount
  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      const userPreferences = userService.getUserPreferences(currentUser.id);
      if (userPreferences) {
        setPreferences(userPreferences);
      }
    }
    setLoading(false);
  }, []);
  
  // Update preferences
  const handleChange = (section: string, field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  // Update direct preference
  const handleDirectChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save preferences
  const handleSave = async () => {
    setSaving(true);
    
    try {
      const currentUser = userService.getCurrentUser();
      if (currentUser) {
        // Save preferences
        userService.updateUserPreferences(currentUser.id, preferences);
        
        // Apply dark mode if changed
        if (preferences.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show saved message
      setSavedMessage(true);
      setTimeout(() => {
        setSavedMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-secondary rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          <span className="ml-3 text-primary">Loading preferences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Custom Preferences</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Personalize your Insight Sentinel experience
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* UI Preferences */}
        <div>
          <h3 className="text-lg font-medium text-primary mb-4">Interface Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-secondary mr-2" />
                <div>
                  <p className="text-sm font-medium text-primary">Dark Mode</p>
                  <p className="text-xs text-secondary">Use dark theme throughout the application</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.darkMode}
                  onChange={e => handleDirectChange('darkMode', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-secondary mr-2" />
                <div>
                  <p className="text-sm font-medium text-primary">Compact View</p>
                  <p className="text-xs text-secondary">Display more information in a condensed format</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.ui.compactView}
                  onChange={e => handleChange('ui', 'compactView', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="h-5 w-5 text-secondary mr-2" />
                <div>
                  <p className="text-sm font-medium text-primary">Welcome Screen</p>
                  <p className="text-xs text-secondary">Show welcome screen when you log in</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.ui.showWelcome}
                  onChange={e => handleChange('ui', 'showWelcome', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Notification Preferences */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-medium text-primary mb-4">Notification Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-secondary mr-2" />
                <div>
                  <p className="text-sm font-medium text-primary">Email Notifications</p>
                  <p className="text-xs text-secondary">Receive important updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.notifications.email}
                  onChange={e => handleChange('notifications', 'email', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-secondary mr-2" />
                <div>
                  <p className="text-sm font-medium text-primary">In-App Notifications</p>
                  <p className="text-xs text-secondary">Receive notifications within the application</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.notifications.inApp}
                  onChange={e => handleChange('notifications', 'inApp', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Notification Digest Frequency
              </label>
              <select
                value={preferences.notifications.digest}
                onChange={e => handleChange('notifications', 'digest', e.target.value)}
                className="w-full p-2.5 border border-border rounded-md bg-background-primary text-primary"
              >
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
                <option value="none">No Digest</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="p-4 bg-background-primary border-t border-border flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:bg-gray-400"
        >
          {saving ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
              Saving...
            </>
          ) : savedMessage ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomPreferencesPanel;