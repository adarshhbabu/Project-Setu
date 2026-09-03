import React, { useState } from 'react';
import { checkLedgerFlag, flagLedgerIdentifier } from '../api/client';

export const BankLedgerCheck: React.FC = () => {
  const [queryInput, setQueryInput] = useState('9988777741');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loadingCheck, setLoadingCheck] = useState(false);

  const [flagId, setFlagId] = useState('');
  const [flagRef, setFlagRef] = useState('');
  const [flagBank, setFlagBank] = useState('AXIS_BANK_MUMBAI');
  const [flagResult, setFlagResult] = useState<any>(null);
  const [loadingFlag, setLoadingFlag] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput) return;
    setLoadingCheck(true);
    try {
      const res = await checkLedgerFlag(queryInput);
      setQueryResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCheck(false);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagId || !flagRef) return;
    setLoadingFlag(true);
    try {
      const res = await flagLedgerIdentifier({
        identifier: flagId,
        complaint_reference: flagRef,
        bank_id: flagBank
      });
      setFlagResult(res);
    } catch (err: any) {
      alert(err.message || "Failed to flag identifier. Mandatory complaint reference required.");
    } finally {
      setLoadingFlag(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-lg p-space-xl max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm">
        <div>
          <h1 className="font-sans text-xl font-bold text-on-surface tracking-tight">
            Inter-Bank Fraud Registry (HMAC-SHA256 Shared Ledger)
          </h1>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">
            Keyed HMAC hashing preserves bank privacy while allowing instant fraud flag checks across the financial network.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-xs font-semibold text-secondary bg-surface-container-high px-3 py-1.5 rounded border border-outline-variant/50">
            Zero-PII Exposure Protocol
          </span>
          <span className="font-mono text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ Section 65B Indian Evidence Act Certified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Left Box: Bank Flag Query Widget */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">search</span>
            <h2 className="font-sans text-sm font-bold text-on-surface">1. Query Ledger by Account or Phone</h2>
          </div>

          <form onSubmit={handleCheck} className="flex flex-col gap-3">
            <div>
              <label className="font-mono text-[11px] uppercase text-on-surface-variant block mb-1">
                Account Number / Phone / Hash:
              </label>
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="e.g. 9988777741 or +91-7000011122"
                className="w-full p-2.5 rounded bg-surface-container-low border border-outline-variant text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loadingCheck}
              className="py-2.5 rounded bg-primary text-white font-sans text-xs font-semibold hover:bg-primary-container transition-colors shadow"
            >
              {loadingCheck ? 'Hashing & Querying Ledger...' : 'Check Fraud Registry Status'}
            </button>
          </form>

          {queryResult && (
            <div className={`p-4 rounded-lg border text-xs font-mono flex flex-col gap-2 ${
              queryResult.flagged
                ? 'bg-error-container/30 border-error text-on-error-container'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>STATUS: {queryResult.flagged ? 'ACTIVE FRAUD FLAG DETECTED' : 'CLEAR (NO FLAGS)'}</span>
                <span>{queryResult.flagged ? 'FLAGGED' : 'CLEAR'}</span>
              </div>
              <p className="text-[11px]">HMAC Hash: <span className="break-all">{queryResult.query_hash}</span></p>
              {queryResult.complaint_reference && (
                <p className="text-[11px]">Mandatory Complaint Ref: <strong>{queryResult.complaint_reference}</strong></p>
              )}
              <p className="text-[10px] text-outline border-t border-outline-variant/30 pt-1 mt-1">
                {queryResult.note}
              </p>
            </div>
          )}
        </div>

        {/* Right Box: Flag Submission Form */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error">flag</span>
            <h2 className="font-sans text-sm font-bold text-on-surface">2. Log Fraud Flag (Consortium Write)</h2>
          </div>

          <form onSubmit={handleFlagSubmit} className="flex flex-col gap-3">
            <div>
              <label className="font-mono text-[11px] uppercase text-on-surface-variant block mb-1">
                Suspect Identifier (Account/Phone):
              </label>
              <input
                type="text"
                value={flagId}
                onChange={(e) => setFlagId(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full p-2.5 rounded bg-surface-container-low border border-outline-variant text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase text-on-surface-variant block mb-1">
                Mandatory Complaint Reference / FIR #:
              </label>
              <input
                type="text"
                value={flagRef}
                onChange={(e) => setFlagRef(e.target.value)}
                placeholder="e.g. CMP-10412 or FIR-2026-90"
                className="w-full p-2.5 rounded bg-surface-container-low border border-outline-variant text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loadingFlag}
              className="py-2.5 rounded bg-error text-white font-sans text-xs font-semibold hover:bg-red-700 transition-colors shadow"
            >
              {loadingFlag ? 'Hashing & Writing Entry...' : 'Write HMAC Flag to Consortium Ledger'}
            </button>
          </form>

          {flagResult && (
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant text-xs font-mono text-on-surface">
              <span className="font-bold text-emerald-700 block mb-1">Entry Logged Successfully!</span>
              <p className="text-[11px]">Hash: <span className="break-all">{flagResult.hash}</span></p>
              <p className="text-[11px]">Complaint Ref: {flagResult.complaint_reference}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
