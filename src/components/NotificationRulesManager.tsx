import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { Bell, Plus, Settings, ChevronDown, ChevronUp, Check, X, DollarSign, Globe, Building2, RefreshCw } from 'lucide-react';

const NotificationRulesManager: React.FC = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Load rules and channels on mount
  useEffect(() => {
    setLoading(true);
    
    // Get notification rules
    const notificationRules = notificationService.getNotificationRules();
    setRules(notificationRules);
    
    // Get notification channels
    const notificationChannels = notificationService.getNotificationChannels();
    setChannels(notificationChannels);
    
    // Initialize expanded state
    const expanded: Record<string, boolean> = {};
    notificationRules.forEach(rule => {
      expanded[rule.id] = false;
    });
    setExpandedRules(expanded);
    
    setLoading(false);
  }, []);
  
  // Toggle rule expansion
  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId]
    }));
  };
  
  // Start editing a rule
  const handleEdit = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      setEditingRule(ruleId);
      setEditForm({
        ...rule,
        conditions: {
          ...rule.conditions
        }
      });
    }
  };
  
  // Save edited rule
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save rule
      const savedRule = notificationService.saveNotificationRule(editForm);
      
      // Update local state
      setRules(prev => prev.map(rule => 
        rule.id === savedRule.id ? savedRule : rule
      ));
      
      // Close edit form
      setEditingRule(null);
      setEditForm(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving notification rule:', error);
      setIsSaving(false);
      alert('Failed to save notification rule. Please try again.');
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    setEditingRule(null);
    setEditForm(null);
  };
  
  // Update form data
  const updateFormData = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Update condition field
  const updateCondition = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }));
  };
  
  // Toggle channel in form
  const toggleChannel = (channel: string) => {
    setEditForm(prev => {
      const channels = [...prev.channels];
      const index = channels.indexOf(channel);
      
      if (index >= 0) {
        channels.splice(index, 1);
      } else {
        channels.push(channel);
      }
      
      return {
        ...prev,
        channels
      };
    });
  };
  
  // Toggle rule enabled state
  const toggleRuleEnabled = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      const updatedRule = {
        ...rule,
        enabled: !rule.enabled
      };
      
      // Save updated rule
      notificationService.saveNotificationRule(updatedRule);
      
      // Update local state
      setRules(prev => prev.map(r => 
        r.id === ruleId ? updatedRule : r
      ));
    }
  };
  
  // Delete a rule
  const handleDelete = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this notification rule?')) {
      // Delete rule
      notificationService.deleteNotificationRule(ruleId);
      
      // Update local state
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };
  
  // Create a new rule
  const handleCreateRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      name: 'New Notification Rule',
      description: 'Notify me about specific events',
      eventType: 'any',
      conditions: {},
      channels: ['in-app'],
      enabled: true
    };
    
    // Save new rule
    const savedRule = notificationService.saveNotificationRule(newRule);
    
    // Update local state
    setRules(prev => [...prev, savedRule]);
    
    // Start editing the new rule
    setEditingRule(savedRule.id);
    setEditForm(savedRule);
    
    // Expand the new rule
    setExpandedRules(prev => ({
      ...prev,
      [savedRule.id]: true
    }));
  };

  if (loading) {
    return (
      <div className="bg-background-secondary rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          <span className="ml-3 text-primary">Loading notification rules...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Notification Rules</h2>
          </div>
          <button
            onClick={handleCreateRule}
            className="px-2.5 py-1.5 bg-white text-black rounded-md hover:bg-gray-100 text-sm flex items-center"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Rule
          </button>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Configure when and how you receive notifications
        </p>
      </div>
      
      <div className="p-4">
        {rules.length > 0 ? (
          <div className="space-y-4">
            {rules.map(rule => (
              <div 
                key={rule.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                {editingRule === rule.id ? (
                  // Edit form
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-primary mb-4">Edit Notification Rule</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          Rule Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => updateFormData('description', e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">
                          Event Type
                        </label>
                        <select
                          value={editForm.eventType}
                          onChange={(e) => updateFormData('eventType', e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background-primary text-primary"
                        >
                          <option value="any">Any Event</option>
                          <option value="funding">Funding Events</option>
                          <option value="acquisition">Acquisitions</option>
                        </select>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-primary mb-2">Conditions</h4>
                        
                        <div className="space-y-3 p-3 bg-background-primary rounded-md border border-border">
                          {(editForm.eventType === 'funding' || editForm.eventType === 'acquisition') && (
                            <div>
                              <label className="block text-xs text-secondary mb-1">
                                Minimum Amount (in millions)
                              </label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2 h-4 w-4 text-secondary" />
                                <input
                                  type="number"
                                  value={editForm.conditions.minAmount ? editForm.conditions.minAmount / 1000000 : ''}
                                  onChange={(e) => updateCondition('minAmount', e.target.value ? Number(e.target.value) * 1000000 : undefined)}
                                  placeholder="Any amount"
                                  className="w-full pl-9 p-2 border border-border rounded-md bg-background-secondary text-primary"
                                />
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <label className="flex items-center text-xs text-secondary mb-1">
                              <Globe className="h-3.5 w-3.5 mr-1" />
                              Regions (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={editForm.conditions.regions?.join(', ') || ''}
                              onChange={(e) => updateCondition('regions', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                              placeholder="All regions"
                              className="w-full p-2 border border-border rounded-md bg-background-secondary text-primary"
                            />
                          </div>
                          
                          <div>
                            <label className="flex items-center text-xs text-secondary mb-1">
                              <Building2 className="h-3.5 w-3.5 mr-1" />
                              Industries (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={editForm.conditions.industries?.join(', ') || ''}
                              onChange={(e) => updateCondition('industries', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                              placeholder="All industries"
                              className="w-full p-2 border border-border rounded-md bg-background-secondary text-primary"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="watchlist-only"
                              checked={editForm.conditions.watchlistOnly || false}
                              onChange={(e) => updateCondition('watchlistOnly', e.target.checked)}
                              className="h-4 w-4 border-border text-accent rounded focus:ring-accent"
                            />
                            <label htmlFor="watchlist-only" className="ml-2 text-sm text-primary">
                              Only for companies in my watchlist
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-primary mb-2">Delivery Channels</h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="channel-in-app"
                              checked={editForm.channels.includes('in-app')}
                              onChange={() => toggleChannel('in-app')}
                              className="h-4 w-4 border-border text-accent rounded focus:ring-accent"
                            />
                            <label htmlFor="channel-in-app" className="ml-2 text-sm text-primary">
                              In-App Notifications
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="channel-email"
                              checked={editForm.channels.includes('email')}
                              onChange={() => toggleChannel('email')}
                              className="h-4 w-4 border-border text-accent rounded focus:ring-accent"
                            />
                            <label htmlFor="channel-email" className="ml-2 text-sm text-primary">
                              Email Notifications
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="channel-mobile"
                              checked={editForm.channels.includes('mobile')}
                              onChange={() => toggleChannel('mobile')}
                              className="h-4 w-4 border-border text-accent rounded focus:ring-accent"
                            />
                            <label htmlFor="channel-mobile" className="ml-2 text-sm text-primary">
                              Mobile Push Notifications
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-background-primary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 flex items-center"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1.5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div 
                      className="p-3 bg-background-primary border-b border-border flex justify-between items-center cursor-pointer"
                      onClick={() => toggleRuleExpansion(rule.id)}
                    >
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded-full mr-2 ${rule.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <h3 className="font-medium text-primary">{rule.name}</h3>
                      </div>
                      <div className="flex items-center">
                        <div className="flex space-x-2 mr-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRuleEnabled(rule.id);
                            }}
                            className={`px-2 py-0.5 text-xs rounded ${
                              rule.enabled 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                          >
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                        {expandedRules[rule.id] ? (
                          <ChevronUp className="h-4 w-4 text-secondary" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-secondary" />
                        )}
                      </div>
                    </div>
                    
                    {expandedRules[rule.id] && (
                      <div className="p-3">
                        <p className="text-sm text-secondary mb-3">{rule.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="bg-background-primary p-2 rounded-md border border-border">
                            <h4 className="text-xs font-medium text-secondary mb-1">Event Type</h4>
                            <p className="text-sm text-primary">
                              {rule.eventType === 'any' ? 'Any Event' : 
                               rule.eventType === 'funding' ? 'Funding Events' : 
                               'Acquisitions'}
                            </p>
                          </div>
                          
                          <div className="bg-background-primary p-2 rounded-md border border-border">
                            <h4 className="text-xs font-medium text-secondary mb-1">Delivery Channels</h4>
                            <div className="flex flex-wrap gap-1">
                              {rule.channels.map((channel: string) => (
                                <span 
                                  key={channel}
                                  className="px-1.5 py-0.5 text-xs bg-accent/10 text-accent rounded"
                                >
                                  {channel === 'in-app' ? 'In-App' : 
                                   channel === 'email' ? 'Email' : 'Mobile'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-background-primary p-2 rounded-md border border-border mb-3">
                          <h4 className="text-xs font-medium text-secondary mb-1">Conditions</h4>
                          <div className="space-y-1">
                            {rule.conditions?.minAmount && (
                              <div className="flex items-center text-sm">
                                <DollarSign className="h-3.5 w-3.5 text-secondary mr-1" />
                                <span className="text-primary">
                                  Minimum amount: ${(rule.conditions.minAmount / 1000000).toFixed(1)}M
                                </span>
                              </div>
                            )}
                            
                            {rule.conditions?.industries && rule.conditions.industries.length > 0 && (
                              <div className="flex items-center text-sm">
                                <Building2 className="h-3.5 w-3.5 text-secondary mr-1" />
                                <span className="text-primary">
                                  Industries: {rule.conditions.industries.join(', ')}
                                </span>
                              </div>
                            )}
                            
                            {rule.conditions?.regions && rule.conditions.regions.length > 0 && (
                              <div className="flex items-center text-sm">
                                <Globe className="h-3.5 w-3.5 text-secondary mr-1" />
                                <span className="text-primary">
                                  Regions: {rule.conditions.regions.join(', ')}
                                </span>
                              </div>
                            )}
                            
                            {rule.conditions?.watchlistOnly && (
                              <div className="flex items-center text-sm">
                                <Check className="h-3.5 w-3.5 text-secondary mr-1" />
                                <span className="text-primary">
                                  Only for companies in watchlist
                                </span>
                              </div>
                            )}
                            
                            {(!rule.conditions || Object.keys(rule.conditions).length === 0) && (
                              <div className="text-sm text-secondary">
                                No conditions set (all events of this type)
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(rule.id)}
                            className="px-2.5 py-1 text-xs bg-background-primary border border-border rounded hover:bg-background-primary transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(rule.id)}
                            className="px-2.5 py-1 text-xs bg-red-50 text-red-600 border border-red-100 rounded hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-primary mb-2">No Notification Rules</h3>
            <p className="text-secondary max-w-md mx-auto mb-4">
              Create notification rules to get alerts about funding events, acquisitions, and other activities that match your criteria.
            </p>
            <button
              onClick={handleCreateRule}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Create Your First Rule
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-background-primary border-t border-border">
        <div className="text-sm text-secondary">
          <p>
            Notification rules determine when and how you receive alerts about funding events, acquisitions, and other activities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationRulesManager;