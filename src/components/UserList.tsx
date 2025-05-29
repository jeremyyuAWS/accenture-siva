import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User, UserPlus, Mail, Calendar, Shield, Settings, X, Check } from 'lucide-react';
import UserProfileModal from './UserProfileModal';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'user',
    teamId: ''
  });
  const [inviting, setInviting] = useState(false);
  
  // Load users and teams on mount
  useEffect(() => {
    setLoading(true);
    
    // Get all users
    const allUsers = userService.getUsers();
    setUsers(allUsers);
    
    // Get all teams
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      const userTeams = userService.getUserTeams(currentUser.id);
      setTeams(userTeams);
    }
    
    setLoading(false);
  }, []);
  
  // Handle invite form change
  const handleInviteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInviteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle invite submission
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    
    try {
      // In a real implementation, this would send an invite email
      console.log('Inviting user:', inviteForm);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and close invite panel
      setInviteForm({
        email: '',
        role: 'user',
        teamId: ''
      });
      setInviteOpen(false);
      
      // Show success message
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-secondary rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          <span className="ml-3 text-primary">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Team Members</h2>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="px-2.5 py-1.5 bg-white text-black rounded-md hover:bg-gray-100 text-sm flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            Invite User
          </button>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Manage team members and their access permissions
        </p>
      </div>
      
      {inviteOpen && (
        <div className="p-4 bg-accent/5 border-b border-border">
          <h3 className="text-lg font-medium text-primary mb-4">Invite New Team Member</h3>
          
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-secondary" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={inviteForm.email}
                  onChange={handleInviteChange}
                  required
                  placeholder="colleague@example.com"
                  className="w-full pl-9 p-2.5 border border-border rounded-md bg-background-primary text-primary"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-primary mb-1">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 h-4 w-4 text-secondary" />
                  <select
                    id="role"
                    name="role"
                    value={inviteForm.role}
                    onChange={handleInviteChange}
                    className="w-full pl-9 p-2.5 border border-border rounded-md bg-background-primary text-primary"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="teamId" className="block text-sm font-medium text-primary mb-1">
                  Team
                </label>
                <select
                  id="teamId"
                  name="teamId"
                  value={inviteForm.teamId}
                  onChange={handleInviteChange}
                  className="w-full p-2.5 border border-border rounded-md bg-background-primary text-primary"
                >
                  <option value="">Select a team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="px-4 py-2 border border-border text-primary rounded-md hover:bg-background-primary transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={inviting || !inviteForm.email || !inviteForm.teamId}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:bg-gray-400"
              >
                {inviting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-background-primary">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Team(s)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background-secondary divide-y divide-border">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-background-primary">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.name} avatar`}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                        <span className="font-medium">{user.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-primary">{user.name}</p>
                      <p className="text-xs text-secondary">user@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-primary">
                    {teams
                      .filter(team => team.members.includes(user.id))
                      .map(team => team.name)
                      .join(', ') || 'No teams'}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-secondary flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>June 15, 2025</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingUser(user.id)}
                    className="text-accent hover:text-accent/80 mr-3"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Edit User Modal */}
      {editingUser && (
        <UserProfileModal
          userId={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

export default UserList;