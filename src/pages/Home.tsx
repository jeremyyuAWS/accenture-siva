import React, { useState } from 'react';
import { 
  ChevronRight, 
  ArrowRight, 
  PaperclipIcon, 
  Sparkles,
  Book,
  Calendar,
  Play,
  Bot,
  Search,
  Database,
  FileText,
  Clock,
  Network
} from 'lucide-react';
import { popularSearchScenarios } from '../data/demoScenarios';

const Home: React.FC = () => {
  const [taskInput, setTaskInput] = useState('');

  // Function to handle navigation to Knowledge Graph tab
  const navigateToKnowledgeGraph = (scenarioId: string) => {
    console.log("Navigating to Knowledge Graph with scenario:", scenarioId);
    
    // Dispatch a custom event to change the tab
    const tabChangeEvent = new CustomEvent('changeTab', {
      detail: { 
        tab: 'knowledge',
        scenarioId: scenarioId
      }
    });
    document.dispatchEvent(tabChangeEvent);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-8">
      <div className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-4xl font-medium text-gray-800 mb-2">Welcome to Agent Eddie</h1>
        <h2 className="text-2xl text-gray-500">What would you like to explore today?</h2>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex items-center">
          <textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Give Agent Eddie a task to work on..."
            className="flex-grow min-h-12 p-2 text-gray-800 placeholder-gray-400 resize-none outline-none"
            rows={1}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <PaperclipIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center">
            <div className="flex items-center border border-gray-200 rounded-md px-3 py-1 mr-4">
              <Sparkles className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700 text-sm">Standard</span>
              <span className="ml-2 text-gray-400">▼</span>
            </div>
            
            <span className="text-gray-500 text-sm mr-2">1,000 + 21</span>
            
            <button 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                taskInput.trim() ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}
              disabled={!taskInput.trim()}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Popular Search Scenarios */}
      <div className="w-full max-w-3xl mb-8">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Popular Searches</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularSearchScenarios.map((scenario) => (
            <div 
              key={scenario.id}
              onClick={() => navigateToKnowledgeGraph(scenario.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {scenario.id === 'fintech-crypto-genai' ? (
                    <Database className="h-5 w-5 text-blue-600" />
                  ) : scenario.id === 'ai-healthcare-startups' ? (
                    <Bot className="h-5 w-5 text-blue-600" />
                  ) : scenario.id === 'climate-tech-investors' ? (
                    <FileText className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Search className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{scenario.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{scenario.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap mt-2">
                    {scenario.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full mr-2 mb-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="w-full max-w-3xl">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => navigateToKnowledgeGraph('fintech-crypto-genai')} 
            className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md border border-gray-200"
          >
            <Database className="h-4 w-4 mr-2 text-gray-600" />
            <span>Fintech Companies in Crypto Space Using GenAI</span>
            <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
          </button>
          
          <button 
            onClick={() => navigateToKnowledgeGraph('ai-healthcare-startups')} 
            className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md border border-gray-200"
          >
            <Calendar className="h-4 w-4 mr-2 text-gray-600" />
            <span>AI Healthcare Startups</span>
            <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
          </button>
          
          <button 
            onClick={() => navigateToKnowledgeGraph('climate-tech-investors')} 
            className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md border border-gray-200"
          >
            <Book className="h-4 w-4 mr-2 text-gray-600" />
            <span>Climate Tech Investors</span>
            <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 right-8">
        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
          Explore more use cases
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Home;