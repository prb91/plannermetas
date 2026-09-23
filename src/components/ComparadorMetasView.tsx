import React, { useState } from 'react';
import { 
  Layers, 
  Clock, 
  DollarSign, 
  Target,
  FileDown,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import { CAMPANHAS, VALOR_TAC_POR_CLIENTE, RECORRENCIA_PADRAO } from '../data/campanhas';
import { formatMoneyNum, formatPercentage, parseValue, parsePercentage } from '../utils/formatters';
import { CurrencyInput } from './CurrencyInput';
import { PercentageInput } from './PercentageInput';

interface ComparadorMetasViewProps {
  onSelectCampaign: (id: number) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenReport?: (data: any) => void;
}

export const ComparadorMetasView: React.FC<ComparadorMetasViewProps> = ({
  onSelectCampaign,
  onNavigateToTab,
  onOpenReport,
}) => {
  const [tpvAtualStr, setTpvAtualStr] = useState<string>('');
  const [tpvMedioStr, setTpvMedioStr] = useState<string>('');
  const [clientesMesStr, setClientesMesStr] = useState<string>('');
  const [recorrenciaStr, setRecorrenciaStr] = useState<string>('');

  const clientesMes = parseInt(clientesMesStr, 10) || 0;
  const tpvAtual = parseValue(tpvAtualStr);
  const tpvMedio = parseValue(tpvMedioStr);
  const recorrencia = parsePercentage(recorrenciaStr);
  const tpvPorMes = tpvMedio * clientesMes;
  const tacMensal = clientesMes * VALOR_TAC_POR_CLIENTE;

  // Lógica de compensação de TPV se a recorrência estiver abaixo de 0,32%
  const fatorCompensacao = (recorrencia > 0 && recorrencia < RECORRENCIA_PADRAO) 
    ? (RECORRENCIA_PADRAO / recorrencia) 
    : 1;

  const handleExportPDF = () => {
    if (!onOpenReport) return;
    const campanhasComparativo = CAMPANHAS.map((campanha) => {
      const metaAjustada = Math.round(campanha.meta * fatorCompensacao);
      const falta = Math.max(0, metaAjustada - tpvAtual);
      const mesesNecessarios = tpvPorMes > 0 ? Math.ceil(falta / tpvPorMes) : 999;
      const jaBateu = tpvAtual >= metaAjustada;
      // Ao compensar, a comissão ao bater atinge o valor equivalente da campanha (meta * 0.32%)
      const comissaoAoBater = metaAjustada * recorrencia;
      const totalMensalAoBater = comissaoAoBater + tacMensal;

      return {
        id: campanha.id,
        nome: campanha.nome,
        premio: campanha.premio,
        meta: metaAjustada,
        metaOriginal: campanha.meta,
        metaAjustada,
        fatorCompensacao,
        falta,
        mesesNecessarios,
        jaBateu,
        comissaoAoBater,
        totalMensalAoBater,
      };
    });

    onOpenReport({
      tpvAtual,
      tpvMedio,
      clientesMes,
      recorrencia,
      fatorCompensacao,
      tpvPorMes,
      tacMensal,
      campanhas: campanhasComparativo,
    });
  };

  return (
    <div className="space-y-8 py-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm mb-1">
            <Layers className="w-4 h-4" />
            <span>Visão Executiva Comparativa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quadro Executivo de Metas B91
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Compare simultaneamente o tempo de conquista e renda gerada nas 6 grandes campanhas corporativas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-3.5 w-full lg:w-auto">
          {/* Card de Destaque Executivo de Produção Mensal & TAC */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0e1e33] to-[#1e153b] text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl border border-purple-500/30 shadow-lg shadow-slate-900/10 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-3 sm:gap-6 divide-x divide-white/15">
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-purple-300">
                  Produção Mensal
                </span>
                <div className="text-sm sm:text-lg font-black text-white tracking-tight">
                  {formatMoneyNum(tpvPorMes)}
                  <span className="text-[11px] sm:text-xs font-medium text-slate-300 ml-1">/mês</span>
                </div>
              </div>
              <div className="pl-3 sm:pl-6">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                  TAC Mensal
                </span>
                <div className="text-sm sm:text-lg font-black text-emerald-400 tracking-tight">
                  {formatMoneyNum(tacMensal)}
                  <span className="text-[11px] sm:text-xs font-medium text-emerald-200/80 ml-1">/mês</span>
                </div>
              </div>
            </div>
          </div>

          {onOpenReport && (
            <button
              onClick={handleExportPDF}
              className="group self-stretch px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-orange-500 to-[#ff5e36] hover:from-orange-600 hover:to-[#e84f29] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 border border-orange-400/30 transition-all flex items-center gap-3 sm:gap-3.5 cursor-pointer shrink-0 active:scale-[0.98] min-h-[44px]"
              title="Exportar quadro comparativo em PDF"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <FileDown className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-orange-100">
                  Relatório Executivo
                </span>
                <div className="text-xs sm:text-base font-black text-white tracking-tight whitespace-nowrap">
                  Exportar PDF / Imprimir
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-orange-500" />
          <span>Ajustar Ritmo de Vendas para Comparação</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">TPV Atual (R$)</label>
            <CurrencyInput
              value={tpvAtualStr}
              onValueChange={(values) => setTpvAtualStr(values.value)}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">TPV Médio/Cliente (R$)</label>
            <CurrencyInput
              value={tpvMedioStr}
              onValueChange={(values) => setTpvMedioStr(values.value)}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">Novos Clientes/Mês</label>
            <input
              type="number"
              min="0"
              value={clientesMesStr}
              onChange={(e) => setClientesMesStr(e.target.value)}
              placeholder="Ex: 6"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">Taxa de Recorrência</label>
            <PercentageInput
              value={recorrenciaStr}
              onChange={(formatted) => setRecorrenciaStr(formatted)}
              placeholder="0,32%"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {fatorCompensacao > 1 && (
          <div className="mt-4 p-4 bg-amber-50/90 border border-amber-200/90 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-amber-950 flex flex-wrap items-center gap-2">
                <span>Compensação Automática de Recorrência ({formatPercentage(recorrencia)} vs 0,32% Padrão)</span>
                <span className="bg-amber-200/80 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                  Fator +{((fatorCompensacao - 1) * 100).toFixed(1)}% TPV
                </span>
              </div>
              <p className="mt-1 text-amber-800 leading-relaxed">
                Como a taxa de recorrência informada está abaixo da referência de 0,32%, o TPV necessário de cada campanha corporativa foi ajustado proporcionalmente para compensar a margem e manter rigorosamente a mesma comissão mensal prevista na premiação.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAMPANHAS.map((campanha) => {
          const metaAjustada = Math.round(campanha.meta * fatorCompensacao);
          const falta = Math.max(0, metaAjustada - tpvAtual);
          const mesesNecessarios = tpvPorMes > 0 ? Math.ceil(falta / tpvPorMes) : 999;
          const jaBateu = tpvAtual >= metaAjustada;
          const comissaoAoBater = metaAjustada * recorrencia;
          const totalMensalAoBater = comissaoAoBater + tacMensal;

          return (
            <div
              key={campanha.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                jaBateu 
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200 hover:border-orange-300'
              }`}
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={campanha.imagemUrl}
                    alt={campanha.premio}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60";
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1.5 shadow">
                    <span>{campanha.emoji}</span>
                    <span>{formatMoneyNum(metaAjustada)}</span>
                    {fatorCompensacao > 1 && (
                      <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wide bg-amber-500/25 px-1.5 py-0.5 rounded">
                        Compensado
                      </span>
                    )}
                  </div>
                  {jaBateu && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs shadow-md">
                      ✅ Conquistada!
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      {campanha.premio}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {campanha.descricao}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs">
                    {fatorCompensacao > 1 && (
                      <div className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-900">
                        <span className="flex items-center gap-1 font-medium text-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Meta Nominal (0,32%):
                        </span>
                        <span className="font-bold text-slate-500 line-through">
                          {formatMoneyNum(campanha.meta)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-orange-500" />
                        {fatorCompensacao > 1 ? 'TPV Necessário Corrigido:' : 'Meta TPV:'}
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatMoneyNum(metaAjustada)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Tempo estimado:
                      </span>
                      <span className="font-bold text-slate-900">
                        {jaBateu ? 'Imediato (já qualificado)' : tpvPorMes <= 0 ? 'Aguardando ritmo' : `${mesesNecessarios} meses`}
                      </span>
                    </div>

                    {!jaBateu && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Falta para meta:</span>
                        <span className="font-bold text-orange-600">
                          {formatMoneyNum(falta)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        Comissão no atingimento:
                      </span>
                      <span className="font-bold text-emerald-600">
                        {formatMoneyNum(comissaoAoBater)}/mês
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                      <span className="font-semibold text-slate-700">Renda Total (+TAC):</span>
                      <span className="font-extrabold text-purple-700 text-sm">
                        {formatMoneyNum(totalMensalAoBater)}/mês
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 italic">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          * As imagens dos prêmios e campanhas são meramente ilustrativas.
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          Circuito Oficial de Premiações B91 • Planejamento Estratégico Comercial
        </span>
      </div>
    </div>
  );
};
