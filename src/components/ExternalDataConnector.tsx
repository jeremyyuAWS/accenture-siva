import React, { useState } from 'react';
import { DataSourceConnection } from '../types';
import { 
  Database, 
  Link2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Plus,
  Settings,
  Clock,
  BarChart2,
  FileText
} from 'lucide-react';

interface ExternalDataConnectorProps {
  onConnect?: (connection: DataSourceConnection) => void;
}

const ExternalDataConnector: React.FC<ExternalDataConnectorProps> = ({ onConnect }) => {
  const [connections, setConnections] = useState<DataSourceConnection[]>([
    {
      id: 'financial-db-1',
      name: 'S&P Capital IQ',
      type: 'financial_db',
      status: 'connected',
      lastSynced: new Date(2023, 6, 15),
      config: { apiKey: '***************', refreshRate: 'daily' }
    },
    {
      id: 'market-data-1',
      name: 'Bloomberg Market Data',
      type: 'market_data',
      status: 'disconnected',
      config: { apiKey: '', refreshRate: 'hourly' }
    },
    {
      id: 'news-1',
      name: 'Reuters News API',
      type: 'news',
      status: 'error',
      lastSynced: new Date(2023, 6, 10),
      config: { apiKey: '***************', refreshRate: 'daily' }
    }
  ]);

  const [connecting, setConnecting] = useState<string | null>(null);
  const [syncingData, setSyncingData] = useState<string | null>(null);
  const [showNewConnector, setShowNewConnector] = useState(false);
  const [newConnector, setNewConnector] = useState<{
    name: string;
    type: DataSourceConnection['type'];
    config: { apiKey: string; refreshRate: string; };
  }>({
    name: '',
    type: 'financial_db',
    config: { apiKey: '', refreshRate: 'daily' }
  });

  // Connect to a data source
  const handleConnect = (id: string) => {
    setConnecting(id);

    // Simulate connection process
    setTimeout(() => {
      setConnections(prev => prev.map(conn => {
        if (conn.id === id) {
          return { ...conn, status: 'connected', lastSynced: new Date() };
        }
        return conn;
      }));
      setConnecting(null);

      // Notify parent component
      if (onConnect) {
        const connection = connections.find(conn => conn.id === id);
        if (connection) {
          onConnect({ ...connection, status: 'connected', lastSynced: new Date() });
        }
      }
    }, 1500);
  };

  // Sync data from a data source
  const handleSync = (id: string) => {
    setSyncingData(id);

    // Simulate sync process
    setTimeout(() => {
      setConnections(prev => prev.map(conn => {
        if (conn.id === id) {
          return { ...conn, lastSynced: new Date() };
        }
        return conn;
      }));
      setSyncingData(null);
      alert('Data synchronized successfully!');
    }, 2000);
  };

  // Add a new connector
  const handleAddConnector = () => {
    if (!newConnector.name || !newConnector.config.apiKey) {
      alert('Please provide a name and API key for the connector.');
      return;
    }

    const newId = `${newConnector.type}-${Date.now()}`;
    const connector: DataSourceConnection = {
      id: newId,
      name: newConnector.name,
      type: newConnector.type,
      status: 'connected',
      lastSynced: new Date(),
      config: newConnector.config
    };

    setConnections(prev => [...prev, connector]);
    setShowNewConnector(false);
    setNewConnector({
      name: '',
      type: 'financial_db',
      config: { apiKey: '', refreshRate: 'daily' }
    });

    // Notify parent component
    if (onConnect) {
      onConnect(connector);
    }
  };

  // Get status icon
  const getStatusIcon = (status: DataSourceConnection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get type icon
  const getTypeIcon = (type: DataSourceConnection['type']) => {
    switch (type) {
      case 'financial_db':
        return <Database className="h-5 w-5 text-gray-500" />;
      case 'market_data':
        return <BarChart2 className="h-5 w-5 text-gray-500" />;
      case 'news':
        return <FileText className="h-5 w-5 text-gray-500" />;
      case 'regulatory':
        return <FileText className="h-5 w-5 text-gray-500" />;
      case 'custom':
        return <Settings className="h-5 w-5 text-gray-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <Link2 className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">External Data Integration</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Connect to external data sources for enhanced M&A intelligence
        </p>
      </div>

      <div className="p-4 bg-background-primary border-b border-border">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-primary">Connected Data Sources</h3>
          <button
            onClick={() => setShowNewConnector(!showNewConnector)}
            className="px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Connector
          </button>
        </div>
      </div>

      {/* Add New Connector Form */}
      {showNewConnector && (
        <div className="p-4 bg-accent/5 border-b border-border">
          <h3 className="text-sm font-medium text-primary mb-3">New Data Connector</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Connector Name
              </label>
              <input
                type="text"
                value={newConnector.name}
                onChange={(e) => setNewConnector({ ...newConnector, name: e.target.value })}
                placeholder="Enter name"
                className="w-full p-2 border border-border bg-background-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Connector Type
              </label>
              <select
                value={newConnector.type}
                onChange={(e) => setNewConnector({ ...newConnector, type: e.target.value as DataSourceConnection['type'] })}
                className="w-full p-2 border border-border bg-background-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              >
                <option value="financial_db">Financial Database</option>
                <option value="market_data">Market Data</option>
                <option value="news">News API</option>
                <option value="regulatory">Regulatory Data</option>
                <option value="custom">Custom API</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                API Key / Secret
              </label>
              <input
                type="password"
                value={newConnector.config.apiKey}
                onChange={(e) => setNewConnector({ 
                  ...newConnector, 
                  config: { ...newConnector.config, apiKey: e.target.value } 
                })}
                placeholder="Enter API key"
                className="w-full p-2 border border-border bg-background-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Refresh Rate
              </label>
              <select
                value={newConnector.config.refreshRate}
                onChange={(e) => setNewConnector({ 
                  ...newConnector, 
                  config: { ...newConnector.config, refreshRate: e.target.value } 
                })}
                className="w-full p-2 border border-border bg-background-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowNewConnector(false)}
              className="px-3 py-1.5 border border-border text-primary text-sm rounded-md hover:bg-background-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddConnector}
              className="px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
            >
              Add Connector
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {connections.map(connection => (
          <div key={connection.id} className="p-4 hover:bg-background-primary transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-md mr-3">
                  {getTypeIcon(connection.type)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-primary mr-2">{connection.name}</h3>
                    <div className="flex items-center text-xs">
                      {getStatusIcon(connection.status)}
                      <span className={`ml-1 ${
                        connection.status === 'connected' 
                          ? 'text-green-600' 
                          : connection.status === 'error' 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                      }`}>
                        {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    {connection.type === 'financial_db' && 'Financial Database'}
                    {connection.type === 'market_data' && 'Market Data'}
                    {connection.type === 'news' && 'News API'}
                    {connection.type === 'regulatory' && 'Regulatory Data'}
                    {connection.type === 'custom' && 'Custom API'}
                    
                    {connection.lastSynced && (
                      <>
                        <span className="mx-1">•</span>
                        <span>Last synced: {connection.lastSynced.toLocaleString()}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {connection.status === 'disconnected' ? (
                  <button
                    onClick={() => handleConnect(connection.id)}
                    disabled={connecting === connection.id}
                    className="px-3 py-1.5 bg-black text-white text-xs rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center"
                  >
                    {connecting === connection.id ? (
                      <>
                        <RefreshCw className="animate-spin h-3 w-3 mr-1" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3 w-3 mr-1" />
                        Connect
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSync(connection.id)}
                    disabled={syncingData === connection.id || connection.status !== 'connected'}
                    className="px-3 py-1.5 bg-black text-white text-xs rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center"
                  >
                    {syncingData === connection.id ? (
                      <>
                        <RefreshCw className="animate-spin h-3 w-3 mr-1" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Data
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => alert(`This would open the settings for ${connection.name}`)}
                  className="px-3 py-1.5 border border-border text-primary text-xs rounded-md hover:bg-background-primary transition-colors flex items-center"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Settings
                </button>
              </div>
            </div>
            
            {connection.status === 'error' && (
              <div className="mt-3 p-2 bg-red-50 rounded-md text-xs text-red-700 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                <span>Connection error: API key expired or invalid. Please update credentials.</span>
              </div>
            )}
            
            {connection.status === 'connected' && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-2 bg-background-primary rounded-md text-xs border border-border">
                  <span className="font-medium text-primary">Data Types:</span>
                  <span className="ml-1 text-secondary">
                    {connection.type === 'financial_db' && 'Financial metrics, valuations, company profiles'}
                    {connection.type === 'market_data' && 'Stock prices, market trends, industry benchmarks'}
                    {connection.type === 'news' && 'News articles, press releases, sentiment analysis'}
                    {connection.type === 'regulatory' && 'Regulatory filings, compliance data, industry standards'}
                    {connection.type === 'custom' && 'Custom data fields'}
                  </span>
                </div>
                <div className="p-2 bg-background-primary rounded-md text-xs border border-border flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-accent" />
                  <span className="font-medium text-primary">Refresh Rate:</span>
                  <span className="ml-1 text-secondary">
                    {connection.config?.refreshRate || 'Manual'}
                  </span>
                </div>
                <div className="p-2 bg-accent/5 rounded-md text-xs border border-border flex items-center">
                  <ExternalLink className="h-3 w-3 mr-1 text-accent" />
                  <button
                    onClick={() => alert(`This would open the documentation for ${connection.name}`)}
                    className="text-accent hover:text-accent/80"
                  >
                    View API Documentation
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Data Integration Benefits */}
      <div className="p-4 bg-background-primary border-t border-border">
        <h3 className="text-sm font-medium text-primary mb-3">Enhanced Data Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-background-secondary p-3 rounded-md border border-border">
            <div className="flex items-center mb-2">
              <Database className="h-4 w-4 text-accent mr-2" />
              <h4 className="text-sm font-medium text-primary">Financial Databases</h4>
            </div>
            <p className="text-xs text-secondary">
              Access detailed financial data, benchmarks, and valuation metrics from industry-leading providers.
            </p>
          </div>
          
          <div className="bg-background-secondary p-3 rounded-md border border-border">
            <div className="flex items-center mb-2">
              <BarChart2 className="h-4 w-4 text-accent mr-2" />
              <h4 className="text-sm font-medium text-primary">Market Intelligence</h4>
            </div>
            <p className="text-xs text-secondary">
              Real-time market data, industry trends, and competitor analysis to inform acquisition decisions.
            </p>
          </div>
          
          <div className="bg-background-secondary p-3 rounded-md border border-border">
            <div className="flex items-center mb-2">
              <FileText className="h-4 w-4 text-accent mr-2" />
              <h4 className="text-sm font-medium text-primary">News & Sentiment</h4>
            </div>
            <p className="text-xs text-secondary">
              Latest news, sentiment analysis, and media coverage to identify emerging opportunities and risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalDataConnector;