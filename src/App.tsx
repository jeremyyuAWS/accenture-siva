import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import KnowledgeGraphReasoning from './pages/KnowledgeGraph';
import AgentHub from './pages/AgentHub';
import DataIntegration from './pages/DataIntegration';
import ReportCenter from './pages/ReportCenter';
import UserManagement from './pages/UserManagement';
import NotificationSettings from './pages/NotificationSettings';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import { useAppContext } from './context/AppContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { DataIntegrationProvider } from './services/dataIntegration/DataIntegrationService';
import IntegrationStatusPanel from './components/IntegrationStatusPanel';
import CompanySearch from './pages/CompanySearch';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('');
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  
  const { filteredCompanies, updateDealStage, setSelectedCompany, selectedCompany } = useAppContext();
  
  useEffect(() => {
    // Apply dark mode class to the document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for custom changeTab events
  useEffect(() => {
    const handleChangeTab = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.tab) {
        setActiveTab(customEvent.detail.tab);
        
        // If there's a scenario ID, save it
        if (customEvent.detail.scenarioId) {
          setScenarioId(customEvent.detail.scenarioId);
        } else {
          setScenarioId(null);
        }
      }
    };

    document.addEventListener('changeTab', handleChangeTab);
    
    return () => {
      document.removeEventListener('changeTab', handleChangeTab);
    };
  }, []);
  
  // Render the active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'knowledge':
        return <KnowledgeGraphReasoning />;
      case 'agents':
        return <AgentHub />;
      case 'company-search':
        return <CompanySearch />;
      case 'data-integration':
        return <DataIntegration />;
      case 'reports':
        return <ReportCenter />;
      case 'users':
        return <UserManagement />;
      case 'notifications':
        return <NotificationSettings />;
      case 'analytics':
        return <AnalyticsDashboardPage />;
      default:
        return <Home />;
    }
  };

  return (
    <DataIntegrationProvider>
      <div className={`${darkMode ? 'dark' : ''}`}>
        <div className="flex h-screen overflow-hidden bg-background-primary">
          {/* Mobile menu button */}
          <div className="fixed top-4 left-4 z-50 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md bg-background-secondary text-primary"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          {/* Sidebar */}
          <div className={`w-64 border-r border-border bg-background-secondary fixed md:relative h-screen z-30 transition-all duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <Sidebar 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsSidebarOpen(false);
                setScenarioId(null);
              }}
            />
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-background-secondary border-b border-border px-4 flex justify-between items-center">
              <Header />
              
              {/* Theme toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-background-primary ml-2"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <div className="max-w-7xl mx-auto">
                <IntegrationStatusPanel minimal={true} />
                <div className="mt-4">
                  {renderActiveTab()}
                </div>
              </div>
            </main>
            
            {/* Footer */}
            <footer className="bg-background-secondary border-t border-border py-3 px-6 text-center text-sm text-secondary">
              <p>
                Agent Eddie © 2025
              </p>
            </footer>
          </div>
        </div>
      </div>
    </DataIntegrationProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;