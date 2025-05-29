import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { MessageSquare, Send, HelpCircle, Search, FileText, Sparkles, BarChart2 } from 'lucide-react';
import AIVisualizationResponse from './AIVisualizationResponse';

interface ChatPanelProps {
  currentUser: User | null;
  chatMessages: ChatMessage[];
  onSendMessage: (content: string, companyId?: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  currentUser,
  chatMessages,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');
  const [shouldShowVisualization, setShouldShowVisualization] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
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
      
      onSendMessage(message);
      setMessage('');
    }
  };
  
  // Suggested questions to ask the AI
  const suggestedQuestions = [
    "What types of companies should we be looking for?",
    "Show me the tier distribution for our targets",
    "Compare the strategic fit of top tier companies",
    "What metrics are most important for evaluating tech acquisitions?",
    "Summarize the key M&A trends in our target portfolio"
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-black text-white border-b border-gray-200">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">M&A Scout AI Assistant</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Ask about acquisition targets, strategy, and insights
        </p>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-xl font-medium text-gray-800 mb-3">How can I help with your M&A strategy?</h3>
            <p className="text-gray-500 max-w-lg mb-8">
              Ask me about potential acquisition targets, market analysis, or strategic recommendations to enhance your M&A decisions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSendMessage(question);
                    if (question.toLowerCase().includes('show') || 
                        question.toLowerCase().includes('compare') ||
                        question.toLowerCase().includes('distribution')) {
                      setActiveVisualization(question);
                      setShouldShowVisualization(true);
                    }
                  }}
                  className="p-3 text-sm text-left rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {chatMessages.map((msg) => (
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
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-gray-300' : 'text-gray-500'
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
            {shouldShowVisualization && activeVisualization && (
              <div className="w-full">
                <AIVisualizationResponse query={activeVisualization} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
            placeholder="Ask me about M&A targets, strategy, or request visualizations..."
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-black text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex text-xs text-gray-500 items-center">
            <HelpCircle className="h-3 w-3 mr-1" />
            <span>Ask about targets, strategy, or specific companies</span>
          </div>
          
          <button 
            className="text-xs text-gray-600 hover:text-gray-800 transition-colors flex items-center"
            onClick={() => {
              const visualizationQuery = "Show me charts of our target companies";
              onSendMessage(visualizationQuery);
              setActiveVisualization(visualizationQuery);
              setShouldShowVisualization(true);
            }}
          >
            <BarChart2 className="h-3 w-3 mr-1" />
            <span>Show visualizations</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;