import { GraphNode, GraphEdge } from '../types';
import { mockGraphData } from '../data/graphData';

/**
 * Service for managing and querying the knowledge graph
 * This is a simulated service that would typically be connected to a backend
 */
class GraphService {
  private nodes: GraphNode[];
  private edges: GraphEdge[];
  private isSearching: boolean = false;
  private lastQuery: string = '';

  constructor() {
    // Initialize with mock data
    this.nodes = mockGraphData.nodes;
    this.edges = mockGraphData.edges;
  }

  /**
   * Search the knowledge graph
   */
  async search(query: string): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    this.isSearching = true;
    this.lastQuery = query;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter nodes and edges based on the query
    let filteredNodes = this.nodes;
    
    if (query) {
      // Simple search based on node name and properties
      const lowerQuery = query.toLowerCase();
      filteredNodes = this.nodes.filter(node => {
        return node.name.toLowerCase().includes(lowerQuery) ||
               node.properties?.industry?.toString().toLowerCase().includes(lowerQuery) ||
               node.properties?.region?.toString().toLowerCase().includes(lowerQuery);
      });
      
      // Handle specific queries
      if (lowerQuery.includes('fintech') && lowerQuery.includes('crypto') && lowerQuery.includes('genai')) {
        // Create crypto-focused fintech companies using GenAI
        filteredNodes = [
          {
            id: 'company_crypto_1',
            name: 'Sardine',
            type: 'company',
            properties: { industry: 'Fintech', region: 'North America', fundingStage: 'Series B' }
          },
          {
            id: 'company_crypto_2',
            name: 'Alloy',
            type: 'company',
            properties: { industry: 'Fintech', region: 'North America', fundingStage: 'Series C' }
          },
          {
            id: 'company_crypto_3',
            name: 'Chainalysis',
            type: 'company',
            properties: { industry: 'Crypto', region: 'North America', fundingStage: 'Series E' }
          },
          {
            id: 'company_crypto_4',
            name: 'Blocknative',
            type: 'company',
            properties: { industry: 'Crypto', region: 'North America', fundingStage: 'Series A' }
          },
          {
            id: 'company_crypto_5',
            name: 'TRM Labs',
            type: 'company',
            properties: { industry: 'Crypto', region: 'North America', fundingStage: 'Series B' }
          },
          {
            id: 'company_crypto_6',
            name: 'Gauntlet',
            type: 'company',
            properties: { industry: 'DeFi', region: 'North America', fundingStage: 'Series B' }
          },
          {
            id: 'investor_crypto_1',
            name: 'Andreessen Horowitz',
            type: 'investor',
            properties: { region: 'North America', investorType: 'VC' }
          },
          {
            id: 'investor_crypto_2',
            name: 'Paradigm',
            type: 'investor',
            properties: { region: 'North America', investorType: 'Crypto VC' }
          },
          {
            id: 'investor_crypto_3',
            name: 'Insight Partners',
            type: 'investor',
            properties: { region: 'North America', investorType: 'Growth Equity' }
          },
          {
            id: 'industry_crypto_1',
            name: 'Fintech',
            type: 'industry'
          },
          {
            id: 'industry_crypto_2',
            name: 'Crypto',
            type: 'industry'
          },
          {
            id: 'industry_crypto_3',
            name: 'GenAI',
            type: 'industry'
          }
        ];
        
        // Create edges for the crypto fintech companies
        const customEdges: GraphEdge[] = [
          {
            source: 'investor_crypto_1',
            target: 'company_crypto_1',
            type: 'invested_in',
            properties: { 
              eventType: 'series_b', 
              amount: 70000000, 
              timestamp: '2023-09-15T10:00:00Z',
              description: 'Andreessen Horowitz led a $70M Series B round in Sardine'
            }
          },
          {
            source: 'investor_crypto_3',
            target: 'company_crypto_2',
            type: 'invested_in',
            properties: { 
              eventType: 'series_c', 
              amount: 150000000, 
              timestamp: '2023-05-10T14:30:00Z',
              description: 'Insight Partners led a $150M Series C round in Alloy'
            }
          },
          {
            source: 'investor_crypto_2',
            target: 'company_crypto_6',
            type: 'invested_in',
            properties: { 
              eventType: 'series_b', 
              amount: 55000000, 
              timestamp: '2023-11-20T09:45:00Z',
              description: 'Paradigm led a $55M Series B round in Gauntlet'
            }
          },
          {
            source: 'investor_crypto_3',
            target: 'company_crypto_5',
            type: 'invested_in',
            properties: { 
              eventType: 'series_b', 
              amount: 85000000, 
              timestamp: '2023-12-05T11:15:00Z',
              description: 'Insight Partners led an $85M Series B round in TRM Labs'
            }
          },
          {
            source: 'investor_crypto_1',
            target: 'company_crypto_4',
            type: 'invested_in',
            properties: { 
              eventType: 'series_a', 
              amount: 35000000, 
              timestamp: '2023-08-22T10:30:00Z',
              description: 'Andreessen Horowitz led a $35M Series A round in Blocknative'
            }
          },
          // Industry connections
          { source: 'company_crypto_1', target: 'industry_crypto_1', type: 'belongs_to' },
          { source: 'company_crypto_1', target: 'industry_crypto_3', type: 'belongs_to' },
          { source: 'company_crypto_2', target: 'industry_crypto_1', type: 'belongs_to' },
          { source: 'company_crypto_2', target: 'industry_crypto_3', type: 'belongs_to' },
          { source: 'company_crypto_3', target: 'industry_crypto_2', type: 'belongs_to' },
          { source: 'company_crypto_3', target: 'industry_crypto_3', type: 'belongs_to' },
          { source: 'company_crypto_4', target: 'industry_crypto_2', type: 'belongs_to' },
          { source: 'company_crypto_4', target: 'industry_crypto_3', type: 'belongs_to' },
          { source: 'company_crypto_5', target: 'industry_crypto_2', type: 'belongs_to' },
          { source: 'company_crypto_5', target: 'industry_crypto_3', type: 'belongs_to' },
          { source: 'company_crypto_6', target: 'industry_crypto_2', type: 'belongs_to' },
          { source: 'company_crypto_6', target: 'industry_crypto_3', type: 'belongs_to' }
        ];
        
        return { nodes: filteredNodes, edges: customEdges };
      }
      
      // Also include related nodes
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      
      // Get all connected nodes
      this.edges.forEach(edge => {
        if (nodeIds.has(edge.source)) {
          const targetNode = this.nodes.find(n => n.id === edge.target);
          if (targetNode && !nodeIds.has(edge.target)) {
            filteredNodes.push(targetNode);
            nodeIds.add(edge.target);
          }
        }
        
        if (nodeIds.has(edge.target)) {
          const sourceNode = this.nodes.find(n => n.id === edge.source);
          if (sourceNode && !nodeIds.has(edge.source)) {
            filteredNodes.push(sourceNode);
            nodeIds.add(edge.source);
          }
        }
      });
      
      // Filter edges to only include those connecting the filtered nodes
      const filteredEdges = this.edges.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
      );
      
