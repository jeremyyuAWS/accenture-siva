import React from 'react';
import { ZoomIn, ZoomOut, Maximize, RefreshCw, Download, Share2, Map } from 'lucide-react';

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRefresh: () => void;
  onDownload: () => void;
  onCreateSubgraph: () => void;
}

const GraphControls: React.FC<GraphControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onRefresh,
  onDownload,
  onCreateSubgraph
}) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-background-secondary rounded-md border border-border p-1">
      <button
        onClick={onZoomIn}
        className="p-1.5 rounded-md text-secondary hover:bg-background-primary hover:text-primary"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
      
      <button
        onClick={onZoomOut}
        className="p-1.5 rounded-md text-secondary hover:bg-background-primary hover:text-primary"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </button>
      
      <button
        onClick={onReset}
        className="p-1.5 rounded-md text-secondary hover:bg-background-primary hover:text-primary"
        title="Reset View"
      >
        <Maximize className="h-4 w-4" />
      </button>
      
      <div className="border-t border-border pt-1">
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-md text-secondary hover:bg-background-primary hover:text-primary"
          title="Refresh Graph"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      <div className="border-t border-border pt-1">
        <button
          onClick={onCreateSubgraph}
          className="p-1.5 rounded-md text-secondary hover:bg-background-primary hover:text-primary"
          title="Create Subgraph"
        >
          <Map className="h-4 w-4" />
        </button>
      </div>
      
      <div className="border-t border-border pt-1">
        <button
          onClick={onDownload}
          className="p-1.5 rounded-md text-secondary hover:bg-background-primary hover:text-primary"
          title="Download Graph"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default GraphControls;