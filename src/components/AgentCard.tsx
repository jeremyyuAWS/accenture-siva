import React from 'react';
import { Play, Clock, Settings, PlusCircle, Check } from 'lucide-react';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    status?: 'active' | 'inactive' | 'error';
    lastRun?: string;
    icon: React.ReactNode;
    color: string;
    isAddCard?: boolean;
  };
  onActivate: (id: string) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onActivate }) => {
  return (
    <div className={`bg-background-secondary rounded-lg border ${
      agent.status === 'active' ? 'border-accent/20' : 'border-border'
    } overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${agent.color} ${
              agent.isAddCard ? 'text-gray-600' : 'text-white'
            }`}>
              {agent.icon}
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-primary">{agent.name}</h3>
              {!agent.isAddCard && (
                <div className="flex items-center mt-0.5">
                  {agent.status === 'active' ? (
                    <>
                      <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1.5"></span>
                      <span className="text-xs text-green-600">Active</span>
                    </>
                  ) : agent.status === 'error' ? (
                    <>
                      <span className="h-1.5 w-1.5 bg-red-500 rounded-full mr-1.5"></span>
                      <span className="text-xs text-red-600">Error</span>
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                      <span className="text-xs text-secondary">Inactive</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {!agent.isAddCard && agent.status === 'active' && (
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 text-secondary mr-1.5" />
              <span className="text-xs text-secondary">{agent.lastRun}</span>
            </div>
          )}
        </div>
        
        <p className="text-secondary text-sm mt-3">
          {agent.description}
        </p>
      </div>
      
      <div className="px-4 py-3 bg-background-primary border-t border-border">
        <button
          onClick={() => onActivate(agent.id)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            agent.isAddCard
              ? 'bg-accent/10 text-accent hover:bg-accent/20'
              : agent.status === 'active'
              ? 'bg-background-secondary border border-border text-primary hover:bg-background-primary'
              : 'bg-black text-white hover:bg-gray-800'
          } flex items-center justify-center w-full`}
        >
          {agent.isAddCard ? (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Agent
            </>
          ) : agent.status === 'active' ? (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Activate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AgentCard;