import React, { useState } from 'react';
import { Company, DealStage, DealStageConfig } from '../types';
import { 
  ArrowRight, 
  MoveRight, 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart2, 
  CheckCheck, 
  XCircle,
  Plus,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  Search
} from 'lucide-react';

interface DealPipelineProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onUpdateDealStage: (companyId: string, stage: DealStage) => void;
}

const DealPipeline: React.FC<DealPipelineProps> = ({
  companies,
  onSelectCompany,
  onUpdateDealStage
}) => {
  const [draggingCompany, setDraggingCompany] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all');
  const [showConfig, setShowConfig] = useState(false);

  // Define deal stages and their configurations
  const dealStages: DealStageConfig[] = [
    {
      id: 'identification',
      name: 'Identification',
      description: 'Initial target identification',
      color: 'bg-gray-200',
      icon: 'Search',
      order: 1
    },
    {
      id: 'initial_interest',
      name: 'Initial Interest',
      description: 'Preliminary evaluation and interest',
      color: 'bg-gray-200',
      icon: 'Star',
      order: 2
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      description: 'Detailed analysis and evaluation',
      color: 'bg-gray-200',
      icon: 'BarChart2',
      order: 3
    },
    {
      id: 'due_diligence',
      name: 'Due Diligence',
      description: 'Formal due diligence process',
      color: 'bg-gray-200',
      icon: 'ClipboardCheck',
      order: 4
    },
    {
      id: 'negotiation',
      name: 'Negotiation',
      description: 'Terms and price negotiation',
      color: 'bg-gray-200',
      icon: 'MessageSquare',
      order: 5
    },
    {
      id: 'agreement',
      name: 'Agreement',
      description: 'Deal terms agreed upon',
      color: 'bg-gray-200',
      icon: 'FileText',
      order: 6
    },
    {
      id: 'closing',
      name: 'Closing',
      description: 'Final approval and closing',
      color: 'bg-gray-200',
      icon: 'CheckSquare',
      order: 7
    },
    {
      id: 'integration',
      name: 'Integration',
      description: 'Post-acquisition integration',
      color: 'bg-gray-200',
      icon: 'GitMerge',
      order: 8
    },
    {
      id: 'closed',
      name: 'Completed',
      description: 'Deal successfully completed',
      color: 'bg-gray-200',
      icon: 'CheckCheck',
      order: 9
    },
    {
      id: 'abandoned',
      name: 'Abandoned',
      description: 'Deal abandoned or rejected',
      color: 'bg-gray-200',
      icon: 'XCircle',
      order: 10
    }
  ];

  // Group companies by deal stage
  const getCompaniesByStage = () => {
    const companiesByStage: Record<DealStage, Company[]> = {
      identification: [],
      initial_interest: [],
      evaluation: [],
      due_diligence: [],
      negotiation: [],
      agreement: [],
      closing: [],
      integration: [],
      closed: [],
      abandoned: []
    };

    // Filter companies based on search and stage filter
    const filteredCompanies = companies.filter(company => {
      const matchesSearch = searchFilter === '' || 
        company.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchesStage = stageFilter === 'all' || company.dealStage === stageFilter;
      
      return matchesSearch && matchesStage;
    });

    // Group filtered companies by deal stage
    filteredCompanies.forEach(company => {
      const stage = company.dealStage || 'identification';
      companiesByStage[stage].push(company);
    });

    return companiesByStage;
  };

  const companiesByStage = getCompaniesByStage();

  // Count companies in each stage
  const getCounts = () => {
    return dealStages.map(stage => ({
      stage: stage.id,
      count: companiesByStage[stage.id].length
    }));
  };

  const stageCounts = getCounts();

  // Handle drag start
  const handleDragStart = (companyId: string) => {
    setDraggingCompany(companyId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropStage: DealStage) => {
    e.preventDefault();
    if (draggingCompany) {
      onUpdateDealStage(draggingCompany, dropStage);
      setDraggingCompany(null);
    }
  };

  // Format probability as percentage
  const formatProbability = (probability?: number): string => {
    if (probability === undefined) return 'N/A';
    return `${Math.round(probability)}%`;
  };

  // Get appropriate icon for deal stage
  const getStageIcon = (stage: DealStage) => {
    switch (stage) {
      case 'identification':
        return <Search className="h-4 w-4" />;
      case 'initial_interest':
        return <UserCheck className="h-4 w-4" />;
      case 'evaluation':
        return <BarChart2 className="h-4 w-4" />;
      case 'due_diligence':
        return <AlertTriangle className="h-4 w-4" />;
      case 'negotiation':
        return <Clock className="h-4 w-4" />;
      case 'agreement':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'closing':
        return <ArrowRight className="h-4 w-4" />;
      case 'integration':
        return <MoveRight className="h-4 w-4" />;
      case 'closed':
        return <CheckCheck className="h-4 w-4" />;
      case 'abandoned':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <BarChart2 className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Deal Pipeline</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Track and manage acquisition targets through pipeline stages
        </p>
      </div>

      {/* Filters and controls */}
      <div className="px-4 py-3 bg-background-primary border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search deals..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9 pr-3 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
            </div>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as DealStage | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="all">All Stages</option>
              {dealStages.map(stage => (
                <option key={stage.id} value={stage.id}>
                  {stage.name} ({stageCounts.find(s => s.stage === stage.id)?.count || 0})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <MoreHorizontal className="h-4 w-4 mr-1" />
              Pipeline Settings
            </button>

            <button
              className="px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
              onClick={() => {
                alert('In a real implementation, this would allow adding a new deal to the pipeline.');
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Deal
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Configuration Panel (shown/hidden) */}
      {showConfig && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Pipeline Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              className="p-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
              onClick={() => alert('This would allow customizing pipeline stages')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Customize Stages
            </button>
            <button
              className="p-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
              onClick={() => alert('This would allow configuring probability thresholds')}
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              Probability Thresholds
            </button>
            <button
              className="p-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
              onClick={() => alert('This would allow setting automated notifications')}
            >
              <Clock className="h-4 w-4 mr-1" />
              Stage Timelines
            </button>
            <button
              className="p-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
              onClick={() => alert('This would allow exporting the pipeline data')}
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              Export Pipeline
            </button>
          </div>
        </div>
      )}

      {/* Pipeline Content */}
      <div className="p-1 md:p-4 bg-background-primary overflow-x-auto">
        <div className="flex space-x-2 md:space-x-4 min-w-max">
          {dealStages.slice(0, 8).map(stage => (
            <div 
              key={stage.id}
              className="w-64 flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className={`p-2 rounded-t-md ${stage.color.replace('200', '100')} border-b-2 ${stage.color}`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-800">{stage.name}</h3>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-700">
                    {companiesByStage[stage.id].length}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-b-md shadow-sm min-h-[300px] max-h-[500px] overflow-y-auto">
                {companiesByStage[stage.id].length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                    Drop companies here
                  </div>
                ) : (
                  <div className="p-1 space-y-2">
                    {companiesByStage[stage.id].map(company => (
                      <div
                        key={company.id}
                        className="p-2 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        draggable
                        onDragStart={() => handleDragStart(company.id)}
                        onClick={() => onSelectCompany(company)}
                      >
                        <div className="flex items-center mb-2">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={`${company.name} logo`}
                              className="w-6 h-6 rounded-full mr-2 object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-2">
                              <span className="text-xs font-bold">{company.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="flex-1 truncate font-medium text-sm text-gray-800">{company.name}</div>
                          <div className={`ml-2 w-2 h-2 rounded-full ${
                            company.tier === 1 
                              ? 'bg-gray-800' 
                              : company.tier === 2 
                              ? 'bg-gray-500' 
                              : 'bg-gray-300'
                          }`}></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <div>
                            <span>Probability: </span>
                            <span className={`font-medium ${
                              (company.dealProbability || 0) > 70 
                                ? 'text-gray-600' 
                                : (company.dealProbability || 0) > 40 
                                ? 'text-gray-600' 
                                : 'text-gray-600'
                            }`}>
                              {formatProbability(company.dealProbability)}
                            </span>
                          </div>
                          <div>
                            <span>Timeline: </span>
                            <span className="font-medium text-gray-600">
                              {company.dealTimelineEstimate || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {company.nextSteps && company.nextSteps.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                            <div className="flex items-center">
                              <ChevronRight className="h-3 w-3 mr-1 text-gray-500" />
                              <span>{company.nextSteps[0]}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {companies.length} companies in pipeline • 
            <span className="ml-1 text-gray-600">{companiesByStage.closing.length + companiesByStage.agreement.length} in late stages</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Pipeline Value: </span>
            <span className="font-medium text-gray-800">
              ${companies.reduce((sum, company) => sum + (company.valuation || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealPipeline;