import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { ChevronDown, Plus, Users, Folder } from 'lucide-react';

interface TeamWorkspaceSelectorProps {
  onSelectWorkspace: (workspaceId: string) => void;
}

const TeamWorkspaceSelector: React.FC<TeamWorkspaceSelectorProps> = ({ onSelectWorkspace }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  
  // Load teams and workspaces on mount
  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      // Load teams
      const userTeams = userService.getUserTeams(currentUser.id);
      setTeams(userTeams);
      
      // Set default selected team if available
      if (userTeams.length > 0) {
        setSelectedTeam(userTeams[0].id);
        
        // Load workspaces for first team
        const teamWorkspaces = userService.getTeamWorkspaces(userTeams[0].id);
        setWorkspaces(teamWorkspaces);
        
        // Set default selected workspace if available
        if (teamWorkspaces.length > 0) {
          setSelectedWorkspace(teamWorkspaces[0].id);
          onSelectWorkspace(teamWorkspaces[0].id);
        }
      }
    }
  }, [onSelectWorkspace]);
  
  // Load workspaces when selected team changes
  useEffect(() => {
    if (selectedTeam) {
      const teamWorkspaces = userService.getTeamWorkspaces(selectedTeam);
      setWorkspaces(teamWorkspaces);
      
      // Set default selected workspace if available
      if (teamWorkspaces.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(teamWorkspaces[0].id);
        onSelectWorkspace(teamWorkspaces[0].id);
      }
    }
  }, [selectedTeam, onSelectWorkspace, selectedWorkspace]);
  
  // Handle workspace selection
  const handleSelectWorkspace = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    onSelectWorkspace(workspaceId);
    setIsOpen(false);
  };
  
  // Get currently selected workspace and team names
  const selectedWorkspaceName = workspaces.find(w => w.id === selectedWorkspace)?.name || 'Select Workspace';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 w-full text-left bg-background-secondary border border-border rounded-md hover:bg-background-primary transition-colors"
      >
        <Folder className="h-4 w-4 text-accent mr-2" />
        <span className="text-sm text-primary flex-grow truncate max-w-[160px]">{selectedWorkspaceName}</span>
        <ChevronDown className="h-4 w-4 text-secondary ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute mt-1 w-56 right-0 rounded-md shadow-lg z-10 bg-background-secondary border border-border">
          <div className="p-2 border-b border-border">
            <div className="text-xs text-secondary mb-1">Current Team</div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-secondary mr-1.5" />
              <span className="text-sm text-primary">{teams.find(t => t.id === selectedTeam)?.name || 'Select Team'}</span>
            </div>
          </div>
          
          <div className="py-1">
            <div className="px-2 py-1 text-xs text-secondary">Workspaces</div>
            {workspaces.map(workspace => (
              <button
                key={workspace.id}
                onClick={() => handleSelectWorkspace(workspace.id)}
                className={`flex items-center px-3 py-2 w-full text-left text-sm ${
                  selectedWorkspace === workspace.id 
                    ? 'bg-accent text-white' 
                    : 'text-primary hover:bg-background-primary'
                }`}
              >
                <Folder className="h-4 w-4 mr-2" />
                {workspace.name}
              </button>
            ))}
            
            <button
              className="flex items-center px-3 py-2 w-full text-left text-sm text-accent hover:bg-background-primary"
              onClick={() => {
                // This would open a create workspace modal in a real implementation
                alert('This would open the create workspace modal');
                setIsOpen(false);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Workspace
            </button>
          </div>
          
          <div className="py-1 border-t border-border">
            <div className="px-2 py-1 text-xs text-secondary">Teams</div>
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => {
                  setSelectedTeam(team.id);
                  // This would load the team's workspaces in a real implementation
                }}
                className={`flex items-center px-3 py-2 w-full text-left text-sm ${
                  selectedTeam === team.id 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-primary hover:bg-background-primary'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                {team.name}
              </button>
            ))}
            
            <button
              className="flex items-center px-3 py-2 w-full text-left text-sm text-accent hover:bg-background-primary"
              onClick={() => {
                // This would open a create team modal in a real implementation
                alert('This would open the create team modal');
                setIsOpen(false);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Team
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamWorkspaceSelector;