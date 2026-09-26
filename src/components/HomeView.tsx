import React from 'react';
import { Edit2, LogOut } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onSelectCampaign: (id: number) => void;
  userName: string;
  onEditName: () => void;
  onLogout: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  userName,
  onEditName,
  onLogout,
}) => {
  return (
    <div className="py-8 space-y-6">
      {/* Boas-Vindas */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {userName && userName.trim() ? (
              <>
                Bem-vindo, <span className="text-[#ff5e36]">{userName.trim()}!</span>
              </>
            ) : (
              'Bem-vindo ao Planner de Metas'
            )}
          </h2>

          <div className="flex items-center gap-2">
            {onEditName && (
              <button
                onClick={onEditName}
                title="Alterar seu nome"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
              >
                <Edit2 className="w-3 h-3 text-slate-400" />
                <span>Alterar nome</span>
              </button>
            )}

            {onLogout && userName && (
              <button
                onClick={onLogout}
                title="Sair do sistema"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-rose-500 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span>Sair</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Selecione uma das opções abaixo para começar seu planejamento
        </p>
      </div>

      {/* Grid com os 4 Cards Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Convenção RJ */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7 flex flex-col justify-between hover:border-orange-300 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 flex items-center justify-start text-4xl">
              <span role="img" aria-label="Convenção RJ">🏖️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Convenção RJ</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Planeje seu crescimento com metas de premiação específicas para a convenção regional. Exportação em PDF disponível.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => onNavigate('convencaoRJ')}
              className="w-full py-3 px-4 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-[0.98] text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Calcular Meta</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 2: Todas as Premiações */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7 flex flex-col justify-between hover:border-orange-300 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 flex items-center justify-start text-4xl">
              <span role="img" aria-label="Todas as Premiações">🏆</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Todas as Premiações</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Projeção completa das 6 campanhas com cronograma personalizado e relatório executivo em PDF.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => onNavigate('premiacoes')}
              className="w-full py-3 px-4 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-[0.98] text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Projetar Premiações</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 3: Remuneração */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7 flex flex-col justify-between hover:border-orange-300 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M4 17l6-6 4 4 6-8" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Remuneração</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Projete a evolução mensal da sua renda (Comissão + TAC) com meta e relatório em PDF.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => onNavigate('crescimento')}
              className="w-full py-3 px-4 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-[0.98] text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Projetar Renda</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 4: Quadro Comparativo */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7 flex flex-col justify-between hover:border-slate-400 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <rect x="4" y="10" width="4" height="10" rx="1" fill="#ec4899" />
                <rect x="10" y="5" width="4" height="15" rx="1" fill="#3b82f6" />
                <rect x="16" y="8" width="4" height="12" rx="1" fill="#10b981" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Quadro Comparativo</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Compare o tempo de conquista de todas as metas simultaneamente e gere o relatório oficial consolidado.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => onNavigate('comparador')}
              className="w-full py-3 px-4 bg-[#0c1e30] hover:bg-slate-900 active:scale-[0.98] text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ver Comparativo</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
