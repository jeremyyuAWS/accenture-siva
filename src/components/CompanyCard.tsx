import React from 'react';
import { Company } from '../types';
import { Building2, Globe, Users, Banknote, TrendingUp, Award } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  onClick: (company: Company) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onClick }) => {
  // Get tier class for styling
  const getTierClass = (tier: number | undefined) => {
    switch(tier) {
      case 1:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
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
    return `$${num}`;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onClick(company)}
    >
      <div className="p-5">
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                className="w-10 h-10 rounded object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <Building2 className="w-6 h-6 text-gray-600" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getTierClass(company.tier)} border`}>
            Tier {company.tier}
          </div>
        </div>
        
        <div className="mt-3 mb-4">
          <p className="text-gray-600 text-sm line-clamp-2">{company.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div className="flex items-center text-gray-700">
            <Building2 className="mr-1 h-4 w-4 text-gray-500" />
            <span>{company.industry}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Globe className="mr-1 h-4 w-4 text-gray-500" />
            <span>{company.region}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Users className="mr-1 h-4 w-4 text-gray-500" />
            <span>{company.employees.toLocaleString()} employees</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Banknote className="mr-1 h-4 w-4 text-gray-500" />
            <span>{formatNumber(company.revenue)}</span>
          </div>
        </div>
        
        {company.score && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Match Score</span>
              <span className="text-sm font-semibold text-gray-600">{Math.round(company.score.overall)}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gray-800 h-2.5 rounded-full" 
                style={{ width: `${Math.round(company.score.overall)}%` }}
              ></div>
            </div>
            
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Services</span>
                  <span className="font-medium">{Math.round(company.score.servicesFit)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gray-600 h-1.5 rounded-full" 
                    style={{ width: `${Math.round(company.score.servicesFit)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Industry</span>
                  <span className="font-medium">{Math.round(company.score.industryFit)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gray-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.round(company.score.industryFit)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          {company.services.slice(0, 3).map((service, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {service}
            </span>
          ))}
          {company.services.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{company.services.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;