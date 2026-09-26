import React, { useState, useEffect } from 'react';
import {
  Trophy,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  RotateCcw,
  TrendingUp,
  DollarSign,
  Users,
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
  gerarMesesDinamicos,
  RECORRENCIA_MINIMA,
  REMUNERACAO_TAC_UNITARIA,
} from '../data/campaigns';
import confetti from 'canvas-confetti';

interface PremiacoesViewProps {
  selectedCampaignId?: number;
  onOpenReport?: (data: any) => void;
  onOpenHelp?: () => void;
}

export const PremiacoesView: React.FC<PremiacoesViewProps> = ({
  selectedCampaignId = 2,
  onOpenReport,
  onOpenHelp,
}) => {
  const [usarTpvAtual, setUsarTpvAtual] = useState(false);
  const [tpvAtualStr, setTpvAtualStr] = useState('');
  const [tpvMedioStr, setTpvMedioStr] = useState('');
  const [clientesMesStr, setClientesMesStr] = useState('');
  const [recorrenciaStr, setRecorrenciaStr] = useState('');
  const [campaignId, setCampaignId] = useState(selectedCampaignId);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (selectedCampaignId !== undefined) {
      setCampaignId(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  const selectedCampanha =
    CAMPANHAS_OFICIAIS.find((c) => c.id === campaignId) || CAMPANHAS_OFICIAIS[0];
  const clientesMes = parseInt(clientesMesStr, 10) || 0;
  const remunTAC = clientesMes * REMUNERACAO_TAC_UNITARIA;
  const taxaRec = parsePercentage(recorrenciaStr);
  const fatorCompensacao =
    taxaRec > 0 && taxaRec < RECORRENCIA_MINIMA ? RECORRENCIA_MINIMA / taxaRec : 1;

  const handleCalcular = () => {
    const tpvAtual = parseValue(tpvAtualStr);
    const tpvMedio = parseValue(tpvMedioStr);
    const rec = parsePercentage(recorrenciaStr);
    const metaOriginal = selectedCampanha.meta;
    const fator = rec > 0 && rec < RECORRENCIA_MINIMA ? RECORRENCIA_MINIMA / rec : 1;
    const metaAjustada = Math.round(metaOriginal * fator);

    const tpvMensalAdicionado = tpvMedio * clientesMes;
    let tpvBase = 0;
    if (usarTpvAtual && tpvAtual > 0) {
      tpvBase = tpvAtual;
    }

    if (tpvMensalAdicionado <= 0 && tpvBase <= 0) {
      setResult(null);
      return;
    }

    const mesesLabels = gerarMesesDinamicos(120);
    const rows: any[] = [];
    let acumulado = tpvBase;
    let mesesAtingimento = 0;
    let primeiroMesBateu: number | null = null;
    const jaAtingiu = tpvBase >= metaAjustada;

    if (jaAtingiu) {
      // Já atinge a meta na carteira atual: projeta 12 meses de evolução contínua
      const mesesProjecao = 12;
      for (let m = 1; m <= mesesProjecao; m++) {
        acumulado = tpvBase + tpvMensalAdicionado * m;
        const comissao = acumulado * rec;
        const tac = clientesMes * REMUNERACAO_TAC_UNITARIA;
        const total = comissao + tac;

        rows.push({
          mesIndex: m,
          nomeMes: mesesLabels[m - 1] || `Mês ${m}`,
          tpvPorMes: tpvMensalAdicionado,
          acumulado,
          comissao,
          remuneracaoTAC: tac,
          comissaoMaisTAC: total,
          atingiuMeta: true,
        });
      }
    } else {
      const mesesMinimos = 12;
      let mesesAposAtingir = 0;
      while (
        (acumulado < metaAjustada || mesesAposAtingir < 6 || mesesAtingimento < mesesMinimos) &&
        mesesAtingimento < 60
      ) {
        mesesAtingimento++;
        if (acumulado >= metaAjustada) {
          mesesAposAtingir++;
          if (primeiroMesBateu === null) primeiroMesBateu = mesesAtingimento;
        }
        acumulado = tpvBase + tpvMensalAdicionado * mesesAtingimento;
        const comissao = acumulado * rec;
        const tac = clientesMes * REMUNERACAO_TAC_UNITARIA;
        const total = comissao + tac;
        const bateu = acumulado >= metaAjustada;

        if (bateu && primeiroMesBateu === null) {
          primeiroMesBateu = mesesAtingimento;
        }

        rows.push({
          mesIndex: mesesAtingimento,
          nomeMes: mesesLabels[mesesAtingimento - 1] || `Mês ${mesesAtingimento}`,
          tpvPorMes: tpvMensalAdicionado,
          acumulado,
          comissao,
          remuneracaoTAC: tac,
          comissaoMaisTAC: total,
          atingiuMeta: bateu,
        });
      }
    }

    const bateu = jaAtingiu || acumulado >= metaAjustada;
    if (bateu) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }

    const mesesExibicaoAtingimento = jaAtingiu
      ? 0
      : primeiroMesBateu !== null
      ? primeiroMesBateu
      : mesesAtingimento;

    const comissaoAoAtingir = jaAtingiu
      ? tpvBase * rec
      : (primeiroMesBateu && rows[primeiroMesBateu - 1] ? rows[primeiroMesBateu - 1].comissao : metaAjustada * rec);
    const totalAoAtingir = comissaoAoAtingir + remunTAC;

    let viabilidadeLabel = '🟢 Excelente Ritmo';
    let viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

    if (jaAtingiu) {
      viabilidadeLabel = '🟢 Já Elegível (Meta Superada)';
      viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (mesesExibicaoAtingimento <= 6) {
      viabilidadeLabel = '🟢 Conquista Rápida (≤ 6 meses)';
      viabilidadeCor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (mesesExibicaoAtingimento <= 12) {
      viabilidadeLabel = '🟡 Ritmo Moderado (7 a 12 meses)';
      viabilidadeCor = 'text-amber-700 bg-amber-50 border-amber-200';
    } else {
      viabilidadeLabel = '🔴 Ritmo Desafiador (> 12 meses)';
      viabilidadeCor = 'text-rose-700 bg-rose-50 border-rose-200';
    }

    setResult({
      tpvAtual: tpvBase,
      tpvMedio,
      clientesMes,
      recorrencia: rec,
      tpvPorMes: tpvMensalAdicionado,
      remuneracaoTAC: remunTAC,
      campanha: selectedCampanha,
      metaOriginal,
      meta: metaAjustada,
      fatorCompensacao: fator,
      meses: mesesExibicaoAtingimento,
      atingiu: bateu,
      jaAtingiu,
      comissaoAoAtingir,
      comissaoTotalAoAtingir: totalAoAtingir,
      viabilidade: {
        label: viabilidadeLabel,
        cor: viabilidadeCor,
      },
      rows,
      usarTpvAtual,
    });
  };

  useEffect(() => {
    if (tpvMedioStr && clientesMesStr) {
      handleCalcular();
    }
  }, [campaignId, usarTpvAtual]);

  const handleLimpar = () => {
    setTpvAtualStr('');
    setTpvMedioStr('');
    setClientesMesStr('');
    setRecorrenciaStr('');
    setUsarTpvAtual(false);
    setResult(null);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Banner Principal */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm mb-1">
            <Trophy className="w-4 h-4" />
            <span>Grandes Premiações Corporativas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Todas as Premiações
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Projete o tempo e ritmo de credenciamento até alcançar qualquer um dos 6 prêmios oficiais.
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
        <h3 className="text-lg font-bold text-slate-900">Configuração da Projeção</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Campanha Alvo
            </label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(parseInt(e.target.value, 10))}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold text-sm focus:border-[#ff5e36] focus:outline-none bg-white transition-all cursor-pointer"
            >
              {CAMPANHAS_OFICIAIS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.nome} (Meta: {formatCurrency(c.meta)})
                </option>
              ))}
            </select>
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

        {/* Toggle TPV Atual */}
        <div className="pt-2">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={usarTpvAtual}
              onChange={(e) => setUsarTpvAtual(e.target.checked)}
              className="w-4 h-4 rounded text-[#ff5e36] focus:ring-[#ff5e36] border-slate-300"
            />
            <span className="text-sm font-semibold text-slate-800">
              Possuo TPV atual acumulado que desejo considerar como base inicial
            </span>
          </label>

          {usarTpvAtual && (
            <div className="mt-3 max-w-sm">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Informe seu TPV atual base
              </label>
              <CurrencyInput
                value={tpvAtualStr}
                onChangeValue={(v) => setTpvAtualStr(v.toString())}
                placeholder="R$ 0,00"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-bold text-sm focus:border-[#ff5e36] focus:outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Alerta de Compensação se Recorrência for inferior a 0,32% */}
        {fatorCompensacao > 1 && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-amber-900">
                Ajuste por Recorrência Inferior ao Padrão (0,32%)
              </strong>
              <span>
                Com taxa de {formatPercent(taxaRec)}, o regulamento exige compensação no volume de TPV. A meta para esta campanha passa de {formatCurrency(selectedCampanha.meta)} para {formatCurrency(Math.round(selectedCampanha.meta * fatorCompensacao))}.
              </span>
            </div>
          </div>
        )}

        {/* Detalhe do Prêmio */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
          <img
            src={selectedCampanha.imagemUrl}
            alt={selectedCampanha.premio}
            className="w-32 h-20 object-cover rounded-lg shadow-xs border border-slate-300 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedCampanha.emoji}</span>
              <h4 className="text-base font-bold text-slate-900">{selectedCampanha.premio}</h4>
              <span className="text-xs bg-[#ff5e36] text-white px-2 py-0.5 rounded font-mono font-bold">
                {selectedCampanha.nome}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{selectedCampanha.descricao}</p>
          </div>
          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
            <span className="text-[11px] text-slate-500 block">Remuneração TAC Mensal</span>
            <strong className="text-sm font-bold text-emerald-700 font-mono">
              {formatCurrency(remunTAC)}
            </strong>
            <span className="text-[10px] text-slate-400 block">
              {clientesMes} × R$ 49,90 por cliente
            </span>
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
                Resultado • {result.campanha.premio} em {result.meses} meses
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Projeção com adição de {result.clientesMes} clientes/mês ({formatCurrency(result.tpvPorMes)}/mês em TPV)
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
                Parabéns! Sua carteira já é elegível para {result.campanha.premio}!
              </h4>
              <p className="text-sm text-emerald-700 max-w-xl mx-auto">
                Seu TPV de <strong>{formatCurrency(result.tpvAtual)}</strong> já atinge a meta de {formatCurrency(result.meta)}.
                Comissão mensal de <strong>{formatCurrency(result.comissaoAoAtingir)}</strong> garantida na taxa de {formatPercent(result.recorrencia)}.
              </p>
            </div>
          )}

          {/* Cards de Resumo com Análise de Viabilidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Tempo de Atingimento</span>
              <strong className="text-xl font-black text-slate-900 font-mono mt-1 block">
                {result.jaAtingiu ? 'Já Elegível' : `${result.meses} meses`}
              </strong>
              <span className="text-[11px] text-slate-500">
                {result.jaAtingiu ? 'meta já superada' : 'mantendo o ritmo atual'}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">TPV Mensal Novo</span>
              <strong className="text-xl font-black text-slate-900 font-mono mt-1 block">
                +{formatCurrency(result.tpvPorMes)}
              </strong>
              <span className="text-[11px] text-slate-500">{result.clientesMes} clientes novos/mês</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Comissão ao Atingir</span>
              <strong className="text-xl font-black text-emerald-700 font-mono mt-1 block">
                {formatCurrency(result.comissaoAoAtingir || result.rows[result.rows.length - 1]?.comissao || 0)}
              </strong>
              <span className="text-[11px] text-slate-500">recorrência mensal garantida</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Renda Total Mensal</span>
              <strong className="text-xl font-black text-[#ff5e36] font-mono mt-1 block">
                {formatCurrency(result.comissaoTotalAoAtingir || result.rows[result.rows.length - 1]?.comissaoMaisTAC || 0)}
              </strong>
              <span className="text-[11px] text-slate-500">comissão + TAC mensal</span>
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
                      row.atingiuMeta ? 'bg-amber-50/70 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">{row.nomeMes}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{formatCurrency(row.tpvPorMes)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatCurrency(row.acumulado)}
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
                      {row.atingiuMeta ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1 w-max">
                          <span>🎉 Meta Atingida!</span>
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
