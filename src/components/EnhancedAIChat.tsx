import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  Sparkles, 
  BarChart2, 
  ArrowRight 
} from 'lucide-react';
import AIVisualizationResponse from './AIVisualizationResponse';
import AIConversationScenarios from './AIConversationScenarios';
import { demoScenarios } from '../data/demoScenarios';
import { ChatMessage } from '../types';

const EnhancedAIChat: React.FC = () => {
  const { currentUser, chatMessages, sendChatMessage, filteredCompanies, setSelectedCompany } = useAppContext();
  const [message, setMessage] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [shouldShowVisualization, setShouldShowVisualization] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [demoMessages, setDemoMessages] = useState<ChatMessage[]>([]);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [activeDemoScenario, setActiveDemoScenario] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get top tier 1 companies
  const topTierCompanies = filteredCompanies
    .filter(company => company.tier === 1)
    .slice(0, 2);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, demoMessages]);
  
  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Check if the message is requesting a visualization
      const lowerMessage = message.toLowerCase();
      const isVisualizationRequest = 
        lowerMessage.includes('show me') || 
        lowerMessage.includes('visualize') || 
        lowerMessage.includes('chart') || 
        lowerMessage.includes('graph') ||
        lowerMessage.includes('compare') || 
        lowerMessage.includes('distribution') ||
        lowerMessage.includes('breakdown');
      
      if (isVisualizationRequest) {
        setActiveVisualization(message);
        setShouldShowVisualization(true);
      }
      
      // In demo mode, continue the scenario instead of sending to the API
      if (demoMode) {
        continueDemoScenario(message);
      } else {
        sendChatMessage(message);
      }
      
      setMessage('');
      setShowSuggestions(false);
    }
  };
  
  // Handle starting a demo scenario
  const handleSelectScenario = (scenarioId: string) => {
    const scenario = demoScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setDemoMode(true);
      setActiveDemoScenario(scenarioId);
      setDemoMessages([]);
      setCurrentDemoIndex(0);
      
      // Start with the first user message
      const firstMessage: ChatMessage = {
        id: `demo-${Date.now()}`,
        role: scenario.messages[0].role,
        content: scenario.messages[0].content,
        timestamp: new Date(),
      };
      
      setDemoMessages([firstMessage]);
      
      // Automatically show AI response after a delay
      setTimeout(() => {
        const secondMessage: ChatMessage = {
          id: `demo-${Date.now() + 1}`,
          role: scenario.messages[1].role,
          content: scenario.messages[1].content,
          timestamp: new Date(),
          visualizationType: scenario.messages[1].visualizationType
        };
        
        setDemoMessages(prev => [...prev, secondMessage]);
        setCurrentDemoIndex(2); // Set to next expected message index
        
        if (secondMessage.visualizationType) {
          setActiveVisualization(secondMessage.visualizationType);
          setShouldShowVisualization(true);
        }
      }, 1000);
    }
  };
  
  // Continue the demo scenario based on user input
  const continueDemoScenario = (userInput: string) => {
    const scenario = demoScenarios.find(s => s.id === activeDemoScenario);
    if (!scenario || currentDemoIndex >= scenario.messages.length) return;
    
    // For demo purposes, we'll show the next message regardless of actual input
    const userMessage: ChatMessage = {
      id: `demo-${Date.now()}`,
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    
    setDemoMessages(prev => [...prev, userMessage]);
    
    // Show AI response after a short delay
    setTimeout(() => {
      if (currentDemoIndex < scenario.messages.length) {
        const nextMessage = scenario.messages[currentDemoIndex];
        const aiMessage: ChatMessage = {
          id: `demo-${Date.now() + 1}`,
          role: nextMessage.role,
          content: nextMessage.content,
          timestamp: new Date(),
          visualizationType: nextMessage.visualizationType
        };
        
        setDemoMessages(prev => [...prev, aiMessage]);
        setCurrentDemoIndex(currentDemoIndex + 1);
        
        if (nextMessage.visualizationType) {
          setActiveVisualization(nextMessage.visualizationType);
          setShouldShowVisualization(true);
        }
      }
    }, 1000);
  };
  
  // Exit demo mode
  const exitDemoMode = () => {
    setDemoMode(false);
    setDemoMessages([]);
    setShowSuggestions(true);
  };
  
  // Messages to display (either real or demo)
  const displayMessages = demoMode ? demoMessages : chatMessages;
  
  // Suggested questions to ask the AI
  const suggestedQuestions = [
    "What types of companies should we be looking for?",
    "Show me the tier distribution for our targets",
    "Visualize revenue comparison of top targets",
    "Compare the strategic fit of top tier companies",
    "What metrics are most important for evaluating tech acquisitions?",
    "Summarize the key M&A trends in our target portfolio"
  ];

  return (
    <div className="h-[calc(100vh-180px)] flex">
      {/* Main Chat Panel */}
      <div className={`flex-1 flex flex-col bg-background-secondary rounded-lg shadow-md overflow-hidden transition-all ${showInsights ? 'mr-4' : ''}`}>
        {/* Header */}
        <div className="p-4 bg-black text-white border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">M&A Scout AI Assistant</h2>
            </div>
            <div className="flex items-center">
              {demoMode && (
                <button
                  onClick={exitDemoMode}
                  className="mr-3 text-xs bg-white/20 hover:bg-white/30 transition-colors px-2 py-1 rounded text-white"
                >
                  Exit Demo
                </button>
              )}
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="text-white hover:text-gray-200 transition-colors"
                title={showInsights ? "Hide insights" : "Show insights"}
              >
                {showInsights ? <ChevronRight className="h-5 w-5" /> : <Info className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <p className="text-gray-300 text-sm mt-1 max-w-2xl">
            Ask questions about M&A targets, strategy, and insights. Request visualizations by asking for charts or comparisons.
          </p>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-background-primary">
          {displayMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-xl font-medium text-primary mb-3">How can I help with your M&A strategy?</h3>
              <p className="text-secondary max-w-lg mb-8">
                Ask me about potential acquisition targets, market analysis, or strategic recommendations to enhance your M&A decisions.
              </p>
              
              {showSuggestions && (
                <div className="w-full max-w-3xl">
                  <AIConversationScenarios onSelectScenario={handleSelectScenario} />
                  
                  <div className="mt-4">
                    <h4 className="text-primary font-medium mb-3">Quick Questions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            sendChatMessage(question);
                            if (question.toLowerCase().includes('show') || 
                                question.toLowerCase().includes('visualize') || 
                                question.toLowerCase().includes('chart') ||
                                question.toLowerCase().includes('compare') ||
                                question.toLowerCase().includes('distribution')) {
                              setActiveVisualization(question);
                              setShouldShowVisualization(true);
                            }
                            setShowSuggestions(false);
                          }}
                          className="p-3 text-sm text-left rounded-md bg-background-secondary border border-border text-primary hover:bg-accent/5 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {displayMessages.map((msg, index) => (
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
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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
              
              {/* Show visualization after relevant AI responses */}
              {(shouldShowVisualization && activeVisualization) || 
               displayMessages.some(m => m.visualizationType) ? (
                <div className="w-full">
                  <AIVisualizationResponse 
                    query={activeVisualization || displayMessages.find(m => m.visualizationType)?.visualizationType || ''} 
                  />
                </div>
              ) : null}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Message Input */}
        <div className="p-4 bg-background-secondary border-t border-border">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background-primary text-primary placeholder-secondary"
              placeholder={demoMode ? "Continue the demo conversation..." : "Ask me about M&A targets, strategy, or request visualizations..."}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-4 py-2 bg-black text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors flex items-center"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          
          <div className="mt-2 flex justify-between items-center">
            <button
              onClick={() => {
                setActiveVisualization("Show me charts of our target companies");
                setShouldShowVisualization(prevState => !prevState);
              }}
              className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center"
            >
              <BarChart2 className="h-3 w-3 mr-1" />
              {shouldShowVisualization ? "Hide visualizations" : "Show visualizations"}
            </button>
            
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center"
            >
              <Info className="h-3 w-3 mr-1" />
              {showInsights ? "Hide insights panel" : "Show insights panel"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Collapsible Insights Panel */}
      {showInsights && (
        <div className="w-72 bg-background-secondary rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="p-3 bg-accent/10 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-primary">Key Insights</h2>
            <button
              onClick={() => setShowInsights(false)}
              className="text-secondary hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {/* Top Companies */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-primary">Top Recommendations</h3>
                <button className="text-xs text-accent hover:text-accent/80 transition-colors">
                  View all
                </button>
              </div>
              
              <div className="space-y-2">
                {topTierCompanies.length > 0 ? (
                  topTierCompanies.map(company => (
                    <div 
                      key={company.id}
                      className="p-2 border border-border rounded bg-background-primary cursor-pointer hover:border-accent/20 transition-colors"
                      onClick={() => setSelectedCompany(company)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">{company.name}</span>
                        <span className="text-xs bg-accent/10 px-1.5 py-0.5 rounded text-accent">
                          Tier {company.tier}
                        </span>
                      </div>
                      <div className="text-xs text-secondary mt-1">
                        {company.industry} • {(company.revenue / 1000000).toFixed(1)}M revenue
                      </div>
                      {company.score && (
                        <div className="mt-1 w-full h-1 bg-gray-200 rounded-full">
                          <div 
                            className="h-1 bg-accent rounded-full" 
                            style={{ width: `${company.score.overall}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 text-xs text-secondary">
                    No tier 1 companies found
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mb-4">
              <h3 className="text-xs font-medium text-primary mb-2">Portfolio Overview</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-background-primary border border-border rounded">
                  <p className="text-xs text-secondary">Tier 1</p>
                  <p className="text-lg font-bold text-primary">
                    {filteredCompanies.filter(c => c.tier === 1).length}
                  </p>
                </div>
                <div className="p-2 bg-background-primary border border-border rounded">
                  <p className="text-xs text-secondary">Due Diligence</p>
                  <p className="text-lg font-bold text-primary">
                    {filteredCompanies.filter(c => c.dealStage === 'due_diligence').length}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Strategic Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-primary">Strategy Tips</h3>
                <button className="text-xs text-accent hover:text-accent/80 transition-colors">
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <p className="p-2 bg-background-primary border border-border rounded text-secondary">
                  Focus on companies with complementary tech stacks to reduce integration risks.
                </p>
                <p className="p-2 bg-background-primary border border-border rounded text-secondary">
                  Consider geographic expansion to diversify market presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAIChat;