import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Sparkles,
  RotateCcw,
  Target,
  DollarSign,
  Clock,
  BookOpen,
} from 'lucide-react';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import {
  formatCurrency,
  formatPercent,
  parseValue,
  parsePercentage,
  gerarMesesDinamicos,
  REMUNERACAO_TAC_UNITARIA,
} from '../data/campaigns';
import confetti from 'canvas-confetti';

interface CrescimentoViewProps {
  onOpenReport?: (data: any) => void;
  onOpenHelp?: () => void;
}

export const CrescimentoView: React.FC<CrescimentoViewProps> = ({
  onOpenReport,
  onOpenHelp,
}) => {
  const [comissaoMetaStr, setComissaoMetaStr] = useState('');
  const [recorrenciaStr, setRecorrenciaStr] = useState('');
  const [tpvMedioStr, setTpvMedioStr] = useState('');
  const [clientesMesStr, setClientesMesStr] = useState('');

  const [usarTpvAtual, setUsarTpvAtual] = useState(false);
  const [tpvAtualStr, setTpvAtualStr] = useState('');

  const [usarTempoFixo, setUsarTempoFixo] = useState(false);
  const [tempoFixoMeses, setTempoFixoMeses] = useState(12);

  const [result, setResult] = useState<any>(null);

  const clientesMes = parseInt(clientesMesStr, 10) || 0;
  const remuneracaoTAC = clientesMes * REMUNERACAO_TAC_UNITARIA;

  const handleCalcular = () => {
    const metaComissao = parseValue(comissaoMetaStr);
    const taxaRec = parsePercentage(recorrenciaStr);
    const tpvMedio = parseValue(tpvMedioStr);

    if (metaComissao <= 0 || taxaRec <= 0 || tpvMedio <= 0 || clientesMes <= 0) {
      setResult(null);
      return;
    }

    const tpvTotalNecessario = metaComissao / taxaRec;
    const tpvMensalAdicionado = tpvMedio * clientesMes;

    let tpvBase = 0;
    if (usarTpvAtual) {
      tpvBase = parseValue(tpvAtualStr);
    }

    let limiteMeses = 24;
    let tpvMensalNecessario: number | null = null;

    if (usarTempoFixo) {
      limiteMeses = tempoFixoMeses || 12;
      tpvMensalNecessario = Math.max(0, tpvTotalNecessario - tpvBase) / limiteMeses;
    } else {
      // Sem tempo fixo: projeta pelo menos 12 meses, ou até 6 meses após atingir a meta
      if (tpvMensalAdicionado > 0) {
        const mesesParaAtingir = Math.ceil(Math.max(0, tpvTotalNecessario - tpvBase) / tpvMensalAdicionado);
        limiteMeses = Math.min(60, Math.max(12, mesesParaAtingir + 6));
      } else {
        limiteMeses = 12;
      }
    }

    const mesesLabels = gerarMesesDinamicos(60);
    let acumulado = tpvBase;
    let mesAtingiu: number | null = null;
    const jaAtingiu = tpvBase * taxaRec >= metaComissao;
    const rows: any[] = [];

    for (let f = 1; f <= limiteMeses; f++) {
      acumulado += tpvMensalAdicionado;
      const comissao = acumulado * taxaRec;

      if (comissao >= metaComissao && mesAtingiu === null) {
        mesAtingiu = f;
      }

      const isMetaMonth = mesAtingiu === f;
      const nomeMes = mesesLabels[f - 1] || `Mês ${f}`;
      const totalRenda = comissao + remuneracaoTAC;

      rows.push({
        mesIndex: f,
        nomeMes,
        tpvMensal: tpvMensalAdicionado,
        tpvAcumulado: acumulado,
        comissao,
        remuneracaoTAC,
        comissaoMaisTAC: totalRenda,
        isMetaMonth,
      });
    }

    if (jaAtingiu || mesAtingiu !== null) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    const nomeMesAtingido = jaAtingiu
      ? 'Já Atingido (Carteira Atual)'
      : mesAtingiu
      ? mesesLabels[mesAtingiu - 1] || `Mês ${mesAtingiu}`
      : null;

    let viabilidadeLabel = '🟢 Alcançável';
    let viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

    if (jaAtingiu) {
      viabilidadeLabel = '🟢 Já Atingido na Carteira';
      viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (usarTempoFixo && tpvMensalNecessario !== null) {
      if (tpvMensalAdicionado >= tpvMensalNecessario) {
        viabilidadeLabel = '🟢 Ritmo Adequado ao Prazo';
        viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      } else if (tpvMensalAdicionado >= tpvMensalNecessario * 0.7) {
        viabilidadeLabel = '🟡 Ritmo Próximo (Ajuste Recomendado)';
        viabilidadeCor = 'text-amber-700 bg-amber-50 border-amber-200';
      } else {
        viabilidadeLabel = '🔴 Aceleração Necessária (>30% gap)';
        viabilidadeCor = 'text-rose-700 bg-rose-50 border-rose-200';
      }
    } else {
      if (mesAtingiu !== null && mesAtingiu <= 6) {
        viabilidadeLabel = '🟢 Conquista Rápida (≤ 6 meses)';
        viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      } else if (mesAtingiu !== null && mesAtingiu <= 12) {
        viabilidadeLabel = '🟡 Médio Prazo (7 a 12 meses)';
        viabilidadeCor = 'text-amber-700 bg-amber-50 border-amber-200';
      } else {
        viabilidadeLabel = '🔴 Longo Prazo (> 12 meses)';
        viabilidadeCor = 'text-rose-700 bg-rose-50 border-rose-200';
      }
    }

    setResult({
      comissaoMeta: metaComissao,
      recorrencia: taxaRec,
      tpvMedio,
      clientesMes,
      tpvNecessario: tpvTotalNecessario,
      tpvMensal: tpvMensalAdicionado,
      tpvAtualCrescimento: tpvBase,
      usarTpvAtual,
      usarTempoAtingimento: usarTempoFixo,
      tempoAtingimentoMeses: limiteMeses,
      tpvMensalNecessario,
      remuneracaoTAC,
      mesMetaAtingida: jaAtingiu ? 0 : mesAtingiu,
      nomeMesAtingida: nomeMesAtingido,
      jaAtingiu,
      viabilidade: {
        label: viabilidadeLabel,
        cor: viabilidadeCor,
      },
      rows,
    });
  };

  useEffect(() => {
    if (comissaoMetaStr && tpvMedioStr && clientesMesStr) {
      handleCalcular();
    }
  }, [usarTpvAtual, usarTempoFixo, tempoFixoMeses]);

  const handleLimpar = () => {
    setComissaoMetaStr('');
    setRecorrenciaStr('');
    setTpvMedioStr('');
    setClientesMesStr('');
    setTpvAtualStr('');
    setUsarTpvAtual(false);
    setUsarTempoFixo(false);
    setResult(null);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Banner Principal */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Projeção de Renda Mensal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Remuneração e Crescimento
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Projete o volume de TPV e a carteira necessários para atingir seu objetivo de renda mensal.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              title="Ver manual de como usar esta ferramenta"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#ff5e36] text-xs font-bold transition-all shadow-xs cursor-pointer group"
            >
              <BookOpen className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
              <span>Como usar esta aba</span>
            </button>
          )}

          {result && (
            <button
              onClick={() => onOpenReport && onOpenReport(result)}
              className="px-4 py-2.5 bg-[#0b1c2d] hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-orange-400" />
              <span>Gerar Relatório / Imprimir</span>
            </button>
          )}
        </div>
      </div>

      {/* Formulário de Premissas */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Definição dos Objetivos Financeiros</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Comissão Alvo Mensal (R$)
            </label>
            <CurrencyInput
              value={comissaoMetaStr}
              onChangeValue={(v) => setComissaoMetaStr(v.toString())}
              placeholder="R$ 10.000,00"
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
              placeholder="Ex: 6"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-base focus:border-[#ff5e36] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Toggles Avançados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Toggle TPV Atual */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={usarTpvAtual}
                onChange={(e) => setUsarTpvAtual(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff5e36] focus:ring-[#ff5e36] border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Considerar TPV Atual como Base
              </span>
            </label>

            {usarTpvAtual && (
              <div className="mt-3">
                <CurrencyInput
                  value={tpvAtualStr}
                  onChangeValue={(v) => setTpvAtualStr(v.toString())}
                  placeholder="R$ 0,00"
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-sm focus:border-[#ff5e36] focus:outline-none bg-white transition-all"
                />
              </div>
            )}
          </div>

          {/* Toggle Tempo Fixo */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={usarTempoFixo}
                onChange={(e) => setUsarTempoFixo(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff5e36] focus:ring-[#ff5e36] border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Fixar Tempo de Atingimento
              </span>
            </label>

            {usarTempoFixo && (
              <div className="mt-3">
                <select
                  value={tempoFixoMeses}
                  onChange={(e) => setTempoFixoMeses(parseInt(e.target.value, 10))}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-sm focus:border-[#ff5e36] focus:outline-none bg-white transition-all cursor-pointer"
                >
                  <option value={6}>6 meses (Semestre)</option>
                  <option value={12}>12 meses (1 ano)</option>
                  <option value={18}>18 meses (1 ano e meio)</option>
                  <option value={24}>24 meses (2 anos)</option>
                  <option value={36}>36 meses (3 anos)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handleCalcular}
            className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 bg-[#ff5e36] hover:bg-[#e84f29] active:scale-95 text-white font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Calcular Projeção</span>
          </button>

          <button
            onClick={handleLimpar}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Resultados da Simulação */}
      {result && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Resultado • Renda Alvo de {formatCurrency(result.comissaoMeta)} / mês
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                TPV total necessário: {formatCurrency(result.tpvNecessario)} em carteira ativa
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenReport && onOpenReport(result)}
                className="px-4 py-2 bg-[#ff5e36] hover:bg-[#e84f29] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Impressão</span>
              </button>
            </div>
          </div>

          {result.jaAtingiu && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <h4 className="text-xl font-extrabold text-emerald-900">
                Parabéns! Sua carteira atual já gera a renda alvo desejada!
              </h4>
              <p className="text-sm text-emerald-700 max-w-xl mx-auto">
                Seu TPV de <strong>{formatCurrency(result.tpvAtualCrescimento)}</strong> já garante a comissão mensal de {formatCurrency(result.comissaoMeta)}.
              </p>
            </div>
          )}

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">TPV Necessário</span>
              <strong className="text-xl font-black text-slate-900 font-mono mt-1 block">
                {formatCurrency(result.tpvNecessario)}
              </strong>
              <span className="text-[11px] text-slate-500">volume total em carteira</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Mês de Atingimento</span>
              <strong className="text-xl font-black text-blue-700 font-mono mt-1 block">
                {result.nomeMesAtingida || 'Além do período'}
              </strong>
              <span className="text-[11px] text-slate-500">
                {result.jaAtingiu ? 'já superada' : result.mesMetaAtingida ? `atingido no mês ${result.mesMetaAtingida}` : 'continue expandindo'}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Remuneração TAC / Mês</span>
              <strong className="text-xl font-black text-emerald-700 font-mono mt-1 block">
                +{formatCurrency(result.remuneracaoTAC)}
              </strong>
              <span className="text-[11px] text-slate-500">{result.clientesMes} credenciamentos/mês</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Renda Total Projetada</span>
              <strong className="text-xl font-black text-[#ff5e36] font-mono mt-1 block">
                {formatCurrency(result.rows[result.rows.length - 1]?.comissaoMaisTAC || 0)}
              </strong>
              <span className="text-[11px] text-slate-500">ao fim do cronograma</span>
            </div>

            <div className={`p-4 rounded-xl border ${result.viabilidade?.cor || 'bg-slate-50 border-slate-200'}`}>
              <span className="text-xs font-semibold uppercase block opacity-80">Índice de Viabilidade</span>
              <strong className="text-base font-black mt-1 block">
                {result.viabilidade?.label || '🟢 Alcançável'}
              </strong>
              <span className="text-[11px] opacity-80">baseado na cadência mensal</span>
            </div>
          </div>

          {/* Tabela do Cronograma */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="py-3 px-4 font-bold text-xs uppercase">Mês</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">TPV Novo / Mês</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">TPV Acumulado</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">Comissão Recorrência</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">Remuneração TAC</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">Total Mensal</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.rows.map((row: any, idx: number) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 transition-colors ${
                      row.isMetaMonth ? 'bg-amber-50/70 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">{row.nomeMes}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{formatCurrency(row.tpvMensal)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatCurrency(row.tpvAcumulado)}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-bold">
                      {formatCurrency(row.comissao)}
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-700 font-bold">
                      {formatCurrency(row.remuneracaoTAC)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#ff5e36] font-extrabold">
                      {formatCurrency(row.comissaoMaisTAC)}
                    </td>
                    <td className="py-3 px-4">
                      {row.isMetaMonth ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1 w-max">
                          <span>🎉 Renda Alvo Alcançada!</span>
                        </span>
                      ) : row.comissao >= result.comissaoMeta ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Meta Superada
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          Construção
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
