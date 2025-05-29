import React, { useState } from 'react';
import { Company, SearchParams } from '../types';
import { FileSpreadsheet, Download, Check, Upload, AlertCircle } from 'lucide-react';

interface ExcelExporterProps {
  companies: Company[];
  searchParams: SearchParams;
}

const ExcelExporter: React.FC<ExcelExporterProps> = ({ companies, searchParams }) => {
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportType, setExportType] = useState<'simple' | 'detailed' | 'full'>('simple');
  const [customFileName, setCustomFileName] = useState('M&A_Target_List');
  
  const handleExport = () => {
    setExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setExporting(false);
      setExportSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
      
      // In a real implementation, this would generate and download an Excel file
      console.log(`Exporting ${companies.length} companies to Excel`);
      console.log(`Export type: ${exportType}`);
      console.log(`Filename: ${customFileName}.xlsx`);
      
      alert(`${companies.length} companies exported to Excel. In a real implementation, this would download an Excel file named "${customFileName}.xlsx".`);
    }, 1500);
  };
  
  // Get count of companies by tier
  const tier1Count = companies.filter(c => c.tier === 1).length;
  const tier2Count = companies.filter(c => c.tier === 2).length;
  const tier3Count = companies.filter(c => c.tier === 3).length;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <div className="flex items-center">
          <FileSpreadsheet className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Export Results</h2>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          Download target company data in various formats
        </p>
      </div>
      
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="text-md font-medium text-gray-800 mb-3">Export Summary</h3>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Total Companies</p>
              <p className="text-xl font-bold text-gray-800">{companies.length}</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Tier Distribution</p>
              <div className="flex justify-center space-x-2">
                <span className="text-blue-600 font-semibold">{tier1Count} T1</span>
                <span className="text-green-600 font-semibold">{tier2Count} T2</span>
                <span className="text-amber-600 font-semibold">{tier3Count} T3</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Primary Industry</p>
              <p className="text-md font-medium text-gray-800">{searchParams.industry || 'All'}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Exporting search results based on {searchParams.services?.length || 0} service criteria and 
            {searchParams.region ? ` filtered by ${searchParams.region} region` : ' all regions'}.
          </p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
              File Name
            </label>
            <input
              type="text"
              id="fileName"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter file name"
            />
          </div>
          
          <div>
            <label htmlFor="exportType" className="block text-sm font-medium text-gray-700 mb-1">
              Export Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setExportType('simple')}
                className={`cursor-pointer border rounded-lg p-3 text-center ${
                  exportType === 'simple' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium">Simple</p>
                <p className="text-xs text-gray-500 mt-1">Basic company info</p>
              </div>
              
              <div
                onClick={() => setExportType('detailed')}
                className={`cursor-pointer border rounded-lg p-3 text-center ${
                  exportType === 'detailed' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium">Detailed</p>
                <p className="text-xs text-gray-500 mt-1">With scores & metrics</p>
              </div>
              
              <div
                onClick={() => setExportType('full')}
                className={`cursor-pointer border rounded-lg p-3 text-center ${
                  exportType === 'full' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium">Full Analysis</p>
                <p className="text-xs text-gray-500 mt-1">All data & insights</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-800 mb-3">Included Data</h4>
            
            <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
              <div className="grid grid-cols-2 gap-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeBasic"
                    checked
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeBasic" className="ml-2 text-sm text-gray-700">
                    Company Information
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeFinancials"
                    checked
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeFinancials" className="ml-2 text-sm text-gray-700">
                    Financial Data
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeScores"
                    checked
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeScores" className="ml-2 text-sm text-gray-700">
                    Strategic Fit Scores
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeServices"
                    checked
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeServices" className="ml-2 text-sm text-gray-700">
                    Services & Offerings
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeContacts"
                    checked={exportType === 'detailed' || exportType === 'full'}
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeContacts" className="ml-2 text-sm text-gray-700">
                    Contact Information
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeAnalysis"
                    checked={exportType === 'full'}
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeAnalysis" className="ml-2 text-sm text-gray-700">
                    AI Analysis & Insights
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            {exportType === 'simple' ? (
              'Basic export includes company profiles, tier data, and key metrics'
            ) : exportType === 'detailed' ? (
              'Detailed export includes all company data with scores and contact information'
            ) : (
              'Full analysis export includes AI-generated insights and recommendations'
            )}
          </div>
          
          <button
            onClick={handleExport}
            disabled={exporting || exportSuccess}
            className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {exporting ? (
              <>
                <Upload className="animate-spin h-4 w-4 mr-2" />
                Exporting...
              </>
            ) : exportSuccess ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Exported Successfully
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </>
            )}
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-400 flex items-start">
          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
          <span>
            In a real implementation, this would generate an Excel file with multiple sheets including company data, 
            financial information, and AI-generated insights based on your selected export type.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExcelExporter;