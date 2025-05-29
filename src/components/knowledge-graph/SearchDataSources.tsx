import React, { useState, useEffect } from 'react';
import { Database, Globe, FileText, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

type DataSource = {
  id: string;
  name: string;
  type: 'database' | 'web' | 'api';
  status: 'searching' | 'complete' | 'idle' | 'error';
  progress?: number;
  info?: string;
  icon?: React.ReactNode;
};

interface SearchDataSourcesProps {
  isSearching: boolean;
  onSourceClick?: (source: DataSource) => void;
}

const SearchDataSources: React.FC<SearchDataSourcesProps> = ({ isSearching, onSourceClick }) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { id: 'crunchbase', name: 'Crunchbase', type: 'database', status: 'idle', icon: <Database className="h-4 w-4" /> },
    { id: 'pitchbook', name: 'Pitchbook', type: 'database', status: 'idle', icon: <Database className="h-4 w-4" /> },
    { id: 'apollo', name: 'Apollo', type: 'database', status: 'idle', icon: <Database className="h-4 w-4" /> },
    { id: 'google-news', name: 'Google News', type: 'web', status: 'idle', icon: <Globe className="h-4 w-4" /> },
    { id: 'techcrunch', name: 'TechCrunch', type: 'web', status: 'idle', icon: <Globe className="h-4 w-4" /> },
    { id: 'opencorporates', name: 'OpenCorporates', type: 'api', status: 'idle', icon: <FileText className="h-4 w-4" /> },
    { id: 'sec-edgar', name: 'SEC EDGAR', type: 'api', status: 'idle', icon: <FileText className="h-4 w-4" /> },
  ]);

  // Simulate search progress when isSearching is true
  useEffect(() => {
    if (!isSearching) {
      // Reset all sources to idle when search is stopped
      setDataSources(prev => prev.map(source => ({ ...source, status: 'idle', progress: undefined })));
      return;
    }

    // Set all sources to searching with 0 progress
    setDataSources(prev => prev.map(source => ({ ...source, status: 'searching', progress: 0 })));
    
    // Simulate the search process with different timing for each data source
    const intervalIds: NodeJS.Timeout[] = [];
    
    dataSources.forEach((source, index) => {
      // Start searching each source with a delay
      const startDelay = setTimeout(() => {
        setDataSources(prev => 
          prev.map(s => s.id === source.id ? { ...s, status: 'searching', progress: 0 } : s)
        );
        
        // Update progress
        const progressInterval = setInterval(() => {
          setDataSources(prev => {
            return prev.map(s => {
              if (s.id === source.id) {
                // Calculate new progress
                const newProgress = (s.progress || 0) + Math.random() * 20;
                
                // If complete, clear interval
                if (newProgress >= 100) {
                  clearInterval(progressInterval);
                  // Randomly make some sources have errors
                  const hasError = Math.random() < 0.1; // 10% chance of error
                  return { 
                    ...s, 
                    status: hasError ? 'error' : 'complete', 
                    progress: 100,
                    info: hasError ? 'Connection timeout' : 'Found 27 matches'
                  };
                }
                
                return { ...s, progress: newProgress };
              }
              return s;
            });
          });
        }, 500 + Math.random() * 1000); // Different update speed for each source
        
        intervalIds.push(progressInterval);
      }, 300 * index); // Stagger start time
      
      intervalIds.push(startDelay);
    });
    
    return () => {
      // Clean up all intervals
      intervalIds.forEach(id => clearInterval(id));
    };
  }, [isSearching]);

  // Render the status icon based on source status
  const renderStatusIcon = (source: DataSource) => {
    switch (source.status) {
      case 'searching':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'idle':
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Data Sources</h3>
      </div>
      
      <div className="p-2">
        <div className="space-y-1">
          {dataSources.map((source) => (
            <div 
              key={source.id}
              className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
              onClick={() => onSourceClick?.(source)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                {source.icon}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-700">{source.name}</div>
                  <div>{renderStatusIcon(source)}</div>
                </div>
                
                {source.status === 'searching' && source.progress !== undefined && (
                  <div className="mt-1 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${source.progress}%` }}
                    ></div>
                  </div>
                )}
                
                {source.info && (
                  <div className={`text-xs mt-1 ${
                    source.status === 'error' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {source.info}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDataSources;