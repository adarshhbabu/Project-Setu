import React from 'react';

interface NetworkGraphProps {
  graphData: {
    nodes: Array<{ id: string; label: string; type: string; cluster_id?: string }>;
    edges: Array<{ source: string; target: string }>;
  };
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ graphData }) => {
  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  return (
    <div className="w-full bg-[#000412] rounded-xl p-6 border border-[#4e5e7f]/40 relative overflow-hidden shadow-inner min-h-[320px] flex flex-col justify-between">
      {/* Visual Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="font-mono text-xs text-[#c7d7fe] uppercase tracking-wider">Syndicate Correlation Engine (Exact Identifiers)</span>
        </div>
        <span className="font-mono text-[11px] text-[#7886a3] bg-[#0f1e36] px-2.5 py-1 rounded border border-[#4e5e7f]/30">
          {nodes.length} Nodes • {edges.length} Edges
        </span>
      </div>

      {/* Interactive Node Render */}
      <div className="my-6 relative flex flex-wrap items-center justify-center gap-6 p-4 z-10">
        {nodes.map((n, idx) => {
          const isComplaint = n.type === 'complaint';
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                isComplaint
                  ? 'bg-[#0f1e36] border-[#c7d7fe]/50 text-white shadow-md hover:scale-105'
                  : 'bg-[#1a2b49] border-[#d97706]/60 text-[#c7d7fe]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] mb-1 text-[#c7d7fe]">
                {isComplaint ? 'shield_alert' : n.id.startsWith('acct') ? 'account_balance' : 'phone_iphone'}
              </span>
              <span className="font-mono text-xs font-semibold tracking-wide">{n.label || n.id}</span>
              <span className="font-mono text-[10px] text-[#7886a3] uppercase mt-0.5">
                {isComplaint ? 'Ingested Complaint' : n.id.split(':')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend & Framing */}
      <div className="flex items-center justify-between text-xs text-[#7886a3] border-t border-[#4e5e7f]/30 pt-3 z-10 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#c7d7fe]"></span> Complaint Node</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#d97706]"></span> Exact Identifier (Account/Phone)</span>
        </div>
        <span>Strict Matching: Zero Generic Bank/IFSC False Positives</span>
      </div>
    </div>
  );
};
