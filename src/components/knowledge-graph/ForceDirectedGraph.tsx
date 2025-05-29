import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphEdge } from '../../types';

interface ForceDirectedGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
  onNodeClick: (node: GraphNode) => void;
  isLoading?: boolean;
  animated?: boolean;
}

const ForceDirectedGraph: React.FC<ForceDirectedGraphProps> = ({
  nodes,
  edges,
  width,
  height,
  onNodeClick,
  isLoading = false,
  animated = true
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Create the visualization
  useEffect(() => {
    if (!svgRef.current || isLoading || nodes.length === 0 || edges.length === 0) return;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");
    
    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        svg.attr('transform', event.transform);
      });
    
    d3.select(svgRef.current)
      .call(zoom as any)
      .on("dblclick.zoom", null);
    
    // Define arrow marker for directed edges
    svg.append("defs").selectAll("marker")
      .data(["invested", "acquired", "belongs"])
      .enter().append("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", d => {
        if (d === 'invested') return "#059669";
        if (d === 'acquired') return "#4338ca";
        return "#9ca3af";
      })
      .attr("d", "M0,-5L10,0L0,5");
    
    // Create force simulation
    const simulation = d3.forceSimulation<any, any>(nodes)
      .force("link", d3.forceLink(edges).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));
    
    // Create links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", (d: any) => {
        if (d.type === 'acquired') return "#4338ca";
        if (d.type === 'invested_in') return "#059669";
        return "#9ca3af";
      })
      .attr("stroke-width", (d: any) => {
        // Thicker lines for acquisitions and large investments
        if (d.type === 'acquired') return 2;
        if (d.type === 'invested_in' && d.properties?.amount) {
          const amount = d.properties.amount as number;
          return Math.max(1, Math.min(3, Math.log10(amount / 10000000)));
        }
        return 1;
      })
      .attr("stroke-dasharray", (d: any) => {
        return d.type === 'belongs_to' ? "4,4" : null;
      })
      .attr("marker-end", (d: any) => {
        if (d.type === 'invested_in') return "url(#arrow-invested)";
        if (d.type === 'acquired') return "url(#arrow-acquired)";
        if (d.type === 'belongs_to') return "url(#arrow-belongs)";
        return null;
      });
    
    // Create nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d);
      })
      .on("mouseover", (event, d) => {
        setHoveredNode(d.id);
      })
      .on("mouseout", () => {
        setHoveredNode(null);
      });
    
    // Add circles to nodes
    node.append("circle")
      .attr("r", (d: any) => {
        if (d.type === 'industry') return 15;
        if (d.type === 'investor') return 12;
        if (d.type === 'acquirer') return 14;
        return 10; // companies
      })
      .attr("fill", (d: any) => {
        if (d.type === 'company') return "#000000";
        if (d.type === 'investor') return "#059669";
        if (d.type === 'acquirer') return "#4338ca";
        if (d.type === 'industry') return "#6b7280";
        return "#d1d5db";
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5);
    
    // Add labels to nodes
    node.append("text")
      .attr("dx", 15)
      .attr("dy", 5)
      .style("font-size", "10px")
      .style("fill", "#374151")
      .text((d: any) => d.name);
    
    // Initial fade in animation
    if (animated) {
      node.attr("opacity", 0)
        .transition()
        .duration(1000)
        .delay((_, i) => i * 10)
        .attr("opacity", 1);
        
      link.attr("opacity", 0)
        .attr("stroke-dashoffset", 100)
        .transition()
        .duration(1000)
        .delay((_, i) => i * 5)
        .attr("opacity", 1)
        .attr("stroke-dashoffset", 0);
    }
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
        
      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, edges, width, height, isLoading, animated, onNodeClick]);
  
  // Loading spinner while data loads
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }
  
  return (
    <svg ref={svgRef} width={width} height={height} className="bg-white">
      <g className="links"></g>
      <g className="nodes"></g>
    </svg>
  );
};

export default ForceDirectedGraph;