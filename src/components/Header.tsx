import React from 'react';
import { User, Pencil, LogOut, RotateCcw, BarChart3, BookOpen, Home, Trophy, Gift, TrendingUp, Scale } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  userName?: string;
  onEditName?: () => void;
  onLogout?: () => void;
  onClearData?: () => void;
  onOpenHelp?: () => void;
  onBack?: () => void;
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
    <header className="bg-[#0b1c2d] border-b border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Top Row: Brand, Consultant Badge & Voltar Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#ff5e36] to-[#e04520] text-white flex items-center justify-center shadow-lg shadow-orange-500/20 font-black shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-none">
                    Planner de Metas
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-orange-500/20 text-[#ff5e36] border border-orange-500/30 px-2 py-0.5 rounded-full shrink-0">
                    Oficial
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1">
                  Planejamento Estratégico Comercial
                </p>
              </div>
            </div>

            {/* Mobile-only Como usar / Voltar buttons */}
            <button
              onClick={onOpenHelp}
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer min-h-[36px]"
              title="Aprenda a usar o sistema"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#ff5e36]" />
              Como usar
            </button>

            {activeTab !== 'home' && (
              <button
                onClick={onBack}
                className="sm:hidden px-3.5 py-2 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-95 text-white font-bold rounded-xl shadow-md text-xs cursor-pointer shrink-0 min-h-[36px]"
                title="Voltar ao início"
              >
                Voltar
              </button>
            )}
          </div>

          {/* Right side: Consultant Name & Sair button & Desktop Voltar button */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto flex-wrap">
            {userName && (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <button
                  onClick={onEditName}
                  title="Clique para editar seu nome"
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-200 text-xs font-medium transition-all group cursor-pointer min-h-[36px]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#ff5e36]/20 text-[#ff5e36] flex items-center justify-center shrink-0">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-white max-w-[100px] sm:max-w-[180px] truncate">{userName}</span>
                  <Pencil className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                </button>

                {onClearData && (
                  <button
                    onClick={onClearData}
                    title="Limpar todos os dados salvos no navegador e resetar o planner"
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-amber-950/40 border border-slate-700/70 hover:border-amber-600/40 text-slate-300 hover:text-amber-300 text-xs font-semibold transition-all cursor-pointer min-h-[36px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="hidden sm:inline">Limpar</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sair da conta do consultor"
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-rose-950/50 border border-slate-700/70 hover:border-rose-800/50 text-slate-300 hover:text-rose-200 text-xs font-semibold transition-all cursor-pointer min-h-[36px]"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                )}
              </div>
            )}

            <button
              onClick={onOpenHelp}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition-all cursor-pointer min-h-[40px]"
              title="Aprenda a usar o sistema"
            >
              <BookOpen className="w-4 h-4 text-[#ff5e36]" />
              Como usar
            </button>

            {/* Desktop Voltar button */}
            {activeTab !== 'home' && (
              <button
                onClick={onBack}
                className="hidden sm:inline-flex px-6 sm:px-7 py-2.5 sm:py-3 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all text-sm sm:text-base cursor-pointer shrink-0 min-h-[40px] items-center justify-center"
                title="Voltar ao início"
              >
                Voltar
              </button>
            )}
          </div>
        </div>

        {/* Subtitle Description matching screenshot */}
        <p className="text-xs sm:text-[15px] text-slate-300 mt-2.5 sm:mt-4 leading-relaxed font-normal">
          Projete seu crescimento e alcance seus objetivos com inteligência
        </p>

        {/* Informational Callout Box matching the model screenshot */}
        <div className="mt-3 sm:mt-4 p-3.5 sm:p-4.5 bg-[#142c44]/90 border border-slate-700/70 rounded-xl space-y-1.5 shadow-sm">
          <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 leading-snug">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-[#1d63ed] text-white text-[11px] font-black shrink-0 mt-0.5">
              i
            </span>
            <div>
              <strong className="text-white font-bold">Importante:</strong> Por se tratarem de projeções, os resultados reais podem variar. O planejamento serve como referência estratégica.
            </div>
          </div>
          
          <div className="italic text-xs sm:text-sm text-slate-300 pl-6 font-normal">
            &quot;Pois qual de vós, querendo edificar uma torre, não se assenta primeiro a fazer as contas dos gastos?&quot; — Lucas 14:28
          </div>
        </div>

        {/* Navegação principal por abas */}
        <nav className="mt-4 -mx-1 overflow-x-auto pb-1 no-scrollbar" aria-label="Navegação principal">
          <div className="flex min-w-max items-center gap-2 px-1">
            {[
              { id: 'home', label: 'Início', icon: Home },
              { id: 'convencaoRJ', label: 'Convenção RJ', icon: Trophy },
              { id: 'premiacoes', label: 'Todas as Premiações', icon: Gift },
              { id: 'crescimento', label: 'Remuneração e Crescimento', icon: TrendingUp },
              { id: 'comparador', label: 'Quadro Comparativo', icon: Scale },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#ff5e36] border-[#ff5e36] text-white shadow-md shadow-orange-600/20'
                      : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};
