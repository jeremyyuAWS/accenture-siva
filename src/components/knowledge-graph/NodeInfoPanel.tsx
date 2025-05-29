import React from 'react';
import { X, Building2, Calendar, DollarSign, Globe, Users, ExternalLink, Link, ArrowRight } from 'lucide-react';
import { GraphNode } from '../../types';

interface NodeInfoPanelProps {
  node: GraphNode;
  onClose: () => void;
  relatedNodes?: GraphNode[];
  relatedEdges?: any[];
}

const NodeInfoPanel: React.FC<NodeInfoPanelProps> = ({
  node,
  onClose,
  relatedNodes = [],
  relatedEdges = []
}) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    } else if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    } else if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  const getRelationshipInfo = () => {
    // Get information about relationships to display in the panel
    const relationships = [];
    
    if (relatedEdges && relatedEdges.length > 0) {
      // Investment relationships
      const investments = relatedEdges.filter(edge => 
        edge.type === 'invested_in' && 
        (edge.source === node.id || edge.target === node.id)
      );
      
      // Acquisition relationships
      const acquisitions = relatedEdges.filter(edge => 
        edge.type === 'acquired' && 
        (edge.source === node.id || edge.target === node.id)
      );
      
      if (investments.length > 0) {
        if (node.type === 'investor') {
          // Show companies this investor has invested in
          const investedCompanies = investments.map(edge => {
            const company = relatedNodes.find(n => n.id === edge.target);
            return {
              type: 'invested_in',
              node: company,
              amount: edge.properties?.amount,
              date: edge.properties?.timestamp ? new Date(edge.properties.timestamp) : null
            };
          });
          relationships.push({
            type: 'investments',
            label: 'Investments',
            items: investedCompanies
          });
        } else if (node.type === 'company') {
          // Show investors in this company
          const companyInvestors = investments.map(edge => {
            const investor = relatedNodes.find(n => n.id === edge.source);
            return {
              type: 'investor',
              node: investor,
              amount: edge.properties?.amount,
              date: edge.properties?.timestamp ? new Date(edge.properties.timestamp) : null
            };
          });
          relationships.push({
            type: 'investors',
            label: 'Investors',
            items: companyInvestors
          });
        }
      }
      
      if (acquisitions.length > 0) {
        if (node.type === 'acquirer') {
          // Show companies this acquirer has acquired
          const acquiredCompanies = acquisitions.map(edge => {
            const company = relatedNodes.find(n => n.id === edge.target);
            return {
              type: 'acquired',
              node: company,
              amount: edge.properties?.amount,
              date: edge.properties?.timestamp ? new Date(edge.properties.timestamp) : null
            };
          });
          relationships.push({
            type: 'acquisitions',
            label: 'Acquisitions',
            items: acquiredCompanies
          });
        } else if (node.type === 'company') {
          // Show acquirer of this company
          const companyAcquirer = acquisitions.map(edge => {
            const acquirer = relatedNodes.find(n => n.id === edge.source);
            return {
              type: 'acquirer',
              node: acquirer,
              amount: edge.properties?.amount,
              date: edge.properties?.timestamp ? new Date(edge.properties.timestamp) : null
            };
          });
          relationships.push({
            type: 'acquirers',
            label: 'Acquired by',
            items: companyAcquirer
          });
        }
      }
    }
    
    return relationships;
  };

  const getNodeIcon = () => {
    switch (node.type) {
      case 'company':
        return <Building2 className="h-5 w-5 text-gray-600" />;
      case 'investor':
        return <Users className="h-5 w-5 text-emerald-600" />;
      case 'acquirer':
        return <Building2 className="h-5 w-5 text-indigo-600" />;
      case 'industry':
        return <Link className="h-5 w-5 text-gray-600" />;
      default:
        return <Building2 className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNodeTypeLabel = () => {
    switch (node.type) {
      case 'company':
        return "Company";
      case 'investor':
        return "Investor";
      case 'acquirer':
        return "Acquirer";
      case 'industry':
        return "Industry";
      default:
        return node.type;
    }
  };

  const relationships = getRelationshipInfo();

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-md w-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-start">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            {getNodeIcon()}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{node.name}</h3>
            <p className="text-sm text-gray-500">{getNodeTypeLabel()}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        {/* Node details */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Details</h4>
          <div className="space-y-2">
            {node.properties?.industry && (
              <div className="flex items-center text-sm">
                <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600">Industry:</span>
                <span className="ml-2 text-gray-900">{node.properties.industry}</span>
              </div>
            )}
            
            {node.properties?.region && (
              <div className="flex items-center text-sm">
                <Globe className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600">Region:</span>
                <span className="ml-2 text-gray-900">{node.properties.region}</span>
              </div>
            )}
            
            {node.properties?.fundingStage && (
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600">Funding Stage:</span>
                <span className="ml-2 text-gray-900">{node.properties.fundingStage}</span>
              </div>
            )}
            
            {node.properties?.investorType && (
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600">Investor Type:</span>
                <span className="ml-2 text-gray-900">{node.properties.investorType}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Relationships */}
        {relationships.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Relationships</h4>
            <div className="space-y-3">
              {relationships.map((relationship, idx) => (
                <div key={idx}>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">{relationship.label}</h5>
                  <div className="space-y-2">
                    {relationship.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-gray-50 p-2 rounded-md text-sm flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-800">{item.node?.name || 'Unknown'}</span>
                          {item.date && (
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {item.date.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        {item.amount && (
                          <div className="text-sm font-medium text-gray-700">
                            {formatCurrency(item.amount)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* View full profile button */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
            <ExternalLink className="h-4 w-4 mr-2" />
            <span>View Full Profile</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeInfoPanel;