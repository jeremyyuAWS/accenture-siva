import React from 'react';
import { ZoomIn, ZoomOut, RefreshCw, Download, Share2, RotateCcw } from 'lucide-react';

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRefresh: () => void;
  onDownload: () => void;
  onShare: () => void;
  className?: string;
}

const GraphControls: React.FC<GraphControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onRefresh,
  onDownload,
  onShare,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-2 ${className}`}>
      <div className="flex flex-col space-y-2">
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Zoom In"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Zoom Out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Reset View"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        
        <div className="border-t border-gray-200 pt-2"></div>
        
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Refresh Data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
        
        <button
          onClick={onDownload}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Download"
        >
          <Download className="h-5 w-5" />
        </button>
        
        <button
          onClick={onShare}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default GraphControls;