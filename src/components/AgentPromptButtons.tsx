import React from 'react';
import { 
  CalendarDays, 
  TrendingUp, 
  Clock, 
  Users, 
  Globe,
  Sparkles
} from 'lucide-react';
import AnalysisTemplatesPanel from './AnalysisTemplatesPanel';
import NaturalLanguageQueryBuilder from './NaturalLanguageQueryBuilder';

interface AgentPromptButtonsProps {
  onPromptClick: (prompt: string) => void;
}

const AgentPromptButtons: React.FC<AgentPromptButtonsProps> = ({ onPromptClick }) => {
  const promptSuggestions = [
    {
      text: "What deals happened in my watchlist this week?",
      icon: <CalendarDays className="h-4 w-4 mr-2" />
    },
    {
      text: "Summarize Series A activity in ClimateTech",
      icon: <TrendingUp className="h-4 w-4 mr-2" />
    },
    {
      text: "Show a timeline of recent funding rounds",
      icon: <Clock className="h-4 w-4 mr-2" />
    },
    {
      text: "Who's acquiring AI startups?",
      icon: <Users className="h-4 w-4 mr-2" />
    },
    {
      text: "Top investors in North America last quarter?",
      icon: <Globe className="h-4 w-4 mr-2" />
    }
  ];

  return (
    <div className="w-full max-w-xl space-y-6">
      <div>
        <div className="text-sm font-medium text-primary mb-3 flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-accent" />
          Ask a question:
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {promptSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onPromptClick(suggestion.text)}
              className="flex items-center p-3 text-left text-sm rounded-lg bg-background-secondary border border-border hover:bg-accent/5 transition-colors"
            >
              {suggestion.icon}
              <span>{suggestion.text}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Advanced Query Builder */}
      <NaturalLanguageQueryBuilder onRunQuery={onPromptClick} />
      
      {/* Analysis Templates */}
      <AnalysisTemplatesPanel onSelectTemplate={onPromptClick} />
    </div>
  );
};

export default AgentPromptButtons;