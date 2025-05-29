import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { User, Users, Settings, Shield } from 'lucide-react';
import UserList from '../components/UserList';
import CustomPreferencesPanel from '../components/CustomPreferencesPanel';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <div className="space-y-6">
      <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-black text-white">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">User Management</h2>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            Manage team members, preferences, and access controls
          </p>
        </div>
        
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border">
            <TabsList className="h-10 w-full bg-background-primary">
              <TabsTrigger 
                value="users" 
                className={`flex items-center h-10 px-4 ${activeTab === 'users' ? 'border-b-2 border-accent' : ''}`}
              >
                <User className="h-4 w-4 mr-2" />
                Team Members
              </TabsTrigger>
              
              <TabsTrigger 
                value="teams" 
                className={`flex items-center h-10 px-4 ${activeTab === 'teams' ? 'border-b-2 border-accent' : ''}`}
              >
                <Users className="h-4 w-4 mr-2" />
                Teams & Workspaces
              </TabsTrigger>
              
              <TabsTrigger 
                value="preferences" 
                className={`flex items-center h-10 px-4 ${activeTab === 'preferences' ? 'border-b-2 border-accent' : ''}`}
              >
                <Settings className="h-4 w-4 mr-2" />
                User Preferences
              </TabsTrigger>
              
              <TabsTrigger 
                value="roles" 
                className={`flex items-center h-10 px-4 ${activeTab === 'roles' ? 'border-b-2 border-accent' : ''}`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Roles & Permissions
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="users">
              <UserList />
            </TabsContent>
            
            <TabsContent value="teams">
              <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-black text-white">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <h2 className="text-lg font-semibold">Teams & Workspaces</h2>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    Manage collaborative teams and their workspaces
                  </p>
                </div>
                
                <div className="p-8 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-xl font-medium text-primary mb-2">Team Management</h3>
                  <p className="text-secondary max-w-md mx-auto mb-6">
                    Create and manage teams, add members, and organize workspaces for collaborative CVC activities.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Create New Team
                    </button>
                    <button
                      className="px-4 py-2 border border-border text-primary rounded-md hover:bg-background-primary transition-colors"
                    >
                      Manage Existing Teams
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences">
              <CustomPreferencesPanel />
            </TabsContent>
            
            <TabsContent value="roles">
              <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-black text-white">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <h2 className="text-lg font-semibold">Roles & Permissions</h2>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    Configure access controls and permission levels
                  </p>
                </div>
                
                <div className="p-8 text-center">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-xl font-medium text-primary mb-2">Access Control System</h3>
                  <p className="text-secondary max-w-md mx-auto mb-6">
                    Define roles, set permissions, and manage access control for different parts of the system.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Define Custom Roles
                    </button>
                    <button
                      className="px-4 py-2 border border-border text-primary rounded-md hover:bg-background-primary transition-colors"
                    >
                      Manage Permissions
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagement;