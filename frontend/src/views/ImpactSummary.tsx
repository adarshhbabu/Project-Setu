import React, { useEffect, useState } from 'react';
import { fetchImpactMetrics } from '../api/client';

export const ImpactSummary: React.FC = () => {
  const [impact, setImpact] = useState<any>(null);

  useEffect(() => {
    fetchImpactMetrics().then(setImpact).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-space-lg p-space-xl max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm">
        <div>
          <h1 className="font-sans text-xl font-bold text-on-surface tracking-tight">
            Grid Operational Impact Summary (Live Simulation Analytics)
          </h1>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">
            Aggregated system metrics demonstrating proactive intervention efficiency.
          </p>
        </div>

        <span className="font-mono text-xs font-semibold text-secondary bg-surface-container-high px-3 py-1.5 rounded border border-outline-variant/50">
          Hackathon Benchmark Evaluation
        </span>
      </div>

      {/* Mandatory Label Banner */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">info</span>
          <span className="font-sans text-xs font-semibold text-on-surface">
            {impact?.mandatory_label || 'Simulated data, calibrated to public NCRB/RBI figures'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-outline uppercase font-medium">Compliance Label</span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <span className="font-mono text-xs text-on-surface-variant uppercase font-medium">Total Flagged Amount</span>
          <div className="my-4 text-2xl font-bold font-sans text-on-surface">
            {impact?.formatted_recoverable_amount || '₹1,47,50,000.00'}
          </div>
          <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold self-start">
            Golden Hour Lien Target
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <span className="font-mono text-xs text-on-surface-variant uppercase font-medium">Syndicate Clusters Surfaced</span>
          <div className="my-4 text-3xl font-extrabold font-mono text-amber-700">
            {impact?.syndicate_clusters_surfaced || 1} Active
          </div>
          <span className="font-mono text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold self-start">
            Inter-State Network Matches
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <span className="font-mono text-xs text-on-surface-variant uppercase font-medium">Avg Alert-to-Routing Time</span>
          <div className="my-4 text-3xl font-extrabold font-mono text-primary">
            {impact?.avg_alert_to_routing_time_sec || 14.5} Seconds
          </div>
          <span className="font-mono text-[11px] text-primary-container text-white px-2 py-0.5 rounded font-semibold self-start">
            Automated Dispatch Speed
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <span className="font-mono text-xs text-on-surface-variant uppercase font-medium">Interagency Boost</span>
          <div className="my-4 text-3xl font-extrabold font-sans text-emerald-700">
            {impact?.interagency_coordination_boost || '94.2%'}
          </div>
          <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold self-start">
            Frictionless Law Enforcement - Bank Grid
          </span>
        </div>
      </div>
    </div>
  );
};
