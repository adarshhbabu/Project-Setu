import React, { useEffect, useState } from 'react';
import { fetchQueue, dispatchAlert } from '../api/client';

export const JurisdictionAlerts: React.FC = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<string>('CMP-10231');
  const [dispatchStatus, setDispatchStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueue().then(d => setQueue(d.queue || [])).catch(console.error);
  }, []);

  const handleTriggerAlert = async (cid: string) => {
    setLoading(true);
    try {
      const res = await dispatchAlert(cid);
      setDispatchStatus(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-lg p-space-xl max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm">
        <div>
          <h1 className="font-sans text-xl font-bold text-on-surface tracking-tight">
            Targeted Jurisdiction Alerts (SendGrid & Grid Integration)
          </h1>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">
            Routes alerts to 3 distinct jurisdictions per case (Victim location, suspect account branch location, predicted withdrawal hub).
          </p>
        </div>

        <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
          Threshold Gating Active (&ge; 60% Conf / &le; 120 Mins)
        </span>
      </div>

      {/* Case Selector & Dispatch Widget */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
          <label className="font-sans text-xs font-semibold text-on-surface">Select Case to Dispatch Grid Alert:</label>
          <select
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            className="p-2 rounded bg-surface-container-low border border-outline-variant text-xs font-mono text-on-surface max-w-xs w-full"
          >
            {queue.map(c => (
              <option key={c.complaint_id} value={c.complaint_id}>
                {c.complaint_id} - {c.fraud_type} (₹{c.amount?.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => handleTriggerAlert(selectedCase)}
          disabled={loading}
          className="w-full py-3 rounded bg-primary hover:bg-primary-container text-white font-sans text-xs font-semibold shadow transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">campaign</span>
          {loading ? 'Dispatching via Grid API...' : `Trigger Multi-Jurisdiction Alert for ${selectedCase}`}
        </button>
      </div>

      {/* Dispatch Output Results */}
      {dispatchStatus && (
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-on-surface">
              Dispatch Report for {dispatchStatus.complaint_id}
            </span>
            <span className={`font-mono text-xs px-2.5 py-0.5 rounded font-bold ${
              dispatchStatus.threshold_passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {dispatchStatus.threshold_passed ? 'THRESHOLD PASSED (PUSH ALERT)' : 'DASHBOARD QUEUE ONLY'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {dispatchStatus.dispatches?.map((d: any, idx: number) => (
              <div key={idx} className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-sans">
                <span className="font-mono text-[11px] text-secondary font-bold uppercase block mb-1">{d.role}</span>
                <h4 className="font-bold text-on-surface text-sm">{d.district}</h4>
                <p className="font-mono text-[11px] text-on-surface-variant mt-1">{d.recipient_email}</p>
                <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-mono">
                  <span>Status:</span>
                  <span className="font-bold text-primary">{d.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
