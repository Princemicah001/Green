# ECO-SHIELD SENTINEL NETWORK
### Climate & Critical Infrastructure Environmental Intelligence Platform

> **"Detect environmental stress before it becomes a crisis."**

Eco-Shield Sentinel Network is an enterprise climate and critical infrastructure intelligence platform designed for presentation to **Oracle, @iLabAfrica, climate organizations, infrastructure operators, and impact investors**.

The platform converges three critical data domains—**Climate/Satellite Telemetry**, **Infrastructure SCADA/BMS Feeds**, and **Decentralized Ground Community Observations**—into a unified real-time spatial intelligence plane to detect resource and thermal stress, simulate operational mitigation, and provide auditable environmental evidence for green finance.

---

## 1. Product Philosophy & Visual Language

Eco-Shield is designed as **mission-critical infrastructure software**, avoiding gaming tropes, neon visual noise, and generic AI dashboard templates.

* **Design Standard:** Palantir Foundry + Apple + Linear + Geospatial Intelligence
* **Enterprise Palette:**
  * Near Black: `#0B0D0F`
  * Graphite: `#15181B`
  * Surface: `#1B1F23`
  * Border: `#2A2F34`
  * Primary Text: `#F4F5F6`
  * Secondary Text: `#8B9299`
  * Muted Text: `#60676E`
* **Status Semantics:** Restrained Green (Healthy), Muted Amber (Watch), Muted Orange (Stressed), Restrained Red (Critical). Color communicates information, not decoration.
* **The Earth is the Hero:** A true 3D interactive Earth built with Three.js, equirectangular satellite textures, topological bump maps, Rayleigh atmosphere shader, and camera flight slerp animations.

---

## 2. Core Architecture

```text
CLIMATE / SATELLITE             INFRASTRUCTURE SCADA           COMMUNITY OBSERVATIONS
(ERA5 / Sentinel-2/3 / NOAA)    (Data Centers / Grid / Water)   (Zero-PII Ground Telemetry)
             │                                │                             │
             └────────────────────────────────┼─────────────────────────────┘
                                              ▼
                             DATA INGESTION & NORMALIZATION
                                              │
                                              ▼
                              MULTI-VARIATE ANOMALY DETECTION
                                              │
                                              ▼
                                 ENVIRONMENTAL STRESS ENGINE
                     (Weighted Multi-Domain Aggregation: 0 - 100 Index)
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
         DIGITAL TWIN & TRENDS          ALERT ENGINE           MITIGATION SIMULATOR
         (90-Day Trajectory)            (Thresholds)           (Closed-Loop & Shedding)
                    │                         │                         │
                    └─────────────────────────┼─────────────────────────┘
                                              ▼
                                   ECO-SHIELD REST API
                                              ▼
                             SENTINEL COMMAND WORKSPACE
```

---

## 3. Mathematical Stress Formulation

The **Environmental Stress Engine** aggregates cross-domain stress signals using a configurable deterministic weighted model:

$$\text{Overall Stress} = \sum (w_i \cdot S_i)$$

Where:
* $w_{\text{heat}} = 0.30$ (Surface Temperature & Urban Heat Island Anomaly)
* $w_{\text{water}} = 0.30$ (Aquifer Depletion & Municipal Feed Pressure Deficit)
* $w_{\text{community}} = 0.20$ (Verified Ground Telemetry Cluster Weight)
* $w_{\text{energy}} = 0.15$ (Grid Stability & Power Demand)
* $w_{\text{climate}} = 0.05$ (10-Year Precipitation Anomaly)

### Operational Status Boundaries
* $\ge 75$: **CRITICAL** (Active alerts generated, mitigation protocol recommended)
* $\ge 60$: **STRESSED** (Regional water/heat monitoring elevated)
* $\ge 40$: **WATCH** (Baseline deviation logged)
* $< 40$: **HEALTHY** (Within historical equilibrium)

---

## 4. Key Platform Features

### 4.1 The 3D Sentinel Globe
* Real 3D interactive Earth running at 60fps on Three.js WebGL.
* Layer toggles: Climate Stress, Facilities (`◎`), and Community Signals.
* Interactive raycasting with smooth camera flight to selected regions (Nairobi, Kisumu, Mombasa, Lodwar/Turkana, Garissa, Frankfurt, Ashburn, Singapore).
* Custom Rayleigh atmospheric haze shader and procedural pulse on critical locations.

### 4.2 Environmental Digital Twin
* Real-time location profile with 90-day trajectory chart and baseline comparison (baseline target: 48).
* Compact telemetry rows: Surface Temperature, Rainfall Deficit, Water Stress Index, Cooling Demand Delta, and Verified Observations.

### 4.3 Mitigation Engine & Simulation
* Mathematical simulation of data center workload rebalancing:
  * Non-critical batch workload throttling (-15%)
  * Job rerouting to renewable geothermal nodes (Olkaria Geothermal Computing Facility)
  * Transition to closed-circuit evaporative cooling economizers