      this.isSearching = false;
      return { nodes: filteredNodes, edges: filteredEdges };
    }
    
    this.isSearching = false;
    return { nodes: this.nodes, edges: this.edges };
  }

  /**
   * Get node details by ID
   */
  getNodeById(id: string): GraphNode | null {
    return this.nodes.find(node => node.id === id) || null;
  }

  /**
   * Get related nodes and edges for a node
   */
  getRelatedData(nodeId: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
    // Find edges connected to this node
    const relatedEdges = this.edges.filter(edge => 
      edge.source === nodeId || edge.target === nodeId
    );
    
    // Get unique IDs of related nodes
    const relatedNodeIds = new Set<string>();
    relatedEdges.forEach(edge => {
      relatedNodeIds.add(edge.source);
      relatedNodeIds.add(edge.target);
    });
    
    // Get the related nodes
    const relatedNodes = this.nodes.filter(node => 
      relatedNodeIds.has(node.id)
    );
    
    return { nodes: relatedNodes, edges: relatedEdges };
  }

  /**
   * Check if search is in progress
   */
  getSearchStatus(): boolean {
    return this.isSearching;
  }

  /**
   * Get the last search query
   */
  getLastQuery(): string {
    return this.lastQuery;
  }

  /**
   * Reset the graph data
   */
  resetData(): void {
    this.nodes = mockGraphData.nodes;
    this.edges = mockGraphData.edges;
  }
}

// Create singleton instance
export const graphService = new GraphService();