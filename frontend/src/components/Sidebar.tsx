import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCitizenMode: boolean;
  setIsCitizenMode: (mode: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCitizenMode,
  setIsCitizenMode
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'priority-queue', label: 'Priority Queue', icon: 'hourglass_top' },
    { id: 'jurisdiction-alerts', label: 'Jurisdiction Alerts', icon: 'flip_camera_ios' },
    { id: 'bank-ledger-check', label: 'Bank Ledger Check', icon: 'account_balance' },
    { id: 'impact-summary', label: 'Impact Summary', icon: 'insights' }
  ];

  if (isCitizenMode) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#1a2b49] text-white shadow-lg z-50 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#d97706] flex items-center justify-center font-bold text-white text-lg">
              S
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg text-white">SETU CITIZEN</h1>
              <p className="text-xs text-[#c7d7fe]">Victim Assistance Grid</p>
            </div>
          </div>

          <div className="bg-[#0f1e36] p-4 rounded-xl border border-[#4e5e7f]/40 mb-6">
            <p className="text-xs text-[#c7d7fe] leading-relaxed">
              Transparent, honest complaint tracking for affected citizens. Sensitive investigative data is securely protected.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCitizenMode(false)}
          className="w-full py-3 px-4 rounded-lg bg-[#0f1e36] hover:bg-[#000412] text-xs font-mono uppercase tracking-wider text-[#c7d7fe] hover:text-white border border-[#4e5e7f]/50 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          Switch to LEA Officer Portal
        </button>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar-width bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-lg flex items-center gap-space-sm bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-mono font-bold text-sm">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-headline-sm text-primary leading-tight tracking-tight">SETU PORTAL</span>
            <span className="font-mono text-[11px] text-on-surface-variant tracking-wider uppercase">LEA-BFSI Grid</span>
          </div>
        </div>

        {/* Operational Modules Navigation */}
        <div className="px-space-md pt-space-md">
          <div className="px-space-sm pb-space-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-outline font-medium">Operational Modules</span>
          </div>

          <nav className="flex flex-col gap-space-2xs">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-space-sm px-space-sm py-2.5 rounded transition-colors text-left font-sans text-sm ${
                    isActive
                      ? 'bg-primary-container text-white font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-body-md">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile & Portal Switcher */}
      <div className="p-space-md flex flex-col gap-space-sm bg-surface-container-low border-t border-outline-variant/30">
        <div className="px-space-sm py-space-xs rounded bg-surface-container-lowest shadow-[0_1px_3px_rgba(15,30,54,0.04)] flex items-center gap-space-xs">
          <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0 animate-pulse"></span>
          <span className="font-mono text-[11px] text-secondary truncate">Gov-Net Enclave • MH-04 • Active</span>
        </div>

        <div className="flex items-center gap-space-sm px-space-xs py-1">
          <div className="w-8 h-8 rounded-full bg-primary-container text-white font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-outline-variant">
            RS
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-xs font-semibold text-on-surface truncate">Insp. R. K. Sharma, IPS</span>
            <span className="font-mono text-[11px] text-on-surface-variant truncate">Cyber Fraud Cell</span>
          </div>
        </div>

        <button
          onClick={() => setIsCitizenMode(true)}
          className="mt-1 w-full py-2 px-3 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface text-[11px] font-mono tracking-wide border border-outline-variant transition-colors flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">person_pin</span>
          Open Citizen View
        </button>
      </div>
    </aside>
  );
};
