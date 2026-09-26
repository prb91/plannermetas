import React from 'react';
import { ArrowRight, Award, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { CAMPANHAS_LISTA } from '../../types/canvaPlanner';
import { formatMoneyNum } from '../../utils/canvaCalculations';

interface HomePageProps {
  onSelectModule: (module: 'convencaoRJ' | 'premiacoes' | 'crescimento' | 'comparador') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectModule }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12">
      {/* Seção de Boas-Vindas */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bem-vindo ao Planner de Metas
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Selecione uma das ferramentas abaixo para começar seu planejamento estratégico
            </p>
          </div>

          <button
            onClick={() => onSelectModule('comparador')}
            className="btn-primary py-2 px-4 text-xs shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ver Quadro Comparador Geral</span>
          </button>
        </div>
      </div>

      {/* Grid com os 3 Cards Principais + Banner do Quadro Comparador */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Convenção RJ */}
        <div
          onClick={() => onSelectModule('convencaoRJ')}
          className="card-modern cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">🏖️</div>
              <ArrowRight className="text-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Convenção RJ
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Planeje seu crescimento com metas de premiação específicas para a convenção regional
            </p>
          </div>
          <button className="btn-primary w-full">
            Calcular Meta →
          </button>
        </div>

        {/* Card 2: Todas as Premiações */}
        <div
          onClick={() => onSelectModule('premiacoes')}
          className="card-modern cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">🏆</div>
              <ArrowRight className="text-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Todas as Premiações
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Projeção completa das campanhas disponíveis com cronograma personalizado
            </p>
          </div>
          <button className="btn-primary w-full">
            Projetar Premiações →
          </button>
        </div>

        {/* Card 3: Remuneração */}
        <div
          onClick={() => onSelectModule('crescimento')}
          className="card-modern cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">📈</div>
              <ArrowRight className="text-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Remuneração
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Projete a evolução mensal da sua renda com metas estratégicas
            </p>
          </div>
          <button className="btn-primary w-full">
            Projetar Renda →
          </button>
        </div>
      </div>

      {/* Regras Institucionais */}
      <div className="card-modern bg-slate-900 text-white border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <h3 className="text-lg font-bold text-white">
            Diretrizes Institucionais e Critérios de Elegibilidade
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 text-xs sm:text-sm text-gray-300">
          <div className="space-y-1">
            <strong className="text-white block font-semibold">1. TPV Mínimo Exigido</strong>
            <p className="text-gray-400">
              Cada faixa de premiação exige o volume mínimo integral de transação comercial.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-white block font-semibold">2. Recorrência Mínima de 0,32%</strong>
            <p className="text-gray-400">
              Caso a taxa seja menor, o consultor deve compensar no volume de TPV correspondente.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-white block font-semibold">3. Validação de 3 Meses Consecutivos</strong>
            <p className="text-gray-400">
              O TPV atingido e a recorrência média devem ser mantidos durante todo o período de validação.
            </p>
          </div>
        </div>
      </div>

      {/* Vitrine Visual dos 6 Prêmios Oficiais B91 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#ff6b35]" />
            <h3 className="text-xl font-bold text-gray-900">
              Vitrine Oficial das Campanhas de Premiação
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">
            Clique em qualquer prêmio para projetar
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAMPANHAS_LISTA.map((campanha) => (
            <div
              key={campanha.id}
              onClick={() => onSelectModule('premiacoes')}
              className="card-modern group cursor-pointer overflow-hidden p-0 border border-gray-200 hover:border-[#ff6b35] transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={campanha.imagem}
                  alt={campanha.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-xl mr-2">{campanha.emoji}</span>
                  <span className="text-white font-bold text-base drop-shadow-sm">
                    {campanha.nome}
                  </span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                <div>
                  <span className="text-[11px] text-gray-500 block">Meta Exigida</span>
                  <strong className="text-sm font-bold text-slate-900 font-mono">
                    {formatMoneyNum(campanha.meta)}
                  </strong>
                </div>

                <span className="text-xs font-semibold text-[#ff6b35] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Projetar →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
