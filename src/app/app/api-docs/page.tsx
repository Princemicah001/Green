'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface EndpointDoc {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  exampleRequest?: object;
  exampleResponse: object;
}

const ENDPOINTS: EndpointDoc[] = [
  {
    method: 'GET',
    path: '/api/locations',
    description: 'List all active regional environmental monitoring digital twins.',
    exampleResponse: {
      status: 'success',
      count: 8,
      environmentMode: 'DEMO ENVIRONMENT',
      data: [
        {
          id: 'nairobi',
          name: 'Nairobi',
          country: 'Kenya',
          overallStress: 68,
          status: 'STRESSED',
          signals: { waterStress: 72, energyStress: 61, heatStress: 79 },
        },
      ],
    },
  },
  {
    method: 'GET',
    path: '/api/locations/nairobi',
    description: 'Retrieve detailed digital twin and multi-domain signal vectors for a specific location ID.',
    exampleResponse: {
      status: 'success',
      data: {
        id: 'nairobi',
        name: 'Nairobi',
        country: 'Kenya',
        overallStress: 68,
        status: 'STRESSED',
        assessment: {
          confidence: 93,
          primaryContributors: ['Heat Stress', 'Water Stress', 'Community Signal'],
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/api/environment?locationId=nairobi',
    description: 'Fetch synchronized regional ERA5 climate telemetry and Copernicus Sentinel satellite observations.',
    exampleResponse: {
      status: 'success',
      locationId: 'nairobi',
      telemetry: {
        climate: { surfaceTemperatureC: 31.4, precipitationDeficitPct: -18 },
        satellite: { ndviCurrent: 0.38, landSurfaceTempAnomalyC: 4.1 },
      },
    },
  },
  {
    method: 'GET',
    path: '/api/infrastructure',
    description: 'Query BMS and SCADA telemetry from connected cloud computing and edge facilities.',
    exampleResponse: {
      status: 'success',
      count: 5,
      data: [
        {
          id: 'fac-nbo-1',
          name: 'Nairobi Cloud Data Centre',
          computeLoadPct: 74,
          powerMW: 4.8,
          waterConsumptionMLDay: 1.2,
          pue: 1.22,
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/api/community/report',
    description: 'Ingest decentralized ground telemetry. Applies cryptographic anonymization and fuzzy coordinates.',
    exampleRequest: {
      locationId: 'nairobi',
      locationName: 'Nairobi',
      category: 'WATER',
      severity: 'HIGH',
      observation: 'Aquifer municipal feeder pressure dropped to near zero across commercial quadrant.',
    },
    exampleResponse: {
      status: 'success',
      message: 'Community observation verified, sanitized, and ingested into Sentinel Intelligence Engine.',
      report: {
        anonymousId: 'OBS-8492',
        verificationStatus: 'CROSS_REFERENCED',
        confidenceScore: 92,
      },
    },
  },
  {
    method: 'GET',
    path: '/api/alerts',
    description: 'Query real-time operational alerts triggered by cross-domain threshold breaches.',
    exampleResponse: {
      status: 'success',
      count: 5,
      data: [
        {
          id: 'alt-101',
          timeFormatted: '14:32',
          severity: 'CRITICAL',
          title: 'Nairobi water stress exceeded operational threshold',
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/api/mitigation/simulate',
    description: 'Simulate operational mitigation response (workload shedding and closed-loop cooling setpoint shifts).',
    exampleRequest: {
      facilityId: 'fac-nbo-1',
    },
    exampleResponse: {
      status: 'success',
      simulationNotice: 'SIMULATION ONLY: No physical infrastructure actuations dispatched without operational operator signing.',
      plan: {
        waterSavingsPct: 18,
        stressReductionPoints: 13,
        before: { waterConsumptionMLDay: 1.2, overallStress: 82 },
        after: { waterConsumptionMLDay: 0.98, overallStress: 69 },
      },
    },
  },
];

export default function ApiDocsPage() {
  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [liveResult, setLiveResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const endpoint = ENDPOINTS[activeEndpointIndex];

  const handleTestLive = async () => {
    setIsLoading(true);
    setLiveResult(null);
    try {
      if (endpoint.method === 'GET') {
        const res = await fetch(endpoint.path);
        const data = await res.json();
        setLiveResult(JSON.stringify(data, null, 2));
      } else {
        const res = await fetch(endpoint.path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(endpoint.exampleRequest),
        });
        const data = await res.json();
        setLiveResult(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setLiveResult(JSON.stringify({ error: 'Failed to fetch local endpoint', detail: String(err) }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-eco-750 pb-5">
        <div className="text-xs font-mono uppercase tracking-widest text-eco-400 font-bold">
          Developer Platform & REST Specifications
        </div>
        <h1 className="text-2xl font-bold text-eco-50 tracking-tight mt-1">
          Eco-Shield Sentinel API
        </h1>
        <p className="text-sm text-eco-300 font-sans mt-1">
          Programmatic access to environmental digital twins, climate ingestion streams, and mitigation simulators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 font-mono text-sm">
        {/* Endpoint Selector Navigation */}
        <div className="lg:col-span-4 bg-eco-900 border border-eco-700 rounded overflow-hidden">
          <div className="p-4 border-b border-eco-750 text-xs text-eco-400 uppercase tracking-wider font-bold">
            Endpoints ({ENDPOINTS.length})
          </div>
          <div className="divide-y divide-eco-800">
            {ENDPOINTS.map((ep, idx) => {
              const isSelected = idx === activeEndpointIndex;
              return (
                <button
                  key={ep.path}
                  onClick={() => {
                    setActiveEndpointIndex(idx);
                    setLiveResult(null);
                  }}
                  className={`w-full text-left p-3.5 flex flex-col gap-1.5 transition-colors ${
                    isSelected ? 'bg-eco-800 text-eco-50' : 'hover:bg-eco-850/60 text-eco-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      ep.method === 'GET' ? 'bg-eco-750 text-status-healthy' : 'bg-eco-750 text-status-watch'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-bold text-eco-50 text-sm truncate">{ep.path}</span>
                  </div>
                  <div className="text-xs text-eco-400 font-sans truncate">{ep.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Endpoint Inspector & Live Test Console */}
        <div className="lg:col-span-8 bg-eco-900 border border-eco-700 rounded p-6 space-y-5">
          <div className="flex items-start justify-between border-b border-eco-750 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                  endpoint.method === 'GET' ? 'bg-eco-800 text-status-healthy' : 'bg-eco-800 text-status-watch'
                }`}>
                  {endpoint.method}
                </span>
                <span className="text-base font-bold text-eco-50">{endpoint.path}</span>
              </div>
              <p className="text-sm text-eco-300 font-sans mt-1.5">{endpoint.description}</p>
            </div>

            <button
              onClick={handleTestLive}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-eco-50 hover:bg-eco-200 text-eco-950 font-bold rounded text-xs md:text-sm transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isLoading ? 'Executing...' : 'Execute Live API'}</span>
            </button>
          </div>

          {/* Example Request if POST */}
          {endpoint.exampleRequest && (
            <div>
              <div className="text-xs uppercase text-eco-400 mb-1.5 font-bold">Request Payload (JSON)</div>
              <pre className="p-4 bg-eco-950 border border-eco-800 rounded text-eco-200 text-xs md:text-sm overflow-x-auto leading-relaxed">
                {JSON.stringify(endpoint.exampleRequest, null, 2)}
              </pre>
            </div>
          )}

          {/* Live Execution Result or Example Response */}
          <div>
            <div className="flex items-center justify-between text-xs uppercase text-eco-400 mb-1.5 font-bold">
              <span>{liveResult ? 'Live API Response (HTTP 200)' : 'Documented Response Schema'}</span>
              {liveResult && <span className="text-status-healthy font-bold">LIVE PAYLOAD</span>}
            </div>
            <pre className="p-4 bg-eco-950 border border-eco-800 rounded text-eco-200 text-xs md:text-sm overflow-x-auto max-h-[420px] leading-relaxed">
              {liveResult || JSON.stringify(endpoint.exampleResponse, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
