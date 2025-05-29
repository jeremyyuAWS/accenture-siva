import React, { useState } from 'react';
import { Company, ChatMessage } from '../types';
import { 
  Building2, 
  Globe, 
  Users, 
  Banknote, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  DollarSign,
  PiggyBank,
  Percent,
  Award,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CompanyAnalysis from './CompanyAnalysis';

interface CompanyDetailProps {
  company: Company;
  onClose: () => void;
  chatMessages: ChatMessage[];
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ 
  company, 
  onClose,
  chatMessages
}) => {
  const { sendChatMessage } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'services' | 'chat' | 'analysis'>('overview');
  const [chatInput, setChatInput] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'overview': true,
    'services': false,
    'contacts': false,
    'metrics': false,
  });
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Format large numbers
  const formatNumber = (num: number | undefined): string => {
    if (!num) return 'N/A';
    
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(1)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(1)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(1)}K`;
    }
    return `$${num}`;
  };
  
  // Handle chat message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChatMessage(chatInput, company.id);
      setChatInput('');
    }
  };

  // Get tier class for styling
  const getTierClass = (tier: number | undefined) => {
    switch(tier) {
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-green-100 text-green-800';
      case 3:
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filter chat messages for this company
  const relevantChatMessages = chatMessages.filter(msg => 
    msg.companyId === company.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div className="flex items-center">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
            )}
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-800 mr-3">{company.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierClass(company.tier)}`}>
                  Tier {company.tier}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{company.industry} • {company.region}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'financials'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ml-8`}
            >
              Financials
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ml-8`}
            >
              Services & Offerings
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'analysis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ml-8 flex items-center`}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Enhanced Analysis
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ml-8 flex items-center`}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              AI Analysis
            </button>
          </nav>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('overview')}
                >
                  <h3 className="text-lg font-medium text-gray-800">Company Overview</h3>
                  {expandedSections.overview ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                
                {expandedSections.overview && (
                  <div className="mt-3">
                    <p className="text-gray-700 mb-4">{company.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center">
                        <Building2 className="mr-2 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Industry</p>
                          <p className="font-medium">{company.industry} {company.subIndustry ? `/ ${company.subIndustry}` : ''}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Globe className="mr-2 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{company.country}, {company.region}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="mr-2 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Employees</p>
                          <p className="font-medium">{company.employees.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Founded</p>
                          <p className="font-medium">{company.foundedYear}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Banknote className="mr-2 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Annual Revenue</p>
                          <p className="font-medium">{formatNumber(company.revenue)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Growth Rate</p>
                          <p className="font-medium">{company.growthRate ? `${company.growthRate}%` : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Match Scores Section */}
              {company.score && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Strategic Fit Analysis</h3>
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Overall Match</span>
                    <span className="text-sm font-semibold text-blue-600">{Math.round(company.score.overall)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.round(company.score.overall)}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Services Fit</span>
                        <span className="text-sm font-medium">{Math.round(company.score.servicesFit)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.round(company.score.servicesFit)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Industry Fit</span>
                        <span className="text-sm font-medium">{Math.round(company.score.industryFit)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.round(company.score.industryFit)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Geography Fit</span>
                        <span className="text-sm font-medium">{Math.round(company.score.geographyFit)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${Math.round(company.score.geographyFit)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Financial Health</span>
                        <span className="text-sm font-medium">{Math.round(company.score.financialHealth)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full" 
                          style={{ width: `${Math.round(company.score.financialHealth)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Why This Company?
                    </h4>
                    <p className="text-sm text-blue-700">
                      {company.tier === 1 ? (
                        `${company.name} stands out with exceptional strategic alignment, particularly in ${company.score.servicesFit > 80 ? 'service offerings' : 'industry position'}. Their strong ${company.growthRate}% growth rate and established market presence in ${company.region} make them an ideal acquisition target that could immediately enhance our capabilities in ${company.services[0]} and ${company.services[1]}.`
                      ) : company.tier === 2 ? (
                        `${company.name} shows promising potential with good alignment in ${company.score.servicesFit > 70 ? 'services' : 'market position'}. While not a perfect match, their specialization in ${company.services[0]} would complement our existing offerings, and their presence in ${company.region} offers geographic advantages worth exploring.`
                      ) : (
                        `${company.name} has some interesting capabilities but lower overall strategic alignment. Their specialization in ${company.services[0]} could fill specific gaps in our portfolio, though a full acquisition may not be the optimal approach. Consider partnership opportunities or targeted asset acquisition instead.`
                      )}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Contacts Section */}
              {company.contacts && company.contacts.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('contacts')}
                  >
                    <h3 className="text-lg font-medium text-gray-800">Key Contacts</h3>
                    {expandedSections.contacts ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  
                  {expandedSections.contacts && (
                    <div className="mt-3 space-y-4">
                      {company.contacts.map((contact, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.position}</p>
                            {contact.email && (
                              <p className="text-sm text-blue-600">{contact.email}</p>
                            )}
                            {contact.phone && (
                              <p className="text-sm text-gray-600">{contact.phone}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Notes Section */}
              {company.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Notes</h3>
                  <p className="text-gray-700">{company.notes}</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Banknote className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">Revenue</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(company.revenue)}</p>
                  <p className="text-sm text-gray-500 mt-1">Annual Revenue</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">Valuation</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(company.valuation)}</p>
                  <p className="text-sm text-gray-500 mt-1">Estimated Value</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-amber-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">Growth</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{company.growthRate ? `${company.growthRate}%` : 'N/A'}</p>
                  <p className="text-sm text-gray-500 mt-1">Annual Growth Rate</p>
                </div>
              </div>
              
              {/* Financial Metrics Section */}
              {company.financialMetrics && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('metrics')}
                  >
                    <h3 className="text-lg font-medium text-gray-800">Detailed Metrics</h3>
                    {expandedSections.metrics ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  
                  {expandedSections.metrics && (
                    <div className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Percent className="mr-2 h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-500">Profit Margin</p>
                            <p className="font-medium">
                              {company.financialMetrics.profitMargin 
                                ? `${company.financialMetrics.profitMargin}%` 
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Revenue Growth</p>
                            <p className="font-medium">
                              {company.financialMetrics.revenueGrowth 
                                ? `${company.financialMetrics.revenueGrowth}%` 
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <BarChart3 className="mr-2 h-5 w-5 text-amber-500" />
                          <div>
                            <p className="text-sm text-gray-500">Debt to Equity</p>
                            <p className="font-medium">
                              {company.financialMetrics.debtToEquity !== undefined 
                                ? company.financialMetrics.debtToEquity 
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <PiggyBank className="mr-2 h-5 w-5 text-purple-500" />
                          <div>
                            <p className="text-sm text-gray-500">Cash Flow</p>
                            <p className="font-medium">
                              {company.financialMetrics.cashFlow 
                                ? formatNumber(company.financialMetrics.cashFlow) 
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Valuation Metrics</h4>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Revenue Multiple</p>
                              <p className="font-medium text-lg">
                                {company.valuation && company.revenue
                                  ? (company.valuation / company.revenue).toFixed(1) + 'x'
                                  : 'N/A'}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Value per Employee</p>
                              <p className="font-medium text-lg">
                                {company.valuation && company.employees
                                  ? '$' + (company.valuation / company.employees / 1000).toFixed(0) + 'K'
                                  : 'N/A'}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Years Since Founded</p>
                              <p className="font-medium text-lg">
                                {company.foundedYear
                                  ? (new Date().getFullYear() - company.foundedYear)
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Financial Summary</h3>
                <p className="text-gray-700">
                  {company.name} is a {company.foundedYear ? (new Date().getFullYear() - company.foundedYear) + ' year old' : ''} {company.industry.toLowerCase()} company based in {company.country}. 
                  With annual revenue of {formatNumber(company.revenue)} and approximately {company.employees.toLocaleString()} employees, 
                  the company {company.growthRate ? `is growing at ${company.growthRate}% annually` : 'has stable operations'}.
                  {company.financialMetrics?.profitMargin ? ` The company maintains a profit margin of ${company.financialMetrics.profitMargin}%,` : ''}
                  {company.financialMetrics?.debtToEquity !== undefined ? ` with a debt-to-equity ratio of ${company.financialMetrics.debtToEquity}.` : ''}
                </p>
                
                {company.tier === 1 && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Financial Assessment:</span> {company.name} demonstrates strong financial performance with excellent profitability metrics and healthy growth. The company's market position and financial stability make it an attractive acquisition target from a financial perspective.
                    </p>
                  </div>
                )}
                
                {company.tier === 2 && (
                  <div className="mt-4 bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Financial Assessment:</span> {company.name} shows solid financial performance with good growth potential. While not exceptional in all metrics, the company maintains healthy operations and represents a reasonable investment opportunity with moderate financial risk.
                    </p>
                  </div>
                )}
                
                {company.tier === 3 && (
                  <div className="mt-4 bg-amber-50 p-3 rounded-md">
                    <p className="text-sm text-amber-700">
                      <span className="font-medium">Financial Assessment:</span> {company.name} presents a mixed financial picture with some concerns regarding long-term sustainability. More detailed financial due diligence would be required to fully assess the investment potential and associated risks.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('services')}
                >
                  <h3 className="text-lg font-medium text-gray-800">Services & Capabilities</h3>
                  {expandedSections.services ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                
                {expandedSections.services && (
                  <div className="mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Core Services</h4>
                        <ul className="space-y-2">
                          {company.services.map((service, index) => (
                            <li key={index} className="flex items-center">
                              <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                              <span className="text-gray-700">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Offerings & Delivery Models</h4>
                        <ul className="space-y-2">
                          {company.offerings.map((offering, index) => (
                            <li key={index} className="flex items-center">
                              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                              <span className="text-gray-700">{offering}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-md">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Services Alignment Analysis</h4>
                      <p className="text-sm text-blue-700">
                        {company.score && company.score.servicesFit > 85 ? (
                          `${company.name}'s service portfolio demonstrates exceptional alignment (${Math.round(company.score.servicesFit)}%) with our strategic needs. Their expertise in ${company.services[0]} and ${company.services[1]} directly complements our current offerings and would immediately strengthen our market position.`
                        ) : company.score && company.score.servicesFit > 70 ? (
                          `${company.name}'s service portfolio shows good alignment (${Math.round(company.score.servicesFit)}%) with our priorities. Their focus on ${company.services[0]} would be particularly beneficial, though some areas would require further integration planning.`
                        ) : (
                          `${company.name}'s service portfolio shows moderate alignment (${company.score?.servicesFit ? Math.round(company.score.servicesFit) : 0}%) with our current needs. While their expertise in ${company.services[0]} has potential value, there would be challenges in fully integrating their service model with our existing offerings.`
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Industry & Market Position</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Primary Industry</p>
                    <p className="font-medium">{company.industry}</p>
                  </div>
                  
                  {company.subIndustry && (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500">Sub-Industry</p>
                      <p className="font-medium">{company.subIndustry}</p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Market Position</p>
                    <p className="font-medium">
                      {company.revenue > 100000000 ? 'Enterprise' : 
                       company.revenue > 50000000 ? 'Mid-Market' : 
                       'Emerging Player'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Industry Context</h4>
                  <p className="text-gray-700">
                    {company.name} operates in the {company.industry.toLowerCase()} sector
                    {company.subIndustry ? `, specifically in ${company.subIndustry.toLowerCase()}` : ''}.
                    The company has established a presence in {company.region}, serving clients
                    with its portfolio of {company.services.length} distinct services and
                    {company.offerings.length} delivery models.
                    {company.score && company.score.industryFit > 80 
                      ? ` There is strong industry alignment with our strategic focus areas.` 
                      : company.score && company.score.industryFit > 60
                      ? ` There is moderate alignment with our industry priorities.`
                      : ` The industry alignment with our core strategy requires further evaluation.`}
                  </p>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-md">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Strategic Synergies</h4>
                  <p className="text-sm text-green-700">
                    An acquisition of {company.name} would provide access to 
                    {company.region === 'North America' 
                      ? ' the North American market with potential for cross-border expansion' 
                      : company.region === 'Europe'
                      ? ' European markets with established client relationships'
                      : ` the ${company.region} region, offering geographic diversification`}.
                    Their specialization in {company.services.slice(0, 2).join(' and ')} 
                    would {company.score && company.score.servicesFit > 80 
                      ? 'strongly complement' 
                      : 'potentially enhance'} our existing capabilities.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'analysis' && (
            <CompanyAnalysis company={company} />
          )}
          
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
                {relevantChatMessages.length > 0 ? (
                  <div className="space-y-4">
                    {relevantChatMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-3/4 rounded-lg p-3 ${
                            message.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white border border-gray-300 text-gray-700'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium text-gray-700">Ask About This Company</h3>
                    <p className="text-gray-500 mt-1 max-w-md">
                      Ask questions about why this company was selected, potential synergies, 
                      risks, or any other aspects you're curious about.
                    </p>
                    <div className="mt-4 space-y-2 w-full max-w-md">
                      <button 
                        onClick={() => sendChatMessage(`Why is ${company.name} rated as a Tier ${company.tier} company?`, company.id)}
                        className="w-full p-2 text-sm text-left rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Why is this a Tier {company.tier} company?
                      </button>
                      <button 
                        onClick={() => sendChatMessage(`What are the potential synergies with ${company.name}?`, company.id)}
                        className="w-full p-2 text-sm text-left rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        What are the potential synergies?
                      </button>
                      <button 
                        onClick={() => sendChatMessage(`What are the risks of acquiring ${company.name}?`, company.id)}
                        className="w-full p-2 text-sm text-left rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        What are the acquisition risks?
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about this company..."
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
          {activeTab === 'overview' && (
            <button
              onClick={() => setActiveTab('analysis')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                View Enhanced Analysis
              </div>
            </button>
          )}
          
          {activeTab !== 'chat' && (
            <button
              onClick={() => setActiveTab('chat')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                Ask About This Company
              </div>
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;