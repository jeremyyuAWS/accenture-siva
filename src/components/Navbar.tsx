import React, { useState } from 'react';
import { Send, PieChart, Database, MessageSquare, Settings, LogOut, Menu, X, User, Link2, ClipboardCheck, Kanban } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import NotificationCenter from './NotificationCenter';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const { currentUser } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const tabs = [
    { id: 'search', name: 'Search', icon: <Send className="h-5 w-5" /> },
    { id: 'targets', name: 'Targets', icon: <Database className="h-5 w-5" /> },
    { id: 'pipeline', name: 'Deal Pipeline', icon: <Kanban className="h-5 w-5" /> },
    { id: 'diligence', name: 'Due Diligence', icon: <ClipboardCheck className="h-5 w-5" /> },
    { id: 'report', name: 'Report', icon: <PieChart className="h-5 w-5" /> },
    { id: 'chat', name: 'AI Chat', icon: <MessageSquare className="h-5 w-5" /> },
  ];
  
  return (
    <div className="bg-white shadow-md">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <div className="bg-black text-white p-2 rounded">
                  <PieChart className="h-6 w-6" />
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-800">M&A Scout AI</span>
              </div>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full ${
                    activeTab === tab.id
                      ? 'border-black text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <div className="mr-2">{tab.icon}</div>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Notifications */}
            <NotificationCenter />
            
            {currentUser && (
              <div className="flex items-center ml-4">
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {currentUser.name.substring(0, 1)}
                    </span>
                  </div>
                )}
                <span className="ml-2 text-sm font-medium text-gray-700">{currentUser.name}</span>
              </div>
            )}
            
            <div className="ml-3 relative">
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              {mobileMenuOpen ? 
                <X className="block h-6 w-6" /> : 
                <Menu className="block h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${
                  activeTab === tab.id
                    ? 'bg-gray-50 border-black text-gray-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <div className="mr-3">{tab.icon}</div>
                  {tab.name}
                </div>
              </button>
            ))}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {currentUser && (
              <div className="flex items-center px-4">
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {currentUser.name.substring(0, 1)}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{currentUser.name}</div>
                  <div className="text-sm font-medium text-gray-500">{currentUser.role}</div>
                </div>
              </div>
            )}
            
            <div className="mt-3 space-y-1">
              <button
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5" />
                  Your Profile
                </div>
              </button>
              <button
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </div>
              </button>
              <button
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;