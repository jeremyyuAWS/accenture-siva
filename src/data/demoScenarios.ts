import { GraphNode, GraphEdge } from '../types';

// Demo scenario for "Fintech Companies in Crypto Space Using GenAI"
export const fintechCryptoGenAI = {
  title: "Fintech Companies in Crypto Space Using GenAI",
  description: "Discover fintech companies operating in cryptocurrency that leverage generative AI",
  query: "fintech crypto generative AI",
  tags: ["Fintech", "Crypto", "GenAI", "Blockchain"],
  companies: [
    { 
      name: "Sardine", 
      description: "AI-powered fraud prevention platform for crypto transactions using generative models to detect patterns", 
      industry: "Fintech",
      fundingStage: "Series B",
      fundingAmount: "$70M",
      investors: ["Andreessen Horowitz", "XYZ Ventures"]
    },
    { 
      name: "Alloy", 
      description: "Identity verification platform using GenAI to validate crypto transactions and ensure compliance", 
      industry: "Fintech",
      fundingStage: "Series C",
      fundingAmount: "$150M",
      investors: ["Lightspeed", "Canapi Ventures"]
    },
    { 
      name: "Chainalysis", 
      description: "Blockchain analysis platform leveraging GenAI for transaction monitoring and risk assessment", 
      industry: "Crypto",
      fundingStage: "Series E",
      fundingAmount: "$300M",
      investors: ["Benchmark", "Accel"]
    },
    { 
      name: "Blocknative", 
      description: "Blockchain infrastructure with GenAI-powered transaction prediction and mempool monitoring", 
      industry: "Crypto",
      fundingStage: "Series A",
      fundingAmount: "$35M",
      investors: ["Foundry Group"]
    },
    { 
      name: "TRM Labs", 
      description: "Crypto fraud detection using GenAI to analyze on-chain and off-chain data", 
      industry: "Crypto",
      fundingStage: "Series B",
      fundingAmount: "$85M",
      investors: ["Insight Partners", "PayPal Ventures"]
    },
    { 
      name: "Gauntlet", 
      description: "Risk management platform for DeFi using GenAI for simulation and scenario analysis", 
      industry: "DeFi",
      fundingStage: "Series B",
      fundingAmount: "$55M",
      investors: ["Paradigm", "Ribbit Capital"]
    }
  ],
  searchSteps: [
    {
      description: "Querying databases for fintech companies with crypto focus",
      sources: ["Pitchbook", "Crunchbase", "Apollo"],
      duration: 800
    },
    {
      description: "Analyzing companies using GenAI technologies",
      sources: ["Google News", "TechCrunch", "Company Websites"],
      duration: 1000
    },
    {
      description: "Identifying relationships between companies and investors",
      sources: ["Investment Databases", "SEC Filings"],
      duration: 700
    },
    {
      description: "Creating knowledge graph of fintech-crypto-GenAI companies",
      sources: ["Graph Database", "Relationship Analysis"],
      duration: 900
    }
  ]
};

// Demo scenario for "AI Healthcare Startups"
export const aiHealthcareStartups = {
  title: "AI Healthcare Startups",
  description: "Discover innovative startups using AI in healthcare and medical applications",
  query: "AI healthcare startups",
  tags: ["AI", "Healthcare", "Startups"],
  companies: [
    { 
      name: "Tempus", 
      description: "AI-driven precision medicine platform analyzing clinical and molecular data to personalize healthcare treatments", 
      industry: "Healthcare",
      fundingStage: "Series G",
      fundingAmount: "$1.1B",
      investors: ["Google Ventures", "NEA"]
    },
    { 
      name: "Insitro", 
      description: "Machine learning platform for drug discovery combining biological data and computation", 
      industry: "Biotech",
      fundingStage: "Series C",
      fundingAmount: "$400M",
      investors: ["Andreessen Horowitz", "ARCH Venture Partners"]
    },
    { 
      name: "PathAI", 
      description: "AI-powered pathology platform improving cancer diagnosis accuracy and treatment selection", 
      industry: "Healthcare",
      fundingStage: "Series C",
      fundingAmount: "$165M",
      investors: ["General Atlantic", "Tiger Global"]
    }
  ],
  searchSteps: [
    {
      description: "Querying databases for healthcare startups with AI focus",
      sources: ["Pitchbook", "Crunchbase", "Apollo"],
      duration: 800
    },
    {
      description: "Analyzing startups using AI in medical applications",
      sources: ["Google News", "MedTech Insight", "Company Websites"],
      duration: 1000
    },
    {
      description: "Identifying relationships between companies and investors",
      sources: ["Investment Databases", "Healthcare Publications"],
      duration: 700
    },
    {
      description: "Creating knowledge graph of AI healthcare companies",
      sources: ["Graph Database", "Relationship Analysis"],
      duration: 900
    }
  ]
};