* Live Before vs After telemetry verification:
  * Water Consumption: $1.20 \to 0.98\text{ ML/day } (-18\%)$
  * Energy Draw: $4.8 \to 4.3\text{ MW } (-10\%)$
  * Regional Stress: $82 \to 69\text{ } (-13\text{ points})$

### 4.4 Community Observation Network (Zero-PII)
* Privacy-first architecture: Contributor phone numbers, emails, names, and IP addresses are completely stripped before ingestion.
* Geographic coordinates are quantized (~1.2km spatial fuzzing) to protect privacy while preserving cluster validity.
* Workflow: **Received $\to$ Validated $\to$ Cross-referenced $\to$ Confidence Assigned**.

### 4.5 Environmental Time Machine
* Interactive temporal playback across historical observations (January Healthy $\to$ June Critical).
* Stepped timeline inspector synchronizing globe markers, digital twin scores, and infrastructure demand.

### 4.6 Multi-Variate Correlation Analytics
* Comparative analysis: Water vs Heat, Cooling vs Water Demand, Rainfall Deficit vs Community Submissions.
* Responsible scientific language adhering to statistical rigor: *"Observed relationship"*, *"Potential correlation"*, *"Environmental anomaly"*; never claiming single-source causality.

### 4.7 Green Finance Evidence Layer
* Empirical auditability layer for the **Climate Data, Awareness & Green Finance** hackathon track.
* Provides immutable evidence for:
  * Sustainability-Linked Infrastructure Loans (SLIL)
  * Water Resilience Bonds (WRB)
  * Parametric Heat-Index Contingent Credit
  * EU Green Bond Standard (EuGB) / TCFD / ISSB S2 Disclosures

---

## 5. End-to-End Guided Demonstration Scenario

Eco-Shield includes a 1-click **Scenario Controller** directly in the top header:

1. **Initial State:** Nairobi initialized in `STRESSED` status (Score: 68/100).
2. **Step 1 - Community Surge:** Multiple verified municipal water reports ingested. Community Signal climbs from $66 \to 74$.
3. **Step 2 - Heat Wave Anomaly:** Ambient temperature spikes to $32.8^\circ\text{C}$ (+1.4°C anomaly). Intelligence engine recalculates overall stress from $68 \to 78$ (**CRITICAL**). Alerts generated, facility cooling demand surges.
4. **Step 3 - Mitigation Simulation:** Click *"SIMULATE RESPONSE"*. Closed-circuit cooling and batch shedding reduce water consumption by $18\%$ and regional stress from $78 \to 65$.

---

## 6. REST API Reference

The platform includes production-ready API routes accessible under `/api/*`:

| Endpoint | Method | Description |
|---|---|---|
| `/api/locations` | `GET` | List all regional digital twins and stress assessments |
| `/api/locations/:id` | `GET` | Retrieve detailed telemetry and signals for a specific basin |
| `/api/environment` | `GET` | Synchronized ERA5 climate and Copernicus satellite observations |
| `/api/infrastructure` | `GET` | Connected data center SCADA and BMS telemetry |
| `/api/community` | `GET` | Query anonymized verified ground observations |
| `/api/community/report` | `POST` | Ingest ground telemetry (triggers automatic stress recalculation) |
| `/api/history/:id` | `GET` | Fetch 90-day time series and Time Machine replay steps |
| `/api/stress` | `POST` | Calculate multi-domain stress with custom weight configuration |
| `/api/alerts` | `GET` | Query active operational threshold alerts |
| `/api/mitigation/simulate` | `POST` | Simulate workload rebalancing and cooling optimization impact |

Interactive documentation and live execution console available in-app at `/app/api-docs`.

---

## 7. Installation & Running

### Prerequisites
* Node.js v18.0.0 or higher
* npm or yarn

### Quickstart

```bash
# Clone the repository and enter directory
cd Green

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
* **Landing Page:** `http://localhost:3000/`
* **Sentinel Workspace:** `http://localhost:3000/app`
* **Interactive 3D Globe:** `http://localhost:3000/app/globe`
* **Community Network:** `http://localhost:3000/app/community`
* **Infrastructure Facilities:** `http://localhost:3000/app/infrastructure`
* **Climate Intelligence:** `http://localhost:3000/app/climate`
* **Environmental Time Machine:** `http://localhost:3000/app/history`
* **Alert Feed:** `http://localhost:3000/app/alerts`
* **Green Finance:** `http://localhost:3000/app/finance`
* **API Documentation:** `http://localhost:3000/app/api-docs`

### Production Build

```bash
npm run build
npm start
```

---

## 8. Architectural Integrity

* **Zero Mock UI Artifacts:** Every displayed number originates from the reactive state repository or explicit simulation engines.
* **Deterministic Reactivity:** A community report submission cascades immediately to repository $\to$ location signals $\to$ stress recalculation $\to$ alert evaluation $\to$ 3D globe marker $\to$ digital twin.
* **Responsible AI & Science:** Clear separation between empirical observations and predictive simulation.

---

*Eco-Shield Sentinel Network — Enterprise Climate Intelligence for Critical Infrastructure.*
