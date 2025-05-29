import React, { useState } from 'react';
import { 
  Bot, 
  Globe, 
  FileText, 
  Settings, 
  Clock, 
  Network,
  Database,
  Search,
  BookOpen,
  List,
  Briefcase,
  FilePlus,
  Webhook
} from 'lucide-react';
import AgentCard from '../components/AgentCard';
import ReportSettingsModal from '../components/ReportSettingsModal';
import { popularSearchScenarios } from '../data/demoScenarios';

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
      icon: <Plus className="h-5 w-5" />,
      color: 'bg-gray-200'
    }
  ];
  
  // Scenario agents - NEW
  const scenarioAgents = [
    {
      id: 'fintech-crypto-genai',
      name: 'Fintech + Crypto + GenAI',
      description: 'Discovers fintech companies operating in crypto space using generative AI',
      status: 'active',
      lastRun: '5 minutes ago',
      icon: <Database className="h-5 w-5" />,
      color: 'bg-blue-600'
    },
    {
      id: 'ai-healthcare-startups',
      name: 'AI Healthcare Startups',
      description: 'Identifies innovative AI startups in the healthcare sector',
      status: 'active',
      lastRun: '20 minutes ago',
      icon: <Bot className="h-5 w-5" />,
      color: 'bg-green-600'
    },
    {
      id: 'climate-tech-investors',
      name: 'Climate Tech Investors',
      description: 'Finds top investors funding climate tech and sustainability companies',
      status: 'active',
      lastRun: '35 minutes ago',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-emerald-600'
    },
    {
      id: 'cyber-security-acquisitions',
      name: 'Cybersecurity Acquisitions',
      description: 'Tracks recent M&A activity in the cybersecurity industry',
      status: 'active',
      lastRun: '1 hour ago',
      icon: <Search className="h-5 w-5" />,
      color: 'bg-violet-600'
    }
  ];
  
  // Close the current modal
  const closeModal = () => {
    setActiveModal(null);
  };

  // Activate a scenario agent (navigate to Knowledge Graph tab)
  const activateScenarioAgent = (scenarioId: string) => {
    // Find the matching scenario
    const scenario = popularSearchScenarios.find(s => s.id === scenarioId);
    
    if (scenario) {
      // Dispatch a custom event to change the tab and start search
      const tabChangeEvent = new CustomEvent('changeTab', {
        detail: { 
          tab: 'knowledge',
          scenarioId: scenarioId,
          autoStartSearch: true,  // Auto-start the search
          searchQuery: scenario.query || scenario.title
        }
      });
      document.dispatchEvent(tabChangeEvent);
    }
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
      
      {/* Scenario Agents - NEW */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-primary mb-4">Scenario Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {scenarioAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onActivate={(id) => {
                activateScenarioAgent(id);
              }}
            />
          ))}
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
                if (id === 'knowledge-graph-agent') {
                  // Navigate to Knowledge Graph tab when this agent is activated
                  const tabChangeEvent = new CustomEvent('changeTab', {
                    detail: { tab: 'knowledge' }
                  });
                  document.dispatchEvent(tabChangeEvent);
                } else {
                  alert(`Activating agent: ${id}`);
                }
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