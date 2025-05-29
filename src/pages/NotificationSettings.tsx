import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Bell, Settings, Sliders, Mail } from 'lucide-react';
import NotificationRulesManager from '../components/NotificationRulesManager';

const NotificationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rules');
  
  return (
    <div className="space-y-6">
      <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-black text-white">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            Configure how and when you receive alerts and notifications
          </p>
        </div>
        
        <Tabs defaultValue="rules" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border">
            <TabsList className="h-10 w-full bg-background-primary">
              <TabsTrigger 
                value="rules" 
                className={`flex items-center h-10 px-4 ${activeTab === 'rules' ? 'border-b-2 border-accent' : ''}`}
              >
                <Sliders className="h-4 w-4 mr-2" />
                Alert Rules
              </TabsTrigger>
              
              <TabsTrigger 
                value="channels" 
                className={`flex items-center h-10 px-4 ${activeTab === 'channels' ? 'border-b-2 border-accent' : ''}`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Delivery Channels
              </TabsTrigger>
              
              <TabsTrigger 
                value="preferences" 
                className={`flex items-center h-10 px-4 ${activeTab === 'preferences' ? 'border-b-2 border-accent' : ''}`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="rules">
              <NotificationRulesManager />
            </TabsContent>
            
            <TabsContent value="channels">
              <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-black text-white">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    <h2 className="text-lg font-semibold">Delivery Channels</h2>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    Configure how notifications are delivered to you
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* In-App Notifications */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="p-4 bg-background-primary border-b border-border flex justify-between items-center">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-primary mr-2" />
                        <h3 className="font-medium text-primary">In-App Notifications</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                      </label>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-secondary mb-4">
                        Receive notifications directly within the Insight Sentinel application.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-primary">Show notification badge</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-primary">Play sound for new notifications</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-primary mb-1">
                            Maximum notifications to display
                          </label>
                          <select
                            className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                            defaultValue="50"
                          >
                            <option value="10">10 notifications</option>
                            <option value="25">25 notifications</option>
                            <option value="50">50 notifications</option>
                            <option value="100">100 notifications</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email Notifications */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="p-4 bg-background-primary border-b border-border flex justify-between items-center">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-primary mr-2" />
                        <h3 className="font-medium text-primary">Email Notifications</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                      </label>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-secondary mb-4">
                        Receive notifications via email to stay updated even when you're not using the application.
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-primary mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue="user@example.com"
                            className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-primary mb-1">
                            Email Frequency
                          </label>
                          <select
                            className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                            defaultValue="immediate"
                          >
                            <option value="immediate">Immediate (as events occur)</option>
                            <option value="digest">Daily Digest</option>
                            <option value="weekly">Weekly Summary</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-primary">Include event details in email</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Push Notifications */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="p-4 bg-background-primary border-b border-border flex justify-between items-center">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-primary mr-2" />
                        <h3 className="font-medium text-primary">Mobile Push Notifications</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                      </label>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-secondary mb-4">
                        Receive push notifications on your mobile device when important events occur.
                      </p>
                      
                      <div className="p-4 bg-background-primary rounded-md border border-border text-center">
                        <p className="text-sm text-primary mb-3">
                          Mobile push notifications require the Insight Sentinel mobile app.
                        </p>
                        <button
                          className="px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800"
                        >
                          Set Up Mobile App
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences">
              <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-black text-white">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    <h2 className="text-lg font-semibold">Notification Preferences</h2>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    Customize your notification experience
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-primary mb-4">General Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">Notification Bundling</p>
                          <p className="text-xs text-secondary">Group similar notifications together</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-primary">Quiet Hours</p>
                          <p className="text-xs text-secondary">Pause notifications during specific hours</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          Notification Priority
                        </label>
                        <select
                          className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                          defaultValue="all"
                        >
                          <option value="all">All Notifications</option>
                          <option value="important">Important Only</option>
                          <option value="critical">Critical Only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-medium text-primary mb-4">Notification Types</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary">Funding Events</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary">Acquisitions</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary">Report Generation</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary">System Updates</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary">Team Activity</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-background-primary border-t border-border flex justify-end">
                  <button
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationSettings;