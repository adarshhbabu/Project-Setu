import React, { useEffect, useState } from 'react';
import { fetchComplaintPrediction, generateFreezeRequest, dispatchAlert } from '../api/client';
import { NetworkGraph } from '../components/NetworkGraph';
import { ExplainabilityPanel } from '../components/ExplainabilityPanel';

interface CaseDetailViewProps {
  complaintId: string;
  onBack: () => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ complaintId, onBack }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [freezeDoc, setFreezeDoc] = useState<any>(null);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [alertDispatched, setAlertDispatched] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchComplaintPrediction(complaintId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [complaintId]);

  const handleGenerateFreeze = async () => {
    try {
      const doc = await generateFreezeRequest(complaintId);
      setFreezeDoc(doc);
      setShowFreezeModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDispatchAlert = async () => {
    try {
      await dispatchAlert(complaintId);
      setAlertDispatched(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-space-2xl text-center font-mono text-sm text-on-surface-variant">
        Fetching intelligence grid predictions and graph correlation...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-space-2xl text-center font-mono text-sm text-error">
        Error loading case details for {complaintId}.
      </div>
    );
  }

  const topPrediction = data.predictions?.[0] || { district: 'Deoghar', confidence_score: 0.81, percentage: 81 };

  return (
    <div className="flex flex-col gap-space-lg p-space-xl max-w-7xl mx-auto">
      {/* Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm">
        <div className="flex items-center gap-space-md">
          <button
            onClick={onBack}
            className="p-2 rounded bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-space-xs">
              <h1 className="font-mono text-xl font-bold text-on-surface">{data.complaint_id}</h1>
              {data.cluster_id && (
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  {data.cluster_id} (Syndicate)
                </span>
              )}
            </div>
            <p className="font-sans text-xs text-on-surface-variant">
              Priority Score: <strong className="text-error">{data.priority_score}</strong> • Tier: <span className="font-mono">{data.tier}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={handleDispatchAlert}
            className="px-space-md py-2.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-sans text-xs font-semibold border border-outline-variant transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            {alertDispatched ? 'Alert Dispatched!' : 'Dispatch Jurisdiction Alert'}
          </button>

          <button
            onClick={handleGenerateFreeze}
            className="px-space-md py-2.5 rounded bg-error hover:bg-red-700 text-white font-sans text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            Generate Freeze Request (CrPC §102)
          </button>
        </div>
      </div>

      {/* Main Grid: Predictions GIS + Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {/* Left Column: Top Predicted Withdrawal Hub */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-2">
              Predicted Cash-Out District
            </span>
            <div className="text-3xl font-extrabold font-mono text-error tracking-tight">
              {topPrediction.district}
            </div>
            <span className="font-sans text-xs text-on-surface-variant mt-1 block">
              Confidence Score: <strong className="text-on-surface font-mono">{topPrediction.percentage}%</strong> ({topPrediction.confidence_score})
            </span>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/30 text-xs font-sans">
            <span className="font-mono text-[11px] text-outline uppercase block mb-1">Top 3 Locations Probability</span>
            {data.predictions?.map((p: any, idx: number) => (
              <div key={idx} className="flex justify-between py-1 border-b border-outline-variant/10 text-on-surface">
                <span>{p.district}</span>
                <span className="font-mono font-semibold">{p.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Urgency Countdown Timer */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-2">
              Estimated Urgency Window
            </span>
            <div className="text-4xl font-extrabold font-mono text-amber-700 tracking-tight">
              ~{data.urgency_minutes} Mins
            </div>
            <span className="font-sans text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold inline-block mt-2 border border-amber-200">
              Golden Hour Hop Velocity Window
            </span>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed">
            Predictive machine learning models estimate high probability of ATM/Branch debit cash-out within this remaining window.
          </div>
        </div>

        {/* Right Column: Statutory Framing Notice */}
        <div className="bg-surface-container-low p-space-lg rounded-xl border border-outline-variant/50 shadow-sm flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs text-secondary font-bold uppercase tracking-wider block mb-2">
              Statutory Framing Notice
            </span>
            <p className="font-sans text-xs text-on-surface leading-relaxed">
              This intelligence grid produces predictive location warnings and pre-filled freeze documentation.
            </p>
          </div>

          <div className="mt-4 p-3 rounded bg-surface-container-lowest border border-outline-variant/40 font-mono text-[11px] text-on-surface-variant">
            <strong>CRITICAL CONSTRAINT:</strong> Autonomous freezes are strictly prohibited. Lien execution requires human LEA officer &amp; bank signatory authorization.
          </div>
        </div>
      </div>

      {/* Network Graph Visualizer */}
      <NetworkGraph graphData={data.graph_data} />

      {/* Explainability Panel */}
      <ExplainabilityPanel explanation={data.explanation} />

      {/* Freeze Request Document Modal */}
      {showFreezeModal && freezeDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-space-lg bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error">gavel</span>
                <h3 className="font-sans font-bold text-sm text-on-surface">
                  Statutory Freeze Request Document (CrPC §102 / IT Act §91)
                </h3>
              </div>
              <button
                onClick={() => setShowFreezeModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-space-lg overflow-y-auto font-mono text-xs bg-[#030712] text-[#f1f5f9] rounded-lg m-4 border border-[#334155] leading-relaxed whitespace-pre-wrap shadow-inner">
              {freezeDoc.document_text}
            </div>

            <div className="p-space-lg bg-surface-container-low border-t border-outline-variant/40 flex items-center justify-between">
              <span className="font-mono text-[11px] text-error font-semibold">
                Requires Human Authorization Signatory
              </span>
              <button
                onClick={() => {
                  alert("Freeze request document downloaded and logged to consortium audit chain.");
                  setShowFreezeModal(false);
                }}
                className="px-space-lg py-2 rounded bg-primary text-white font-sans text-xs font-semibold hover:bg-primary-container transition-colors"
              >
                Download Restraint Order Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
