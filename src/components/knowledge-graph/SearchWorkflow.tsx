import React, { useEffect, useState } from 'react';
import { 
  Check, 
  Search, 
  CheckCircle, 
  Clock, 
  FileText, 
  Database, 
  Globe, 
  AlertCircle, 
  Loader2
} from 'lucide-react';

interface SearchWorkflowProps {
  isSearching: boolean;
  searchQuery: string;
  onWorkflowComplete?: () => void;
  searchSteps?: {
    description: string;
    sources: string[];
    duration: number;
  }[];
}

const SearchWorkflow: React.FC<SearchWorkflowProps> = ({
  isSearching,
  searchQuery,
  onWorkflowComplete,
  searchSteps
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [steps, setSteps] = useState<{
    id: string;
    name: string;
    status: 'pending' | 'in-progress' | 'completed' | 'error';
  }[]>([]);

  useEffect(() => {
    // Initialize steps based on search query
    if (searchQuery.includes('fintech') && searchQuery.includes('crypto') && searchQuery.includes('genai')) {
      setSteps([
        {
          id: 'search',
          name: 'Search for fintech companies operating in the crypto space that utilize Generative AI.',
          status: 'pending'
        },
        {
          id: 'create-file',
          name: 'Creating file todo.md',
          status: 'pending'
        },
        {
          id: 'connect',
          name: 'Connected to datasource(2)',
          status: 'pending'
        },
        {
          id: 'research',
          name: 'Researching fintech companies in the crypto and GenAI space.',
          status: 'pending'
        },
        {
          id: 'search-keywords',
          name: 'Searching fintech companies crypto generative AI',
          status: 'pending'
        },
        {
          id: 'visit-sources',
          name: 'Visiting top sources to gather company names and details.',
          status: 'pending'
        },
        {
          id: 'browse',
          name: 'Browsing https://thefinancialtechnologyreport.com/the-top-25-fintech-ai-companies-2023',
          status: 'pending'
        },
        {
          id: 'analyze',
          name: 'Analyzing full list of top FinTech AI companies for further analysis.',
          status: 'pending'
        },
        {
          id: 'report',
          name: 'Report findings and send the document to the user.',
          status: 'pending'
        }
      ]);
    } else if (searchQuery.includes('healthcare') && searchQuery.includes('ai')) {
      setSteps([
        {
          id: 'search',
          name: 'Search for AI startups operating in the healthcare sector.',
          status: 'pending'
        },
        {
          id: 'create-file',
          name: 'Creating file todo.md',
          status: 'pending'
        },
        {
          id: 'connect',
          name: 'Connected to datasource(3)',
          status: 'pending'
        },
        {
          id: 'research',
          name: 'Researching AI companies in the healthcare space.',
          status: 'pending'
        },
        {
          id: 'search-keywords',
          name: 'Searching AI healthcare startups funding',
          status: 'pending'
        },
        {
          id: 'visit-sources',
          name: 'Visiting top sources to gather company profiles.',
          status: 'pending'
        },
        {
          id: 'browse',
          name: 'Browsing https://www.cbinsights.com/research/artificial-intelligence-healthcare-startups',
          status: 'pending'
        },
        {
          id: 'analyze',
          name: 'Analyzing top healthcare AI companies by funding and innovation.',
          status: 'pending'
        },
        {
          id: 'report',
          name: 'Report findings and send the document to the user.',
          status: 'pending'
        }
      ]);
    } else if (searchQuery.includes('climate')) {
      setSteps([
        {
          id: 'search',
          name: 'Search for investors specializing in climate technology.',
          status: 'pending'
        },
        {
          id: 'create-file',
          name: 'Creating file todo.md',
          status: 'pending'
        },
        {
          id: 'connect',
          name: 'Connected to datasource(2)',
          status: 'pending'
        },
        {
          id: 'research',
          name: 'Researching climate tech investors and their portfolios.',
          status: 'pending'
        },
        {
          id: 'search-keywords',
          name: 'Searching climate tech investors venture capital',
          status: 'pending'
        },
        {
          id: 'visit-sources',
          name: 'Visiting top sources to gather investor profiles.',
          status: 'pending'
        },
        {
          id: 'analyze',
          name: 'Analyzing investment patterns in sustainable technology.',
          status: 'pending'
        },
        {
          id: 'report',
          name: 'Report findings and send the document to the user.',
          status: 'pending'
        }
      ]);
    } else if (searchQuery.includes('cyber') && searchQuery.includes('acquisition')) {
      setSteps([
        {
          id: 'search',
          name: 'Search for recent acquisitions in the cybersecurity industry.',
          status: 'pending'
        },
        {
          id: 'create-file',
          name: 'Creating file todo.md',
          status: 'pending'
        },
        {
          id: 'connect',
          name: 'Connected to datasource(3)',
          status: 'pending'
        },
        {
          id: 'research',
          name: 'Researching cybersecurity M&A activity.',
          status: 'pending'
        },
        {
          id: 'search-keywords',
          name: 'Searching cybersecurity acquisitions mergers deals',
          status: 'pending'
        },
        {
          id: 'visit-sources',
          name: 'Visiting top sources to gather acquisition details.',
          status: 'pending'
        },
        {
          id: 'analyze',
          name: 'Analyzing M&A trends and strategic rationales.',
          status: 'pending'
        },
        {
          id: 'report',
          name: 'Report findings and send the document to the user.',
          status: 'pending'
        }
      ]);
    } else if (searchSteps && searchSteps.length > 0) {
      // Use custom search steps if provided
      setSteps(searchSteps.map((step, index) => ({
        id: `step-${index}`,
        name: step.description,
        status: 'pending'
      })));
    } else {
      // Generic workflow steps for other queries
      setSteps([
        {
          id: 'search',
          name: `Search for ${searchQuery || 'companies'}`,
          status: 'pending'
        },
        {
          id: 'connect',
          name: 'Connecting to data sources',
          status: 'pending'
        },
        {
          id: 'research',
          name: 'Researching relevant companies',
          status: 'pending'
        },
        {
          id: 'analyze',
          name: 'Analyzing results',
          status: 'pending'
        },
        {
          id: 'report',
          name: 'Generate report',
          status: 'pending'
        }
      ]);
    }
  }, [searchQuery, searchSteps]);

  // Simulate workflow progress when searching is active
  useEffect(() => {
    if (!isSearching || steps.length === 0) {
      // Reset step index when search is not active
      setCurrentStepIndex(-1);
      return;
    }

    let currentIndex = 0;
    setCurrentStepIndex(0);

    // Update the status of the current step
    const updateStep = (index: number, status: 'in-progress' | 'completed' | 'error') => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        if (newSteps[index]) {
          newSteps[index] = { ...newSteps[index], status };
        }
        return newSteps;
      });
    };

    // Process steps sequentially with animation
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        currentIndex = i;
        setCurrentStepIndex(i);

        // Mark step as in-progress
        updateStep(i, 'in-progress');

        // Wait for step duration
        const stepDuration = searchSteps && searchSteps[i] ? searchSteps[i].duration : (i === 0 ? 800 : 600 + Math.random() * 800);
        await new Promise(resolve => setTimeout(resolve, stepDuration));

        // Mark step as completed
        updateStep(i, 'completed');

        // If this is the last step, call the completion callback
        if (i === steps.length - 1) {
          if (onWorkflowComplete) {
            setTimeout(() => onWorkflowComplete(), 500);
          }
          return;
        }
      }
    };

    // Start processing steps
    const timer = setTimeout(() => {
      processSteps();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [isSearching, steps, searchSteps, onWorkflowComplete]);

  // Render status icon based on step status
  const renderStatusIcon = (status: 'pending' | 'in-progress' | 'completed' | 'error') => {
    switch (status) {
      case 'pending':
        return <div className="text-gray-400">◯</div>;
      case 'in-progress':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-1">
      {steps.map((step, index) => (
        <div 
          key={step.id}
          className={`flex items-start ${
            step.status === 'in-progress' 
              ? 'text-blue-700' 
              : step.status === 'completed'
              ? 'text-green-700'
              : 'text-gray-500'
          } py-2 ${index === currentStepIndex ? 'bg-blue-50 rounded' : ''}`}
        >
          <div className="mr-3">
            {renderStatusIcon(step.status)}
          </div>
          <div className="text-sm">
            {step.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchWorkflow;