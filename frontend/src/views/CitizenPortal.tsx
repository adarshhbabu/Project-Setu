import React, { useState } from 'react';
import { fetchCitizenStatus } from '../api/client';

export const CitizenPortal: React.FC = () => {
  const [complaintIdInput, setComplaintIdInput] = useState('CMP-10231');
  const [statusResult, setStatusResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintIdInput) return;
    setLoading(true);
    try {
      const res = await fetchCitizenStatus(complaintIdInput);
      setStatusResult(res);
    } catch (err) {
      alert("Complaint ID not found in citizen registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b172a] text-white p-6 md:p-12 font-sans flex flex-col items-center justify-start">
      {/* Citizen View Header Banner */}
      <div className="max-w-3xl w-full bg-[#162744] p-8 rounded-2xl border border-[#4e5e7f]/40 shadow-xl mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/20 text-[#fbbf24] text-xs font-mono mb-4 border border-[#d97706]/40">
          <span className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse"></span>
          CITIZEN VICTIM ASSISTANCE PORTAL
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Project Setu Complaint Status Lookup
        </h1>
        <p className="text-sm text-[#c7d7fe] max-w-xl mx-auto leading-relaxed">
          Transparent, reassuring status tracking for cyber fraud complaints. Check your recovery odds indicator without exposing sensitive police intelligence.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="max-w-xl w-full bg-[#162744] p-8 rounded-2xl border border-[#4e5e7f]/40 shadow-xl flex flex-col gap-6">
        <form onSubmit={handleLookup} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-xs text-[#c7d7fe] uppercase block mb-2 font-medium">
              Enter Your National Cyber Crime Complaint ID:
            </label>
            <input
              type="text"
              value={complaintIdInput}
              onChange={(e) => setComplaintIdInput(e.target.value)}
              placeholder="e.g. CMP-10231 or CMP-10412"
              className="w-full p-3.5 rounded-xl bg-[#0b172a] border border-[#4e5e7f]/50 text-sm font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#c7d7fe]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-sans text-sm font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">verified</span>
            {loading ? 'Checking Registry...' : 'Check Complaint Recovery Status'}
          </button>
        </form>

        {statusResult && (
          <div className="mt-4 p-6 rounded-xl bg-[#0b172a] border border-[#4e5e7f]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#4e5e7f]/30 pb-3">
              <span className="font-mono text-xs text-[#c7d7fe]">Complaint Ref: {statusResult.complaint_id}</span>
              <span className="px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                {statusResult.status}
              </span>
            </div>

            <div>
              <span className="font-mono text-xs text-gray-400 block uppercase mb-1">Estimated Recovery Odds Indicator</span>
              <div className="text-xl font-bold text-emerald-400">{statusResult.recovery_odds}</div>
            </div>

            <div className="p-4 rounded-lg bg-[#162744] text-xs text-[#c7d7fe] leading-relaxed">
              {statusResult.plain_language_status}
            </div>

            <div className="text-[11px] font-mono text-gray-500 border-t border-[#4e5e7f]/30 pt-3 italic">
              {statusResult.note}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
