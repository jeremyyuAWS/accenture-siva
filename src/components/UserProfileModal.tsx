import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { X, User, Mail, Shield, Check, RefreshCw } from 'lucide-react';

interface UserProfileModalProps {
  onClose: () => void;
  userId?: string; // If provided, edit this user, otherwise edit current user
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose, userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    avatar: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Load user data on mount
  useEffect(() => {
    const user = userId 
      ? userService.getUserById(userId)
      : userService.getCurrentUser();
    
    if (user) {
      setFormData({
        name: user.name,
        email: 'user@example.com', // Mock email since it's not in our User type
        role: user.role,
        avatar: user.avatar || '',
      });
    }
  }, [userId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real implementation, this would update the user in the database
      const targetUserId = userId || userService.getCurrentUser()?.id;
      
      if (!targetUserId) {
        throw new Error('No user selected for update');
      }
      
      const updatedUser = userService.updateUser(targetUserId, {
        name: formData.name,
        avatar: formData.avatar,
        role: formData.role as 'user' | 'admin'
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (updatedUser) {
        // Success
        onClose();
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 bg-black text-white flex justify-between items-center">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">User Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-secondary" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 p-2.5 border border-border rounded-md bg-background-primary text-primary"
                />
              </div>
            </div>
            
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 p-2.5 border border-border rounded-md bg-background-primary text-primary"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-primary mb-1">
                Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 h-4 w-4 text-secondary" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-9 p-2.5 border border-border rounded-md bg-background-primary text-primary"
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-primary mb-1">
                Avatar URL
              </label>
              <input
                type="text"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full p-2.5 border border-border rounded-md bg-background-primary text-primary"
              />
              
              {formData.avatar && (
                <div className="mt-2 flex items-center">
                  <img
                    src={formData.avatar}
                    alt="Avatar Preview"
                    className="h-10 w-10 rounded-full object-cover mr-2 border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <span className="text-xs text-secondary">Avatar Preview</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-primary rounded-md hover:bg-background-primary transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:bg-gray-400"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;