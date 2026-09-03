import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-sidebar-width right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg border-b border-outline-variant/30">
      <div className="flex items-center gap-space-md">
        <span className="font-mono text-[11px] px-space-xs py-1 rounded bg-surface-container-high text-on-primary-container tracking-wider uppercase font-semibold border border-outline-variant/40">
          RESTRICTED // LEA-BFSI INTERFACE
        </span>
      </div>

      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-space-xs">
          <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
          <span className="font-mono text-[11px] text-secondary font-medium uppercase tracking-wider">Sync: Real-Time Grid</span>
        </div>
        <div className="h-4 w-px bg-outline-variant"></div>
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">verified_user</span>
          <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Gov-Id: IPS-77490-W</span>
        </div>
      </div>
    </header>
  );
};
