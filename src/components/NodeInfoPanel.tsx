import React, { useState } from 'react';
import { X, ExternalLink, Calendar, DollarSign, Building2, Globe, Hash, TrendingUp, Users, PieChart } from 'lucide-react';
import { graphService } from '../services/graphService';

interface NodeInfoPanelProps {
  node: any;
  onClose: () => void;
}

const NodeInfoPanel: React.FC<NodeInfoPanelProps> = ({ node, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'connections' | 'events'>('overview');
  
  // Check node type
  const isCompany = node.type === 'company';
  const isInvestor = node.type === 'investor';
  const isIndustry = node.type === 'industry';
  
  // Find subgraph for this node to show connections
  const subgraph = graphService.getSubgraph(node.id, 1);
  const connections = subgraph.edges.filter(edge => 
    edge.source === node.id || edge.target === node.id
  );
  
  // Get connected nodes
  const connectedNodeIds = connections.flatMap(edge => [edge.source, edge.target]);
  const connectedNodes = subgraph.nodes.filter(n => 
    n.id !== node.id && connectedNodeIds.includes(n.id)
  );
  
  // Get events for this node (for company/investor nodes)
  const getNodeEvents = () => {
    // For companies, get funding rounds and acquisitions
    if (isCompany) {
      return connections
        .filter(edge => 
          edge.type === 'invested_in' || edge.type === 'acquired'
        )
        .map(edge => {
          const connectedNode = subgraph.nodes.find(n => 
            (edge.type === 'invested_in' && edge.source === n.id) ||
            (edge.type === 'acquired' && edge.source === n.id)
          );
          
          return {
            type: edge.type === 'invested_in' ? 'Funding Round' : 'Acquisition',
            date: edge.properties?.timestamp ? new Date(edge.properties.timestamp as string) : new Date(),
            amount: edge.properties?.amount as number || 0,
            counterparty: connectedNode?.name || 'Unknown',
            details: edge.properties?.description as string || ''
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    
    // For investors, get investments
    if (isInvestor) {
      return connections
        .filter(edge => edge.type === 'invested_in')
        .map(edge => {
          const company = subgraph.nodes.find(n => edge.target === n.id);
          
          return {
            type: 'Investment',
            date: edge.properties?.timestamp ? new Date(edge.properties.timestamp as string) : new Date(),
            amount: edge.properties?.amount as number || 0,
            counterparty: company?.name || 'Unknown',
            details: edge.properties?.description as string || ''
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    
    // For industries, no events
    return [];
  };
  
  const events = getNodeEvents();
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    } else if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    } else if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };
  
  // Get the icon for the node type
  const getNodeIcon = () => {
    if (isCompany) return <Building2 className="h-4 w-4" />;
    if (isInvestor) return <Users className="h-4 w-4" />;
    if (isIndustry) return <Hash className="h-4 w-4" />;
    return <Hash className="h-4 w-4" />;
  };
  
  // Get the background color for the node icon
  const getNodeIconBg = () => {
    if (isCompany) return 'bg-accent text-white';
    if (isInvestor) return 'bg-green-600 text-white';
    if (isIndustry) return 'bg-gray-600 text-white';
    return 'bg-gray-600 text-white';
  };

  return (
    <div className="bg-background-primary rounded-lg border border-border">
      <div className="flex justify-between items-start p-3 border-b border-border">
        <div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${getNodeIconBg()}`}>
              {getNodeIcon()}
            </div>
            <div>
              <h3 className="font-medium text-primary">{node.name}</h3>
              <p className="text-xs text-secondary">
                {isCompany ? 'Company' : isInvestor ? 'Investor' : isIndustry ? 'Industry' : 'Entity'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-secondary hover:text-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 text-xs font-medium border-b-2 ${
              activeTab === 'overview' 
                ? 'border-accent text-primary' 
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`py-2 px-3 text-xs font-medium border-b-2 ${
              activeTab === 'connections' 
                ? 'border-accent text-primary' 
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            Connections ({connectedNodes.length})
          </button>
          {(isCompany || isInvestor) && (
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-3 text-xs font-medium border-b-2 ${
                activeTab === 'events' 
                  ? 'border-accent text-primary' 
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              Events ({events.length})
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3">
        {activeTab === 'overview' && (
          <>
            {isCompany && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-secondary mr-1.5" />
                    <div>
                      <p className="text-xs text-secondary">Industry</p>
                      <p className="text-sm font-medium">{node.properties?.industry || 'Technology'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-secondary mr-1.5" />
                    <div>
                      <p className="text-xs text-secondary">Region</p>
                      <p className="text-sm font-medium">{node.properties?.region || 'Global'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-secondary mr-1.5" />
                    <div>
                      <p className="text-xs text-secondary">Funding Stage</p>
                      <p className="text-sm font-medium">{node.properties?.fundingStage || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-secondary mr-1.5" />
                    <div>
                      <p className="text-xs text-secondary">Last Event</p>
                      <p className="text-sm font-medium">{events[0]?.date.toLocaleDateString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center mb-2">
                    <PieChart className="h-4 w-4 text-secondary mr-1.5" />
                    <p className="text-sm font-medium text-primary">Company Overview</p>
                  </div>
                  <p className="text-xs text-secondary">
                    {node.name} is a {node.properties?.fundingStage || 'growth-stage'} company in the {node.properties?.industry || 'technology'} sector. 
                    Based in {node.properties?.region || 'North America'}, the company has raised several funding rounds and is positioned as an innovative player in its market.
                  </p>
                </div>
              </>
            )}
            
            {isInvestor && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-secondary mr-1.5" />
                    <div>
                      <p className="text-xs text-secondary">Investor Type</p>
                      <p className="text-sm font-medium">{node.properties?.investorType || 'Venture Capital'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-secondary mr-1.5" />
                    <div>
                      <p className="text-xs text-secondary">Region</p>
                      <p className="text-sm font-medium">{node.properties?.region || 'Global'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-secondary mr-1.5" />
                    <div>
                      <p className="text-xs text-secondary">Investments</p>
                      <p className="text-sm font-medium">{events.length || '0'} deals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-secondary mr-1.5" />
                    <div>
                      <p className="text-xs text-secondary">Last Investment</p>
                      <p className="text-sm font-medium">{events[0]?.date.toLocaleDateString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center mb-2">
                    <PieChart className="h-4 w-4 text-secondary mr-1.5" />
                    <p className="text-sm font-medium text-primary">Investor Overview</p>
                  </div>
                  <p className="text-xs text-secondary">
                    {node.name} is a leading {node.properties?.investorType || 'venture capital firm'} based in {node.properties?.region || 'North America'}.
                    They focus on investments in technology companies with particular interest in AI/ML, cloud infrastructure, and enterprise software.
                  </p>
                </div>
              </>
            )}
            
            {isIndustry && (
              <div className="pt-2">
                <div className="flex items-center mb-2">
                  <PieChart className="h-4 w-4 text-secondary mr-1.5" />
                  <p className="text-sm font-medium text-primary">Industry Overview</p>
                </div>
                <p className="text-xs text-secondary">
                  The {node.name} sector has seen significant activity in the past quarter with substantial funding and acquisition events.
                  Companies in this space are attracting strong investor interest, particularly in innovative technology applications.
                </p>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-secondary">Connected Companies</span>
                    <span className="text-xs font-medium text-primary">{connectedNodes.filter(n => n.type === 'company').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-secondary">Active Investors</span>
                    <span className="text-xs font-medium text-primary">{connectedNodes.filter(n => n.type === 'investor').length}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-border">
              <button
                className="text-xs text-accent hover:text-accent/80 flex items-center"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                View Full Profile
              </button>
            </div>
          </>
        )}
        
        {activeTab === 'connections' && (
          <div className="space-y-3">
            <div className="text-xs text-secondary mb-1">
              Showing {connectedNodes.length} connections for {node.name}
            </div>
            
            {connectedNodes.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {connectedNodes.map((connectedNode, index) => {
                  // Find the edge connecting these nodes
                  const edge = connections.find(e => 
                    (e.source === node.id && e.target === connectedNode.id) ||
                    (e.source === connectedNode.id && e.target === node.id)
                  );
                  
                  // Determine relationship label
                  let relationshipLabel = 'Connected to';
                  if (edge) {
                    if (edge.type === 'invested_in' && edge.source === connectedNode.id) {
                      relationshipLabel = 'Invested in';
                    } else if (edge.type === 'invested_in' && edge.target === connectedNode.id) {
                      relationshipLabel = 'Received investment from';
                    } else if (edge.type === 'acquired' && edge.source === connectedNode.id) {
                      relationshipLabel = 'Acquired';
                    } else if (edge.type === 'acquired' && edge.target === connectedNode.id) {
                      relationshipLabel = 'Acquired by';
                    } else if (edge.type === 'belongs_to') {
                      relationshipLabel = 'In category';
                    }
                  }
                  
                  return (
                    <div key={index} className="p-2 bg-background-secondary rounded border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                            connectedNode.type === 'company' ? 'bg-accent text-white' :
                            connectedNode.type === 'investor' ? 'bg-green-600 text-white' :
                            connectedNode.type === 'acquirer' ? 'bg-blue-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {connectedNode.type === 'company' ? <Building2 className="h-3.5 w-3.5" /> :
                             connectedNode.type === 'investor' ? <Users className="h-3.5 w-3.5" /> :
                             connectedNode.type === 'industry' ? <Hash className="h-3.5 w-3.5" /> :
                             <Building2 className="h-3.5 w-3.5" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-primary">{connectedNode.name}</p>
                            <p className="text-xs text-secondary">
                              {connectedNode.type.charAt(0).toUpperCase() + connectedNode.type.slice(1)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-xs text-secondary">
                          {relationshipLabel}
                        </div>
                      </div>
                      
                      {edge?.properties?.amount && (
                        <div className="mt-1 text-xs text-primary flex justify-between border-t border-border pt-1">
                          <span>Amount:</span>
                          <span className="font-medium">{formatCurrency(edge.properties.amount as number)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-secondary text-sm">No connections found</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'events' && (
          <div className="space-y-3">
            <div className="text-xs text-secondary mb-1">
              Showing {events.length} events for {node.name}
            </div>
            
            {events.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="p-2 bg-background-secondary rounded border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-primary">{event.type}</p>
                        <p className="text-xs text-secondary">{event.date.toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {formatCurrency(event.amount)}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-primary">
                      {event.type === 'Funding Round' ? 'Investor: ' : 'Acquirer: '}
                      {event.counterparty}
                    </div>
                    {event.details && (
                      <div className="mt-1 text-xs text-secondary">
                        {event.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-secondary text-sm">No events found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeInfoPanel;