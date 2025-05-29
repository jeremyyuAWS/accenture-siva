import React, { useState } from 'react';
import { Company } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Target, 
  AlertTriangle, 
  DollarSign, 
  Download,
  FileSpreadsheet,
  FileText,
  Check
} from 'lucide-react';

interface CompanyAnalysisProps {
  company: Company;
}

const CompanyAnalysis: React.FC<CompanyAnalysisProps> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'competitive' | 'financial' | 'risk'>('competitive');
  const [exportStatus, setExportStatus] = useState<{excel: boolean, pdf: boolean}>({ excel: false, pdf: false });
  
  const handleExport = (type: 'excel' | 'pdf') => {
    // Simulate export process
    setExportStatus(prev => ({ ...prev, [type]: true }));
    
    // Reset status after 2 seconds
    setTimeout(() => {
      setExportStatus(prev => ({ ...prev, [type]: false }));
    }, 2000);
    
    if (type === 'excel') {
      console.log(`Exporting ${company.name} analysis to Excel`);
      // In a real implementation, this would generate and download an Excel file
      alert(`Analysis for ${company.name} exported to Excel. In a real implementation, this would download an Excel file.`);
    } else {
      console.log(`Exporting ${company.name} analysis to PDF`);
      // In a real implementation, this would generate and download a PDF file
      alert(`Analysis for ${company.name} exported to PDF. In a real implementation, this would download a PDF file.`);
    }
  };
  
  const getCompetitiveAdvantages = () => {
    // This would be AI-generated in a real implementation
    const advantages = [
      {
        title: 'Market Position Strength',
        score: Math.round((company.revenue / 1000000) * 0.3 + (company.employees / 1000) * 0.7),
        description: `${company.name} holds a ${company.revenue > 100000000 ? 'strong' : 'developing'} position in the ${company.industry.toLowerCase()} market, with particular emphasis on ${company.services[0]} and ${company.services[1]}.`
      },
      {
        title: 'Innovation Potential',
        score: company.foundedYear > 2015 ? 85 : company.foundedYear > 2010 ? 75 : 65,
        description: `Their technology stack shows ${company.growthRate && company.growthRate > 20 ? 'significant' : 'moderate'} innovation potential, particularly in ${company.services[Math.floor(Math.random() * company.services.length)]}.`
      },
      {
        title: 'Customer Base Quality',
        score: Math.round((company.revenue / company.employees) * 0.01),
        description: `${company.name}'s customer base appears to be ${company.revenue / company.employees > 200000 ? 'high-value' : 'diverse'}, suggesting ${company.revenue / company.employees > 200000 ? 'strong relationships with enterprise clients' : 'broad market appeal'}.`
      }
    ];
    
    return advantages;
  };
  
  const getRiskFactors = () => {
    // This would be AI-generated in a real implementation
    const risks = [
      {
        title: 'Integration Complexity',
        severity: company.employees > 500 ? 'High' : company.employees > 200 ? 'Medium' : 'Low',
        description: `With ${company.employees} employees and a complex service portfolio spanning ${company.services.length} distinct areas, integration challenges may arise in aligning processes and technology stacks.`
      },
      {
        title: 'Cultural Fit',
        severity: company.region === 'North America' ? 'Low' : company.region === 'Europe' ? 'Medium' : 'High',
        description: `Based in ${company.country} with a ${new Date().getFullYear() - company.foundedYear} year history, there may be ${company.region === 'North America' ? 'minimal' : 'some'} challenges in cultural alignment and working practices.`
      },
      {
        title: 'Financial Stability',
        severity: company.financialMetrics?.profitMargin && company.financialMetrics.profitMargin > 15 ? 'Low' : 
                 company.financialMetrics?.profitMargin && company.financialMetrics.profitMargin > 10 ? 'Medium' : 'High',
        description: `Financial indicators show ${company.financialMetrics?.profitMargin && company.financialMetrics.profitMargin > 15 ? 'strong stability' : 'potential concerns'}, with ${company.financialMetrics?.profitMargin || 'unknown'}% profit margin and ${company.financialMetrics?.debtToEquity || 'unknown'} debt-to-equity ratio.`
      }
    ];
    
    return risks;
  };
  
  const getFinancialProjections = () => {
    // This would use real financial models in a production implementation
    const baseRevenue = company.revenue;
    const growthRate = company.growthRate || 10;
    
    const projections = [
      {
        year: new Date().getFullYear(),
        revenue: baseRevenue,
        profit: baseRevenue * (company.financialMetrics?.profitMargin || 15) / 100
      },
      {
        year: new Date().getFullYear() + 1,
        revenue: baseRevenue * (1 + growthRate / 100),
        profit: baseRevenue * (1 + growthRate / 100) * (company.financialMetrics?.profitMargin || 15) / 100
      },
      {
        year: new Date().getFullYear() + 2,
        revenue: baseRevenue * Math.pow(1 + growthRate / 100, 2),
        profit: baseRevenue * Math.pow(1 + growthRate / 100, 2) * (company.financialMetrics?.profitMargin || 15) / 100
      },
      {
        year: new Date().getFullYear() + 3,
        revenue: baseRevenue * Math.pow(1 + growthRate / 100, 3),
        profit: baseRevenue * Math.pow(1 + growthRate / 100, 3) * (company.financialMetrics?.profitMargin || 15) / 100
      }
    ];
    
    return projections;
  };
  
  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(1)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(1)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(1)}K`;
    }
    return `$${num.toFixed(0)}`;
  };
  
  const competitiveAdvantages = getCompetitiveAdvantages();
  const riskFactors = getRiskFactors();
  const financialProjections = getFinancialProjections();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <div className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Enhanced Analysis: {company.name}</h2>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          AI-powered deep analysis and strategic insights
        </p>
      </div>
      
      {/* Tabs */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('competitive')}
            className={`py-2 px-3 text-sm font-medium rounded-md ${
              activeTab === 'competitive'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Competitive Analysis
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('financial')}
            className={`py-2 px-3 text-sm font-medium rounded-md ${
              activeTab === 'financial'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Financial Projections
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('risk')}
            className={`py-2 px-3 text-sm font-medium rounded-md ${
              activeTab === 'risk'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Risk Assessment
            </div>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {activeTab === 'competitive' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Competitive Advantages</h3>
              <div className="text-sm text-gray-500">
                <span className="font-medium">AI Confidence:</span> High
              </div>
            </div>
            
            <div className="space-y-4">
              {competitiveAdvantages.map((advantage, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-blue-600" />
                      {advantage.title}
                    </h4>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Score: {advantage.score}/100
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{advantage.description}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Market Position Summary</h4>
              <p className="text-blue-700 text-sm">
                {company.name} demonstrates {company.tier === 1 ? 'strong' : company.tier === 2 ? 'good' : 'moderate'} competitive advantages in the {company.industry.toLowerCase()} sector, particularly in {company.services.slice(0, 2).join(' and ')}. Their {company.growthRate && company.growthRate > 15 ? 'high growth rate' : 'market presence'} suggests potential for {company.tier === 1 ? 'market leadership' : 'competitive positioning'} in key segments.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Financial Projections</h3>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Base Growth Rate:</span> {company.growthRate || '10'}%
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Revenue</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Profit</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YoY Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {financialProjections.map((projection, index) => (
                    <tr key={index} className={index === 0 ? "bg-blue-50" : ""}>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">{projection.year}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatNumber(projection.revenue)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatNumber(projection.profit)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {index === 0 ? 'Baseline' : 
                          <span className="text-green-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {company.growthRate || 10}%
                          </span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Valuation Impact Analysis
              </h4>
              <p className="text-green-700 text-sm">
                Based on projected financials, an acquisition of {company.name} at {formatNumber(company.valuation || company.revenue * 4)} would likely yield a {company.growthRate && company.growthRate > 15 ? 'positive' : 'moderate'} ROI within 3-5 years. Key value creation would come from {company.services[0]} capabilities and {company.region} market expansion.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-2 rounded border border-green-200">
                  <p className="text-xs text-green-600 font-medium">Projected 3Y Revenue</p>
                  <p className="text-green-800 font-bold">{formatNumber(financialProjections[3].revenue)}</p>
                </div>
                <div className="bg-white p-2 rounded border border-green-200">
                  <p className="text-xs text-green-600 font-medium">Projected 3Y Profit</p>
                  <p className="text-green-800 font-bold">{formatNumber(financialProjections[3].profit)}</p>
                </div>
                <div className="bg-white p-2 rounded border border-green-200">
                  <p className="text-xs text-green-600 font-medium">Est. Break-even</p>
                  <p className="text-green-800 font-bold">{(company.valuation || company.revenue * 4) / financialProjections[1].profit < 4 ? '3-4 Years' : '4-5 Years'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Risk Assessment</h3>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Risk Profile:</span> {company.tier === 1 ? 'Low' : company.tier === 2 ? 'Moderate' : 'Elevated'}
              </div>
            </div>
            
            <div className="space-y-4">
              {riskFactors.map((risk, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">{risk.title}</h4>
                    <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      risk.severity === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : risk.severity === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {risk.severity} Risk
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{risk.description}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <h4 className="font-medium text-amber-800 mb-2">Mitigation Strategies</h4>
              <ul className="text-amber-700 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="h-5 w-5 text-amber-600 mr-2">•</span>
                  <span>Develop phased integration plan focusing on revenue synergies before full operational integration</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 text-amber-600 mr-2">•</span>
                  <span>Conduct extended due diligence on {company.financialMetrics?.profitMargin && company.financialMetrics.profitMargin < 15 ? 'financial health' : 'client contracts'} to validate assumptions</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 text-amber-600 mr-2">•</span>
                  <span>Consider {company.employees > 300 ? 'retention packages for key personnel' : 'earnout structure tied to performance metrics'} to align incentives</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Export Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
              disabled={exportStatus.excel}
            >
              {exportStatus.excel ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Exported
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export to Excel
                </>
              )}
            </button>
            
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
              disabled={exportStatus.pdf}
            >
              {exportStatus.pdf ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Exported
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Export to PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalysis;