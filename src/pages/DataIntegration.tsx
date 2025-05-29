import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Database, Globe, FileText, Clock, Settings } from 'lucide-react';
import { DataIntegrationProvider } from '../services/dataIntegration/DataIntegrationService';
import DataIntegrationDashboard from '../components/DataIntegrationDashboard';
import ApiConnectionManager from '../components/ApiConnectionManager';
import WebScraperManager from '../components/WebScraperManager';
import EtlPipelineManager from '../components/EtlPipelineManager';
import ScheduleManager from '../components/ScheduleManager';

const DataIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <DataIntegrationProvider>
      <div className="space-y-6">
        <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-black text-white">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Data Integration</h2>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Configure and manage your data sources for funding intelligence
            </p>
          </div>
          
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-border">
              <TabsList className="h-10 w-full bg-background-primary">
                <TabsTrigger 
                  value="dashboard" 
                  className={`flex items-center h-10 px-4 ${activeTab === 'dashboard' ? 'border-b-2 border-accent' : ''}`}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                
                <TabsTrigger 
                  value="api-connections" 
                  className={`flex items-center h-10 px-4 ${activeTab === 'api-connections' ? 'border-b-2 border-accent' : ''}`}
                >
                  <Database className="h-4 w-4 mr-2" />
                  API Connections
                </TabsTrigger>
                
                <TabsTrigger 
                  value="web-scrapers" 
                  className={`flex items-center h-10 px-4 ${activeTab === 'web-scrapers' ? 'border-b-2 border-accent' : ''}`}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Web Scrapers
                </TabsTrigger>
                
                <TabsTrigger 
                  value="etl-pipelines" 
                  className={`flex items-center h-10 px-4 ${activeTab === 'etl-pipelines' ? 'border-b-2 border-accent' : ''}`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  ETL Pipelines
                </TabsTrigger>
                
                <TabsTrigger 
                  value="schedules" 
                  className={`flex items-center h-10 px-4 ${activeTab === 'schedules' ? 'border-b-2 border-accent' : ''}`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedules
                </TabsTrigger>
                
                <TabsTrigger 
                  value="settings" 
                  className={`flex items-center h-10 px-4 ${activeTab === 'settings' ? 'border-b-2 border-accent' : ''}`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="dashboard">
                <DataIntegrationDashboard />
              </TabsContent>
              
              <TabsContent value="api-connections">
                <div className="text-center py-8 bg-background-primary rounded-lg border border-border">
                  <Database className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-primary mb-2">API Connection Manager</h3>
                  <p className="text-secondary max-w-lg mx-auto">
                    This component would allow configuring and managing connections to Crunchbase, PitchBook, CB Insights, 
                    and other data APIs.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="web-scrapers">
                <div className="text-center py-8 bg-background-primary rounded-lg border border-border">
                  <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-primary mb-2">Web Scraper Manager</h3>
                  <p className="text-secondary max-w-lg mx-auto">
                    This component would allow configuring and managing web scrapers for TechCrunch, SEC filings,
                    and other news sources.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="etl-pipelines">
                <div className="text-center py-8 bg-background-primary rounded-lg border border-border">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-primary mb-2">ETL Pipeline Manager</h3>
                  <p className="text-secondary max-w-lg mx-auto">
                    This component would allow configuring and managing ETL pipelines for transforming
                    and normalizing funding data from various sources.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="schedules">
                <div className="text-center py-8 bg-background-primary rounded-lg border border-border">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-primary mb-2">Schedule Manager</h3>
                  <p className="text-secondary max-w-lg mx-auto">
                    This component would allow configuring and managing schedules for data refresh operations,
                    including frequency, time of day, and dependencies.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="text-center py-8 bg-background-primary rounded-lg border border-border">
                  <Settings className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-primary mb-2">Integration Settings</h3>
                  <p className="text-secondary max-w-lg mx-auto">
                    This component would allow configuring global settings for the data integration system,
                    including rate limiting, proxy configuration, and error handling.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DataIntegrationProvider>
  );
};

export default DataIntegration;