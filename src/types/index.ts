export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  subIndustry?: string;
  region: string;
  country: string;
  description: string;
  services: string[];
  offerings: string[];
  employees: number;
  revenue: number;
  valuation?: number;
  foundedYear: number;
  tier?: 1 | 2 | 3;
  score?: {
    overall: number;
    servicesFit: number;
    industryFit: number;
    geographyFit: number;
    financialHealth: number;
  };
  growthRate?: number;
  minGrowthRate?: number;
  maxGrowthRate?: number;
  financialMetrics?: {
    profitMargin?: number;
    revenueGrowth?: number;
    debtToEquity?: number;
    cashFlow?: number;
  };
  contacts?: {
    name: string;
    position: string;
    email?: string;
    phone?: string;
  }[];
  notes?: string;
  // Deal pipeline fields
  dealStage?: DealStage;
  dealProbability?: number;
  dealTimelineEstimate?: string;
  lastActivity?: Date;
  nextSteps?: string[];
  // Due diligence fields
  dueDiligence?: DueDiligenceStatus;
}

export interface SearchWeights {
  servicesFit: number;
  industryFit: number;
  geographyFit: number;
  financialHealth: number;
}

export interface SearchParams {
  industry?: string;
  region?: string;
  services?: string[];
  offerings?: string[];
  minRevenue?: number;
  maxRevenue?: number;
  minEmployees?: number;
  maxEmployees?: number;
  foundedAfter?: number;
  foundedBefore?: number;
  minGrowthRate?: number;
  maxGrowthRate?: number;
  weights: SearchWeights;
}

export interface SearchResult {
  companies: Company[];
  totalResults: number;
  tierCounts: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  companyId?: string;
  visualizationType?: VisualizationType;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
}

export interface SavedSearch {
  id: string;
  name: string;
  createdAt: Date;
  params: SearchParams;
  results?: SearchResult;
  userId: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

// Deal Pipeline Types
export type DealStage = 
  'identification' | 
  'initial_interest' | 
  'evaluation' | 
  'due_diligence' | 
  'negotiation' | 
  'agreement' | 
  'closing' | 
  'integration' | 
  'closed' | 
  'abandoned';

export interface DealStageConfig {
  id: DealStage;
  name: string;
  description: string;
  color: string;
  icon: string;
  order: number;
}

export interface DueDiligenceStatus {
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  categories: DueDiligenceCategory[];
}

export interface DueDiligenceCategory {
  id: string;
  name: string;
  progress: number;
  items: DueDiligenceItem[];
}

export interface DueDiligenceItem {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'flagged';
  assignee?: string;
  dueDate?: Date;
  documents?: Document[];
  notes?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  url?: string;
  uploadedAt: Date;
  uploadedBy: string;
  category: string;
  fileSize?: number;
  fileType?: string;
}

// Knowledge Graph Types
export interface GraphNode {
  id: string;
  name: string;
  type: 'company' | 'investor' | 'acquirer' | 'industry';
  properties?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'invested_in' | 'acquired' | 'belongs_to' | 'related_to';
  properties?: Record<string, any>;
}

// Insight Sentinel Types
export interface FocusArea {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  industries: string[];
  regions: string[];
  countries: string[];
  eventTypes: string[];
  watchlist: string[];
}

export interface FundingEvent {
  id: string;
  companyId: string;
  companyName: string;
  date: Date;
  type: 'seed' | 'series_a' | 'series_b' | 'series_c_plus' | 'acquisition' | 'ipo' | 'spac' | 'pe_buyout';
  amount: number;
  investors: string[];
  description: string;
  source?: string;
  sourceUrl?: string;
}

export interface ReportSettings {
  id: string;
  userId: string;
  format: 'bullet' | 'paragraph' | 'chart';
  frequency: 'daily' | 'weekly' | 'monthly';
  delivery: 'in-app' | 'email';
  emailAddress?: string;
  includeVisuals: boolean;
  includeSources: boolean;
  lastDelivery?: Date;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: Date;
  read: boolean;
  relatedTo?: {
    type: 'company' | 'deal' | 'search' | 'system' | 'report';
    id: string;
  };
}

// Visualization Types
export type VisualizationType = 
  | 'tierDistribution'
  | 'revenueComparison'
  | 'growthProjection'
  | 'serviceDistribution'
  | 'dealStages'
  | 'industryDistribution'
  | 'companyComparison'
  | 'alignmentAnalysis'
  | 'overallScore'
  | 'regionDistribution';

// Demo Conversation Scenarios
export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  messages: DemoMessage[];
}

export interface DemoMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  visualizationType?: VisualizationType;
}