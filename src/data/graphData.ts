import { GraphNode, GraphEdge } from '../types';

/**
 * Generate mock nodes for the knowledge graph
 */
export function generateMockNodes(): GraphNode[] {
  const companies = [
    { name: 'TechVision AI', type: 'company', properties: { industry: 'AI/ML', region: 'North America', fundingStage: 'Series B' } },
    { name: 'GreenEnergy Solutions', type: 'company', properties: { industry: 'ClimateTech', region: 'North America', fundingStage: 'Series A' } },
    { name: 'FinSecure Platform', type: 'company', properties: { industry: 'Fintech', region: 'Europe', fundingStage: 'Series A' } },
    { name: 'CloudSecure Inc', type: 'company', properties: { industry: 'Cybersecurity', region: 'North America', fundingStage: 'Series C' } },
    { name: 'HealthTech Solutions', type: 'company', properties: { industry: 'Healthtech', region: 'North America', fundingStage: 'Seed' } },
    { name: 'DataSight Analytics', type: 'company', properties: { industry: 'AI/ML', region: 'Europe', fundingStage: 'Series B' } },
    { name: 'EcoTech Innovations', type: 'company', properties: { industry: 'ClimateTech', region: 'Asia Pacific', fundingStage: 'Seed' } },
    { name: 'BlockSecure Payments', type: 'company', properties: { industry: 'Fintech', region: 'Europe', fundingStage: 'Series B' } },
    { name: 'MobilityTech Inc', type: 'company', properties: { industry: 'Mobility', region: 'Asia Pacific', fundingStage: 'Series A' } },
    { name: 'QuantumAI Solutions', type: 'company', properties: { industry: 'AI/ML', region: 'North America', fundingStage: 'Series C' } },
    { name: 'ClimateGuard Technologies', type: 'company', properties: { industry: 'ClimateTech', region: 'Europe', fundingStage: 'Series B' } },
    { name: 'CyberDefense Systems', type: 'company', properties: { industry: 'Cybersecurity', region: 'North America', fundingStage: 'Series A' } }
  ];
  
  const investors = [
    { name: 'Sequoia Capital', type: 'investor', properties: { region: 'North America', investorType: 'VC' } },
    { name: 'Andreessen Horowitz', type: 'investor', properties: { region: 'North America', investorType: 'VC' } },
    { name: 'Breakthrough Energy Ventures', type: 'investor', properties: { region: 'North America', investorType: 'VC' } },
    { name: 'Accel Partners', type: 'investor', properties: { region: 'North America', investorType: 'VC' } },
    { name: 'Y Combinator', type: 'investor', properties: { region: 'North America', investorType: 'Accelerator' } },
    { name: 'SoftBank Vision Fund', type: 'investor', properties: { region: 'Asia Pacific', investorType: 'VC' } }
  ];
  
  const acquirers = [
    { name: 'TechVision Corp', type: 'acquirer', properties: { industry: 'Technology', region: 'North America' } },
    { name: 'GreenFuture Holdings', type: 'acquirer', properties: { industry: 'Energy', region: 'Europe' } },
    { name: 'Enterprise Solutions Group', type: 'acquirer', properties: { industry: 'Software', region: 'North America' } }
  ];
  
  const industries = [
    { name: 'AI/ML', type: 'industry' },
    { name: 'Fintech', type: 'industry' },
    { name: 'ClimateTech', type: 'industry' },
    { name: 'Cybersecurity', type: 'industry' },
    { name: 'Healthtech', type: 'industry' },
    { name: 'Mobility', type: 'industry' }
  ];
  
  // Create nodes with IDs
  const nodes: GraphNode[] = [
    ...companies.map((company, i) => ({ id: `company_${i+1}`, ...company })),
    ...investors.map((investor, i) => ({ id: `investor_${i+1}`, ...investor })),
    ...acquirers.map((acquirer, i) => ({ id: `acquirer_${i+1}`, ...acquirer })),
    ...industries.map((industry, i) => ({ id: `industry_${i+1}`, ...industry }))
  ];
  
  return nodes;
}

/**
 * Generate mock edges for the knowledge graph
 */
