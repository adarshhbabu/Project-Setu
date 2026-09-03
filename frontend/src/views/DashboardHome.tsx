import React, { useEffect, useState } from 'react';
import { fetchQueue, fetchImpactMetrics } from '../api/client';

interface DashboardHomeProps {
  onNavigateToQueue: () => void;
  onSelectCase: (complaintId: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onNavigateToQueue,
  onSelectCase
}) => {
  const [queue, setQueue] = useState<any[]>([]);
  const [impact, setImpact] = useState<any>(null);

  useEffect(() => {
    fetchQueue().then(data => setQueue(data.queue || [])).catch(console.error);
    fetchImpactMetrics().then(setImpact).catch(console.error);
  }, []);

  const highPriorityCases = queue.filter(c => (c.priority_score || 0) >= 75);
  const topCase = queue[0];

  return (
    <div className="flex flex-col gap-space-xl p-space-xl max-w-7xl mx-auto">
      {/* Salutation & Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm">
        <div>
          <span className="font-mono text-xs font-semibold text-secondary uppercase tracking-wider">
            Cyber Fraud Command Center • Western Zone Grid
          </span>
          <h1 className="font-sans text-2xl font-bold text-on-surface tracking-tight mt-1">
            Welcome, Inspector Rajesh K. Sharma
          </h1>
          <p className="font-sans text-sm text-on-surface-variant mt-1">
            Real-time proactive cybercrime withdrawal prediction & inter-agency routing grid.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onNavigateToQueue}
          className="px-space-lg py-3 rounded-lg bg-primary hover:bg-primary-container text-white font-sans text-sm font-semibold shadow-md transition-colors flex items-center gap-space-xs shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          View Priority Queue ({queue.length})
        </button>
      </div>

      {/* Hero Operational Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {/* Active High-Priority Counter */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-on-surface-variant font-medium uppercase tracking-wider">
              Active High-Priority Cases
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
          </div>
          <div className="my-4 flex items-baseline gap-space-xs">
            <span className="font-sans text-4xl font-extrabold text-error tracking-tight">
              {String(highPriorityCases.length).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs text-on-surface-variant">Cases &gt; 75 Priority Score</span>
          </div>
          <div className="text-xs text-on-surface-variant font-sans border-t border-outline-variant/30 pt-space-xs">
            Requires immediate debit restraint / lien request dispatch
          </div>
        </div>

        {/* Golden Hour Window */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-on-surface-variant font-medium uppercase tracking-wider">
              Golden Hour Intervention
            </span>
            <span className="material-symbols-outlined text-[20px] text-amber-600">timer</span>
          </div>
          <div className="my-4 flex items-baseline gap-space-xs">
            <span className="font-sans text-4xl font-extrabold text-on-surface tracking-tight">
              ~34 Mins
            </span>
            <span className="font-mono text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
              Syndicate Velocity Window
            </span>
          </div>
          <div className="text-xs text-on-surface-variant font-sans border-t border-outline-variant/30 pt-space-xs">
            Average lead time before cash-out at predicted ATM/Branch hub
          </div>
        </div>

        {/* Total Recoverable Amount */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-on-surface-variant font-medium uppercase tracking-wider">
              Flagged Recoverable Value
            </span>
            <span className="material-symbols-outlined text-[20px] text-emerald-600">payments</span>
          </div>
          <div className="my-4 flex items-baseline gap-space-xs">
            <span className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">
              {impact?.formatted_recoverable_amount || '₹1,47,50,000.00'}
            </span>
          </div>
          <div className="text-xs text-secondary font-mono border-t border-outline-variant/30 pt-space-xs">
            {impact?.mandatory_label || 'Simulated data, calibrated to public NCRB/RBI figures'}
          </div>
        </div>
      </div>

      {/* Highest Priority Active Case Focus Card */}
      {topCase && (
        <div className="bg-surface-container-low p-space-lg rounded-xl border border-outline-variant/50 shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="px-space-xs py-1 rounded bg-error text-white font-mono text-xs font-bold uppercase tracking-wider">
                URGENT // TOP CASE
              </span>
              <span className="font-mono text-xs font-semibold text-on-surface">
                {topCase.complaint_id} • {topCase.fraud_type}
              </span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">
              Priority Score: <strong className="text-error">{topCase.priority_score}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md bg-surface-container-lowest p-space-md rounded-lg border border-outline-variant/30 text-xs font-sans">
            <div>
              <span className="text-on-surface-variant font-mono block">Victim Location</span>
              <span className="font-semibold text-on-surface">{topCase.victim_district}, {topCase.victim_state}</span>
            </div>
            <div>
              <span className="text-on-surface-variant font-mono block">Loss Amount</span>
              <span className="font-semibold text-on-surface">₹{topCase.amount?.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-on-surface-variant font-mono block">Predicted Cash-Out Hub</span>
              <span className="font-semibold text-error font-mono">{topCase.predicted_district || 'Deoghar'}</span>
            </div>
            <div>
              <span className="text-on-surface-variant font-mono block">Urgency Window</span>
              <span className="font-semibold text-amber-700 font-mono">~{topCase.urgency_minutes || 34} minutes remaining</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-[11px] text-on-surface-variant">
              Cluster: {topCase.cluster_id || 'Syndicate #47'} • Shared identifiers linked across 3 state jurisdictions
            </span>
            <button
              onClick={() => onSelectCase(topCase.complaint_id)}
              className="px-space-md py-2 rounded bg-primary text-white font-sans text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-1"
            >
              Inspect Case Detail &amp; Map
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
