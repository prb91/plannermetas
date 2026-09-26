import React from 'react';
import { Home, Info, Sparkles } from 'lucide-react';

interface CorporateHeaderProps {
  currentPage: 'home' | 'convencaoRJ' | 'premiacoes' | 'crescimento' | 'comparador';
  onNavigate: (page: 'home' | 'convencaoRJ' | 'premiacoes' | 'crescimento' | 'comparador') => void;
  onQuickProfile?: (perfil: 'iniciante' | 'intermediario' | 'top') => void;
}

export const CorporateHeader: React.FC<CorporateHeaderProps> = ({
  currentPage,
  onNavigate,
  onQuickProfile,
}) => {
  return (
    <header className="gradient-primary text-white sticky top-0 z-50 no-print shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Linha Superior: Logo, Identidade e Botão Voltar alinhado à direita */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo e Identidade */}
          <div
            className="flex items-center gap-3.5 sm:gap-4 cursor-pointer select-none"
            onClick={() => onNavigate('home')}
          >
            {/* Ícone gráfico em barras multicoloridas */}
            <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-md flex items-center justify-center p-2.5 shrink-0 group hover:border-amber-400/50 transition-colors">
              <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm" fill="none">
                <rect x="2" y="14" width="3.5" height="8" rx="1" fill="#ff6b35" />
                <rect x="7" y="10" width="3.5" height="12" rx="1" fill="#38bdf8" />
                <rect x="12" y="6" width="3.5" height="16" rx="1" fill="#10b981" />
                <rect x="17" y="2" width="3.5" height="20" rx="1" fill="#f59e0b" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white m-0 leading-tight">
                Planner de Metas
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm m-0 font-medium">
                B91 - Planejamento Estratégico
              </p>
            </div>
          </div>

          {/* Botões à Direita: Perfis Rápidos e Botão Laranja "Voltar" */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onQuickProfile && (
              <div className="hidden lg:flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/20 text-xs">
                <span className="text-gray-300 text-[11px] font-medium mr-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Perfis:
                </span>

                <button
                  onClick={() => onQuickProfile('iniciante')}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-all text-[11px] font-semibold"
                  title="Iniciante: 3 clientes/mês, TPV R$ 100k"
                >
                  Iniciante
                </button>

                <button
                  onClick={() => onQuickProfile('intermediario')}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-amber-200 transition-all text-[11px] font-semibold"
                  title="Intermediário: 6 clientes/mês, TPV R$ 450k"
                >
                  Intermediário
                </button>

                <button
                  onClick={() => onQuickProfile('top')}
                  className="px-2 py-1 rounded bg-[#ff6b35] hover:bg-[#ff7f50] text-white shadow-xs transition-all text-[11px] font-semibold"
                  title="Top Performer: 12 clientes/mês, TPV R$ 1.2M"
                >
                  Top Performer
                </button>
              </div>
            )}

            {currentPage !== 'home' ? (
              <button
                onClick={() => onNavigate('home')}
                className="btn-primary py-2 px-5 text-sm font-bold shadow-md hover:scale-105 active:scale-100 transition-all flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('comparador')}
                className="btn-primary py-2 px-4 text-xs font-semibold shadow-md flex items-center gap-1.5"
              >
                <span>Quadro Comparador →</span>
              </button>
            )}
          </div>
        </div>

        {/* Frase de Impacto Exata */}
        <p id="pageSubtitle" className="text-gray-200 text-xs sm:text-sm mt-3 mb-2.5 font-normal leading-relaxed">
          Projete e planeje seu crescimento para alcançar metas e realizar objetivos pessoais.
        </p>

        {/* Box Escuro com Ícone Informativo Azul, Alerta de Projeção Estratégica e Citação Bíblica */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded-md bg-sky-500/20 text-sky-400 shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-100 text-xs sm:text-sm leading-relaxed">
                <strong>Importante:</strong> Por se tratarem de projeções, os resultados reais podem variar. O planejamento serve como referência estratégica.
              </p>
              <p className="text-gray-300 text-xs italic leading-relaxed">
                &quot;Pois qual de vós, querendo edificar uma torre, não se assenta primeiro a fazer as contas dos gastos?&quot; — Lucas 14:28
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
