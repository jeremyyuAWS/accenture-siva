import React from 'react';
import { demoScenarios } from '../data/demoScenarios';
import { MessageSquare, TrendingUp, Target, BarChart2, DollarSign, ChevronRight } from 'lucide-react';

interface AIConversationScenariosProps {
  onSelectScenario: (scenarioId: string) => void;
}

const AIConversationScenarios: React.FC<AIConversationScenariosProps> = ({ 
  onSelectScenario 
}) => {
  // Helper function to get scenario icon
  const getScenarioIcon = (scenarioId: string) => {
    switch(scenarioId) {
      case 'acquisition-strategy':
        return <Target className="h-4 w-4" />;
      case 'target-analysis':
        return <MessageSquare className="h-4 w-4" />;
      case 'market-trends':
        return <TrendingUp className="h-4 w-4" />;
      case 'portfolio-distribution':
        return <BarChart2 className="h-4 w-4" />;
      case 'valuation-analysis':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="mt-6 mb-8">
      <h3 className="text-lg font-medium text-primary mb-4">Try a Demo Conversation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demoScenarios.map((scenario) => (
          <div 
            key={scenario.id}
            onClick={() => onSelectScenario(scenario.id)}
            className="bg-background-secondary p-4 rounded-lg border border-border hover:border-accent cursor-pointer transition-colors"
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-2">
                {getScenarioIcon(scenario.id)}
              </div>
              <h4 className="text-primary font-medium">{scenario.title}</h4>
            </div>
            
            <p className="text-secondary text-sm mb-3">{scenario.description}</p>
            
            <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-border">
              <span className="text-secondary">
                {scenario.messages.length} messages
              </span>
              <button className="text-accent flex items-center hover:text-accent/80 transition-colors">
                Start conversation
                <ChevronRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIConversationScenarios;