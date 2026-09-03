import React, { useEffect, useState } from 'react';
import { fetchQueue, ingestComplaint } from '../api/client';

interface PriorityQueueProps {
  onSelectCase: (complaintId: string) => void;
}

export const PriorityQueue: React.FC<PriorityQueueProps> = ({ onSelectCase }) => {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchQueue();
      setQueue(data.queue || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleSimulateIntake = async () => {
    setIngesting(true);
    try {
      await ingestComplaint({
        victim_name: "Priya Sharma",
        victim_state: "Rajasthan",
        victim_district: "Jaipur",
        victim_pincode: "302001",
        fraud_type: "Digital Arrest Scam",
        amount: 125000.0,
        suspect_account: "9988777741",
        suspect_ifsc: "JHRK0009",
        suspect_bank: "Jharkhand Gramin Bank",
        suspect_phone: "+91-7000011122",
        suspect_device_id: "DEV-D82F94E4"
      });
      await loadQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-lg p-space-xl max-w-7xl mx-auto">
      {/* Top Header & Simulation Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm">
        <div>
          <h1 className="font-sans text-xl font-bold text-on-surface tracking-tight">
            Prioritized Cybercrime Queue (Dynamic Urgency Score)
          </h1>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">
            Cases ranked using weighted urgency, log-scaled rupee loss, and syndicate cluster size.
          </p>
        </div>

        <button
          onClick={handleSimulateIntake}
          disabled={ingesting}
          className="px-space-md py-2.5 rounded bg-primary hover:bg-primary-container text-white font-sans text-xs font-semibold shadow transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">add_alert</span>
          {ingesting ? 'Correlating Graph...' : 'Simulate Demo Intake (CMP-10412)'}
        </button>
      </div>

      {/* Queue List Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
        <div className="px-space-lg py-space-md border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <span className="font-mono text-xs font-semibold text-secondary uppercase tracking-wider">
            Active Ranked Queue ({queue.length} Total Complaints)
          </span>
          <span className="font-mono text-[11px] text-outline">
            Formula: 0.45(Urgency) + 0.35(Log10 Amount) + 0.20(Cluster Bonus)
          </span>
        </div>

        {loading ? (
          <div className="p-space-2xl text-center font-mono text-sm text-on-surface-variant">
            Loading real-time prioritized intelligence grid...
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {queue.map((item, idx) => {
              const priority = item.priority_score || 50;
              const isTop = idx === 0;
              return (
                <div
                  key={item.complaint_id}
                  onClick={() => onSelectCase(item.complaint_id)}
                  className={`p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md hover:bg-surface-container-low transition-colors cursor-pointer ${
                    isTop ? 'bg-error-container/20' : ''
                  }`}
                >
                  {/* Left Column: Complaint & Priority Badge */}
                  <div className="flex items-start gap-space-md">
                    <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      priority >= 75 ? 'bg-error text-white' : 'bg-primary-container text-white'
                    }`}>
                      <span>#{idx + 1}</span>
                      <span className="text-[10px] font-normal">{priority}</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-mono text-sm font-bold text-on-surface">{item.complaint_id}</span>
                        <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-primary-container">
                          {item.fraud_type}
                        </span>
                        {item.cluster_id && (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            {item.cluster_id} (Syndicate)
                          </span>
                        )}
                      </div>

                      <div className="font-sans text-xs text-on-surface-variant mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Victim: <strong>{item.victim_name}</strong> ({item.victim_district}, {item.victim_state})</span>
                        <span>•</span>
                        <span>Account: <strong className="font-mono">{item.suspect_account}</strong> ({item.suspect_bank})</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Prediction Metrics */}
                  <div className="flex items-center gap-space-xl shrink-0">
                    <div className="text-right">
                      <span className="font-mono text-[11px] text-on-surface-variant block uppercase">Loss Amount</span>
                      <span className="font-sans text-sm font-bold text-on-surface">₹{item.amount?.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-[11px] text-on-surface-variant block uppercase">Target Cash-Out Hub</span>
                      <span className="font-mono text-sm font-bold text-error">{item.predicted_district || 'Deoghar'}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-[11px] text-on-surface-variant block uppercase">Urgency Window</span>
                      <span className="font-mono text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        ~{item.urgency_minutes || 34} Mins
                      </span>
                    </div>

                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">chevron_right</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
