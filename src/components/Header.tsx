import React from 'react';
import {
  User,
  Edit2,
  RotateCcw,
  LogOut,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  userName: string;
  onEditName: () => void;
  onLogout: () => void;
  onClearData: () => void;
  onOpenHelp: () => void;
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  userName,
  onEditName,
  onLogout,
  onClearData,
  onOpenHelp,
  onBack,
}) => {
  return (
    <header className="bg-[#071524] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-6">
        {/* Top bar: Logo + Branding + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Logo e Nome */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="Ir para o início"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ff5e36] group-hover:scale-105 text-white flex items-center justify-center shadow-xs shrink-0 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" stroke="none">
                <rect x="3" y="12" width="4" height="9" rx="1" />
                <rect x="10" y="7" width="4" height="14" rx="1" />
                <rect x="17" y="3" width="4" height="18" rx="1" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-none">
                  Planner de Metas
                </h1>
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#341b18] text-[#ff8059] border border-[#ff5e36]/40 px-2 py-0.5 rounded-full shrink-0">
                  OFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-1">
                Planejamento Estratégico Comercial
              </p>
            </div>
          </div>

          {/* Ações / Botões no Topo */}
          <div className="flex items-center gap-2 flex-wrap">
            {userName && (
              <>
                {/* Usuário */}
                <button
                  onClick={onEditName}
                  title="Alterar seu nome"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f2338] hover:bg-[#16314f] border border-slate-700/60 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="font-bold text-slate-200">{userName}</span>
                  <Edit2 className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {/* Limpar */}
                <button
                  onClick={onClearData}
                  title="Limpar todos os dados salvos"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f2338] hover:bg-[#16314f] border border-slate-700/60 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>Limpar</span>
                </button>

                {/* Sair */}
                <button
                  onClick={onLogout}
                  title="Sair do sistema"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f2338] hover:bg-[#16314f] border border-slate-700/60 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>Sair</span>
                </button>
              </>
            )}

            {/* Como usar contextual */}
            <button
              onClick={onOpenHelp}
              title={`Ver manual explicativo de ${
                activeTab === 'convencaoRJ'
                  ? 'Convenção RJ'
                  : activeTab === 'premiacoes'
                  ? 'Todas as Premiações'
                  : activeTab === 'crescimento'
                  ? 'Remuneração e Crescimento'
                  : activeTab === 'comparador'
                  ? 'Quadro Comparativo'
                  : 'Visão Geral do Sistema'
              }`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f2338] hover:bg-[#16314f] border border-slate-700/60 text-slate-200 text-xs font-semibold transition-all cursor-pointer group"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#ff5e36] shrink-0 group-hover:scale-110 transition-transform" />
              <span>
                {activeTab === 'convencaoRJ'
                  ? 'Como usar • Convenção RJ'
                  : activeTab === 'premiacoes'
                  ? 'Como usar • Premiações'
                  : activeTab === 'crescimento'
                  ? 'Como usar • Remuneração'
                  : activeTab === 'comparador'
                  ? 'Como usar • Comparador'
                  : 'Como usar'}
              </span>
            </button>

            {/* Botão Voltar (aparece nas abas que não sejam Home) */}
            {activeTab !== 'home' && (
              <button
                onClick={onBack}
                title="Voltar ao início"
                className="px-5 py-1.5 bg-[#ff5e36] hover:bg-[#e84f29] text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center"
              >
                Voltar
              </button>
            )}
          </div>
        </div>

        {/* Subtítulo institucional */}
        <p className="text-sm text-slate-300 mt-3 font-normal">
          Projete seu crescimento e alcance seus objetivos com inteligência
        </p>

        {/* Box Informativo / Lucas 14:28 */}
        <div className="mt-3.5 bg-[#0b2138] border border-[#14375d] rounded-xl p-3.5 px-4 shadow-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-4 h-4 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
              i
            </span>
            <div className="space-y-1">
              <p className="text-xs text-slate-200 leading-snug">
                <strong className="text-white font-bold">Importante:</strong> Por se tratarem de projeções, os resultados reais podem variar. O planejamento serve como referência estratégica.
              </p>
              <p className="italic text-xs text-slate-400">
                &ldquo;Pois qual de vós, querendo edificar uma torre, não se assenta primeiro a fazer as contas dos gastos?&rdquo; &mdash; Lucas 14:28
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
