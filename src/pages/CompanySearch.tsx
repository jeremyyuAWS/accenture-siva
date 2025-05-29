import React, { useState } from 'react';
import { 
  Search, 
  ArrowDown, 
  ChevronRight, 
  Database, 
  Globe, 
  FileText, 
  User, 
  Calendar, 
  DollarSign, 
  Users, 
  Building,
  ExternalLink,
  Filter,
  Send,
  Bot,
  Clock,
  Zap
} from 'lucide-react';

const CompanySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    {role: 'assistant', content: "Hi there! I'm Eddie, your company research assistant. How can I help you find company information today?"}
  ]);
  const [messageInput, setMessageInput] = useState('');
  
  // Sample categories
  const categories = [
    'Technology', 
    'Healthcare', 
    'Finance', 
    'Retail', 
    'Manufacturing', 
    'Energy'
  ];
  
  // Sample sub-categories (would be filtered based on selected category)
  const subCategories = {
    'Technology': ['SaaS', 'Fintech', 'AI/ML', 'Cybersecurity', 'Cloud Computing'],
    'Finance': ['Banking', 'Insurance', 'Investment', 'Cryptocurrency', 'Lending']
  };
  
  // Sample companies (would be filtered based on selected sub-category)
  const companies = {
    'Fintech': ['Square', 'Stripe', 'Plaid', 'Robinhood', 'Coinbase'],
    'Cryptocurrency': ['Binance', 'Coinbase', 'Kraken', 'FTX', 'Gemini'],
    'AI/ML': ['OpenAI', 'Anthropic', 'Cohere', 'Stability AI', 'Inflection AI']
  };

  // Handler for sending messages
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    // Add user message
    setChatMessages([...chatMessages, {role: 'user', content: messageInput}]);
    
    // Clear input
    setMessageInput('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      let response = "I'll search for that information right away.";
      
      // Simple pattern matching for demo purposes
      if (messageInput.toLowerCase().includes('fintech')) {
        response = "I found several fintech companies in our database. Would you like to see companies like Square, Stripe, or Plaid? I can provide detailed information about their funding, products, and market position.";
        setSelectedCategory('Technology');
        setSelectedSubCategory('Fintech');
      } else if (messageInput.toLowerCase().includes('ai') || messageInput.toLowerCase().includes('machine learning')) {
        response = "There are several notable AI/ML companies in our database. Companies like OpenAI, Anthropic, and Cohere are leading the generative AI space. Would you like me to provide more details on any of these?";
        setSelectedCategory('Technology');
        setSelectedSubCategory('AI/ML');
      } else if (messageInput.toLowerCase().includes('crypto')) {
        response = "I can help with information on cryptocurrency companies. Major players include Coinbase, Binance, and Kraken. Would you like to focus on any specific aspect of these companies?";
        setSelectedCategory('Finance');
        setSelectedSubCategory('Cryptocurrency');
      }
      
      setChatMessages(prev => [...prev, {role: 'assistant', content: response}]);
    }, 1000);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Company Search</h1>
      </div>
      
      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search companies..."
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
            <button className="ml-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex h-[calc(100vh-300px)]">
          {/* Chat Panel (1/4 of screen) */}
          <div className="w-1/4 flex flex-col border-r border-gray-200">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Chat with Eddie</h3>
                  <p className="text-xs text-gray-500">Your company research assistant</p>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-3 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Ask about companies..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Updated now</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  <span>Ask about specific industries or companies</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Company List and Details (3/4 of screen) */}
          <div className="w-3/4 flex">
            {/* Categories and Subcategories */}
            <div className="w-2/3 border-r border-gray-200 flex">
              {/* Categories */}
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto p-4">
                <h3 className="font-medium text-gray-800 mb-3">Category</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedSubCategory(null);
                          setSelectedCompany(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedCategory === category
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Sub-Categories */}
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto p-4">
                <h3 className="font-medium text-gray-800 mb-3">
                  <div className="flex items-center">
                    <span>Sub-category</span>
                    {selectedCategory && (
                      <div className="flex items-center ml-2 text-gray-400">
                        <ArrowDown className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </h3>
                {selectedCategory && subCategories[selectedCategory as keyof typeof subCategories] ? (
                  <ul className="space-y-2">
                    {subCategories[selectedCategory as keyof typeof subCategories].map((subCategory) => (
                      <li key={subCategory}>
                        <button
                          onClick={() => {
                            setSelectedSubCategory(subCategory);
                            setSelectedCompany(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            selectedSubCategory === subCategory
                              ? 'bg-blue-50 text-blue-600'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {subCategory}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm italic">
                    Select a category first
                  </div>
                )}
                
                <div className="mt-4">
                  <div className="text-xs text-red-600">
                    <div>Country</div>
                    <div>Funding</div>
                  </div>
                </div>
              </div>
              
              {/* Companies List */}
              <div className="w-1/3 overflow-y-auto p-4">
                <h3 className="font-medium text-gray-800 mb-3">
                  <div className="flex items-center">
                    <span>Companies List</span>
                    {selectedSubCategory && (
                      <div className="flex items-center ml-2 text-gray-400">
                        <ArrowDown className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </h3>
                {selectedSubCategory && companies[selectedSubCategory as keyof typeof companies] ? (
                  <ul className="space-y-2">
                    {companies[selectedSubCategory as keyof typeof companies].map((company) => (
                      <li key={company}>
                        <button
                          onClick={() => setSelectedCompany(company)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            selectedCompany === company
                              ? 'bg-blue-50 text-blue-600'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {company}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm italic">
                    Select a sub-category first
                  </div>
                )}
              </div>
            </div>
            
            {/* Company Details */}
            <div className="w-1/3 overflow-y-auto p-4">
              {selectedCompany ? (
                <div>
                  <h3 className="font-medium text-gray-800 mb-4 text-lg">{selectedCompany}</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">Company Basic Data</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Founders:</span>
                        </div>
                        <span className="text-sm">John Smith, Jane Doe</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Start Date:</span>
                        </div>
                        <span className="text-sm">2018</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <Building className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Services/Products:</span>
                        </div>
                        <span className="text-sm">Cryptocurrency Exchange, Wallet</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Employees:</span>
                        </div>
                        <span className="text-sm">2,500+</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <Globe className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">HQ:</span>
                        </div>
                        <span className="text-sm">San Francisco, CA</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Funding Status:</span>
                        </div>
                        <span className="text-sm">Series E, $535M</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">Detailed Insights</h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>Data sources for detailed insights:</p>
                      <ul className="space-y-1 text-red-600 text-sm">
                        <li>• Website Scraper, Social Media Profiles</li>
                        <li>• Social Listening, Founder Interview</li>
                        <li>• Google News, Databases (Crunchbase, Apollo, Pitchbook)</li>
                      </ul>
                      
                      <div className="pt-3 mt-3 border-t border-gray-200">
                        <p className="text-gray-700">For more comprehensive information:</p>
                        <button className="mt-2 text-blue-600 flex items-center">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          <span>View Full Company Profile</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Select a company to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer with data sources */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
          <p>Data sources: Crunchbase, PitchBook, Apollo, Company websites, Public records</p>
        </div>
      </div>
    </div>
  );
};

export default CompanySearch;