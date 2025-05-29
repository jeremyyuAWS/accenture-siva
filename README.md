````markdown
# Insight Sentinel – Personalized CVC Deal Monitoring Agent  
**Tagline**: *Your AI-powered pulse on funding and M&A events that matter to you.*

---

## 🧭 Overview

**Insight Sentinel** is a multi-agent platform that enables Corporate Venture Capital (CVC) professionals to define strategic focus areas (industries, geographies, companies, and event types), visualize real-time market activity through an interactive knowledge graph, and interact with an intelligent agent assistant to generate personalized, actionable insights. The app is derived from the M&A Agent framework and is structured around three main tabs.

---

## 🧱 Application Structure & Tabs

### 🟦 1. Home – Define Your Focus Area

#### 📌 Purpose
Onboard users by guiding them to define their CVC interests. This data drives personalization for the entire platform: graph views, agent summaries, and reports.

#### 🔹 Layout & Flow
- **Sidebar Navigation**
  - Home, Knowledge Graph, Agent Hub
- **Main Panel**
  - Hero Headline: "Focus Your Lens on the Deals That Matter"
  - Subheadline: "Tell us what you're looking for—we’ll track it for you."
  - CTA Button: “Start Now” → opens stepper interface

#### 🔄 Stepper UI (FocusAreaWizard.tsx)
1. **Industry Selection (`IndustrySelector.tsx`)**
   - Multi-select tag UI (e.g., AI, Fintech, ClimateTech)
   - Option to type and add custom sectors
2. **Geography Selection (`GeoSelector.tsx`)**
   - Region dropdown (e.g., North America, APAC)
   - Optional country-level autocomplete
3. **Company Watchlist (`CompanyWatchlistInput.tsx`)**
   - Autocomplete search
   - Chip/tag UI to add/remove companies
   - Optional suggestions based on selected industries
4. **Event Type Selection (`EventTypeSelector.tsx`)**
   - Multi-select checkboxes (Seed, Series A/B, M&A, IPOs, SPACs)
5. **Summary + Submit**
   - Compact display of selected preferences
   - "Save & Track" button writes to:
     - `userPreferences.json`
     - `watchlist.json`

---

### 🟨 2. Knowledge Graph Reasoning

#### 📌 Purpose
Visual exploration of real-time M&A and funding activity contextualized to the user’s focus. Enables discovery, trend recognition, and intelligent interaction via assistant.

#### 🔹 Layout
- **Two-Panel Grid (`grid-cols-2`)**

##### 🔹 Left Panel: Interactive Graph
- `CompanyGraph.tsx` (D3.js)
  - Node types: startups, investors, acquirers, sectors
  - Edge types: funded_by, acquired_by, related_to
  - On click: emits metadata to `NodeInfoPanel.tsx`
- `GraphSearchInput.tsx` to add new companies/sectors

##### 🔸 Right Panel: Agent Assistant
- `AgentAssistant.tsx`
  - Title: *Ask Insight Sentinel*
  - `AgentPromptButtons.tsx`: clickable, predefined questions
  - `AgentChat.tsx`: chat-style interface with:
    - Summaries
    - Visualizations (`InsightVisualization.tsx`)
    - Dynamic follow-up based on graph node click

#### 🧠 Context Handling
- Clicked nodes populate the assistant prompt:  
  “Tell me more about [Company X]”  
  “Show funding history for [Startup Y]”

---

### 🟩 3. Agent Hub

#### 📌 Purpose
Configure and run agents that power the app’s intelligence layer.

#### 🔹 Layout
- Grid layout of agent cards (`grid-cols-3`)
- Each card routes to a modal or subcomponent for configuration

#### 🔧 Agent Types
1. **Founder Interviewer** *(placeholder)*
2. **Website Scraper**
   - Ingests data from Crunchbase, SEC, TechCrunch, etc.
3. **Report Builder** *(core agent)*

##### Report Builder Functionality
- `ReportSettingsModal.tsx`
  - Choose report format: bullet, paragraph, chart
  - Choose frequency: daily, weekly, monthly
  - Select delivery method: in-app, email
- `ReportPreview.tsx`
  - Shows upcoming report preview
- `CompanyWatchlistInput.tsx`
  - Maintain/edit company tracking list

---

## 📁 File & Component Structure

```bash
/pages
  home.tsx
  knowledge.tsx
  agents.tsx

/components
  Sidebar.tsx
  HeroCTA.tsx
  FocusAreaWizard.tsx
  IndustrySelector.tsx
  GeoSelector.tsx
  CompanyWatchlistInput.tsx
  EventTypeSelector.tsx
  CompanyGraph.tsx
  NodeInfoPanel.tsx
  GraphSearchInput.tsx
  AgentAssistant.tsx
  AgentPromptButtons.tsx
  AgentChat.tsx
  InsightVisualization.tsx
  AgentCard.tsx
  ReportSettingsModal.tsx
  ReportPreview.tsx

/data
  watchlist.json
  userPreferences.json
  reportQueue.json
  eventFeed.json
  promptTemplates.json
````

---

## 🤖 Agent Logic Flow

### Report Builder Agent

```plaintext
User defines focus → 
Scraper ingests events from public sources → 
Report Builder filters based on focus →
Summary generated (bullet or paragraph) →
Rendered as preview or sent via email →
Feeds events to graph + assistant
```

### Assistant Agent

```plaintext
User clicks prompt or types →
Agent checks user focus context →
Fetches relevant events →
Returns summary + visualization →
Graph click feeds into dynamic prompt generation
```

---

## 💬 Predefined Prompt Examples

```json
[
  "What deals happened in my watchlist this week?",
  "Summarize Series A activity in ClimateTech",
  "Show a timeline of funding for [Company]",
  "Who’s acquiring AI startups?",
  "Top investors in North America last quarter?"
]
```

---

## ✅ Output Capabilities

* Conversational summary (markdown-rendered)
* Embedded visualizations:

  * Bar/Line/Pie charts
  * Timeline views
  * Graph snapshots
* Export to PDF (optional via `react-pdf` or `html2canvas`)
* Hyperlinked source references (e.g., Crunchbase, SEC)

---

## ⚙️ Developer Notes

* Use Tailwind `grid-cols-2` layout with responsive fallback
* Use D3.js for interactive graph
* Use global state/context to connect:

  * Graph clicks → assistant prompts
  * Focus area selections → agent filters
* Modularize assistant agent for extensibility
* Add toast alerts for saved preferences, report delivery