export function generateMockEdges(): GraphEdge[] {
  const fundingEdges: GraphEdge[] = [
    // TechVision AI funding rounds
    { source: 'investor_1', target: 'company_1', type: 'invested_in', properties: { 
      eventType: 'series_b', amount: 45000000, timestamp: '2025-07-02T10:00:00Z',
      description: 'Sequoia Capital led a $45M Series B round in TechVision AI'
    }},
    { source: 'investor_2', target: 'company_1', type: 'invested_in', properties: { 
      eventType: 'series_b', amount: 45000000, timestamp: '2025-07-02T10:00:00Z',
      description: 'Andreessen Horowitz participated in TechVision AI\'s $45M Series B round'
    }},
    { source: 'investor_5', target: 'company_1', type: 'invested_in', properties: { 
      eventType: 'series_a', amount: 15000000, timestamp: '2024-02-15T10:00:00Z',
      description: 'Y Combinator led a $15M Series A round in TechVision AI'
    }},
    
    // GreenEnergy Solutions funding
    { source: 'investor_3', target: 'company_2', type: 'invested_in', properties: { 
      eventType: 'series_a', amount: 22000000, timestamp: '2025-07-01T14:30:00Z',
      description: 'Breakthrough Energy Ventures led a $22M Series A round in GreenEnergy Solutions'
    }},
    
    // FinSecure Platform funding
    { source: 'investor_4', target: 'company_3', type: 'invested_in', properties: { 
      eventType: 'series_a', amount: 18000000, timestamp: '2025-06-15T09:45:00Z',
      description: 'Accel Partners led an $18M Series A round in FinSecure Platform'
    }},
    
    // CloudSecure funding
    { source: 'investor_6', target: 'company_4', type: 'invested_in', properties: { 
      eventType: 'series_c', amount: 75000000, timestamp: '2024-11-20T11:15:00Z',
      description: 'SoftBank Vision Fund led a $75M Series C round in CloudSecure Inc'
    }},
    
    // HealthTech Solutions funding
    { source: 'investor_5', target: 'company_5', type: 'invested_in', properties: { 
      eventType: 'seed', amount: 4000000, timestamp: '2025-05-10T15:20:00Z',
      description: 'Y Combinator led a $4M Seed round in HealthTech Solutions'
    }},
    
    // DataSight Analytics funding
    { source: 'investor_1', target: 'company_6', type: 'invested_in', properties: { 
      eventType: 'series_b', amount: 35000000, timestamp: '2024-09-05T13:10:00Z',
      description: 'Sequoia Capital led a $35M Series B round in DataSight Analytics'
    }},
    
    // EcoTech Innovations funding
    { source: 'investor_3', target: 'company_7', type: 'invested_in', properties: { 
      eventType: 'seed', amount: 5000000, timestamp: '2025-04-22T10:30:00Z',
      description: 'Breakthrough Energy Ventures led a $5M Seed round in EcoTech Innovations'
    }}
  ];
  
  const acquisitionEdges: GraphEdge[] = [
    // TechVision Corp acquired DataSight Analytics
    { source: 'acquirer_1', target: 'company_6', type: 'acquired', properties: { 
      eventType: 'acquisition', amount: 980000000, timestamp: '2025-07-03T08:45:00Z',
      description: 'TechVision Corp acquired DataSight Analytics for $980M'
    }},
    
    // GreenFuture Holdings acquired EcoTech Innovations
    { source: 'acquirer_2', target: 'company_7', type: 'acquired', properties: { 
      eventType: 'acquisition', amount: 750000000, timestamp: '2025-06-28T09:30:00Z',
      description: 'GreenFuture Holdings acquired EcoTech Innovations for $750M'
    }},
    
    // Enterprise Solutions Group acquired CloudSecure Inc
    { source: 'acquirer_3', target: 'company_4', type: 'acquired', properties: { 
      eventType: 'acquisition', amount: 1200000000, timestamp: '2025-07-04T11:15:00Z',
      description: 'Enterprise Solutions Group acquired CloudSecure Inc for $1.2B'
    }}
  ];
  
  const industryEdges: GraphEdge[] = [
    { source: 'company_1', target: 'industry_1', type: 'belongs_to' },
    { source: 'company_2', target: 'industry_3', type: 'belongs_to' },
    { source: 'company_3', target: 'industry_2', type: 'belongs_to' },
    { source: 'company_4', target: 'industry_4', type: 'belongs_to' },
    { source: 'company_5', target: 'industry_5', type: 'belongs_to' },
    { source: 'company_6', target: 'industry_1', type: 'belongs_to' },
    { source: 'company_7', target: 'industry_3', type: 'belongs_to' },
    { source: 'company_8', target: 'industry_2', type: 'belongs_to' },
    { source: 'company_9', target: 'industry_6', type: 'belongs_to' },
    { source: 'company_10', target: 'industry_1', type: 'belongs_to' },
    { source: 'company_11', target: 'industry_3', type: 'belongs_to' },
    { source: 'company_12', target: 'industry_4', type: 'belongs_to' },
  ];
  
  return [...fundingEdges, ...acquisitionEdges, ...industryEdges];
}

export const mockGraphData = {
  nodes: generateMockNodes(),
  edges: generateMockEdges()
};