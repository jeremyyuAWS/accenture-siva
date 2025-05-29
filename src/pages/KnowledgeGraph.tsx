import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Download, 
  Share2, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  RefreshCw,
  Zap,
  FileText,
  Bot,
  Network
} from 'lucide-react';
import SearchWorkflow from '../components/knowledge-graph/SearchWorkflow';
import { popularSearchScenarios } from '../data/demoScenarios';

// Mock AI responses for the demo
const AI_RESPONSES = [
  "I'll analyze the knowledge graph to find connections between fintech companies in the crypto space using GenAI.",
  "Based on the graph data, there are several key patterns in how fintech companies are leveraging generative AI for crypto applications.",
  "The visualization shows strong connections between fraud prevention platforms and blockchain analytics companies.",
  "Looking at funding patterns, crypto companies using GenAI for compliance and fraud detection are receiving significant attention from major investors.",
  "The data suggests Sardine and Alloy are leading innovators at the intersection of crypto, fintech, and generative AI."
];

const KnowledgeGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiChat, setAiChat] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  
  // Show document panel
  const [showDocument, setShowDocument] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  
  // Refs
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const initialLoadRef = useRef(false);
  
  // Effect to check for scenario param in URL or event
  useEffect(() => {
    const handleScenarioNavigation = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.tab === 'knowledge') {
        // Set search query if provided
        if (customEvent.detail.searchQuery) {
          setSearchQuery(customEvent.detail.searchQuery);
        }
        
        // Find the matching scenario if scenarioId is provided
        if (customEvent.detail.scenarioId) {
          const scenarioId = customEvent.detail.scenarioId;
          const scenario = popularSearchScenarios.find(s => s.id === scenarioId);
          
          if (scenario) {
            console.log("Scenario found, starting search:", scenario.title);
            setCurrentScenario(scenario);
            
            // Set search query
            const query = customEvent.detail.searchQuery || scenario.query || scenario.title;
            setSearchQuery(query);
            
            // Add user message
            setAiChat([{
              role: 'user',
              content: `Can you analyze the knowledge graph for ${scenario.title}?`
            }]);
            
            // Start search immediately if autoStartSearch is true
            if (customEvent.detail.autoStartSearch) {
              setIsSearching(true);
              
              // Add AI typing indicator and simulate response
              setIsAiTyping(true);
              
              // Simulate AI typing delay
              setTimeout(() => {
                // Get random AI response
                const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
                setAiChat(prev => [...prev, { role: 'assistant', content: aiResponse }]);
                setIsAiTyping(false);
              }, 1500);
              
              // After a delay, finish the search and show document
              setTimeout(() => {
                setIsSearching(false);
                
                // Show document after search completes
                setTimeout(() => {
                  setShowDocument(true);
                }, 500);
              }, 5000);
            }
          }
        } else if (customEvent.detail.autoStartSearch && customEvent.detail.searchQuery) {
          // Handle direct search query without scenario
          setIsSearching(true);
          
          // Add user message if not already added
          if (!aiChat.some(msg => msg.role === 'user')) {
            setAiChat([{
              role: 'user',
              content: `Can you analyze the knowledge graph for "${customEvent.detail.searchQuery}"?`
            }]);
          }
          
          // Add AI typing indicator and simulate response
          setIsAiTyping(true);
          
          // Simulate AI typing delay
          setTimeout(() => {
            // Get random AI response
            const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
            setAiChat(prev => [...prev, { role: 'assistant', content: aiResponse }]);
            setIsAiTyping(false);
          }, 1500);
          
          // After a delay, finish the search
          setTimeout(() => {
            setIsSearching(false);
          }, 5000);
        }
      }
    };

    // Listen for the custom event
    document.addEventListener('changeTab', handleScenarioNavigation);
    
    // Check for URL parameters only once on initial load
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      
      const urlParams = new URLSearchParams(window.location.search);
      const scenarioId = urlParams.get('scenario');
      
      if (scenarioId) {
        // Trigger the same logic as the event handler
        const event = new CustomEvent('changeTab', {
          detail: { 
            tab: 'knowledge',
            scenarioId: scenarioId,
            autoStartSearch: true
          }
        });
        document.dispatchEvent(event);
      }
    }

    return () => {
      document.removeEventListener('changeTab', handleScenarioNavigation);
    };
  }, []);
  
  // Handle search
  const handleSearch = async (query: string) => {
    if (query === searchQuery && isSearching) return;
    
    setSearchQuery(query);
    setIsSearching(true);
    setSelectedNode(null);
    setShowDocument(false);
    
    // Add user message to chat if not already added
    if (!aiChat.some(msg => msg.role === 'user' && msg.content.includes(query))) {
      const userPrompt = query ? 
        `Can you analyze the knowledge graph for "${query}"?` : 
        "Can you analyze the entire knowledge graph for key insights?";
      
      setAiChat(prev => [...prev, { role: 'user', content: userPrompt }]);
    }
    
    setIsAiTyping(true);
    
    // Simulate AI typing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get random AI response
    const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    setAiChat(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsAiTyping(false);
    
    // Keep searching for a bit to show the full workflow animation
    setTimeout(() => {
      setIsSearching(false);
      
      // Show document after search completes if this is the fintech scenario
      if (query.toLowerCase().includes('fintech') && 
          query.toLowerCase().includes('crypto') && 
          query.toLowerCase().includes('genai')) {
        setTimeout(() => {
          setShowDocument(true);
        }, 500);
      } else if (currentScenario) {
        // For other scenarios also show document
        setTimeout(() => {
          setShowDocument(true);
        }, 500);
      }
    }, 5000); // Give more time for the workflow to complete
  };
  
  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setAiChat(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // If message includes search terms, perform a search
    if (userMessage.toLowerCase().includes('search') || 
        userMessage.toLowerCase().includes('find') || 
        userMessage.toLowerCase().includes('show')) {
      handleSearch(userMessage);
    } else {
      // Otherwise just simulate AI response
      setIsAiTyping(true);
      
      setTimeout(() => {
        const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
        setAiChat(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        setIsAiTyping(false);
      }, 1000);
    }
    
    setUserMessage('');
  };
  
  // Auto scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [aiChat, isAiTyping]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
      {/* Left Panel - Animated Sequential Search */}
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <Network className="mr-2 h-5 w-5 text-blue-600" />
            Knowledge Graph Reasoning
          </h2>
          
          <div className="mt-4">
            <div className="relative w-full">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchQuery);
                }}
                className="flex w-full"
              >
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search the knowledge graph..."
                    className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    disabled={isSearching}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                      }}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className={`ml-2 px-4 py-2 ${
                    isSearching
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 hover:bg-black'
                  } text-white rounded-lg flex items-center`}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {isSearching || aiChat.length > 0 ? (
            <div className="h-full">
              <SearchWorkflow 
                isSearching={isSearching}
                searchQuery={searchQuery}
                searchSteps={currentScenario?.searchSteps}
                onWorkflowComplete={() => {
                  // Show document panel when workflow completes
                  if (currentScenario) {
                    setShowDocument(true);
                  }
                }}
              />
              
              <div className="mt-4 text-sm">
                {!isSearching && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-start">
                    <div className="mr-2 mt-0.5">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Search Complete</p>
                      <p className="mt-1">
                        {currentScenario ? 
                          `Found ${currentScenario.companies?.length || 6} companies matching "${currentScenario.title}"` : 
                          `Found 28 results matching "${searchQuery}"`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Search the Knowledge Graph</h3>
                <p className="text-gray-500 max-w-md">
                  Enter a search query to find relationships between companies, investors, and industries.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Panel - AI Assistant & Document Viewer */}
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {showDocument ? (
          /* Document Viewer */
          <div className="flex flex-col h-full">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded flex items-center justify-center bg-blue-100 text-blue-600 mr-3">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-gray-800">{currentScenario ? currentScenario.title : "Fintech Companies in the Crypto Space Using Generative AI"}</h2>
                  <p className="text-xs text-gray-500">Last modified: Just now</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded"
                  onClick={() => setShowDocument(false)}
                >
                  <X className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <article className="max-w-4xl mx-auto prose prose-gray">
                <h1 className="text-3xl font-bold text-gray-800">{currentScenario ? currentScenario.title : "Fintech Companies in the Crypto Space Using Generative AI"}</h1>
                
                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-gray-800">Executive Summary</h2>
                  <p className="mt-4 text-gray-700">
                    This report presents a comprehensive analysis of fintech companies operating at the intersection
                    of cryptocurrency and Generative Artificial Intelligence (GenAI). Through extensive research and
                    validation, we have identified key companies that are leveraging both cryptocurrency
                    capabilities and generative AI technologies to transform the financial technology landscape. These
                    companies represent the cutting edge of innovation in financial services, combining blockchain
                    technology with advanced AI to create new solutions for fraud prevention, compliance, banking,
                    and financial crime detection.
                  </p>
                  
                  <p className="mt-4 text-gray-700">
                    The companies profiled in this report demonstrate various approaches to integrating crypto and
                    GenAI technologies, from fraud prevention platforms specifically designed for crypto transactions
                    to banking platforms incorporating generative AI for product development. Each company brings
                    unique strengths and focuses to this emerging space, highlighting the diverse applications and
                    potential of these combined technologies.
                  </p>
                </section>
                
                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-gray-800">Key Findings</h2>
                  <ol className="mt-4 space-y-4 list-decimal pl-6">
                    <li className="text-gray-700">
                      <strong className="text-gray-800">Fraud Prevention and Compliance</strong> emerge as primary use cases for the integration of GenAI
                      in crypto-focused fintech, with companies like Sardine and Alloy leading the way in developing
                      sophisticated solutions.
                    </li>
                    <li className="text-gray-700">
                      <strong className="text-gray-800">Advanced Risk Assessment</strong> capabilities are being enhanced through GenAI, enabling
                      more accurate detection of unusual patterns and potential fraud in cryptocurrency
                      transactions.
                    </li>
                    <li className="text-gray-700">
                      <strong className="text-gray-800">Customer Experience Improvements</strong> are achieved through GenAI-powered interfaces
                      that simplify complex cryptocurrency concepts and transactions for mainstream users.
                    </li>
                    <li className="text-gray-700">
                      <strong className="text-gray-800">Regulatory Compliance Automation</strong> is streamlined using GenAI to interpret and
                      implement evolving cryptocurrency regulations across different jurisdictions.
                    </li>
                  </ol>
                </section>
                
                <section className="mt-8">
                  <h2 className="text-2xl font-semibold text-gray-800">Company Profiles</h2>
                  <p className="mt-4 text-gray-700">
                    Below is a detailed analysis of the leading companies operating at the intersection of
                    cryptocurrency and generative AI technologies.
                  </p>
                  
                  {currentScenario && currentScenario.companies ? (
                    <div className="space-y-4 mt-6">
                      {currentScenario.companies.map((company: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h3 className="text-xl font-medium text-gray-800">{company.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              {company.industry}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                              {company.fundingStage}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                              {company.fundingAmount}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-700">
                            {company.description}
                          </p>
                          {company.investors && (
                            <div className="mt-2 text-sm text-gray-600">
                              <strong>Key Investors:</strong> {company.investors.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-xl font-medium text-gray-800">Sardine</h3>
                        <p className="mt-2 text-gray-700">
                          Sardine offers an AI-powered fraud prevention and compliance platform specifically designed for crypto
                          and fintech companies. Their platform uses generative AI to analyze thousands of data points in real-time,
                          detecting fraudulent patterns and suspicious behaviors in cryptocurrency transactions that traditional
                          rule-based systems might miss.
                        </p>
                      </div>
                      
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-xl font-medium text-gray-800">Alloy</h3>
                        <p className="mt-2 text-gray-700">
                          Alloy provides an identity decisioning platform that leverages generative AI to help crypto exchanges
                          and fintech companies with customer onboarding, fraud prevention, and regulatory compliance. Their
                          AI models are trained on vast datasets to identify potential money laundering risks and fraudulent
                          activities in the crypto space.
                        </p>
                      </div>
                    </>
                  )}
                </section>
              </article>
            </div>
          </div>
        ) : (
          /* AI Assistant */
          <div className="flex flex-col h-full">
            <div className="p-4 bg-gray-800 text-white flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                <h2 className="font-semibold">Agent Eddie AI Assistant</h2>
              </div>
              
              <button 
                onClick={() => setShowRightPanel(!showRightPanel)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                {showRightPanel ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
            </div>
            
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {aiChat.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      How can I help with your knowledge exploration?
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Ask me to find relationships, analyze patterns, or provide insights about companies, investors, and industries.
                    </p>
                  </div>
                </div>
              ) : (
                aiChat.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  disabled={isSearching}
                  placeholder="Ask about the knowledge graph..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!userMessage.trim() || isSearching}
                  className={`p-2 rounded-lg ${
                    !userMessage.trim() || isSearching 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              </form>
              
              <div className="flex justify-between mt-2 text-xs">
                <button
                  onClick={() => setShowDocument(!showDocument)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showDocument ? 'Hide Document' : 'Show Document'}
                </button>
                
                <div className="flex items-center text-gray-500">
                  <Zap className="h-3 w-3 mr-1" />
                  <span>Powered by Agent Eddie</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraph;