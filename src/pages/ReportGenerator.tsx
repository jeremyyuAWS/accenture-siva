import React, { useState } from 'react';
import PowerPointGenerator from '../components/PowerPointGenerator';
import ExcelExporter from '../components/ExcelExporter';
import { useAppContext } from '../context/AppContext';
import { FileText, FileSpreadsheet, Notebook, ArrowRight } from 'lucide-react';

const ReportGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'powerpoint' | 'excel' | 'pdf'>('powerpoint');
  const { filteredCompanies, searchParams } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('powerpoint')}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'powerpoint'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            PowerPoint Report
          </button>
          
          <button
            onClick={() => setActiveTab('excel')}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'excel'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ml-4`}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel Export
          </button>
          
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'pdf'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } ml-4`}
          >
            <Notebook className="w-4 h-4 mr-2" />
            PDF Report
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 text-sm">
          <div className="flex items-center">
            <ArrowRight className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-gray-600">
              {activeTab === 'powerpoint' 
                ? 'Create presentation-ready PowerPoint decks with target company profiles and analysis'
                : activeTab === 'excel'
                ? 'Export detailed company data to Excel for further analysis and manipulation'
                : 'Generate comprehensive PDF reports with company profiles and strategic recommendations'}
            </span>
          </div>
        </div>
      </div>

      {activeTab === 'powerpoint' && <PowerPointGenerator />}
      {activeTab === 'excel' && <ExcelExporter companies={filteredCompanies} searchParams={searchParams} />}
      {activeTab === 'pdf' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <Notebook className="h-16 w-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">PDF Report Generator</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Generate comprehensive PDF reports with company profiles, financial analysis, and strategic recommendations.
            </p>
            <button
              onClick={() => {
                alert('In a real implementation, this would generate and download a PDF report.');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <Notebook className="h-5 w-5 mr-2" />
              Generate PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;