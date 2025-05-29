import { FundingEvent } from '../../types';

/**
 * Service for generating AI-powered insights and responses
 * This is a mock service that would typically connect to an LLM API
 */
export class AiService {
  private focusAreas: any = null;
  private conversationContext: string[] = [];
  private maxContextLength: number = 10;

  constructor() {
    // In a real implementation, this would load user preferences
    this.focusAreas = this.getDefaultFocusAreas();
  }

  /**
   * Generate a response to a user query
   */
  async generateResponse(query: string, context?: any): Promise<string> {
    // Add query to conversation context
    this.addToContext(`User: ${query}`);
    
    // In a real implementation, this would call an LLM API
    // For this demo, we'll use predefined responses based on the query
    
    console.log('Generating AI response for:', query);
    console.log('Context:', context);
    
    let response = this.getResponseForQuery(query, context);
    
    // Add response to conversation context
    this.addToContext(`AI: ${response}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return response;
  }
  
  /**
   * Determine if a query requires visualization
   */
  requiresVisualization(query: string): string | null {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('show') || lowerQuery.includes('visualize') || lowerQuery.includes('graph')) {
      if (lowerQuery.includes('timeline')) return 'timeline';
      if (lowerQuery.includes('funding') || lowerQuery.includes('investment')) return 'funding';
      if (lowerQuery.includes('acquisition')) return 'acquisitions';
      if (lowerQuery.includes('distribution')) return 'overview';
      if (lowerQuery.includes('trend')) return 'timeline';
      if (lowerQuery.includes('compare')) return 'funding';
      return 'overview';
    }
    
    return null;
  }
  
  /**
   * Generate a data visualization based on a query
   */
  async generateVisualization(query: string, type: string): Promise<any> {
    // In a real implementation, this would generate the data for the visualization
    // For this demo, we'll return predefined data based on the type
    
    console.log('Generating visualization:', type, 'for query:', query);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return data based on visualization type
    switch(type) {
      case 'timeline':
        return {
          type: 'timeline',
          data: [
            { name: 'Jan', Funding: 125, Acquisitions: 5 },
            { name: 'Feb', Funding: 90, Acquisitions: 3 },
            { name: 'Mar', Funding: 150, Acquisitions: 7 },
            { name: 'Apr', Funding: 210, Acquisitions: 8 },
            { name: 'May', Funding: 180, Acquisitions: 6 },
            { name: 'Jun', Funding: 220, Acquisitions: 10 }
          ],
          title: 'Activity Timeline - Last 6 Months'
        };
      case 'funding':
        return {
          type: 'funding',
          data: [
            { name: 'AI/ML', value: 320 },
            { name: 'Fintech', value: 280 },
            { name: 'ClimateTech', value: 190 },
            { name: 'HealthTech', value: 230 },
            { name: 'Cybersecurity', value: 170 }
          ],
          title: 'Funding by Industry (Millions USD)'
        };
      case 'acquisitions':
        return {
          type: 'acquisitions',
          data: [
            { name: 'Big Tech', value: 45 },
            { name: 'Private Equity', value: 30 },
            { name: 'Industry Leaders', value: 25 },
            { name: 'Other', value: 15 }
          ],
          title: 'Acquisition Distribution by Acquirer Type'
        };
      case 'overview':
      default:
        return {
          type: 'overview',
          data: [
            { name: 'Seed', value: 35 },
            { name: 'Series A', value: 42 },
            { name: 'Series B', value: 28 },
            { name: 'Series C+', value: 15 },
            { name: 'Acquisition', value: 23 }
          ],
          title: 'Event Distribution in Your Focus Areas'
        };
    }
  }
  
  /**
   * Set user focus areas
   */
  setFocusAreas(focusAreas: any): void {
    this.focusAreas = focusAreas;
  }
  
  /**
   * Get user focus areas
   */
  getFocusAreas(): any {
    return this.focusAreas;
  }
  
  /**
   * Add a message to the conversation context
   */
  private addToContext(message: string): void {
    this.conversationContext.push(message);
    
    // Keep context to a reasonable size
    if (this.conversationContext.length > this.maxContextLength) {
      this.conversationContext.shift();
    }
  }
  
  /**
   * Get a predefined response based on the query
   */
  private getResponseForQuery(query: string, context?: any): string {
    const lowerQuery = query.toLowerCase();
    
    // If we have a node context, prioritize that
    if (context?.type === 'company') {
      return this.getCompanyNodeResponse(context, query);
    } else if (context?.type === 'investor') {
      return this.getInvestorNodeResponse(context, query);
    } else if (context?.type === 'industry') {
      return this.getIndustryNodeResponse(context, query);
    }
    
    // Handle common queries
    if (lowerQuery.includes('deal') && lowerQuery.includes('week')) {
      return "**This Week's Key Deals in Your Focus Areas**\n\nI've identified 7 significant deals in your focus areas this week:\n\n1. **TechVision AI** secured a $45M Series B led by Sequoia Capital (July 2)\n2. **GreenEnergy Solutions** raised $22M Series A from Breakthrough Energy Ventures (July 1)\n3. **DataSight Analytics** was acquired by TechVision Corp for $980M (July 3)\n4. **EcoTech Innovations** was acquired by GreenFuture Holdings for $750M (June 28)\n5. **CloudSecure Inc** was acquired by Enterprise Solutions Group for $1.2B (July 4)\n6. **FinSecure Platform** raised $18M Series A from Accel Partners (June 15)\n7. **HealthTech Solutions** secured $4M Seed funding from Y Combinator (May 10)\n\nWould you like more details on any of these deals?";
    }
    
    if (lowerQuery.includes('series a') && (lowerQuery.includes('climate') || lowerQuery.includes('clean'))) {
      return "**ClimateTech Series A Activity (Q2 2025)**\n\nThere have been 8 Series A rounds in ClimateTech this quarter, totaling $165M in funding. Key highlights:\n\n- **GreenEnergy Solutions** - $22M for energy storage technology\n- **CarbonCapture Technologies** - $25M for direct air capture solutions\n- **SustainAg Systems** - $18M for sustainable agriculture technology\n- **ClimateAnalytics Platform** - $24M for climate risk modeling\n- **GreenManufacture** - $19M for sustainable manufacturing processes\n\nThe average round size was $20.6M, with Breakthrough Energy Ventures participating in 4 deals. This represents a 34% increase in funding compared to Q1 2025, with particular growth in carbon capture and sustainable manufacturing technologies.";
    }
    
    if (lowerQuery.includes('timeline') && (lowerQuery.includes('funding') || lowerQuery.includes('investment'))) {
      return "**Funding Activity Timeline (Last 6 Months)**\n\nI've analyzed the funding activity in your focus areas over the past 6 months:\n\n- **January**: $125M across 18 deals (12 Seed, 4 Series A, 2 Series B)\n- **February**: $90M across 15 deals (10 Seed, 4 Series A, 1 Series B)\n- **March**: $150M across 22 deals (14 Seed, 6 Series A, 2 Series B)\n- **April**: $210M across 25 deals (15 Seed, 7 Series A, 3 Series B)\n- **May**: $180M across 20 deals (12 Seed, 5 Series A, 3 Series B)\n- **June**: $220M across 28 deals (16 Seed, 8 Series A, 4 Series B)\n\nNotable trends include a 76% increase in activity since January, with AI/ML companies capturing 42% of the total funding. The average deal size has increased by 15% over this period, with Series A rounds seeing the most growth in size.";
    }
    
    if (lowerQuery.includes('who') && lowerQuery.includes('acquiring') && (lowerQuery.includes('ai') || lowerQuery.includes('a.i.'))) {
      return "**AI/ML Acquisition Landscape (2025 YTD)**\n\nThere have been 28 acquisitions of AI/ML companies this year, with a total value of $12.4B. The main acquirers are:\n\n1. **Big Tech Companies** (45% of deals)\n   - TechVision Corp (5 acquisitions, $3.2B total)\n   - Enterprise Solutions Group (3 acquisitions, $2.1B total)\n   - GlobalSoft Inc (2 acquisitions, $980M total)\n\n2. **Private Equity Firms** (30% of deals)\n   - Thoma Bravo (4 acquisitions, $1.8B total)\n   - Vista Equity Partners (3 acquisitions, $1.2B total)\n\n3. **Industry Leaders** (25% of deals)\n   - Various enterprise companies acquiring AI capabilities\n\nThe primary focus areas are machine learning operations (MLOps), natural language processing, and computer vision technologies. The average acquisition price has increased 35% compared to 2024, reflecting the growing strategic value of AI capabilities.";
    }
    
    if (lowerQuery.includes('top investor') && (lowerQuery.includes('north america') || lowerQuery.includes('us') || lowerQuery.includes('u.s.'))) {
      return "**Top Investors in North America (Q2 2025)**\n\nBased on deal count in your focus industries during Q2 2025, the most active investors in North America are:\n\n1. **Andreessen Horowitz** - 14 investments\n   - Focus: AI/ML (8 deals), Fintech (4 deals), Cybersecurity (2 deals)\n   - Notable: Led TechVision AI's $45M Series B\n\n2. **Sequoia Capital** - 12 investments\n   - Focus: AI/ML (6 deals), Fintech (3 deals), Healthtech (3 deals)\n   - Notable: Participated in 3 deals over $50M\n\n3. **Y Combinator** - 11 investments\n   - Focus: AI/ML (5 deals), Fintech (3 deals), ClimateTech (3 deals)\n   - All at Seed stage with average check size of $3.8M\n\n4. **Accel Partners** - 9 investments\n   - Focus: Fintech (4 deals), AI/ML (3 deals), Cybersecurity (2 deals)\n   - Led FinSecure Platform's $18M Series A\n\n5. **Breakthrough Energy Ventures** - 8 investments\n   - Focus: ClimateTech (8 deals)\n   - Led GreenEnergy Solutions' $22M Series A\n\nWould you like more details on the investment strategies of any of these firms?";
    }
    
    // Default response if no pattern matches
    return "Based on your focus areas in AI/ML, FinTech, and ClimateTech, I've identified several notable trends in recent deal activity. There's been a significant increase in early-stage funding for AI companies specializing in financial applications and climate solutions. In your watchlist, three companies have secured new funding in the past month.\n\nWould you like me to provide a more specific analysis of a particular segment or show you a visualization of recent activity?";
  }
  
  /**
   * Get a response for a company node
   */
  private getCompanyNodeResponse(company: any, query: string): string {
    // Here we would generate a dynamic response based on the company node
    // For this demo, we'll use a template and fill in company details
    
    return `**${company.name} - Company Analysis**

Based on the latest data, ${company.name} is a ${company.properties?.fundingStage || 'growth-stage'} company in the ${company.properties?.industry || 'technology'} sector, based in ${company.properties?.region || 'North America'}.

**Recent Activity:**
- Raised a ${company.properties?.fundingStage || 'Series B'} funding round of approximately $45M
- Key investors include Sequoia Capital and Andreessen Horowitz
- Growing at an estimated 30-40% annually based on hiring patterns

**Market Position:**
- Strong competitive position in ${company.properties?.industry || 'technology'} with innovative IP
- Expanding customer base across enterprise segments
- Increasing market share in ${company.properties?.region || 'North America'}

**Strategic Relevance:**
This company aligns with your focus areas in ${company.properties?.industry || 'technology'} and could represent an interesting ${company.tier === 1 ? 'acquisition target' : 'company to monitor'} given its technology stack and market position.

Would you like more specific information about their technology, team, or competitive landscape?`;
  }
  
  /**
   * Get a response for an investor node
   */
  private getInvestorNodeResponse(investor: any, query: string): string {
    return `**${investor.name} - Investor Profile**

${investor.name} is a leading ${investor.properties?.investorType || 'venture capital firm'} based in ${investor.properties?.region || 'North America'}, with a strong focus on early and growth-stage investments.

**Investment Activity:**
- **Deal Count**: 45 investments in the past 12 months
- **Focus Areas**: ${investor.properties?.investorType === 'Accelerator' ? 'Early-stage' : 'Series A-C'} companies in AI/ML, FinTech, and Enterprise Software
- **Average Check Size**: ${investor.properties?.investorType === 'Accelerator' ? '$500K-2M' : '$10-25M'}

**Portfolio Highlights:**
- Led TechVision AI's $45M Series B round
- Participated in DataSight Analytics' $35M Series B before its acquisition
- Early investor in CloudSecure Inc (acquired for $1.2B)

**Investment Strategy:**
Known for taking an active role in portfolio companies, providing operational support, and leveraging a strong corporate network. Typically takes board seats in significant investments and has a strong track record of successful exits.

Would you like to see their recent investment activity or portfolio companies that match your focus areas?`;
  }
  
  /**
   * Get a response for an industry node
   */
  private getIndustryNodeResponse(industry: any, query: string): string {
    return `**${industry.name} Industry Analysis**

The ${industry.name} sector has shown significant activity in the past quarter with 43 funding events totaling $2.8B and 5 acquisitions valued at $4.1B.

**Key Trends:**
- Average Series A round size increased 28% year-over-year to $18.5M
- Growing focus on specialized applications within enterprise environments
- Increasing strategic acquisitions by both tech giants and traditional industry leaders

**Most Active Investors:**
1. Sequoia Capital (8 deals)
2. Andreessen Horowitz (6 deals)
3. Accel Partners (5 deals)

**Notable Recent Events:**
- TechVision AI's $45M Series B (July 2)
- DataSight Analytics acquisition for $980M (July 3)
- CloudSecure Inc acquisition for $1.2B (July 4)

**Market Outlook:**
The sector is expected to continue strong growth through 2025, with particular acceleration in specialized applications and vertical solutions. Valuations remain robust despite broader market fluctuations.

Would you like me to show you a visualization of funding trends in this sector or analyze specific companies within it?`;
  }
  
  /**
   * Get default focus areas
   */
  private getDefaultFocusAreas(): any {
    return {
      industries: ['AI/ML', 'Fintech', 'ClimateTech'],
      regions: ['North America', 'Europe'],
      companies: ['TechVision AI', 'CloudSecure Inc', 'GreenEnergy Solutions'],
      eventTypes: ['seed', 'series_a', 'series_b', 'series_c_plus', 'acquisition']
    };
  }
}

// Create singleton instance
export const aiService = new AiService();