import React from 'react';
import { Pencil, LogOut } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onSelectCampaign?: (id: number) => void;
  userName?: string;
  onEditName?: () => void;
  onLogout?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  userName,
  onEditName,
  onLogout,
}) => {
  return (
    <div className="py-6 sm:py-8 space-y-8 sm:space-y-10">
      {/* Top Welcome Title & Subtitle with personalized name */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {userName && userName.trim() ? (
              <>
                Bem-vindo, <span className="text-[#ff5e36]">{userName.trim()}</span>!
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
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-[#ff5e36] bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-lg transition-all cursor-pointer min-h-[32px]"
              >
                <Pencil className="w-3 h-3" />
                <span>{userName ? 'Alterar nome' : 'Informar nome'}</span>
              </button>
            )}
            {onLogout && userName && (
              <button
                onClick={onLogout}
                title="Sair do sistema"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all cursor-pointer min-h-[32px]"
              >
                <LogOut className="w-3 h-3 text-rose-500" />
                <span>Sair</span>
              </button>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-base text-slate-600 mt-1">
          Selecione uma das opções abaixo para começar seu planejamento
        </p>
      </div>

      {/* 4 Main Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Convenção RJ */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 flex items-center justify-start text-4xl">
              <span role="img" aria-label="Convenção RJ">🏖️</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Convenção RJ
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Planeje seu crescimento com metas de premiação específicas para a convenção regional. Exportação em PDF disponível.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <button
              onClick={() => onNavigate('convencaoRJ')}
              className="w-full py-3 px-4 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-[0.98] text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Calcular Meta</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 2: Todas as Premiações */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 flex items-center justify-start text-4xl">
              <span role="img" aria-label="Todas as Premiações">🏆</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Todas as Premiações
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Projeção completa das 6 campanhas com cronograma personalizado e relatório executivo em PDF.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <button
              onClick={() => onNavigate('premiacoes')}
              className="w-full py-3 px-4 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-[0.98] text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Projetar Premiações</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 3: Remuneração */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 p-2 flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
                <path d="M4 19h16" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 13h16" stroke="#e2e8f0" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />
                <path d="M4 7h16" stroke="#e2e8f0" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />
                <path d="M4 16l5-5 4 3 6-7" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Remuneração
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Projete a evolução mensal da sua renda (Comissão + TAC) com meta e relatório em PDF.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <button
              onClick={() => onNavigate('crescimento')}
              className="w-full py-3 px-4 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-[0.98] text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Projetar Renda</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 4: Quadro Comparativo & PDF */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs">
              <span className="text-2xl font-black">📊</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Quadro Comparativo
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Compare o tempo de conquista de todas as metas simultaneamente e gere o relatório oficial consolidado.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <button
              onClick={() => onNavigate('comparador')}
              className="w-full py-3 px-4 bg-[#0b1c2d] hover:bg-slate-900 active:scale-[0.98] text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
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
