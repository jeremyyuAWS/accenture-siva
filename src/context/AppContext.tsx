import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Company,
  SearchParams,
  SearchWeights,
  SearchResult,
  ChatMessage,
  User,
  SavedSearch,
  DealStage,
  DueDiligenceStatus,
  Notification
} from '../types';

import { 
  mockCompanies, 
  mockUsers, 
  mockSavedSearches,
  mockChatMessages,
  industries,
  regions,
  services,
  offerings
} from '../data/mockCompanies';

interface AppContextType {
  // Current state
  currentUser: User | null;
  companies: Company[];
  filteredCompanies: Company[];
  selectedCompany: Company | null;
  savedSearches: SavedSearch[];
  searchParams: SearchParams;
  searchResults: SearchResult | null;
  chatMessages: ChatMessage[];
  notifications: Notification[];
  
  // Reference data
  industries: string[];
  regions: string[];
  services: string[];
  offerings: string[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setSelectedCompany: (company: Company | null) => void;
  updateSearchParams: (params: Partial<SearchParams>) => void;
  performSearch: () => void;
  saveSearch: (name: string) => void;
  loadSavedSearch: (searchId: string) => void;
  sendChatMessage: (content: string, companyId?: string) => void;
  generateReport: () => void;
  updateDealStage: (companyId: string, stage: DealStage) => void;
  updateDueDiligence: (companyId: string, dueDiligence: DueDiligenceStatus) => void;
  markNotificationAsRead: (notificationId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

// Initialize default search weights
const defaultWeights: SearchWeights = {
  servicesFit: 0.5,
  industryFit: 0.3,
  geographyFit: 0.1,
  financialHealth: 0.1,
};

// Initialize default search parameters
const defaultSearchParams: SearchParams = {
  weights: defaultWeights
};

// Create context with a default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State initialization
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(mockCompanies);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(mockSavedSearches);
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Due Diligence Started',
      message: 'TechSolutions Global has entered the due diligence phase',
      type: 'info',
      createdAt: new Date(2023, 6, 15, 10, 30),
      read: false,
      relatedTo: {
        type: 'company',
        id: '1'
      }
    },
    {
      id: '2',
      title: 'New Target Recommendation',
      message: 'M&A Scout AI has identified 3 new potential targets that match your criteria',
      type: 'success',
      createdAt: new Date(2023, 6, 14, 15, 45),
      read: true,
      relatedTo: {
        type: 'search',
        id: '1'
      }
    },
    {
      id: '3',
      title: 'Deal Risk Alert',
      message: 'High regulatory risk identified in DataInsight Partners due diligence',
      type: 'warning',
      createdAt: new Date(2023, 6, 13, 9, 15),
      read: false,
      relatedTo: {
        type: 'company',
        id: '2'
      }
    }
  ]);
  
  // Score and rank companies based on search parameters and weights
  const rankCompanies = (companies: Company[], params: SearchParams): Company[] => {
    return companies.map(company => {
      // Calculate scores for each dimension
      let servicesFitScore = 0;
      let industryFitScore = 0;
      let geographyFitScore = 0;
      let financialHealthScore = 0;
      
      // Services fit calculation
      if (params.services && params.services.length > 0) {
        const matchingServices = company.services.filter(s => 
          params.services?.includes(s)).length;
        servicesFitScore = (matchingServices / params.services.length) * 100;
      } else {
        servicesFitScore = 75; // Default score if no services specified
      }
      
      // Industry fit calculation
      if (params.industry) {
        industryFitScore = company.industry === params.industry ? 100 : 50;
      } else {
        industryFitScore = 75; // Default score if no industry specified
      }
      
      // Geography fit calculation
      if (params.region) {
        geographyFitScore = company.region === params.region ? 100 : 50;
      } else {
        geographyFitScore = 75; // Default score if no region specified
      }
      
      // Financial health calculation (simplified)
      financialHealthScore = 
        (company.financialMetrics?.profitMargin || 15) * 3 + 
        (company.financialMetrics?.revenueGrowth || 10) * 2;
      
      // Apply weights to calculate overall score
      const overall = 
        servicesFitScore * params.weights.servicesFit +
        industryFitScore * params.weights.industryFit +
        geographyFitScore * params.weights.geographyFit +
        financialHealthScore * params.weights.financialHealth;
      
      // Assign tier based on overall score
      let tier: 1 | 2 | 3;
      if (overall >= 80) {
        tier = 1;
      } else if (overall >= 60) {
        tier = 2;
      } else {
        tier = 3;
      }
      
      // Return company with calculated scores
      return {
        ...company,
        tier,
        score: {
          overall,
          servicesFit: servicesFitScore,
          industryFit: industryFitScore,
          geographyFit: geographyFitScore,
          financialHealth: financialHealthScore
        }
      };
    }).sort((a, b) => (b.score?.overall || 0) - (a.score?.overall || 0));
  };

  // Filter companies based on search parameters
  const filterCompanies = (companies: Company[], params: SearchParams): Company[] => {
    return companies.filter(company => {
      // Industry filter
      if (params.industry && company.industry !== params.industry) {
        return false;
      }
      
      // Region filter
      if (params.region && company.region !== params.region) {
        return false;
      }
      
      // Services filter
      if (params.services && params.services.length > 0) {
        const hasMatchingService = company.services.some(s => 
          params.services?.includes(s));
        if (!hasMatchingService) return false;
      }
      
      // Offerings filter
      if (params.offerings && params.offerings.length > 0) {
        const hasMatchingOffering = company.offerings.some(o => 
          params.offerings?.includes(o));
        if (!hasMatchingOffering) return false;
      }
      
      // Revenue range filter
      if (params.minRevenue && company.revenue < params.minRevenue) {
        return false;
      }
      if (params.maxRevenue && company.revenue > params.maxRevenue) {
        return false;
      }
      
      // Employee count filter
      if (params.minEmployees && company.employees < params.minEmployees) {
        return false;
      }
      if (params.maxEmployees && company.employees > params.maxEmployees) {
        return false;
      }
      
      // Founded year range filter
      if (params.foundedAfter && company.foundedYear < params.foundedAfter) {
        return false;
      }
      if (params.foundedBefore && company.foundedYear > params.foundedBefore) {
        return false;
      }
      
      // Growth rate range filter
      if (params.minGrowthRate && (company.growthRate || 0) < params.minGrowthRate) {
        return false;
      }
      if (params.maxGrowthRate && (company.growthRate || 0) > params.maxGrowthRate) {
        return false;
      }
      
      return true;
    });
  };

  // Perform search with current parameters
  const performSearch = () => {
    // First filter companies based on criteria
    const filtered = filterCompanies(companies, searchParams);
    
    // Then score and rank the filtered companies
    const ranked = rankCompanies(filtered, searchParams);
    
    setFilteredCompanies(ranked);
    
    // Count companies in each tier
    const tier1Count = ranked.filter(c => c.tier === 1).length;
    const tier2Count = ranked.filter(c => c.tier === 2).length;
    const tier3Count = ranked.filter(c => c.tier === 3).length;
    
    // Set search results
    setSearchResults({
      companies: ranked,
      totalResults: ranked.length,
      tierCounts: {
        tier1: tier1Count,
        tier2: tier2Count,
        tier3: tier3Count,
      }
    });
    
    // Add notification for search results
    if (ranked.length > 0) {
      addNotification({
        title: 'Search Results',
        message: `Found ${ranked.length} companies matching your criteria`,
        type: 'info',
        relatedTo: {
          type: 'search',
          id: 'latest'
        }
      });
    }
  };

  // Update search parameters
  const updateSearchParams = (params: Partial<SearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...params,
    }));
  };

  // Save current search
  const saveSearch = (name: string) => {
    if (!currentUser) return;
    
    const newSearch: SavedSearch = {
      id: `search_${Date.now()}`,
      name,
      createdAt: new Date(),
      params: searchParams,
      results: searchResults,
      userId: currentUser.id,
      isFavorite: false,
      isArchived: false
    };
    
    setSavedSearches(prev => [newSearch, ...prev]);
    
    // Add notification
    addNotification({
      title: 'Search Saved',
      message: `"${name}" has been saved to your searches`,
      type: 'success',
      relatedTo: {
        type: 'search',
        id: newSearch.id
      }
    });
  };

  // Load a saved search
  const loadSavedSearch = (searchId: string) => {
    const search = savedSearches.find(s => s.id === searchId);
    if (search) {
      setSearchParams(search.params);
      performSearch();
    }
  };

  // Send a new chat message
  const sendChatMessage = (content: string, companyId?: string) => {
    // Create user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      companyId,
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: generateAIResponse(content, companyId),
        timestamp: new Date(),
        companyId,
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      
      // Add notification for certain types of AI responses
      if (content.toLowerCase().includes('risk') || aiResponse.content.toLowerCase().includes('risk')) {
        addNotification({
          title: 'Risk Analysis',
          message: companyId 
            ? `AI has identified potential risks for ${companies.find(c => c.id === companyId)?.name}`
            : 'AI has provided a risk analysis for your query',
          type: 'warning',
          relatedTo: {
            type: companyId ? 'company' : 'system',
            id: companyId || 'ai-chat'
          }
        });
      }
    }, 1000);
  };

  // Generate mock AI response (in a real app, this would call an AI service)
  const generateAIResponse = (userMessage: string, companyId?: string): string => {
    if (companyId) {
      const company = companies.find(c => c.id === companyId);
      
      if (userMessage.toLowerCase().includes('why')) {
        return `${company?.name} was selected based on its strong ${company?.score?.servicesFit.toFixed(1)}/100 score for service fit and ${company?.score?.industryFit.toFixed(1)}/100 for industry alignment. They specialize in ${company?.services.join(', ')}, which aligns well with our strategic objectives. Their financial health score of ${company?.score?.financialHealth.toFixed(1)}/100 also indicates a stable acquisition target with good growth potential.`;
      }
      
      if (userMessage.toLowerCase().includes('synerg')) {
        return `For ${company?.name}, key synergies include: 1) Technology integration opportunities with their ${company?.services[0]} platform, 2) Market expansion through their established presence in ${company?.region}, and 3) Complementary service offerings in ${company?.services[1]} that would enhance our portfolio. The acquisition would strengthen our position in the ${company?.industry} sector.`;
      }
      
      if (userMessage.toLowerCase().includes('risk')) {
        return `Key risks for acquiring ${company?.name} include: 1) Integration complexity due to their specialized technology stack, 2) Potential cultural alignment challenges given their different regional operating model in ${company?.region}, and 3) Financial considerations including their debt-to-equity ratio of ${company?.financialMetrics?.debtToEquity}. A thorough due diligence process would be required to mitigate these risks.`;
      }
    }
    
    return `Based on my analysis of the M&A targets, I would recommend focusing on companies with strong service alignment in ${searchParams.services?.join(', ') || 'cloud services and data analytics'}. The companies in Tier 1 show the strongest strategic fit based on your prioritized criteria. Would you like more specific information about any particular company?`;
  };

  // Generate a PowerPoint report (mock function)
  const generateReport = () => {
    // In a real implementation, this would generate and download a PPTX file
    console.log('Generating PowerPoint report with', filteredCompanies.length, 'companies');
    
    // Add notification
    addNotification({
      title: 'Report Generated',
      message: `PowerPoint report with ${filteredCompanies.length} companies has been generated`,
      type: 'success',
      relatedTo: {
        type: 'system',
        id: 'report'
      }
    });
    
    alert('PowerPoint report generated! In a real implementation, this would download a PPTX file with the M&A scan results.');
  };
  
  // Update deal stage for a company
  const updateDealStage = (companyId: string, stage: DealStage) => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;
    
    const oldStage = company.dealStage;
    
    setCompanies(prev => prev.map(comp => 
      comp.id === companyId ? { ...comp, dealStage: stage } : comp
    ));
    
    setFilteredCompanies(prev => prev.map(comp => 
      comp.id === companyId ? { ...comp, dealStage: stage } : comp
    ));
    
    // Add notification
    addNotification({
      title: 'Deal Stage Updated',
      message: `${company.name} has moved from ${oldStage || 'identification'} to ${stage}`,
      type: 'info',
      relatedTo: {
        type: 'company',
        id: companyId
      }
    });
  };
  
  // Update due diligence status for a company
  const updateDueDiligence = (companyId: string, dueDiligence: DueDiligenceStatus) => {
    setCompanies(prev => prev.map(comp => 
      comp.id === companyId ? { ...comp, dueDiligence } : comp
    ));
    
    setFilteredCompanies(prev => prev.map(comp => 
      comp.id === companyId ? { ...comp, dueDiligence } : comp
    ));
    
    // Add notification if progress is significant
    const company = companies.find(c => c.id === companyId);
    if (company && dueDiligence.progress >= 50 && (!company.dueDiligence || company.dueDiligence.progress < 50)) {
      addNotification({
        title: 'Due Diligence Progress',
        message: `${company.name} due diligence is now ${dueDiligence.progress}% complete`,
        type: 'success',
        relatedTo: {
          type: 'company',
          id: companyId
        }
      });
    }
  };
  
  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}`,
      createdAt: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Initial search on component mount
  useEffect(() => {
    performSearch();
    
    // Initialize some companies with deal stages for demo
    setCompanies(prev => prev.map(company => {
      if (company.id === '1') {
        return { ...company, dealStage: 'due_diligence' };
      } else if (company.id === '2') {
        return { ...company, dealStage: 'evaluation' };
      } else if (company.id === '3') {
        return { ...company, dealStage: 'negotiation' };
      }
      return company;
    }));
  }, []);

  // Context value
  const contextValue: AppContextType = {
    currentUser,
    companies,
    filteredCompanies,
    selectedCompany,
    savedSearches,
    searchParams,
    searchResults,
    chatMessages,
    notifications,
    industries,
    regions,
    services,
    offerings,
    setCurrentUser,
    setSelectedCompany,
    updateSearchParams,
    performSearch,
    saveSearch,
    loadSavedSearch,
    sendChatMessage,
    generateReport,
    updateDealStage,
    updateDueDiligence,
    markNotificationAsRead,
    addNotification
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};