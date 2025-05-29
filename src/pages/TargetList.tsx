import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import CompanyList from '../components/CompanyList';
import CompanyDetail from '../components/CompanyDetail';
import CompanyAnalysis from '../components/CompanyAnalysis';
import { BarChart3, ArrowLeft } from 'lucide-react';

const TargetList: React.FC = () => {
  const { filteredCompanies, selectedCompany, setSelectedCompany, chatMessages } = useAppContext();
  const [showingAnalysis, setShowingAnalysis] = useState(false);
  const [companyForAnalysis, setCompanyForAnalysis] = useState(selectedCompany);

  const handleViewAnalysis = (company: typeof selectedCompany) => {
    setCompanyForAnalysis(company);
    setShowingAnalysis(true);
  };

  return (
    <div>
      {showingAnalysis && companyForAnalysis ? (
        <div className="space-y-4">
          <button
            onClick={() => setShowingAnalysis(false)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Target List
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Enhanced Analysis Dashboard
                </h2>
              </div>
              <div className="text-sm text-gray-500">
                {companyForAnalysis.name} • {companyForAnalysis.industry}
              </div>
            </div>
          </div>
          
          <CompanyAnalysis company={companyForAnalysis} />
        </div>
      ) : (
        <>
          <CompanyList 
            companies={filteredCompanies}
            onSelectCompany={(company) => {
              setSelectedCompany(company);
              setCompanyForAnalysis(company);
            }}
          />
          
          {selectedCompany && (
            <CompanyDetail 
              company={selectedCompany}
              onClose={() => setSelectedCompany(null)}
              chatMessages={chatMessages}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TargetList;