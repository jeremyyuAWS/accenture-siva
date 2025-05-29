import React, { useState, useRef, useEffect } from 'react';
import { Send, BarChart2, HelpCircle, Bot, Lightbulb, RefreshCw, Search } from 'lucide-react';
import AgentPromptButtons from './AgentPromptButtons';
import InsightVisualization from './InsightVisualization';
import { useAppContext } from '../context/AppContext';
import { aiService } from '../services/aiService';

interface AgentAssistantProps {
  selectedNode?: any;
}

const AgentAssistant: React.FC<AgentAssistantProps> = ({ selectedNode }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualizationType, setVisualizationType] = useState<string | null>(null);
  const [visualizationData, setVisualizationData] = useState<any>(null);
  const [generatingVisualization, setGeneratingVisualization] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { currentUser } = useAppContext();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Update message input if node is selected
  useEffect(() => {
    if (selectedNode) {
      const nodeType = selectedNode.type === 'company' ? 'company' : 
                      selectedNode.type === 'investor' ? 'investor' :
                      selectedNode.type === 'industry' ? 'industry' : 'entity';
      setMessage(`Tell me more about this ${nodeType}: ${selectedNode.name}`);
      
      // Update suggested queries based on the node type
      if (selectedNode.type === 'company') {
        setSuggestedQueries([
          `What's the funding history of ${selectedNode.name}?`,
          `Show me a timeline of events for ${selectedNode.name}`,
          `Who are the main competitors of ${selectedNode.name}?`,
          `What's the valuation trend for ${selectedNode.name}?`
        ]);
      } else if (selectedNode.type === 'investor') {
        setSuggestedQueries([
          `What companies has ${selectedNode.name} invested in?`,
          `Show me the investment focus of ${selectedNode.name}`,
          `What's the average check size for ${selectedNode.name}?`,
          `Compare ${selectedNode.name} to other investors in the same space`
        ]);
      } else if (selectedNode.type === 'industry') {
        setSuggestedQueries([
          `What are the funding trends in ${selectedNode.name}?`,
          `Show me the top startups in ${selectedNode.name}`,
          `Who are the most active investors in ${selectedNode.name}?`,
          `What acquisitions have happened in ${selectedNode.name} recently?`
        ]);
      }
    } else {
      // Reset suggested queries to defaults
      setSuggestedQueries([
        "What deals happened in my watchlist this week?",
        "Summarize Series A activity in ClimateTech",
        "Show a timeline of recent funding rounds",
        "Who's acquiring AI startups?",
        "Top investors in North America last quarter?"
      ]);
    }
  }, [selectedNode]);
  
  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    // Check if message requires visualization
    const visualizationType = aiService.requiresVisualization(message);
    
    try {
      // Generate AI response
      const aiResponse = await aiService.generateResponse(message, selectedNode);
      
      // Add AI response to chat
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, responseMessage]);
      
      // Generate visualization if needed
      if (visualizationType) {
        setShowVisualization(true);
        setVisualizationType(visualizationType);
        
        setGeneratingVisualization(true);
        const visualizationData = await aiService.generateVisualization(message, visualizationType);
        setVisualizationData(visualizationData);
        setGeneratingVisualization(false);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Function to handle predefined prompts
  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
    
    // Automatically send the message
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSendMessage(fakeEvent);
    }, 100);
  };
  
  // Function to handle suggested query click
  const handleSuggestedQueryClick = (query: string) => {
    handlePromptClick(query);
  };

  return (
    <div className="flex flex-col h-full bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Ask Insight Sentinel</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Your AI assistant for market intelligence and deal insights
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-background-primary">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-medium text-primary mb-3">
              How can I help with your investment intelligence?
            </h3>
            <p className="text-secondary max-w-md mb-8">
              Ask me about recent deals, funding trends, or specific companies in your focus areas.
            </p>
            
            <AgentPromptButtons onPromptClick={handlePromptClick} />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-background-secondary border border-border text-primary'
                    }`}
                  >
                    <div className="whitespace-pre-wrap prose prose-sm max-w-none">
                      {msg.role === 'assistant' ? (
                        <div dangerouslySetInnerHTML={{ 
                          __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') 
                        }} />
                      ) : (
                        msg.content
                      )}
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        msg.role === 'user' ? 'text-gray-300' : 'text-secondary'
                      }`}
                    >
                      {msg.role === 'user'
                        ? currentUser?.name || 'You'
                        : 'Insight Sentinel'} • {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-background-secondary border border-border">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {showVisualization && visualizationType && (
                <div className="my-4 w-full">
                  {generatingVisualization ? (
                    <div className="bg-background-secondary p-4 rounded-lg border border-border flex items-center justify-center h-60">
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-8 w-8 text-accent animate-spin mb-3" />
                        <p className="text-primary">Generating visualization...</p>
                      </div>
                    </div>
                  ) : (
                    <InsightVisualization 
                      type={visualizationType}
                      node={selectedNode}
                      data={visualizationData}
                    />
                  )}
                </div>
              )}
              
              {/* Suggested follow-up queries */}
              {chatMessages.length > 0 && !isTyping && chatMessages[chatMessages.length - 1].role === 'assistant' && (
                <div className="mt-2">
                  <div className="flex items-center text-xs text-secondary mb-2">
                    <Lightbulb className="h-3.5 w-3.5 mr-1" />
                    <span>Suggested follow-up questions:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQueries.slice(0, 3).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQueryClick(query)}
                        className="px-3 py-1.5 text-xs bg-background-secondary border border-border rounded-full hover:bg-accent/5 transition-colors text-primary"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="relative flex-1">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about deals, funding trends, or specific companies..."
              className="w-full p-3 pl-9 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background-primary text-primary placeholder-secondary"
            />
            <div className="absolute left-3 top-3.5">
              <Search className="h-4 w-4 text-secondary" />
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="p-3 bg-black text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        <div className="flex justify-between mt-2 text-xs">
          <button
            onClick={() => {
              setShowVisualization(!showVisualization);
              if (!visualizationType) setVisualizationType('overview');
            }}
            className="text-accent hover:text-accent/80 flex items-center"
          >
            <BarChart2 className="h-3.5 w-3.5 mr-1" />
            {showVisualization ? 'Hide Visualization' : 'Show Visualization'}
          </button>
          
          <button
            className="text-secondary hover:text-primary flex items-center"
          >
            <HelpCircle className="h-3.5 w-3.5 mr-1" />
            Tips for better results
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentAssistant;