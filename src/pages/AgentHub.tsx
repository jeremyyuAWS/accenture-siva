import React, { useState } from 'react';
import { 
  Bot, 
  Globe, 
  FileText, 
  Settings, 
  Clock, 
  Play, 
  X, 
  PlusCircle, 
  Database,
  Search,
  BookOpen,
  List,
  Briefcase,
  FilePlus,
  Webhook,
  Network,
  User,
  Newspaper,
  Linkedin,
  UserCircle
} from 'lucide-react';
import AgentCard from '../components/AgentCard';
import ReportSettingsModal from '../components/ReportSettingsModal';

const AgentHub: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Source agents
  const sourceAgents = [
    {
      id: 'pitchbook-agent',
      name: 'Pitchbook Agent',
      description: 'Extracts company data from Pitchbook API and database',
      status: 'active',
      lastRun: '12 minutes ago',
      icon: <Database className="h-5 w-5" />,
      color: 'bg-blue-600'
    },
    {
      id: 'apollo-agent',
      name: 'Apollo Agent',
      description: 'Retrieves contact and company information from Apollo',
      status: 'active',
      lastRun: '28 minutes ago',
      icon: <Database className="h-5 w-5" />,
      color: 'bg-purple-600'
    },
    {
      id: 'crunchbase-agent',
      name: 'Crunchbase Agent',
      description: 'Extracts funding and company details from Crunchbase',
      status: 'active',
      lastRun: '35 minutes ago',
      icon: <Database className="h-5 w-5" />,
      color: 'bg-green-600'
    },
    {
      id: 'perplexity-agent',
      name: 'Perplexity Agent',
      description: 'Performs intelligent web searches using Perplexity AI',
      status: 'active',
      lastRun: '14 minutes ago',
      icon: <Search className="h-5 w-5" />,
      color: 'bg-teal-600'
    }
  ];
  
  // Task agents
  const taskAgents = [
    {
      id: 'extractor-agent',
      name: 'Extractor Agent',
      description: 'Extracts structured data from various sources and formats',
      status: 'active',
      lastRun: '10 minutes ago',
      icon: <Webhook className="h-5 w-5" />,
      color: 'bg-orange-600'
    },
    {
      id: 'internet-search-agent',
      name: 'Internet Search Agent',
      description: 'Performs targeted web searches across multiple engines',
      status: 'active',
      lastRun: '5 minutes ago',
      icon: <Globe className="h-5 w-5" />,
      color: 'bg-cyan-600'
    },
    {
      id: 'company-research-agent',
      name: 'Company Research Agent',
      description: 'Conducts deep research on target companies',
      status: 'active',
      lastRun: '18 minutes ago',
      icon: <Briefcase className="h-5 w-5" />,
      color: 'bg-indigo-600'
    },
    {
      id: 'report-builder',
      name: 'Report Builder',
      description: 'Generates personalized reports based on your focus areas',
      status: 'active',
      lastRun: '2 hours ago',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-black'
    }
  ];
  
  // List builder agents
  const listBuilderAgents = [
    {
      id: 'master-list-agent',
      name: 'Master List Builder',
      description: 'Creates and maintains master list of target companies',
      status: 'active',
      lastRun: '15 minutes ago',
      icon: <List className="h-5 w-5" />,
      color: 'bg-red-600'
    },
    {
      id: 'custom-list-agent',
      name: 'Custom List Builder',
      description: 'Creates specialized lists based on custom criteria',
      status: 'inactive',
      icon: <FilePlus className="h-5 w-5" />,
      color: 'bg-yellow-600'
    },
    {
      id: 'knowledge-graph-agent',
      name: 'Knowledge Graph Builder',
      description: 'Constructs and maintains the knowledge graph database',
      status: 'active',
      lastRun: '42 minutes ago',
      icon: <Network className="h-5 w-5" />,
      color: 'bg-pink-600'
    },
    {
      id: 'new-agent',
      name: 'Add New Agent',
      description: 'Configure a new specialized agent for your needs',
      isAddCard: true,
      icon: <PlusCircle className="h-5 w-5" />,
      color: 'bg-gray-200'
    }
  ];
  
  // Role agents (from diagram)
  const roleAgents = [
    // Left side (data sources)
    {
      id: 'pitchbook-role',
      name: 'Pitchbook',
      description: 'Data source: Pitchbook',
      status: 'active',
      icon: <Database className="h-5 w-5" />, color: 'bg-blue-500'
    },
    {
      id: 'apollo-role',
      name: 'Apollo',
      description: 'Data source: Apollo',
      status: 'active',
      icon: <Database className="h-5 w-5" />, color: 'bg-purple-500'
    },
    {
      id: 'crunchbase-role',
      name: 'Crunchbase',
      description: 'Data source: Crunchbase',
      status: 'active',
      icon: <Database className="h-5 w-5" />, color: 'bg-green-500'
    },
    {
      id: 'specter-role',
      name: 'Specter',
      description: 'Data source: Specter',
      status: 'active',
      icon: <Database className="h-5 w-5" />, color: 'bg-gray-500'
    },
    {
      id: 'nvidia-role',
      name: 'Nvidia',
      description: 'Data source: Nvidia',
      status: 'active',
      icon: <Database className="h-5 w-5" />, color: 'bg-yellow-500'
    },
    {
      id: 'perplexity-role',
      name: 'Perplexity',
      description: 'Data source: Perplexity',
      status: 'active',
      icon: <Search className="h-5 w-5" />, color: 'bg-teal-500'
    },
    {
      id: 'google-role',
      name: 'Google',
      description: 'Data source: Google',
      status: 'active',
      icon: <Globe className="h-5 w-5" />, color: 'bg-red-500'
    },
    {
      id: 'exa-role',
      name: 'Exa',
      description: 'Data source: Exa',
      status: 'active',
      icon: <Database className="h-5 w-5" />, color: 'bg-pink-500'
    },
    {
      id: 'newsletters-role',
      name: 'Newsletters',
      description: 'Data source: Newsletters',
      status: 'active',
      icon: <Newspaper className="h-5 w-5" />, color: 'bg-indigo-500'
    },
    // Top (data types/tasks)
    {
      id: 'press-releases-role',
      name: 'Press Releases',
      description: 'Task: Press Releases',
      status: 'active',
      icon: <Newspaper className="h-5 w-5" />, color: 'bg-orange-500'
    },
    {
      id: 'newsletters-task-role',
      name: 'Newsletters (Task)',
      description: 'Task: Newsletters',
      status: 'active',
      icon: <Newspaper className="h-5 w-5" />, color: 'bg-indigo-400'
    },
    {
      id: 'linkedin-role',
      name: 'Linkedin',
      description: 'Task: Linkedin',
      status: 'active',
      icon: <Linkedin className="h-5 w-5" />, color: 'bg-blue-700'
    },
    {
      id: 'website-role',
      name: 'Website',
      description: 'Task: Website',
      status: 'active',
      icon: <Globe className="h-5 w-5" />, color: 'bg-gray-400'
    },
    {
      id: 'search-apis-role',
      name: 'Search APIs',
      description: 'Task: Search APIs',
      status: 'active',
      icon: <Search className="h-5 w-5" />, color: 'bg-green-400'
    },
    {
      id: 'founder-interview-role',
      name: 'Founder Interview',
      description: 'Task: Founder Interview',
      status: 'active',
      icon: <UserCircle className="h-5 w-5" />, color: 'bg-yellow-400'
    },
    {
      id: 'google-news-role',
      name: 'Google News',
      description: 'Task: Google News',
      status: 'active',
      icon: <Globe className="h-5 w-5" />, color: 'bg-red-400'
    },
  ];
  
  // Close the current modal
  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div>
      <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-black text-white">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Agent Hub</h2>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            Configure and manage your Agent Eddie agents
          </p>
        </div>
        
        <div className="p-4 bg-background-primary border-b border-border">
          <p className="text-secondary">
            Agents automatically collect data, analyze information, and execute tasks based on your needs.
          </p>
        </div>
      </div>
      
      {/* Source Agents */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-primary mb-4">Data Source Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {sourceAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onActivate={(id) => {
                alert(`Activating agent: ${id}`);
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Task Agents */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-primary mb-4">Task Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {taskAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onActivate={(id) => {
                if (id === 'report-builder') {
                  setActiveModal('report-settings');
                } else {
                  alert(`Activating agent: ${id}`);
                }
              }}
            />
          ))}
        </div>
      </div>
      
      {/* List Builder Agents */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-primary mb-4">List Builder Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {listBuilderAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onActivate={(id) => {
                alert(`Activating agent: ${id}`);
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Role Agents */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-primary mb-4">Role Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {roleAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onActivate={(id) => {
                alert(`Simulated demo: ${agent.name} agent activated!`);
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Report Settings Modal */}
      {activeModal === 'report-settings' && (
        <ReportSettingsModal onClose={closeModal} />
      )}
    </div>
  );
};

export default AgentHub;