// Demo scenario for "Climate Tech Investors"
export const climateTechInvestors = {
  title: "Climate Tech Investors",
  description: "Leading investors funding climate tech and sustainable energy companies",
  query: "climate tech investors",
  tags: ["Climate", "Investments", "Sustainability"],
  companies: [
    { 
      name: "Breakthrough Energy Ventures", 
      description: "Investing in innovations that will lead the world to net-zero emissions, founded by Bill Gates", 
      industry: "Venture Capital",
      portfolioSize: "40+ companies",
      fundSize: "$2B",
      notableInvestments: ["Form Energy", "Commonwealth Fusion Systems", "Lilac Solutions"]
    },
    { 
      name: "Lowercarbon Capital", 
      description: "Backing startups tackling the climate crisis through technology and innovation", 
      industry: "Venture Capital",
      portfolioSize: "100+ companies",
      fundSize: "$800M",
      notableInvestments: ["Watershed", "Charm Industrial", "Living Carbon"]
    },
    { 
      name: "Energy Impact Partners", 
      description: "Strategic investment firm focused on the energy transition with utility partners", 
      industry: "Private Equity",
      portfolioSize: "60+ companies",
      fundSize: "$3B",
      notableInvestments: ["Arcadia", "Enchanted Rock", "Opus One Solutions"]
    }
  ],
  searchSteps: [
    {
      description: "Identifying key investors in climate technology",
      sources: ["Pitchbook", "Crunchbase", "CleanTech Group"],
      duration: 800
    },
    {
      description: "Analyzing investment portfolios and strategies",
      sources: ["Investor Websites", "SEC Filings", "Press Releases"],
      duration: 1000
    },
    {
      description: "Mapping investment networks and patterns",
      sources: ["Deal Databases", "Climate Tech Reports"],
      duration: 700
    },
    {
      description: "Creating knowledge graph of climate tech investment ecosystem",
      sources: ["Graph Database", "Relationship Analysis"],
      duration: 900
    }
  ]
};

// Demo scenario for "Cybersecurity Acquisitions"
export const cybersecurityAcquisitions = {
  title: "Cybersecurity Acquisitions",
  description: "Recent M&A activity in the cybersecurity industry",
  query: "cybersecurity acquisitions",
  tags: ["Cybersecurity", "M&A", "Acquisitions"],
  companies: [
    { 
      name: "Google's Acquisition of Mandiant", 
      description: "Google acquired Mandiant to enhance Google Cloud's security operations and consulting services", 
      industry: "Cybersecurity",
      dealValue: "$5.4B",
      announcementDate: "March 2022",
      acquirer: "Google (Alphabet)"
    },
    { 
      name: "Microsoft's Acquisition of RiskIQ", 
      description: "Microsoft acquired RiskIQ to strengthen threat intelligence and attack surface management", 
      industry: "Cybersecurity",
      dealValue: "$500M",
      announcementDate: "July 2021",
      acquirer: "Microsoft"
    },
    { 
      name: "Thoma Bravo's Acquisition of Proofpoint", 
      description: "Private equity firm Thoma Bravo acquired email security leader Proofpoint in a take-private transaction", 
      industry: "Cybersecurity",
      dealValue: "$12.3B",
      announcementDate: "April 2021",
      acquirer: "Thoma Bravo"
    }
  ],
  searchSteps: [
    {
      description: "Identifying major cybersecurity acquisitions",
      sources: ["Pitchbook", "Crunchbase", "SEC Filings"],
      duration: 800
    },
    {
      description: "Analyzing deal terms and strategic rationale",
      sources: ["Press Releases", "Investor Calls", "Industry Reports"],
      duration: 1000
    },
    {
      description: "Evaluating post-acquisition integration and outcomes",
      sources: ["Company Updates", "Financial Reports", "News Analysis"],
      duration: 700
    },
    {
      description: "Creating knowledge graph of cybersecurity M&A landscape",
      sources: ["Graph Database", "Relationship Analysis"],
      duration: 900
    }
  ]
};

// Popular search scenarios for quick access
export const popularSearchScenarios = [
  {
    id: "fintech-crypto-genai",
    title: "Fintech Companies in Crypto Space Using GenAI",
    description: "Discover fintech companies operating in cryptocurrency that leverage generative AI",
    tags: ["Fintech", "Crypto", "GenAI"],
    query: "fintech crypto generative AI",
    searchSteps: fintechCryptoGenAI.searchSteps,
    companies: fintechCryptoGenAI.companies
  },
  {
    id: "ai-healthcare-startups",
    title: "AI Healthcare Startups",
    description: "Discover innovative startups using AI in healthcare and medical applications",
    tags: ["AI", "Healthcare", "Startups"],
    query: "AI healthcare startups",
    searchSteps: aiHealthcareStartups.searchSteps,
    companies: aiHealthcareStartups.companies
  },
  {
    id: "climate-tech-investors",
    title: "Climate Tech Investors",
    description: "Leading investors funding climate tech and sustainable energy companies",
    tags: ["Climate", "Investments", "Sustainability"],
    query: "climate tech investors",
    searchSteps: climateTechInvestors.searchSteps,
    companies: climateTechInvestors.companies
  },
  {
    id: "cyber-security-acquisitions",
    title: "Cybersecurity Acquisitions",
    description: "Recent M&A activity in the cybersecurity industry",
    tags: ["Cybersecurity", "M&A", "Acquisitions"],
    query: "cybersecurity acquisitions",
    searchSteps: cybersecurityAcquisitions.searchSteps,
    companies: cybersecurityAcquisitions.companies
  }
];