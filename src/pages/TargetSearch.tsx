import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MessageSquare, Search, RefreshCw, ArrowRight, X, Filter, LayoutGrid, Download } from 'lucide-react';
import AIVisualizationResponse from '../components/AIVisualizationResponse';
import CompanyCard from '../components/CompanyCard';

const TargetSearch: React.FC = () => {
  const { 
    currentUser, 
    filteredCompanies, 
    searchParams, 
    chatMessages, 
    sendChatMessage, 
    performSearch, 
    updateSearchParams, 
    setSelectedCompany,
    industries, 
    regions 
  } = useAppContext();
  
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVisualization, setActiveVisualization] = useState<string | null>(null);
  const [showResultsPreview, setShowResultsPreview] = useState(false);
  
  // Get top companies to display in preview
  const topCompanies = filteredCompanies
    .filter(company => company.tier === 1)
    .slice(0, 3);
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Update search params based on query
      const industry = industries.find(i => searchQuery.toLowerCase().includes(i.toLowerCase()));
      const region = regions.find(r => searchQuery.toLowerCase().includes(r.toLowerCase()));
      
      if (industry) {
        updateSearchParams({ industry });
      }
      
      if (region) {
        updateSearchParams({ region });
      }
    }
    
    setIsSearching(true);
    performSearch();
    
    // Simulate AI response
    sendChatMessage(`I've found ${filteredCompanies.length} companies matching your criteria. Let me analyze these results for you.`);
    
    setTimeout(() => {
      setIsSearching(false);
      setShowResultsPreview(true);
      
      // Set a visualization based on the results
      setActiveVisualization("tier distribution");
    }, 800);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Process natural language query
      sendChatMessage(message);
      setMessage('');
      
      // If message seems like a visualization request
      if (message.toLowerCase().includes('show') || 
          message.toLowerCase().includes('chart') || 
          message.toLowerCase().includes('visualize') ||
          message.toLowerCase().includes('compare')) {
        setActiveVisualization(message);
      }
      
      // If it seems like a search request
      if (message.toLowerCase().includes('find') || 
          message.toLowerCase().includes('search') || 
          message.toLowerCase().includes('looking for')) {
        setIsSearching(true);
        setTimeout(() => {
          setIsSearching(false);
          setShowResultsPreview(true);
        }, 800);
      }
    }
  };
  
  // Filter chat messages for the current session
  const relevantChatMessages = chatMessages.filter(msg => !msg.companyId);
  
  // Suggested messages for empty state
  const suggestedQueries = [
    "Find technology companies in North America with cloud capabilities",
    "Which companies should we prioritize for acquisition?",
    "Show me tier distribution of our target companies",
    "Compare growth rates of top companies",
    "What strategic opportunities exist in healthcare tech?"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
      {/* Left Panel - Chat Interface */}
      <div className="lg:col-span-2 flex flex-col bg-background-secondary rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-black text-white">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">M&A Scout AI Assistant</h2>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            Ask me about potential targets, M&A strategy, or industry trends
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-background-primary">
          {relevantChatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-primary mb-2">How can I help with your M&A search?</h3>
              <p className="text-secondary max-w-lg mb-6">
                Ask me to find target companies, analyze market trends, or give recommendations 
                on acquisition strategy.
              </p>
              
              <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
                {suggestedQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      sendChatMessage(query);
                      if (query.toLowerCase().includes('show') || 
                          query.toLowerCase().includes('compare')) {
                        setActiveVisualization(query);
                      }
                      
                      if (query.toLowerCase().includes('find') || 
                          query.toLowerCase().includes('companies')) {
                        setIsSearching(true);
                        setTimeout(() => {
                          setIsSearching(false);
                          performSearch();
                          setShowResultsPreview(true);
                        }, 800);
                      }
                    }}
                    className="p-3 text-sm text-left rounded-md bg-background-secondary border border-border text-primary hover:bg-accent/5 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {relevantChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-background-secondary border border-border text-primary'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        msg.role === 'user' ? 'text-gray-300' : 'text-secondary'
                      }`}
                    >
                      {msg.role === 'user'
                        ? currentUser?.name || 'You'
                        : 'M&A Scout AI'} • {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Visualization Response */}
              {activeVisualization && (
                <div className="w-full">
                  <AIVisualizationResponse query={activeVisualization} />
                </div>
              )}
              
              {/* Results Preview */}
              {showResultsPreview && (
                <div className="bg-background-secondary rounded-lg p-4 border border-border">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-primary">Search Results Preview</h4>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          // Use the App's tab navigation system instead of URL hash
                          const tabChangeEvent = new CustomEvent('changeTab', {
                            detail: { tab: 'targets' }
                          });
                          document.dispatchEvent(tabChangeEvent);
                        }}
                        className="text-xs text-accent hover:text-accent/80 flex items-center"
                      >
                        <LayoutGrid className="h-3 w-3 mr-1" />
                        View All
                      </button>
                      <button 
                        onClick={() => setShowResultsPreview(false)}
                        className="text-secondary hover:text-primary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <div className="bg-background-primary rounded p-3 border border-border flex-grow">
                      <p className="text-xs text-secondary">Total Results</p>
                      <p className="text-xl font-bold text-primary">
                        {filteredCompanies.length} companies
                      </p>
                    </div>
                    <div className="bg-background-primary rounded p-3 border border-border flex-grow">
                      <p className="text-xs text-secondary">Top Matches</p>
                      <p className="text-xl font-bold text-primary">
                        {filteredCompanies.filter(c => c.tier === 1).length} Tier 1
                      </p>
                    </div>
                    <div className="bg-background-primary rounded p-3 border border-border flex-grow">
                      <p className="text-xs text-secondary">Total Value</p>
                      <p className="text-xl font-bold text-primary">
                        ${(filteredCompanies.reduce((sum, c) => sum + (c.valuation || 0), 0) / 1000000000).toFixed(1)}B
                      </p>
                    </div>
                  </div>
                  
                  {topCompanies.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-primary mb-2">Top Matches:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {topCompanies.map(company => (
                          <div 
                            key={company.id}
                            onClick={() => setSelectedCompany(company)}
                            className="bg-background-primary rounded-md p-3 border border-border cursor-pointer hover:border-accent/20 transition-colors"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-sm text-primary truncate">{company.name}</span>
                              <span className="text-xs px-1.5 py-0.5 bg-accent/10 text-accent rounded">
                                Tier {company.tier}
                              </span>
                            </div>
                            <div className="text-xs text-secondary">
                              {company.industry} • ${(company.revenue / 1000000).toFixed(1)}M
                            </div>
                            {company.score && (
                              <div className="mt-2">
                                <div className="text-xs flex justify-between">
                                  <span>Match Score:</span>
                                  <span className="font-medium">{Math.round(company.score.overall)}%</span>
                                </div>
                                <div className="mt-1 h-1.5 w-full bg-background-secondary rounded-full">
                                  <div 
                                    className="h-1.5 bg-accent rounded-full" 
                                    style={{ width: `${company.score.overall}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-background-secondary border-t border-border">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about targets, search for companies, or request analysis..."
              className="flex-1 p-3 border border-border bg-background-primary rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-4 py-2 bg-black text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors flex items-center"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
      
      {/* Right Panel - Search Controls */}
      <div className="flex flex-col bg-background-secondary rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-black text-white">
          <div className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Target Search</h2>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            Find potential acquisition targets
          </p>
        </div>
        
        <div className="p-4 border-b border-border">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by industry, region, or service..."
              className="w-full p-2.5 pl-9 border border-border rounded-md bg-background-primary focus:outline-none focus:ring-2 focus:ring-accent text-primary"
            />
            <Search className="absolute left-3 top-3.5 text-secondary h-4 w-4" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-secondary hover:text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          
          {/* Quick filters */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['Technology', 'Healthcare', 'North America', 'Europe', 'Cloud Services'].map(filter => (
                <button 
                  key={filter}
                  className="px-2.5 py-1 text-xs rounded-full border border-border text-primary hover:bg-accent/5 transition-colors"
                  onClick={() => setSearchQuery(filter)}
                >
                  {filter}
                </button>
              ))}
              <button 
                className="px-2.5 py-1 text-xs rounded-full border border-border text-primary hover:bg-accent/5 transition-colors flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-3 w-3 mr-1" />
                {showFilters ? "Less" : "More"}
              </button>
            </div>
          </div>
          
          {/* Additional filters (collapsible) */}
          {showFilters && (
            <div className="mb-4 p-3 bg-background-primary rounded-lg border border-border">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-secondary mb-1">Industry</label>
                  <select
                    className="w-full p-2 text-sm border border-border bg-background-secondary rounded-md"
                    value={searchParams.industry || ''}
                    onChange={(e) => updateSearchParams({ industry: e.target.value || undefined })}
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-secondary mb-1">Region</label>
                  <select
                    className="w-full p-2 text-sm border border-border bg-background-secondary rounded-md"
                    value={searchParams.region || ''}
                    onChange={(e) => updateSearchParams({ region: e.target.value || undefined })}
                  >
                    <option value="">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-secondary mb-1">Min Revenue ($M)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full p-2 text-sm border border-border bg-background-secondary rounded-md"
                    value={searchParams.minRevenue ? searchParams.minRevenue / 1000000 : ''}
                    onChange={(e) => updateSearchParams({ 
                      minRevenue: e.target.value ? parseInt(e.target.value) * 1000000 : undefined 
                    })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary mb-1">Min Growth (%)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full p-2 text-sm border border-border bg-background-secondary rounded-md"
                    value={searchParams.minGrowthRate || ''}
                    onChange={(e) => updateSearchParams({ 
                      minGrowthRate: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center disabled:bg-gray-400"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Targets
              </>
            )}
          </button>
        </div>
        
        {/* Results Summary */}
        <div className="p-4 flex-1 bg-background-primary">
          <h3 className="text-sm font-medium text-primary mb-2">Search Results</h3>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-background-secondary p-3 rounded border border-border">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-secondary">Total Companies</span>
                <span className="text-sm font-medium text-primary">{filteredCompanies.length}</span>
              </div>
              <div className="h-1.5 w-full bg-background-primary rounded-full overflow-hidden">
                <div className="h-full bg-black" style={{ width: `100%` }}></div>
              </div>
            </div>
            
            <div className="bg-background-secondary p-3 rounded border border-border">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-secondary">Tier 1 Companies</span>
                <span className="text-sm font-medium text-primary">
                  {filteredCompanies.filter(c => c.tier === 1).length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-background-primary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black" 
                  style={{ 
                    width: `${(filteredCompanies.filter(c => c.tier === 1).length / filteredCompanies.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="bg-background-secondary p-3 rounded border border-border">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-secondary">Tier 2 Companies</span>
                <span className="text-sm font-medium text-primary">
                  {filteredCompanies.filter(c => c.tier === 2).length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-background-primary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-500" 
                  style={{ 
                    width: `${(filteredCompanies.filter(c => c.tier === 2).length / filteredCompanies.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="bg-background-secondary p-3 rounded border border-border">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-secondary">Tier 3 Companies</span>
                <span className="text-sm font-medium text-primary">
                  {filteredCompanies.filter(c => c.tier === 3).length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-background-primary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-300" 
                  style={{ 
                    width: `${(filteredCompanies.filter(c => c.tier === 3).length / filteredCompanies.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3 border-t border-border flex justify-between">
          <button
            onClick={() => {
              // Use the App's tab navigation system instead of URL hash
              const tabChangeEvent = new CustomEvent('changeTab', {
                detail: { tab: 'targets' }
              });
              document.dispatchEvent(tabChangeEvent);
            }}
            className="text-xs flex items-center text-primary hover:text-accent"
          >
            <LayoutGrid className="h-4 w-4 mr-1.5" />
            View All Results
          </button>
          
          <button
            className="text-xs flex items-center text-primary hover:text-accent"
            onClick={() => {
              alert('This would export the search results in a real implementation.');
            }}
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetSearch;