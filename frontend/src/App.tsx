import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardHome } from './views/DashboardHome';
import { PriorityQueue } from './views/PriorityQueue';
import { CaseDetailView } from './views/CaseDetailView';
import { JurisdictionAlerts } from './views/JurisdictionAlerts';
import { BankLedgerCheck } from './views/BankLedgerCheck';
import { ImpactSummary } from './views/ImpactSummary';
import { CitizenPortal } from './views/CitizenPortal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isCitizenMode, setIsCitizenMode] = useState<boolean>(false);

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
  };

  const handleBackToQueue = () => {
    setSelectedCaseId(null);
  };

  if (isCitizenMode) {
    return <CitizenPortal />;
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCaseId(null);
        }}
        isCitizenMode={isCitizenMode}
        setIsCitizenMode={setIsCitizenMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-sidebar-width min-h-screen flex flex-col">
        <Header />

        <main className="pt-20 pb-12 flex-1">
          {selectedCaseId ? (
            <CaseDetailView complaintId={selectedCaseId} onBack={handleBackToQueue} />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardHome
                  onNavigateToQueue={() => setActiveTab('priority-queue')}
                  onSelectCase={handleSelectCase}
                />
              )}

              {activeTab === 'priority-queue' && (
                <PriorityQueue onSelectCase={handleSelectCase} />
              )}

              {activeTab === 'jurisdiction-alerts' && (
                <JurisdictionAlerts />
              )}

              {activeTab === 'bank-ledger-check' && (
                <BankLedgerCheck />
              )}

              {activeTab === 'impact-summary' && (
                <ImpactSummary />
              )}
            </>
          )}
        </main>

        {/* Footer Compliance Banner */}
        <footer className="px-space-xl py-space-md bg-surface-container-lowest border-t border-outline-variant/30 text-center font-mono text-[11px] text-outline">
          Project Setu • Predictive Cybercrime Withdrawal Intelligence Grid • Institutional Demonstration Version 1.0.0
        </footer>
      </div>
    </div>
  );
};

export default App;
