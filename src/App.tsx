import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ConvencaoRJView } from './components/ConvencaoRJView';
import { TodasPremiacoesView } from './components/TodasPremiacoesView';
import { RemuneracaoCrescimentoView } from './components/RemuneracaoCrescimentoView';
import { ComparadorMetasView } from './components/ComparadorMetasView';
import { ModalResumo } from './components/ModalResumo';
import { WelcomeModal } from './components/WelcomeModal';
import { LoginPresentationView } from './components/LoginPresentationView';
import { ComoUsarView } from './components/ComoUsarView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCampaignId, setSelectedCampaignId] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState<boolean>(false);
  const [helpReturnTab, setHelpReturnTab] = useState<string>('home');

  const handleSaveUserName = (name: string) => {
    const clean = name.trim().toUpperCase();
    setUserName(clean);
  };

  const handleOpenHelp = () => {
    setHelpReturnTab(activeTab === 'comoUsar' ? helpReturnTab : activeTab);
    setActiveTab('comoUsar');
  };

  const handleCloseHelp = () => {
    setActiveTab(helpReturnTab || 'home');
  };

  const handleLogout = () => {
    setUserName('');
    setActiveTab('home');
    setHelpReturnTab('home');
  };

  const handleClearAllData = () => {
    setUserName('');
    setActiveTab('home');
    setSelectedCampaignId(0);
    setHelpReturnTab('home');
  };

  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    tipo: 'convencaoRJ' | 'premiacoes' | 'crescimento' | 'geral';
    data: any;
  }>({
    isOpen: false,
    tipo: 'geral',
    data: null,
  });

  const handleOpenReport = (data: any, tipo: 'convencaoRJ' | 'premiacoes' | 'crescimento' | 'geral' = 'geral') => {
    setReportModal({
      isOpen: true,
      tipo,
      data,
    });
  };

  // Se o consultor ainda não informou o nome, exibe a página independente de apresentação
  if (!userName) {
    return (
      <LoginPresentationView
        onLogin={handleSaveUserName}
        savedName=""
        onClearData={handleClearAllData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-[#ff5e36] selection:text-white">
      {/* Header with Consultant Name and Logout option */}
      <Header
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        userName={userName}
        onEditName={() => setIsEditNameModalOpen(true)}
        onLogout={handleLogout}
        onClearData={handleClearAllData}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
        {activeTab === 'comoUsar' && (
          <ComoUsarView activeSection={helpReturnTab} onBack={handleCloseHelp} />
        )}

        {activeTab === 'home' && (
          <HomeView
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectCampaign={(id) => setSelectedCampaignId(id)}
            userName={userName}
            onEditName={() => setIsEditNameModalOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'convencaoRJ' && (
          <ConvencaoRJView
            initialCampanhaId={selectedCampaignId}
            onOpenReport={(data) => handleOpenReport(data, 'convencaoRJ')}
          />
        )}

        {activeTab === 'premiacoes' && (
          <TodasPremiacoesView
            selectedCampaignId={selectedCampaignId}
            onOpenReport={(data) => handleOpenReport(data, 'premiacoes')}
          />
        )}

        {activeTab === 'crescimento' && (
          <RemuneracaoCrescimentoView
            onOpenReport={(data) => handleOpenReport(data, 'crescimento')}
          />
        )}

        {activeTab === 'comparador' && (
          <ComparadorMetasView
            onSelectCampaign={(id) => setSelectedCampaignId(id)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenReport={(data) => handleOpenReport(data, 'geral')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-[#0b1c2d] border-t border-slate-800 text-slate-400 py-8 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-[#ff5e36] text-white font-extrabold flex items-center justify-center text-xs shadow">
              PR
            </div>
            <div>
              <div className="text-white font-bold text-sm">Planner de Metas • Gestão PR Negócios</div>
              <p className="text-slate-400 text-[11px]">Planejamento Estratégico Comercial</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <button
              onClick={handleClearAllData}
              title="Limpar todos os dados salvos antes de exportar o código ou reiniciar atendimento"
              className="hover:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Limpar Dados (Reset)
            </button>
            <span>•</span>
            <span>© 2026 PR Negócios Gestão Comercial</span>
          </div>
        </div>
      </footer>

      {/* Modal Report (Impressão e Exportação em PDF) */}
      <ModalResumo
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal(prev => ({ ...prev, isOpen: false }))}
        tipo={reportModal.tipo}
        data={reportModal.data}
        userName={userName}
      />

      {/* Modal para Alteração Rápida de Nome */}
      <WelcomeModal
        isOpen={isEditNameModalOpen}
        onClose={() => setIsEditNameModalOpen(false)}
        currentName={userName}
        onSaveName={handleSaveUserName}
      />
    </div>
  );
}
