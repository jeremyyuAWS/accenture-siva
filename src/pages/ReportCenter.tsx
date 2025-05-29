import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { FileText, Clock, Settings, BarChart2, Calendar } from 'lucide-react';
import ReportDeliveryHistoryPanel from '../components/ReportDeliveryHistoryPanel';
import ReportScheduleManager from '../components/ReportScheduleManager';
import ReportPreview from '../components/ReportPreview';
import ReportSettingsModal from '../components/ReportSettingsModal';

const ReportCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-black text-white">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Report Center</h2>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            Generate, schedule, and access personalized funding reports
          </p>
        </div>
        
        <Tabs defaultValue="history" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border">
            <TabsList className="h-10 w-full bg-background-primary">
              <TabsTrigger 
                value="history" 
                className={`flex items-center h-10 px-4 ${activeTab === 'history' ? 'border-b-2 border-accent' : ''}`}
              >
                <Clock className="h-4 w-4 mr-2" />
                Report History
              </TabsTrigger>
              
              <TabsTrigger 
                value="schedules" 
                className={`flex items-center h-10 px-4 ${activeTab === 'schedules' ? 'border-b-2 border-accent' : ''}`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Report Schedules
              </TabsTrigger>
              
              <TabsTrigger 
                value="samples" 
                className={`flex items-center h-10 px-4 ${activeTab === 'samples' ? 'border-b-2 border-accent' : ''}`}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Sample Reports
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-4 bg-background-primary flex justify-between items-center">
            <p className="text-secondary text-sm">
              Personalized reports based on your focus areas and watchlist
            </p>
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
            >
              <Settings className="h-4 w-4 mr-1.5" />
              Configure Reports
            </button>
          </div>
          
          <div className="p-6">
            <TabsContent value="history">
              <ReportDeliveryHistoryPanel />
            </TabsContent>
            
            <TabsContent value="schedules">
              <ReportScheduleManager />
            </TabsContent>
            
            <TabsContent value="samples">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4 flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-lg font-medium text-primary">Bullet Format</h3>
                  </div>
                  <ReportPreview format="bullet" includeVisuals={true} frequency="weekly" />
                </div>
                <div>
                  <div className="mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-lg font-medium text-primary">Paragraph Format</h3>
                  </div>
                  <ReportPreview format="paragraph" includeVisuals={false} frequency="daily" />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* Report Settings Modal */}
      {settingsModalOpen && (
        <ReportSettingsModal onClose={() => setSettingsModalOpen(false)} />
      )}
    </div>
  );
};

export default ReportCenter;