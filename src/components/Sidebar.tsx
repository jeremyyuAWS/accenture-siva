import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Home, 
  Network, 
  Bot, 
  Database,
  FileText,
  Users,
  Bell,
  BarChart2,
  HelpCircle,
  Settings,
  LogOut,
  Search
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { currentUser } = useAppContext();
  
  const tabs = [
    { id: 'home', name: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'knowledge', name: 'Knowledge Graph Reasoning', icon: <Network className="h-5 w-5" /> },
    { id: 'agents', name: 'Agent Hub', icon: <Bot className="h-5 w-5" /> },
    { id: 'company-search', name: 'Company Search', icon: <Search className="h-5 w-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart2 className="h-5 w-5" /> },
    { id: 'reports', name: 'Report Center', icon: <FileText className="h-5 w-5" /> },
    { id: 'data-integration', name: 'Data Integration', icon: <Database className="h-5 w-5" /> },
    { id: 'users', name: 'User Management', icon: <Users className="h-5 w-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-5 w-5" /> },
  ];
  
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center">
        <div className="mr-3">
          <Bot className="h-8 w-8 text-accent" />
        </div>
        <div>
          <span className="text-lg font-semibold text-primary block leading-none">Agent</span>
          <span className="text-lg font-semibold text-primary block leading-none">Eddie</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1.5">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'text-primary hover:bg-background-primary hover:text-accent'
                }`}
              >
                <div className="mr-3">{tab.icon}</div>
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User */}
      <div className="p-4 border-t border-border">
        {currentUser && (
          <div className="flex items-center">
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <span className="font-medium">
                  {currentUser.name.substring(0, 1)}
                </span>
              </div>
            )}
            <div className="ml-3">
              <div className="text-sm font-medium text-primary">{currentUser.name}</div>
              <div className="text-xs text-secondary">{currentUser.role}</div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex space-x-3">
          <button className="flex-1 p-2 rounded-md bg-background-primary border border-border text-primary hover:bg-accent hover:text-white hover:border-accent text-xs font-medium flex justify-center items-center transition-colors">
            <HelpCircle className="h-4 w-4 mr-1" />
            Help
          </button>
          <button className="flex-1 p-2 rounded-md bg-background-primary border border-border text-primary hover:bg-accent hover:text-white hover:border-accent text-xs font-medium flex justify-center items-center transition-colors">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;