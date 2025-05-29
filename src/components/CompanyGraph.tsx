import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import * as d3 from 'd3';
import { graphService } from '../services/graphService';
import { GraphNode, GraphEdge } from '../types';

interface CompanyGraphProps {
  searchQuery: string;
  onNodeClick: (node: any) => void;
  filters?: {
    timeframe?: { start?: Date; end?: Date };
    dealSize?: { min?: number; max?: number };
    eventTypes?: string[];
    industries?: string[];
    regions?: string[];
  };
  enableZoom?: boolean;
  enableDrag?: boolean;
  highlightNodeId?: string;
}

const CompanyGraph: React.FC<CompanyGraphProps> = ({ 
  searchQuery, 
  onNodeClick, 
  filters = {},
  enableZoom = true,
  enableDrag = true,
  highlightNodeId
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({ nodes: [], edges: [] });

  // Create and render the graph visualization
  useEffect(() => {
    const fetchGraphData = () => {
      try {
        // Get filtered graph data from the service
        const filteredGraph = graphService.filterGraph({
          timeframe: filters.timeframe,
          dealSize: filters.dealSize,
          eventTypes: filters.eventTypes,
          industries: filters.industries,
          regions: filters.regions,
          searchTerm: searchQuery
        });
        
        setGraph(filteredGraph);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching graph data:', err);
        setError('Failed to load graph data');
        setLoading(false);
      }
    };
    
    // Simulate a brief loading delay
    setLoading(true);
    setTimeout(fetchGraphData, 500);
  }, [searchQuery, filters]);

  // Update graph based on searchQuery
  useEffect(() => {
    if (searchQuery && svgRef.current) {
      // In a real implementation, this would filter the graph based on the search query
      // For this example, we'll just highlight the matching nodes
      
      d3.select(svgRef.current)
        .selectAll('.node')
        .attr('opacity', 0.3)
        .filter(function(d: any) {
          return d.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .attr('opacity', 1);
    } else if (svgRef.current) {
      // Reset opacity if search is cleared
      d3.select(svgRef.current)
        .selectAll('.node')
        .attr('opacity', 1);
    }
  }, [searchQuery]);
  
  // Initialize and render the graph
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || loading || !graph.nodes.length) return;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Create a force simulation
    const simulation = d3.forceSimulation(graph.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(graph.edges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));
    
    // Create the SVG elements
    const svg = d3.select(svgRef.current);
    
    // Add zoom functionality if enabled
    if (enableZoom) {
      const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });
      
      svg.call(zoom as any);
    }
    
    // Create a container for the graph elements
    const g = svg.append('g');
    
    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.edges)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        if (d.type === 'acquired') return '#4338ca';
        if (d.type === 'invested_in') return '#059669';
        if (d.type === 'belongs_to') return '#9ca3af';
        return '#9ca3af';
      })
      .attr('stroke-width', (d: any) => {
        // Make investment edges thicker based on amount
        if (d.type === 'invested_in' && d.properties?.amount) {
          const amount = d.properties.amount as number;
          return Math.max(1, Math.log10(amount / 1000000)); // Scale by log of millions
        }
        if (d.type === 'acquired') return 2;
        return 1;
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', (d: any) => {
        // Make "belongs_to" edges dashed
        return d.type === 'belongs_to' ? '3,3' : null;
      });
    
    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(graph.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => onNodeClick(d));
    
    // Add circles to nodes with different styles based on type
    node.append('circle')
      .attr('r', (d: any) => {
        if (d.type === 'industry') return 15;
        if (d.type === 'company') return 10;
        if (d.type === 'investor') return 12;
        if (d.type === 'acquirer') return 12;
        return 8;
      })
      .attr('fill', (d: any) => {
        if (d.type === 'industry') return '#6b7280';
        if (d.type === 'company') return '#000000';
        if (d.type === 'investor') return '#059669';
        if (d.type === 'acquirer') return '#4338ca';
        return '#d1d5db';
      })
      .attr('stroke', (d: any) => {
        // Highlight the node if it matches the highlightNodeId
        return d.id === highlightNodeId ? '#ef4444' : (d.type === 'industry' ? '#4b5563' : '#e5e7eb');
      })
      .attr('stroke-width', (d: any) => d.id === highlightNodeId ? 3 : 1.5);
    
    // Add text labels to nodes
    node.append('text')
      .text((d: any) => d.name)
      .attr('dx', 15)
      .attr('dy', 5)
      .attr('font-size', '10px')
      .attr('fill', 'currentColor');
    
    // Add title for tooltip on hover
    node.append('title')
      .text((d: any) => {
        let title = d.name;
        if (d.properties?.industry) {
          title += ` | Industry: ${d.properties.industry}`;
        }
        if (d.properties?.region) {
          title += ` | Region: ${d.properties.region}`;
        }
        if (d.properties?.fundingStage) {
          title += ` | Stage: ${d.properties.fundingStage}`;
        }
        return title;
      });
    
    // Set up the simulation tick function
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any) {
      if (!enableDrag) return;
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: any) {
      if (!enableDrag) return;
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event: any) {
      if (!enableDrag) return;
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return () => {
      simulation.stop();
    };
  }, [graph, loading, onNodeClick, enableZoom, enableDrag, highlightNodeId]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-primary bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-primary bg-opacity-70 z-10">
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-red-800 dark:text-red-200 max-w-md text-center">
            <p className="font-medium">{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-md text-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {!loading && !error && graph.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-primary bg-opacity-70 z-10">
          <div className="bg-background-secondary p-4 rounded-lg border border-border max-w-md text-center">
            <p className="text-primary mb-2">No results match your filters</p>
            <p className="text-secondary text-sm">Try adjusting your search criteria or filters</p>
          </div>
        </div>
      )}
      
      <svg ref={svgRef} width="100%" height="100%"></svg>
      
      {!loading && !error && (
        <div className="absolute bottom-4 right-4 bg-background-secondary p-2 rounded-md border border-border text-xs">
          <div className="flex items-center mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-black mr-1.5"></span>
            <span className="text-primary">Company</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669] mr-1.5"></span>
            <span className="text-primary">Investor</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4338ca] mr-1.5"></span>
            <span className="text-primary">Acquirer</span>
          </div>
          <div className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6b7280] mr-1.5"></span>
            <span className="text-primary">Industry</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyGraph;