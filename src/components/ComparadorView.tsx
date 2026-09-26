import React, { useState } from 'react';
import {
  LayoutGrid,
  TrendingUp,
  Printer,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import {
  CAMPANHAS_OFICIAIS,
  formatCurrency,
  formatPercent,
  parseValue,
  parsePercentage,
  RECORRENCIA_MINIMA,
  REMUNERACAO_TAC_UNITARIA,
} from '../data/campaigns';

interface ComparadorViewProps {
  onSelectCampaign: (id: number) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenReport?: (data: any) => void;
  onOpenHelp?: () => void;
}

export const ComparadorView: React.FC<ComparadorViewProps> = ({
  onSelectCampaign,
  onNavigateToTab,
  onOpenReport,
  onOpenHelp,
}) => {
  const [tpvAtualStr, setTpvAtualStr] = useState('');
  const [tpvMedioStr, setTpvMedioStr] = useState('');
  const [clientesMesStr, setClientesMesStr] = useState('');
  const [recorrenciaStr, setRecorrenciaStr] = useState('');

  const clientesMes = parseInt(clientesMesStr, 10) || 0;
  const tpvAtual = parseValue(tpvAtualStr);
  const tpvMedio = parseValue(tpvMedioStr);
  const taxaRec = parsePercentage(recorrenciaStr);

  const tpvMensalAdicionado = tpvMedio * clientesMes;
  const tacMensal = clientesMes * REMUNERACAO_TAC_UNITARIA;
  const fatorCompensacao =
    taxaRec > 0 && taxaRec < RECORRENCIA_MINIMA ? RECORRENCIA_MINIMA / taxaRec : 1;

  const handleOpenConsolidatedReport = () => {
    if (!onOpenReport) return;
    const campanhasResumo = CAMPANHAS_OFICIAIS.map((camp) => {
      const metaAjustada = Math.round(camp.meta * fatorCompensacao);
      const falta = Math.max(0, metaAjustada - tpvAtual);
      const mesesNecessarios =
        tpvMensalAdicionado > 0 ? Math.ceil(falta / tpvMensalAdicionado) : 999;
      const jaBateu = tpvAtual >= metaAjustada;
      const comissaoAoBater = (jaBateu && tpvAtual > metaAjustada ? tpvAtual : metaAjustada) * taxaRec;
      const totalMensalAoBater = comissaoAoBater + tacMensal;

      return {
        id: camp.id,
        nome: camp.nome,
        premio: camp.premio,
        meta: metaAjustada,
        metaOriginal: camp.meta,
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
      recorrencia: taxaRec,
      fatorCompensacao,
      tpvPorMes: tpvMensalAdicionado,
      tacMensal,
      campanhas: campanhasResumo,
    });
  };

  return (
    <div className="space-y-8 py-6">
      {/* Banner Principal */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm mb-1">
            <LayoutGrid className="w-4 h-4" />
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
          <div className="bg-gradient-to-r from-slate-900 via-[#0e1e33] to-[#1e153b] text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl border border-purple-500/30 shadow-lg shadow-slate-900/10 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-purple-200/80 font-bold block">
                Ritmo Mensal Calculado
              </span>
              <div className="text-base sm:text-lg font-black font-mono text-white">
                +{formatCurrency(tpvMensalAdicionado)}
                <span className="text-xs font-normal text-slate-300 ml-1">/mês</span>
              </div>
            </div>
          </div>

          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              title="Ver manual de como usar esta ferramenta"
              className="px-4 py-3.5 bg-white/90 hover:bg-white text-[#ff5e36] border border-orange-200 font-bold rounded-2xl shadow-xs transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer group"
            >
              <BookOpen className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
              <span>Como usar esta aba</span>
            </button>
          )}

          <button
            onClick={handleOpenConsolidatedReport}
            className="px-5 py-3.5 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/20 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Impressão</span>
          </button>
        </div>
      </div>

      {/* Formulário de Premissas */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Premissas Comerciais da Operação</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              TPV Atual em Carteira
            </label>
            <CurrencyInput
              value={tpvAtualStr}
              onChangeValue={(v) => setTpvAtualStr(v.toString())}
              placeholder="R$ 0,00"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-base focus:border-[#ff5e36] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              TPV Médio por Cliente
            </label>
            <CurrencyInput
              value={tpvMedioStr}
              onChangeValue={(v) => setTpvMedioStr(v.toString())}
              placeholder="R$ 50.000,00"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-base focus:border-[#ff5e36] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Novos Clientes por Mês
            </label>
            <input
              type="number"
              min="1"
              value={clientesMesStr}
              onChange={(e) => setClientesMesStr(e.target.value)}
              placeholder="Ex: 5"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-base focus:border-[#ff5e36] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Taxa de Recorrência
            </label>
            <PercentInput
              value={recorrenciaStr}
              onChange={(val) => setRecorrenciaStr(val)}
              placeholder="0,32%"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-base focus:border-[#ff5e36] focus:outline-none transition-all"
            />
          </div>
        </div>

        {fatorCompensacao > 1 && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-amber-900">
                Ajuste Automático de Compensação Ativo
              </strong>
              <span>
                Com recorrência de {formatPercent(taxaRec)}, o fator de compensação ({fatorCompensacao.toFixed(2)}x) foi aplicado a todas as metas para garantir a correspondência de receita exigida pela B91.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid das 6 Campanhas Comparadas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAMPANHAS_OFICIAIS.map((campanha) => {
          const metaAjustada = Math.round(campanha.meta * fatorCompensacao);
          const falta = Math.max(0, metaAjustada - tpvAtual);
          const mesesNecessarios =
            tpvMensalAdicionado > 0 ? Math.ceil(falta / tpvMensalAdicionado) : 999;
          const jaBateu = tpvAtual >= metaAjustada;
          const comissaoAoBater = (jaBateu && tpvAtual > metaAjustada ? tpvAtual : metaAjustada) * taxaRec;
          const totalMensalAoBater = comissaoAoBater + tacMensal;
          const pctAtual = metaAjustada > 0 ? Math.min(100, (tpvAtual / metaAjustada) * 100) : 0;

          return (
            <div
              key={campanha.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                jaBateu
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Imagem de Capa */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={campanha.imagemUrl}
                    alt={campanha.premio}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-[#ff5e36] text-white px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                    {campanha.nome}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xl mr-2">{campanha.emoji}</span>
                    <span className="text-white font-bold text-base drop-shadow-sm">
                      {campanha.premio}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Status & Tempo */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs text-slate-500 font-medium">Tempo estimado:</span>
                    {jaBateu ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Já Elegível!</span>
                      </span>
                    ) : tpvMensalAdicionado > 0 ? (
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-black font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-700" />
                        <span>{mesesNecessarios} {mesesNecessarios === 1 ? 'mês' : 'meses'}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Defina as premissas</span>
                    )}
                  </div>

                  {/* Barra de Progresso */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Progresso atual</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {pctAtual.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          jaBateu ? 'bg-emerald-500' : 'bg-[#ff5e36]'
                        }`}
                        style={{ width: `${pctAtual}%` }}
                      />
                    </div>
                  </div>

                  {/* Informações Numéricas */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Meta Ajustada
                      </span>
                      <strong className="text-slate-900 font-mono font-bold">
                        {formatCurrency(metaAjustada)}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Falta para Meta
                      </span>
                      <strong className="text-[#ff5e36] font-mono font-bold">
                        {formatCurrency(falta)}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Comissão Recorrente
                      </span>
                      <strong className="text-emerald-700 font-mono font-bold">
                        {formatCurrency(comissaoAoBater)}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Renda Total (c/ TAC)
                      </span>
                      <strong className="text-purple-700 font-mono font-extrabold">
                        {formatCurrency(totalMensalAoBater)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela Resumo Consolidada */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Tabela Comparativa Consolidada das 6 Campanhas
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-4 font-bold text-xs uppercase">Campanha</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Prêmio</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Meta TPV</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Falta</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Meses Estimados</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Comissão Mensal</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Renda Total c/ TAC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CAMPANHAS_OFICIAIS.map((camp) => {
                const metaAjustada = Math.round(camp.meta * fatorCompensacao);
                const falta = Math.max(0, metaAjustada - tpvAtual);
                const meses =
                  tpvMensalAdicionado > 0 ? Math.ceil(falta / tpvMensalAdicionado) : 999;
                const jaBateu = tpvAtual >= metaAjustada;
                const comissao = metaAjustada * taxaRec;
                const total = comissao + tacMensal;

                return (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">{camp.nome}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {camp.emoji} {camp.premio}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{formatCurrency(metaAjustada)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#ff5e36]">{formatCurrency(falta)}</td>
                    <td className="py-3 px-4">
                      {jaBateu ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          Atingido
                        </span>
                      ) : tpvMensalAdicionado > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-black font-mono bg-purple-100 text-purple-900">
                          {meses} meses
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-bold">
                      {formatCurrency(comissao)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#ff5e36] font-extrabold">
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
