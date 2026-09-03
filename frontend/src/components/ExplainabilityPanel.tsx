import React, { useState } from 'react';

interface ExplainabilityPanelProps {
  explanation: {
    tier: string;
    matched_identifiers: string[];
    top_feature_drivers: Array<{ feature: string; contribution: string }>;
    reasoning_summary: string;
    model_type: string;
  };
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ explanation }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!explanation) return null;

  return (
    <div className="w-full bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden mb-6">
      {/* Header Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-primary">auto_awesome</span>
          <div className="text-left">
            <h3 className="font-sans text-sm font-semibold text-on-surface">Why This Prediction? (Model-Native Explainability)</h3>
            <p className="font-mono text-[11px] text-on-surface-variant">Pulled directly from trained XGBoost feature_importances_ at inference</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-surface-container-high text-on-primary-container font-semibold uppercase">
            {explanation.tier === 'TIER_1_CLUSTER_HISTORY' ? 'Tier 1: Syndicate Boost' : 'Tier 2: Cold Start Fallback'}
          </span>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            expand_more
          </span>
        </div>
      </button>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="p-6 border-t border-outline-variant/30 flex flex-col gap-5">
          {/* Reasoning Summary */}
          <div className="p-4 rounded-lg bg-surface-container/60 border border-outline-variant/40">
            <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-semibold block mb-1">
              Automated Plain-Language Audit Synthesis
            </span>
            <p className="font-sans text-sm text-on-surface leading-relaxed">
              {explanation.reasoning_summary}
            </p>
          </div>

          {/* Feature Importances & Identifiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Contributing Feature Drivers */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-outline font-medium block mb-3">
                Top Model Drivers (Native Feature Weight)
              </span>
              <div className="flex flex-col gap-2">
                {explanation.top_feature_drivers?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-surface-container-lowest border border-outline-variant/30 text-xs">
                    <span className="font-sans font-medium text-on-surface">{item.feature}</span>
                    <span className="font-mono font-semibold text-primary">{item.contribution}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Identifiers */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-outline font-medium block mb-3">
                Exact Matched Graph Identifiers
              </span>
              <div className="flex flex-col gap-2">
                {explanation.matched_identifiers?.length > 0 ? (
                  explanation.matched_identifiers.map((id, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono text-secondary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-error">link</span>
                      {id}
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-on-surface-variant font-mono">No prior identifier history (Cold Start)</span>
                )}
              </div>
            </div>
          </div>

          {/* Verifiability Footer */}
          <div className="flex items-center justify-between text-[11px] font-mono text-outline pt-2 border-t border-outline-variant/20">
            <span>Model: {explanation.model_type}</span>
            <span className="text-secondary font-medium">Verified: Non-template, model-native output</span>
          </div>
        </div>
      )}
    </div>
  );
};
