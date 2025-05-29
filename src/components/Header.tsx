import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings, ChevronDown, UserCog, Bell, Users } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import UserProfileModal from './UserProfileModal';
import TeamWorkspaceSelector from './TeamWorkspaceSelector';

const Header: React.FC = () => {
  const { currentUser } = useAppContext();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  
  const handleTabChange = (tab: string) => {
    // Dispatch custom event to change tab
    const event = new CustomEvent('changeTab', {
      detail: { tab }
    });
    document.dispatchEvent(event);
  };
  
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center md:hidden">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-primary">Agent Eddie</span>
        </div>
      </div>
      
      <div className="hidden md:block">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-primary">Agent Eddie</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Workspace Selector */}
        <div className="hidden md:block">
          <TeamWorkspaceSelector onSelectWorkspace={() => {}} />
        </div>
        
        {/* Notifications */}
        <NotificationCenter />
        
        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center"
          >
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="h-8 w-8 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <span className="text-sm font-medium">
                  {currentUser?.name.substring(0, 1)}
                </span>
              </div>
            )}
            <span className="hidden md:block ml-2 text-sm font-medium text-primary">{currentUser?.name}</span>
            <ChevronDown className="h-4 w-4 text-secondary ml-1" />
          </button>
          
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background-secondary border border-border z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileModalOpen(true);
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-background-primary flex items-center"
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    handleTabChange('users');
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-background-primary flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  User Management
                </button>
                <button
                  onClick={() => {
                    handleTabChange('notifications');
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-background-primary flex items-center"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </button>
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={() => {
                    alert('In a real implementation, this would log you out');
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-background-primary"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Modal */}
      {profileModalOpen && (
        <UserProfileModal onClose={() => setProfileModalOpen(false)} />
      )}
    </div>
  );
};

export default Header;