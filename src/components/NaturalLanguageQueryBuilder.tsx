import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, Info } from 'lucide-react';

interface NaturalLanguageQueryBuilderProps {
  onRunQuery: (query: string) => void;
}

const NaturalLanguageQueryBuilder: React.FC<NaturalLanguageQueryBuilderProps> = ({ 
  onRunQuery 
}) => {
  const [query, setQuery] = useState('');
  const [examples, setExamples] = useState<string[]>([
    'Find AI companies that raised over $20M in the past 3 months',
    'Show acquisitions in cybersecurity with deal size over $500M',
    'Which investors are most active in climate tech this year?',
    'Companies with largest funding rounds in fintech'
  ]);
  const [showInfo, setShowInfo] = useState(false);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onRunQuery(query);
    }
  };

  return (
    <div className="bg-background-secondary rounded-lg p-4 border border-border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-primary font-medium flex items-center">
          <Sparkles className="h-4 w-4 mr-1.5 text-accent" />
          Natural Language Graph Query
        </h3>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-secondary hover:text-primary"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>
      
      {showInfo && (
        <div className="p-3 bg-accent/5 border border-accent/10 rounded-md mb-3 text-sm">
          <p className="text-primary">
            Describe what you're looking for in natural language and our AI will translate it to a graph query.
            You can ask about companies, investors, industries, funding rounds, and acquisitions.
          </p>
        </div>
      )}
      
      <form onSubmit={handleQuerySubmit} className="mb-3">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you're looking for..."
            className="w-full p-2.5 pl-9 pr-12 border border-border rounded-md bg-background-primary text-primary"
          />
          <div className="absolute left-3 top-2.5">
            <Search className="h-5 w-5 text-secondary" />
          </div>
          <button 
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-2 p-1.5 bg-black text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
      
      <div className="space-y-2">
        <div className="text-xs text-secondary">Example queries:</div>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(example);
                // Auto-submit after a short delay
                setTimeout(() => {
                  onRunQuery(example);
                }, 100);
              }}
              className="px-2.5 py-1 text-xs bg-background-primary border border-border rounded-full hover:bg-accent/5 transition-colors text-primary"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageQueryBuilder;