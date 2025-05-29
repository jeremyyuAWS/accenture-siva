import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Download, Image, Layout, Settings, Info, Check, ArrowRight } from 'lucide-react';

const PowerPointGenerator: React.FC = () => {
  const { 
    filteredCompanies, 
    searchParams, 
    searchResults, 
    generateReport 
  } = useAppContext();
  
  const [branding, setBranding] = useState('default');
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includeContacts, setIncludeContacts] = useState(true);
  const [includeJustification, setIncludeJustification] = useState(true);
  const [numberOfSlides, setNumberOfSlides] = useState<number>(10);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('corporate');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Calculate tier counts
  const tier1Count = filteredCompanies.filter(c => c.tier === 1).length;
  const tier2Count = filteredCompanies.filter(c => c.tier === 2).length;
  const tier3Count = filteredCompanies.filter(c => c.tier === 3).length;
  
  // Handle the report generation
  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      generateReport();
      setGeneratingReport(false);
      setReportGenerated(true);
      setTimeout(() => {
        setReportGenerated(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-black text-white">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">PowerPoint Report Generator</h2>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          Create a professional M&A target scan presentation
        </p>
      </div>
      
      <div className="p-6">
        {!searchResults ? (
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Search Results</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You need to perform a search before generating a report. Use the Search panel to find potential M&A targets.
            </p>
          </div>
        ) : (
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-1" />
                Report Preview Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Total Companies</p>
                  <p className="text-xl font-bold text-gray-900">{filteredCompanies.length}</p>
                </div>
                
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Primary Industry</p>
                  <p className="text-xl font-bold text-gray-900">{searchParams.industry || 'All Industries'}</p>
                </div>
                
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Tier Distribution</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 font-semibold">{tier1Count} T1</span>
                    <span className="text-gray-600 font-semibold">{tier2Count} T2</span>
                    <span className="text-gray-600 font-semibold">{tier3Count} T3</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-700">
                Your report will include an executive summary, search methodology, target company profiles, 
                tiering justification, and strategic recommendations. The PowerPoint will be automatically
                structured with all your customized content.
              </p>
            </div>
            
            <div className="border-b border-gray-200 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Report Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Presentation Branding
                  </label>
                  <select
                    value={branding}
                    onChange={(e) => setBranding(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="default">Default Branding</option>
                    <option value="accenture">Accenture Corporate</option>
                    <option value="minimal">Minimal Design</option>
                    <option value="modern">Modern with Data Visualization</option>
                    <option value="executive">Executive Style</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Company Profile Slides
                  </label>
                  <input
                    type="range"
                    min="5"
                    max={Math.min(30, filteredCompanies.length)}
                    value={numberOfSlides}
                    onChange={(e) => setNumberOfSlides(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5 slides</span>
                    <span>{numberOfSlides} slides</span>
                    <span>30 slides</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <input
                    id="includeFinancials"
                    type="checkbox"
                    checked={includeFinancials}
                    onChange={(e) => setIncludeFinancials(e.target.checked)}
                    className="h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <label htmlFor="includeFinancials" className="ml-2 text-sm text-gray-700">
                    Include Financial Details
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="includeContacts"
                    type="checkbox"
                    checked={includeContacts}
                    onChange={(e) => setIncludeContacts(e.target.checked)}
                    className="h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <label htmlFor="includeContacts" className="ml-2 text-sm text-gray-700">
                    Include Contact Information
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="includeJustification"
                    type="checkbox"
                    checked={includeJustification}
                    onChange={(e) => setIncludeJustification(e.target.checked)}
                    className="h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <label htmlFor="includeJustification" className="ml-2 text-sm text-gray-700">
                    Include Selection Justification
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Select Template Style</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div 
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedTemplate === 'corporate' ? 'border-black' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedTemplate('corporate')}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="p-3">
                      <div className="h-6 bg-black w-24 mb-2"></div>
                      <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 w-1/2 mb-6"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-sm font-medium">Corporate</p>
                  </div>
                </div>
                
                <div 
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedTemplate === 'minimal' ? 'border-black' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedTemplate('minimal')}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-white">
                    <div className="p-3">
                      <div className="h-6 bg-gray-800 w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 w-1/2 mb-6"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 bg-gray-100 rounded"></div>
                        <div className="h-12 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-sm font-medium">Minimal</p>
                  </div>
                </div>
                
                <div 
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedTemplate === 'data' ? 'border-black' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedTemplate('data')}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="p-3">
                      <div className="h-6 bg-gray-400 w-24 mb-2"></div>
                      <div className="h-3 bg-gray-600 w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 w-1/2 mb-6"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 bg-gray-700 rounded"></div>
                        <div className="h-12 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-sm font-medium">Data-Focused</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="aspect-w-16 aspect-h-9 bg-white rounded-md shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="h-8 bg-gray-100 w-40 rounded mb-4"></div>
                    <div className="h-12 bg-gray-100 w-3/4 rounded mb-6"></div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="h-24 bg-gray-100 rounded"></div>
                      <div className="h-24 bg-gray-100 rounded"></div>
                      <div className="h-24 bg-gray-100 rounded"></div>
                    </div>
                    
                    <div className="h-6 bg-gray-100 w-1/2 rounded mb-3"></div>
                    <div className="h-4 bg-gray-100 w-3/4 rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 w-2/3 rounded"></div>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-center">
                  <div className="flex space-x-2">
                    <button className="h-3 w-3 rounded-full bg-gray-300"></button>
                    <button className="h-3 w-3 rounded-full bg-black"></button>
                    <button className="h-3 w-3 rounded-full bg-gray-300"></button>
                    <button className="h-3 w-3 rounded-full bg-gray-300"></button>
                    <button className="h-3 w-3 rounded-full bg-gray-300"></button>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Layout className="h-4 w-4 mr-1" />
                  <span>Total slides: ~{Math.min(numberOfSlides + 6, filteredCompanies.length + 6)}</span>
                </div>
                
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-1" />
                  <span>More design options in full version</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleGenerateReport}
                  disabled={generatingReport || reportGenerated}
                  className={`px-6 py-3 rounded-md flex items-center ${
                    reportGenerated ? 'bg-gray-600 text-white' :
                    'bg-black text-white hover:bg-gray-800 transition-colors'
                  } disabled:opacity-70`}
                >
                  {generatingReport ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Generating...
                    </>
                  ) : reportGenerated ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Report Generated
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Generate PowerPoint Report
                    </>
                  )}
                </button>
                
                {reportGenerated && (
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('In a real implementation, this would download the generated PowerPoint file.');
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download Report
                  </a>
                )}
              </div>
              
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                onClick={() => {
                  alert('In a real implementation, this would open the template customization panel.');
                }}
              >
                <Image className="h-4 w-4 mr-2" />
                Customize Templates
              </button>
            </div>
            
            {/* Export Formats */}
            {reportGenerated && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Report Generated Successfully
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Your M&A target analysis report has been created with {tier1Count + tier2Count} high-priority targets
                  profiled across {Math.min(numberOfSlides + 6, filteredCompanies.length + 6)} slides.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <a 
                    href="#"
                    className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('In a real implementation, this would download the PowerPoint file.');
                    }}
                  >
                    <FileText className="h-8 w-8 text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">PowerPoint</span>
                    <span className="text-xs text-gray-500">.pptx</span>
                  </a>
                  
                  <a 
                    href="#"
                    className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('In a real implementation, this would download the PDF file.');
                    }}
                  >
                    <FileText className="h-8 w-8 text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">PDF</span>
                    <span className="text-xs text-gray-500">.pdf</span>
                  </a>
                  
                  <a 
                    href="#"
                    className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('In a real implementation, this would generate a Google Slides presentation.');
                    }}
                  >
                    <FileText className="h-8 w-8 text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Google Slides</span>
                    <span className="text-xs text-gray-500">online</span>
                  </a>
                  
                  <a 
                    href="#"
                    className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('In a real implementation, this would send the report via email.');
                    }}
                  >
                    <ArrowRight className="h-8 w-8 text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Share</span>
                    <span className="text-xs text-gray-500">via email</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-3 text-center border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Generated presentations use AI to structure content and create visual elements for optimal impact
        </p>
      </div>
    </div>
  );
};

export default PowerPointGenerator;