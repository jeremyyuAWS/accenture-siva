import { User } from '../../types';

/**
 * Service for managing users and authentication
 */
export class UserService {
  private users: User[] = [];
  private currentUser: User | null = null;
  private teams: any[] = [];
  private workspaces: any[] = [];
  private preferences: Record<string, any> = {};
  
  constructor() {
    this.loadInitialData();
  }
  
  /**
   * Load initial mock data
   */
  private loadInitialData(): void {
    // Mock users
    this.users = [
      {
        id: '1',
        name: 'Patryk Johnson',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        role: 'admin',
      },
      {
        id: '2',
        name: 'Shruti Patel',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        role: 'admin',
      },
      {
        id: '3',
        name: 'Marcus Chen',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
        role: 'user',
      },
      {
        id: '4',
        name: 'Jennifer Reynolds',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
        role: 'user',
      }
    ];
    
    // Set default current user
    this.currentUser = this.users[0];
    
    // Mock teams
    this.teams = [
      {
        id: 'team-1',
        name: 'CVC Investment Team',
        description: 'Team focused on corporate venture capital investments',
        members: ['1', '2', '3'],
        owner: '1',
        createdAt: new Date('2024-12-15')
      },
      {
        id: 'team-2',
        name: 'M&A Strategy',
        description: 'Team focused on merger and acquisition strategy',
        members: ['1', '4'],
        owner: '1',
        createdAt: new Date('2025-02-10')
      }
    ];
    
    // Mock workspaces
    this.workspaces = [
      {
        id: 'workspace-1',
        name: 'Tech Investments',
        description: 'Tracking tech investment opportunities',
        teamId: 'team-1',
        focusAreas: {
          industries: ['AI/ML', 'Fintech', 'Cybersecurity'],
          regions: ['North America', 'Europe'],
          eventTypes: ['seed', 'series_a', 'series_b']
        },
        createdAt: new Date('2025-01-05'),
        lastModified: new Date('2025-06-30')
      },
      {
        id: 'workspace-2',
        name: 'Clean Energy',
        description: 'Tracking opportunities in clean energy and climate tech',
        teamId: 'team-1',
        focusAreas: {
          industries: ['ClimateTech', 'Clean Energy', 'Sustainable Materials'],
          regions: ['Europe', 'North America', 'Asia Pacific'],
          eventTypes: ['series_a', 'series_b', 'acquisition']
        },
        createdAt: new Date('2025-03-20'),
        lastModified: new Date('2025-06-28')
      }
    ];
    
    // Mock user preferences
    this.preferences = {
      '1': {
        darkMode: false,
        notifications: {
          email: true,
          inApp: true,
          digest: 'daily'
        },
        defaultWorkspace: 'workspace-1',
        ui: {
          compactView: false,
          showWelcome: true
        }
      }
    };
  }
  
  /**
   * Get all users
   */
  getUsers(): User[] {
    return [...this.users];
  }
  
  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  /**
   * Set current user
   */
  setCurrentUser(userId: string): User | null {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      return user;
    }
    return null;
  }
  
  /**
   * Get user by ID
   */
  getUserById(userId: string): User | null {
    return this.users.find(u => u.id === userId) || null;
  }
  
  /**
   * Create a new user
   */
  createUser(user: Omit<User, 'id'>): User {
    const newUser = {
      ...user,
      id: `user-${Date.now()}`
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  /**
   * Update a user
   */
  updateUser(userId: string, userData: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === userId);
    if (index >= 0) {
      this.users[index] = {
        ...this.users[index],
        ...userData
      };
      
      // Update current user if it's the same one
      if (this.currentUser?.id === userId) {
        this.currentUser = this.users[index];
      }
      
      return this.users[index];
    }
    return null;
  }
  
  /**
   * Delete a user
   */
  deleteUser(userId: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== userId);
    
    // Clear current user if it's the deleted one
    if (this.currentUser?.id === userId) {
      this.currentUser = null;
    }
    
    return this.users.length < initialLength;
  }
  
  /**
   * Get teams for a user
   */
  getUserTeams(userId: string): any[] {
    return this.teams.filter(team => team.members.includes(userId));
  }
  
  /**
   * Get workspaces for a team
   */
  getTeamWorkspaces(teamId: string): any[] {
    return this.workspaces.filter(workspace => workspace.teamId === teamId);
  }
  
  /**
   * Create a new team
   */
  createTeam(team: { name: string; description?: string; members: string[]; }): any {
    if (!this.currentUser) {
      throw new Error('User must be logged in to create a team');
    }
    
    const newTeam = {
      id: `team-${Date.now()}`,
      name: team.name,
      description: team.description || '',
      members: team.members,
      owner: this.currentUser.id,
      createdAt: new Date()
    };
    
    this.teams.push(newTeam);
    return newTeam;
  }
  
  /**
   * Create a new workspace
   */
  createWorkspace(workspace: { 
    name: string; 
    description?: string; 
    teamId: string; 
    focusAreas?: any;
  }): any {
    if (!this.currentUser) {
      throw new Error('User must be logged in to create a workspace');
    }
    
    // Check if team exists
    const team = this.teams.find(t => t.id === workspace.teamId);
    if (!team) {
      throw new Error(`Team with ID ${workspace.teamId} not found`);
    }
    
    const newWorkspace = {
      id: `workspace-${Date.now()}`,
      name: workspace.name,
      description: workspace.description || '',
      teamId: workspace.teamId,
      focusAreas: workspace.focusAreas || {
        industries: [],
        regions: [],
        eventTypes: []
      },
      createdAt: new Date(),
      lastModified: new Date()
    };
    
    this.workspaces.push(newWorkspace);
    return newWorkspace;
  }
  
  /**
   * Get user preferences
   */
  getUserPreferences(userId: string): any {
    return this.preferences[userId] || {};
  }
  
  /**
   * Update user preferences
   */
  updateUserPreferences(userId: string, preferences: any): any {
    this.preferences[userId] = {
      ...this.preferences[userId],
      ...preferences
    };
    
    return this.preferences[userId];
  }
  
  /**
   * Check if a user has a specific permission
   */
  hasPermission(userId: string, permission: string): boolean {
    const user = this.getUserById(userId);
    
    // Admin has all permissions
    if (user?.role === 'admin') {
      return true;
    }
    
    // Check specific permissions for other roles
    switch (permission) {
      case 'create_workspace':
        // Any user can create a workspace
        return true;
      
      case 'manage_team':
        // Team owners can manage their teams
        return this.teams.some(team => team.owner === userId);
      
      case 'invite_users':
        // Team owners and admins can invite users
        return user?.role === 'admin' || this.teams.some(team => team.owner === userId);
      
      default:
        return false;
    }
  }
}

// Create singleton instance
export const userService = new UserService();