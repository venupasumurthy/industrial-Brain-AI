# Industrial Brain AI - Knowledge Intelligence Platform

Industrial Brain AI is an AI-powered Knowledge Intelligence platform designed for asset-intensive industries (e.g., manufacturing, energy, and heavy chemical plants). It solves the problem of knowledge fragmentation, unplanned operational downtime, and the "knowledge cliff" (retiring experienced workforce) by ingesting heterogeneous engineering, maintenance, safety, and compliance documents and fusing them into queryable, actionable intelligence.

---

## 🏗️ Technical Stack

The application is built using a modern, lightweight, high-performance web architecture:

- **Core Framework**: [Next.js](https://nextjs.org/) (App Router, Static Export configuration)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) / React
- **Styling Engine**: Tailored Vanilla CSS supporting a dynamic, interactive design system
  - **Slate Dark (SpaceX Command / Palantir style)**: Cyber-punk dark mode featuring high contrast, glowing indicators, telemetry telemetry, and glassmorphism.
  - **Enterprise Light**: Clean, standard light theme with a professional layout and optimized text contrast.
- **Typography**: [Geist Sans & Geist Mono](https://vercel.com/font) for precise, technical tabular rendering of logs, charts, and metrics.
- **Icons**: [FontAwesome 6.x](https://fontawesome.com/) (Solid & Brand icon systems)
- **Visual Engines**: Interactive HTML5 `<canvas>` for the dynamic Knowledge Graph rendering.

---

## 💡 Key Applications & Core Modules

The platform features eight interconnected intelligence modules accessible through the sidebar:

### 1. 📊 Executive Intelligence Dashboard
* **Purpose**: Single pane of glass for C-Suite executives to evaluate plant-wide status, operational risk, and compliance.
* **Key Components**:
  - Live KPI grid with dynamic sparkline charts.
  - Interactive **Asset × Category Risk Heatmap** mapping vibration, temp, pressure, and corrosion thresholds across equipment.
  - Integrated compliance summaries and prioritized AI-generated recommendations.

### 2. 📥 Universal Document Ingestion Engine
* **Purpose**: AI-driven file processor that accepts PDFs, scanned reports, P&ID drawings, spreadsheets, and email archives.
* **Key Components**:
  - Drag-and-drop workspace with real-time file upload status.
  - Background **OCR / CV parsing queue** displaying active extraction pipelines.
  - **Extracted Intelligence Entity Panel**: Categorizes metadata into Equipment IDs, process parameters (e.g., Vibration > 8.2mm/s), personnel records, dates, and regulatory standards.

### 3. 🕸️ Knowledge Graph Agent
* **Purpose**: Visualizes relationships between operational elements, helping engineers trace how SOPs, compliance certificates, incidents, and engineering tags link together.
* **Key Components**:
  - Interactive canvas rendering nodes (Assets, Components, Documents, and Incidents) and their edges.
  - Dynamic **Entity Details drawer** that slides in when a top entity (e.g., *Compressor C-101*) is selected.
  - Relationship filters and zoom-to-fit controls.

### 4. 💬 Expert Knowledge Copilot
* **Purpose**: RAG-powered conversational assistant that answers operational, engineering, and maintenance queries for field technicians on the spot.
* **Key Components**:
  - Interactive chat panel with pre-grounded contextual chips.
  - **Confidence Score gauge** indicating retrieval reliability.
  - **Source Citations pane** listing specific clauses in reference documents (e.g., *SOP-MNT-047 v2.1 Section 4.2*).

### 5. 🔧 Maintenance Intelligence & RCA Agent
* **Purpose**: Fuses work order logs and OEM manuals to predict failure timelines and recommend preventive actions.
* **Key Components**:
  - Real-time Health Ring indicators (e.g., *Pump P101 at 31% Health*).
  - Diagnostic **Root Cause Analysis (RCA) Tree** breaking failures down from symptoms to core triggers (e.g., *Lubrication Starvation -> Clogged Filter*).
  - Chronological timeline matching upcoming maintenance jobs with critical/warning/good tags.

### 6. 🛡️ Compliance & Quality Intelligence
* **Purpose**: Maps regulatory requirements (Factories Act, PESO, OISD, environmental norms) against physical plant states.
* **Key Components**:
  - Real-time compliance gauges for site audits.
  - Critical compliance gap alerts (e.g., highlighting missing reports or overdue fire tests).
  - "Audit Evidence Package Creator" that automatically aggregates compliance documents.

### 7. 💡 Lessons Learned Engine
* **Purpose**: Analyzes incident reports, near-misses, and external safety databases to identify systemic failure patterns.
* **Key Components**:
  - Categorized pattern logs (Incidents, Near-Misses, Audit findings).
  - Financial/Time impact calculators demonstrating mitigation statistics.

### 8. 🧠 Industrial Memory Intelligence Engine (IMIE)
* **Purpose**: Reconstructs expert operator knowledge (capturing undocumented operational history) and prevents the "knowledge cliff" associated with engineer retirement.
* **Key Components**:
  - **Memory Search Form**: "Has this happened before?" queries matching present issues with historical actions.
  - **Knowledge-Loss Risk Radar**: Highlights pending retirements, risk percentages, and undocumented procedures.
  - Match history containing specific maintenance hacks and savings calculations.

---

## 🏗️ System Architecture

The application is structured around a four-layer framework:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DELIVERY LAYER                                  │
│   Web Dashboard  ·  Mobile PWA  ·  Tablet (Offline)  ·  WhatsApp Alerts  │
└───────────────────┬────────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        AI REASONING AGENT LAYER                        │
│   RAG Copilot  ·  RCA Brain  ·  IMIE Memory  ·  Compliance Engine      │
└───────────────────┬────────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        INGESTION & GRAPH LAYER                         │
│   OCR / CV  ·  Named Entity Recognition  ·  Knowledge Graph (Neo4j)   │
└───────────────────┬────────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES CORPUS                             │
│   P&IDs / Drawings  ·  OEM Manuals  ·  Work Orders  ·  Email Archives  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Running the App Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Development Server
1. Clone the repository and navigate to the project directory:
   ```bash
   cd industrial-Brain-AI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:3000`.

### Production Build & Serve
To build the static application and run it locally on port `5173`:
1. Generate the static export:
   ```bash
   npx next build
   ```
2. Serve the static `out` directory:
   ```bash
   npx -y serve@latest out -l 5173
   ```
3. Open `http://localhost:5173` to experience the fully optimized build.
