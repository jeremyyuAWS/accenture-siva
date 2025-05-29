import React, { useState } from 'react';
import { Company, DueDiligenceCategory, DueDiligenceItem, Document } from '../types';
import { 
  ClipboardCheck, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  Plus,
  Users,
  Calendar,
  Clipboard,
  Flag,
  AlertCircle,
  Search
} from 'lucide-react';

interface DueDiligenceProps {
  company: Company;
  onUpdateDueDiligence?: (companyId: string, updatedDueDiligence: any) => void;
}

const DueDiligence: React.FC<DueDiligenceProps> = ({ company, onUpdateDueDiligence }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'checklist' | 'documents' | 'risks'>('checklist');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  
  // Default due diligence categories if none exist
  const defaultCategories: DueDiligenceCategory[] = [
    {
      id: 'financial',
      name: 'Financial',
      progress: 0,
      items: [
        {
          id: 'financial_1',
          name: 'Historical Financial Statements',
          description: 'Review of 3 years of audited financial statements',
          status: 'not_started',
          riskLevel: 'medium'
        },
        {
          id: 'financial_2',
          name: 'Financial Projections',
          description: 'Analysis of 5-year financial projections',
          status: 'not_started',
          riskLevel: 'medium'
        },
        {
          id: 'financial_3',
          name: 'Debt Structure Review',
          description: 'Analysis of existing debt obligations',
          status: 'not_started',
          riskLevel: 'high'
        }
      ]
    },
    {
      id: 'legal',
      name: 'Legal',
      progress: 0,
      items: [
        {
          id: 'legal_1',
          name: 'Corporate Structure',
          description: 'Review of corporate structure and organizational documents',
          status: 'not_started',
          riskLevel: 'low'
        },
        {
          id: 'legal_2',
          name: 'Contracts & Agreements',
          description: 'Review of material contracts and agreements',
          status: 'not_started',
          riskLevel: 'medium'
        },
        {
          id: 'legal_3',
          name: 'Litigation Review',
          description: 'Analysis of pending or threatened litigation',
          status: 'not_started',
          riskLevel: 'high'
        }
      ]
    },
    {
      id: 'operational',
      name: 'Operational',
      progress: 0,
      items: [
        {
          id: 'operational_1',
          name: 'Business Operations',
          description: 'Review of core business operations and processes',
          status: 'not_started',
          riskLevel: 'medium'
        },
        {
          id: 'operational_2',
          name: 'Technology Stack',
          description: 'Assessment of technology infrastructure and systems',
          status: 'not_started',
          riskLevel: 'medium'
        },
        {
          id: 'operational_3',
          name: 'Supply Chain Analysis',
          description: 'Review of supplier relationships and dependencies',
          status: 'not_started',
          riskLevel: 'low'
        }
      ]
    },
    {
      id: 'commercial',
      name: 'Commercial',
      progress: 0,
      items: [
        {
          id: 'commercial_1',
          name: 'Customer Analysis',
          description: 'Review of customer base, contracts, and concentrations',
          status: 'not_started',
          riskLevel: 'medium'
        },
        {
          id: 'commercial_2',
          name: 'Market Position',
          description: 'Analysis of competitive positioning and market trends',
          status: 'not_started',
          riskLevel: 'low'
        },
        {
          id: 'commercial_3',
          name: 'Sales Pipeline',
          description: 'Review of sales process and pipeline',
          status: 'not_started',
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'hr',
      name: 'Human Resources',
      progress: 0,
      items: [
        {
          id: 'hr_1',
          name: 'Organizational Structure',
          description: 'Review of org chart and reporting relationships',
          status: 'not_started',
          riskLevel: 'low'
        },
        {
          id: 'hr_2',
          name: 'Key Personnel',
          description: 'Assessment of key personnel and retention risks',
          status: 'not_started',
          riskLevel: 'high'
        },
        {
          id: 'hr_3',
          name: 'Compensation & Benefits',
          description: 'Review of compensation structures and benefit plans',
          status: 'not_started',
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'regulatory',
      name: 'Regulatory & Compliance',
      progress: 0,
      items: [
        {
          id: 'regulatory_1',
          name: 'Industry Regulations',
          description: 'Review of compliance with industry-specific regulations',
          status: 'not_started',
          riskLevel: 'high'
        },
        {
          id: 'regulatory_2',
          name: 'Permits & Licenses',
          description: 'Verification of required permits and licenses',
          status: 'not_started',
          riskLevel: 'medium'
        },
        {
          id: 'regulatory_3',
          name: 'Environmental Compliance',
          description: 'Assessment of environmental compliance and liabilities',
          status: 'not_started',
          riskLevel: 'high'
        }
      ]
    }
  ];

  // Use company's due diligence data or default
  const dueDiligence = company.dueDiligence || {
    progress: 0,
    startedAt: new Date(),
    categories: defaultCategories
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Update item status
  const updateItemStatus = (categoryId: string, itemId: string, status: DueDiligenceItem['status']) => {
    if (!onUpdateDueDiligence) return;

    // Find the category and item
    const updatedCategories = dueDiligence.categories.map(category => {
      if (category.id === categoryId) {
        const updatedItems = category.items.map(item => {
          if (item.id === itemId) {
            return { ...item, status };
          }
          return item;
        });

        // Calculate new progress for the category
        const completedItems = updatedItems.filter(item => item.status === 'completed').length;
        const progress = Math.round((completedItems / updatedItems.length) * 100);

        return {
          ...category,
          items: updatedItems,
          progress
        };
      }
      return category;
    });

    // Calculate new overall progress
    const totalItems = updatedCategories.reduce((sum, category) => sum + category.items.length, 0);
    const completedItems = updatedCategories.reduce(
      (sum, category) => sum + category.items.filter(item => item.status === 'completed').length,
      0
    );
    const overallProgress = Math.round((completedItems / totalItems) * 100);

    const updatedDueDiligence = {
      ...dueDiligence,
      categories: updatedCategories,
      progress: overallProgress
    };

    onUpdateDueDiligence(company.id, updatedDueDiligence);
  };

  // Get status icon
  const getStatusIcon = (status: DueDiligenceItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'flagged':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'not_started':
      default:
        return <XCircle className="h-4 w-4 text-gray-300" />;
    }
  };

  // Get risk level icon and color
  const getRiskDisplay = (level?: DueDiligenceItem['riskLevel']) => {
    switch (level) {
      case 'high':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
          text: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-100'
        };
      case 'medium':
        return {
          icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
          text: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-100'
        };
      case 'low':
      default:
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-100'
        };
    }
  };

  // Handle document upload
  const handleDocumentUpload = () => {
    setUploadingDocument(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploadingDocument(false);
      alert('In a real implementation, this would upload a document to the due diligence repository.');
    }, 1500);
  };

  // Calculate risk distribution
  const calculateRiskDistribution = () => {
    let high = 0;
    let medium = 0;
    let low = 0;
    let total = 0;

    dueDiligence.categories.forEach(category => {
      category.items.forEach(item => {
        total++;
        if (item.riskLevel === 'high') high++;
        else if (item.riskLevel === 'medium') medium++;
        else low++;
      });
    });

    return {
      high,
      medium,
      low,
      total,
      highPercentage: Math.round((high / total) * 100),
      mediumPercentage: Math.round((medium / total) * 100),
      lowPercentage: Math.round((low / total) * 100)
    };
  };

  const riskDistribution = calculateRiskDistribution();

  return (
    <div className="bg-background-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <ClipboardCheck className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Due Diligence Tracker</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Comprehensive due diligence framework for {company.name}
        </p>
      </div>

      {/* Progress Summary */}
      <div className="p-4 bg-background-primary border-b border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-sm font-medium text-primary mb-1">Overall Progress</h3>
            <div className="flex items-center">
              <div className="w-40 h-2.5 bg-gray-200 rounded-full mr-3">
                <div
                  className="h-2.5 bg-black rounded-full"
                  style={{ width: `${dueDiligence.progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-primary">{dueDiligence.progress}%</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-accent/5 rounded-md px-3 py-1.5 text-xs font-medium flex items-center border border-accent/10">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-accent" />
              <span>Started: {dueDiligence.startedAt?.toLocaleDateString() || 'Not started'}</span>
            </div>
            <div className="bg-accent/5 rounded-md px-3 py-1.5 text-xs font-medium flex items-center border border-accent/10">
              <Clipboard className="h-3.5 w-3.5 mr-1.5 text-accent" />
              <span>{riskDistribution.total} Check Items</span>
            </div>
            <div className="bg-accent/5 rounded-md px-3 py-1.5 text-xs font-medium flex items-center border border-accent/10">
              <Flag className="h-3.5 w-3.5 mr-1.5 text-accent" />
              <span>{riskDistribution.high} High-Risk Items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'checklist'
                ? 'border-black text-primary'
                : 'border-transparent text-secondary hover:text-primary hover:border-border'
            }`}
          >
            <div className="flex items-center">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Due Diligence Checklist
            </div>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'documents'
                ? 'border-black text-primary'
                : 'border-transparent text-secondary hover:text-primary hover:border-border'
            } ml-4`}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Document Repository
            </div>
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'risks'
                ? 'border-black text-primary'
                : 'border-transparent text-secondary hover:text-primary hover:border-border'
            } ml-4`}
          >
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Risk Assessment
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            {dueDiligence.categories.map(category => (
              <div key={category.id} className="border border-border rounded-md">
                <div
                  className="p-3 bg-background-primary flex justify-between items-center cursor-pointer border-b border-border"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center">
                    <h3 className="font-medium text-primary">{category.name}</h3>
                    <div className="ml-3 text-xs bg-background-secondary px-2 py-0.5 rounded-full border border-border">
                      {category.items.filter(item => item.status === 'completed').length} / {category.items.length}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-2 bg-black rounded-full"
                        style={{ width: `${category.progress}%` }}
                      ></div>
                    </div>
                    {expandedCategories[category.id] ? (
                      <ChevronUp className="h-4 w-4 text-secondary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-secondary" />
                    )}
                  </div>
                </div>

                {expandedCategories[category.id] && (
                  <div className="p-3 space-y-2">
                    {category.items.map(item => {
                      const riskDisplay = getRiskDisplay(item.riskLevel);
                      return (
                        <div key={item.id} className="bg-background-primary p-2 rounded-md border border-border">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <button
                                onClick={() => {
                                  const nextStatus = {
                                    'not_started': 'in_progress',
                                    'in_progress': 'completed',
                                    'completed': 'flagged',
                                    'flagged': 'not_started'
                                  }[item.status] as DueDiligenceItem['status'];
                                  updateItemStatus(category.id, item.id, nextStatus);
                                }}
                                className="mr-2"
                              >
                                {getStatusIcon(item.status)}
                              </button>
                              <div>
                                <p className="text-sm font-medium text-primary">{item.name}</p>
                                <p className="text-xs text-secondary">{item.description}</p>
                              </div>
                            </div>
                            <div className={`flex items-center px-2 py-1 rounded-md text-xs ${riskDisplay.bg} ${riskDisplay.text} ${riskDisplay.border}`}>
                              {riskDisplay.icon}
                              <span className="ml-1">
                                {item.riskLevel ? item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1) : 'Low'} Risk
                              </span>
                            </div>
                          </div>

                          {item.assignee && (
                            <div className="mt-2 pt-2 border-t border-border flex items-center text-xs text-secondary">
                              <Users className="h-3 w-3 mr-1" />
                              <span>Assigned to: {item.assignee}</span>
                              {item.dueDate && (
                                <>
                                  <span className="mx-2">•</span>
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <button
                      className="w-full py-2 border border-dashed border-border rounded-md text-sm text-secondary hover:bg-background-primary transition-colors flex items-center justify-center"
                      onClick={() => alert('In a real implementation, this would allow adding a new due diligence item.')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              className="w-full py-2 border border-dashed border-border rounded-md text-sm text-secondary hover:bg-background-primary transition-colors flex items-center justify-center"
              onClick={() => alert('In a real implementation, this would allow adding a new due diligence category.')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </button>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-primary">Document Repository</h3>
              <button
                onClick={handleDocumentUpload}
                disabled={uploadingDocument}
                className="px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:bg-gray-400"
              >
                {uploadingDocument ? (
                  <>
                    <Upload className="animate-spin h-4 w-4 mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </button>
            </div>
            
            <div className="border border-border rounded-md">
              <div className="p-3 bg-background-primary border-b border-border flex justify-between">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="px-3 py-1 border border-border bg-background-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-secondary">Filter by: </span>
                  <select className="ml-2 px-2 py-1 border border-border bg-background-secondary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="all">All Categories</option>
                    {dueDiligence.categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {/* Sample documents */}
                {[
                  {
                    id: 'doc1',
                    name: 'Financial Statements 2023.pdf',
                    category: 'Financial',
                    uploadedAt: new Date(2023, 6, 15),
                    uploadedBy: 'John Smith',
                    fileSize: 2.4,
                    fileType: 'pdf'
                  },
                  {
                    id: 'doc2',
                    name: 'Corporate Structure.docx',
                    category: 'Legal',
                    uploadedAt: new Date(2023, 5, 28),
                    uploadedBy: 'Emily Johnson',
                    fileSize: 1.1,
                    fileType: 'docx'
                  },
                  {
                    id: 'doc3',
                    name: 'Customer Contracts.zip',
                    category: 'Commercial',
                    uploadedAt: new Date(2023, 6, 10),
                    uploadedBy: 'Michael Wong',
                    fileSize: 5.7,
                    fileType: 'zip'
                  }
                ].map(doc => (
                  <div key={doc.id} className="p-3 hover:bg-background-primary transition-colors cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="bg-accent/10 p-2 rounded mr-3">
                          <FileText className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-primary">{doc.name}</h4>
                          <p className="text-xs text-secondary">
                            {doc.category} • {doc.uploadedAt.toLocaleDateString()} • {doc.fileSize} MB
                          </p>
                        </div>
                      </div>
                      <div className="text-xs bg-background-primary px-2 py-1 rounded">
                        {doc.fileType.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div className="bg-background-secondary border border-border rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary mb-3">Risk Assessment Matrix</h3>
              
              {/* Risk Distribution */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-primary mb-2">Risk Distribution</h4>
                <div className="h-6 w-full rounded-md overflow-hidden flex">
                  <div 
                    className="bg-red-500 dark:bg-red-700 h-full" 
                    style={{ width: `${riskDistribution.highPercentage}%` }}
                    title={`High Risk: ${riskDistribution.high} items (${riskDistribution.highPercentage}%)`}
                  ></div>
                  <div 
                    className="bg-amber-500 dark:bg-amber-700 h-full" 
                    style={{ width: `${riskDistribution.mediumPercentage}%` }}
                    title={`Medium Risk: ${riskDistribution.medium} items (${riskDistribution.mediumPercentage}%)`}
                  ></div>
                  <div 
                    className="bg-green-500 dark:bg-green-700 h-full" 
                    style={{ width: `${riskDistribution.lowPercentage}%` }}
                    title={`Low Risk: ${riskDistribution.low} items (${riskDistribution.lowPercentage}%)`}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-secondary">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 dark:bg-red-700 rounded-sm mr-1"></div>
                    <span>High Risk: {riskDistribution.high} items</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 dark:bg-amber-700 rounded-sm mr-1"></div>
                    <span>Medium Risk: {riskDistribution.medium} items</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 dark:bg-green-700 rounded-sm mr-1"></div>
                    <span>Low Risk: {riskDistribution.low} items</span>
                  </div>
                </div>
              </div>
              
              {/* Top Risks */}
              <div>
                <h4 className="text-sm font-medium text-primary mb-2">Top Risk Areas</h4>
                <div className="space-y-2">
                  {dueDiligence.categories
                    .flatMap(category => 
                      category.items
                        .filter(item => item.riskLevel === 'high')
                        .map(item => ({ ...item, category: category.name }))
                    )
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={index} className="p-3 bg-red-50 dark:bg-red-900/30 rounded-md border border-red-100 dark:border-red-800/50">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-primary dark:text-gray-200">{item.name}</p>
                              <p className="text-xs text-secondary">{item.category}</p>
                            </div>
                          </div>
                          <div className="text-xs bg-red-100 dark:bg-red-800 px-2 py-1 rounded text-red-700 dark:text-red-300">
                            High Risk
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-secondary dark:text-gray-400">{item.description}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            
            {/* Risk Assessment Grid */}
            <div className="bg-background-secondary border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-primary mb-4">Risk Assessment Grid</h3>
              
              <div className="border border-border rounded-md overflow-hidden">
                <div className="grid grid-cols-4">
                  <div className="bg-background-primary p-3 text-center font-medium text-primary border-r border-b border-border">
                    Impact / Likelihood
                  </div>
                  <div className="bg-background-primary p-3 text-center font-medium text-primary border-r border-b border-border">
                    Low
                  </div>
                  <div className="bg-background-primary p-3 text-center font-medium text-primary border-r border-b border-border">
                    Medium
                  </div>
                  <div className="bg-background-primary p-3 text-center font-medium text-primary border-b border-border">
                    High
                  </div>
                  
                  <div className="bg-background-primary p-3 text-center font-medium text-primary border-r border-b border-border">
                    High
                  </div>
                  <div className="p-3 text-xs text-center bg-amber-50 dark:bg-amber-900/30 border-r border-b border-border">
                    Medium Risk
                  </div>
                  <div className="p-3 text-xs text-center bg-red-50 dark:bg-red-900/30 border-r border-b border-border">
                    High Risk
                  </div>
                  <div className="p-3 text-xs text-center bg-red-50 dark:bg-red-900/30 border-b border-border">
                    High Risk
                  </div>
                  
                  <div className="bg-background-primary p-3 text-center font-medium text-primary border-r border-b border-border">
                    Medium
                  </div>
                  <div className="p-3 text-xs text-center bg-green-50 dark:bg-green-900/30 border-r border-b border-border">
                    Low Risk
                  </div>
                  <div className="p-3 text-xs text-center bg-amber-50 dark:bg-amber-900/30 border-r border-b border-border">
                    Medium Risk
                  </div>
                  <div className="p-3 text-xs text-center bg-red-50 dark:bg-red-900/30 border-b border-border">
                    High Risk
                  </div>
                  
                  <div className="bg-background-primary p-3 text-center font-medium text-primary border-r border-border">
                    Low
                  </div>
                  <div className="p-3 text-xs text-center bg-green-50 dark:bg-green-900/30 border-r border-border">
                    Low Risk
                  </div>
                  <div className="p-3 text-xs text-center bg-green-50 dark:bg-green-900/30 border-r border-border">
                    Low Risk
                  </div>
                  <div className="p-3 text-xs text-center bg-amber-50 dark:bg-amber-900/30 border-border">
                    Medium Risk
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mitigation Strategies */}
            <div className="bg-background-secondary border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-primary mb-2">Recommended Mitigation Strategies</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-accent/5 rounded-md border border-accent/10">
                  <h4 className="text-sm font-medium text-primary mb-1">Detailed Financial Review</h4>
                  <p className="text-xs text-secondary">
                    Commission a detailed third-party financial audit to verify revenue recognition practices and validate growth projections.
                  </p>
                </div>
                
                <div className="p-3 bg-accent/5 rounded-md border border-accent/10">
                  <h4 className="text-sm font-medium text-primary mb-1">Key Personnel Retention Plan</h4>
                  <p className="text-xs text-secondary">
                    Develop specific retention packages for identified key personnel, including management team and technical leads.
                  </p>
                </div>
                
                <div className="p-3 bg-accent/5 rounded-md border border-accent/10">
                  <h4 className="text-sm font-medium text-primary mb-1">Regulatory Compliance Verification</h4>
                  <p className="text-xs text-secondary">
                    Engage industry-specific regulatory experts to verify compliance with all applicable regulations and identify remediation requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DueDiligence;