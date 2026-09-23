import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Target, 
  RotateCcw, 
  FileSpreadsheet, 
  Printer, 
  Sparkles, 
  Users,
  FileDown,
  AlertTriangle,
  Info
} from 'lucide-react';
import { CAMPANHAS, VALOR_TAC_POR_CLIENTE, RECORRENCIA_PADRAO } from '../data/campanhas';
import { 
  formatMoneyNum, 
  formatPercentage,
  parseValue, 
  parsePercentage, 
  gerarMesesDinamicos, 
  exportToCSV 
} from '../utils/formatters';
import { PremiacoesData, ProjecaoPremiacaoRow } from '../types';
import { CurrencyInput } from './CurrencyInput';
import { PercentageInput } from './PercentageInput';

interface TodasPremiacoesViewProps {
  selectedCampaignId?: number;
  onOpenReport?: (data: PremiacoesData) => void;
}

export const TodasPremiacoesView: React.FC<TodasPremiacoesViewProps> = ({
  selectedCampaignId = 2,
  onOpenReport,
}) => {
  const [usarTpvAtual, setUsarTpvAtual] = useState<boolean>(false);
  const [tpvAtualStr, setTpvAtualStr] = useState<string>('');
  const [tpvMedioStr, setTpvMedioStr] = useState<string>('');
  const [clientesMesStr, setClientesMesStr] = useState<string>('');
  const [recorrenciaStr, setRecorrenciaStr] = useState<string>('');
  const [campanhaId, setCampanhaId] = useState<number>(selectedCampaignId);
  const [resultado, setResultado] = useState<PremiacoesData | null>(null);

  useEffect(() => {
    if (selectedCampaignId !== undefined) {
      setCampanhaId(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  const clientesMes = parseInt(clientesMesStr, 10) || 0;
  const campanhaSelecionada = CAMPANHAS.find(c => c.id === campanhaId) || CAMPANHAS[0];
  const remuneracaoTACMensal = clientesMes * VALOR_TAC_POR_CLIENTE;
  const recAtual = parsePercentage(recorrenciaStr);
  const fatorCompensacaoAtual = (recAtual > 0 && recAtual < RECORRENCIA_PADRAO) ? (RECORRENCIA_PADRAO / recAtual) : 1;

  const handleCalcular = () => {
    const tpvAtualInput = parseValue(tpvAtualStr);
    const tpvMedio = parseValue(tpvMedioStr);
    const rec = parsePercentage(recorrenciaStr);
    const metaNominal = campanhaSelecionada.meta;
    const tpvPorMes = tpvMedio * clientesMes;

    // Regra de compensação: se recorrência < 0,32%, ajusta a meta proporcionalmente
    const fatorCompensacao = (rec > 0 && rec < RECORRENCIA_PADRAO) ? (RECORRENCIA_PADRAO / rec) : 1;
    const meta = Math.round(metaNominal * fatorCompensacao);

    let baseTpv = 0;
    if (usarTpvAtual && tpvAtualInput > 0) {
      baseTpv = tpvAtualInput;
    }

    if (tpvPorMes <= 0 && baseTpv <= 0) {
      setResultado(null);
      return;
    }

    const mesesNomes = gerarMesesDinamicos(120);
    const rows: ProjecaoPremiacaoRow[] = [];
    let acumulado = baseTpv;
    let meses = 0;

    while (acumulado < meta && meses < 120) {
      meses++;
      acumulado = baseTpv + (tpvPorMes * meses);
      const comissao = acumulado * rec;
      const tac = clientesMes * VALOR_TAC_POR_CLIENTE;
      const comissaoMaisTAC = comissao + tac;
      const atingiuMeta = acumulado >= meta;

      rows.push({
        mesIndex: meses,
        nomeMes: mesesNomes[meses - 1] || `Mês ${meses}`,
        tpvPorMes,
        acumulado,
        comissao,
        remuneracaoTAC: tac,
        comissaoMaisTAC,
        atingiuMeta
      });
    }

    const atingiu = acumulado >= meta;

    if (atingiu) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    const data: PremiacoesData = {
      tpvAtual: baseTpv,
      tpvMedio,
      clientesMes,
      recorrencia: rec,
      tpvPorMes,
      remuneracaoTAC: remuneracaoTACMensal,
      campanha: campanhaSelecionada,
      meta,
      meses,
      atingiu,
      rows,
      usarTpvAtual
    };

    setResultado(data);
  };

  useEffect(() => {
    if (tpvMedioStr && clientesMesStr) {
      handleCalcular();
    }
  }, [campanhaId, usarTpvAtual]);

  const handleLimpar = () => {
    setTpvAtualStr('');
    setTpvMedioStr('');
    setClientesMesStr('');
    setRecorrenciaStr('');
    setUsarTpvAtual(false);
    setResultado(null);
  };

  const handleExportCSV = () => {
    if (!resultado) return;
    const rows: (string | number)[][] = [
      ['Planner de Metas B91 - Projeção de Premiações'],
      ['Campanha Alvo', resultado.campanha.nome],
      ['Meta TPV', formatMoneyNum(resultado.meta)],
      ['TPV Atual Base', formatMoneyNum(resultado.tpvAtual)],
      ['TPV Projetado por Mês', formatMoneyNum(resultado.tpvPorMes)],
      ['Clientes Novos / Mês', resultado.clientesMes],
      ['Remuneração TAC Mensal', formatMoneyNum(resultado.remuneracaoTAC)],
      ['Meses até Atingimento', resultado.meses],
      [],
      ['Mês', 'TPV Projetado/Mês', 'TPV Acumulado', 'Comissão Recorrência', 'Remuneração TAC', 'Comissão + TAC']
    ];

    resultado.rows.forEach(r => {
      rows.push([
        r.nomeMes,
        formatMoneyNum(r.tpvPorMes),
        formatMoneyNum(r.acumulado),
        formatMoneyNum(r.comissao),
        formatMoneyNum(r.remuneracaoTAC),
        formatMoneyNum(r.comissaoMaisTAC)
      ]);
    });

    exportToCSV(`Projecao_Premiacao_${resultado.campanha.premio.replace(/\s+/g, '_')}`, rows);
  };

  return (
    <div className="space-y-8 py-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm mb-1">
            <Trophy className="w-4 h-4" />
            <span>Circuito de Premiações B91</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Todas as Premiações
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Projeção personalizada do tempo necessário para conquistar cada prêmio com cálculo de recorrência e TAC
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-lg text-slate-900">Parâmetros de Crescimento</h3>
            </div>
            <span className="text-xs text-slate-500">
              Modo: <strong>{usarTpvAtual && parseValue(tpvAtualStr) > 0 ? 'Base Atual + Expansão' : 'Apenas Expansão Nova'}</strong>
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Recorrência (%)
              </label>
              <PercentageInput
                value={recorrenciaStr}
                onChange={(formatted) => setRecorrenciaStr(formatted)}
                placeholder="0,32%"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-semibold text-base transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                TPV Médio por Cliente (R$)
              </label>
              <CurrencyInput
                value={tpvMedioStr}
                onValueChange={(values) => setTpvMedioStr(values.value)}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-semibold text-base transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Novos Clientes / Mês
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  <Users className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="number"
                  min="0"
                  value={clientesMesStr}
                  onChange={(e) => setClientesMesStr(e.target.value)}
                  placeholder="Ex: 6"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-semibold text-base transition-all"
                />
              </div>
            </div>
          </div>

          {/* Considerar TPV Atual na Base - Mesmo padrão da aba Projeção de Crescimento */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800">Considerar TPV Atual na Base</span>
                <p className="text-xs text-slate-500">Inicia a projeção com a carteira atual</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const novoEstado = !usarTpvAtual;
                  setUsarTpvAtual(novoEstado);
                  if (!novoEstado) {
                    setTpvAtualStr('');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  usarTpvAtual 
                    ? 'bg-slate-900 text-white shadow' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {usarTpvAtual ? '🔘 Ativado' : '⚪ Desativado'}
              </button>
            </div>

            {usarTpvAtual && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  TPV Atual (R$)
                </label>
                <CurrencyInput
                  value={tpvAtualStr}
                  onValueChange={(values) => setTpvAtualStr(values.value)}
                  placeholder="R$ 0,00"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Selecione a Campanha / Premiação Alvo
            </label>
            <select
              value={campanhaId}
              onChange={(e) => setCampanhaId(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-semibold text-base transition-all"
            >
              {CAMPANHAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.nome} (Meta: {formatMoneyNum(c.meta)})
                </option>
              ))}
            </select>
          </div>

          {fatorCompensacaoAtual > 1 && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Compensação de Recorrência ({formatPercentage(recAtual)} vs 0,32% Padrão):</span>
                <p className="mt-0.5 text-amber-800">
                  Como a taxa informada está abaixo de 0,32%, o TPV necessário desta campanha foi ajustado para{' '}
                  <strong className="text-amber-950">{formatMoneyNum(Math.round(campanhaSelecionada.meta * fatorCompensacaoAtual))}</strong>{' '}
                  (fator +{((fatorCompensacaoAtual - 1) * 100).toFixed(1)}%) para manter o mesmo retorno financeiro da premiação.
                </p>
              </div>
            </div>
          )}

          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Remuneração TAC Mensal Calculada</span>
              </div>
              <div className="text-[11px] text-blue-700 mt-0.5">
                {clientesMes} clientes × R$ 49,90 por ativação
              </div>
            </div>
            <div className="text-xl font-extrabold text-blue-900">
              {formatMoneyNum(remuneracaoTACMensal)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleCalcular}
              className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 bg-[#ff5e36] hover:bg-[#e84f29] text-white font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer min-h-[44px]"
            >
              <Target className="w-4 h-4" />
              <span>Calcular Projeção</span>
            </button>
            <button
              onClick={handleLimpar}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 text-sm cursor-pointer min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpar</span>
            </button>
            {resultado && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 text-sm cursor-pointer min-h-[44px]"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Exportar CSV</span>
                </button>
                {onOpenReport && (
                  <button
                    onClick={() => onOpenReport(resultado)}
                    className="w-full sm:w-auto px-4 py-3 bg-[#0b1c2d] hover:bg-slate-900 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:ml-auto shadow-md shadow-slate-900/10 cursor-pointer min-h-[44px]"
                    title="Exportar projeção de premiações em PDF"
                  >
                    <FileDown className="w-4 h-4 text-[#ff5e36]" />
                    <span>Exportar PDF / Imprimir</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Selected Prize Card */}
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="relative h-56 bg-slate-100 overflow-hidden">
            <img
              src={campanhaSelecionada.imagemUrl}
              alt={campanhaSelecionada.premio}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60";
              }}
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1.5">
              <span>{campanhaSelecionada.emoji}</span>
              <span>Campanha B91</span>
            </div>
            <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-lg bg-[#ff5e36] text-white font-black text-xs shadow-md">
              Meta: {formatMoneyNum(campanhaSelecionada.meta)}
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">
                {campanhaSelecionada.premio}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {campanhaSelecionada.descricao}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Meta oficial TPV</span>
              <span className="font-extrabold text-slate-900">
                {formatMoneyNum(campanhaSelecionada.meta)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {resultado && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                TPV Base Inicial
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {formatMoneyNum(resultado.tpvAtual)}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                TPV Projetado / Mês
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-600">
                {formatMoneyNum(resultado.tpvPorMes)}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Tempo de Atingimento
              </div>
              <div className="text-xl sm:text-2xl font-black text-orange-600 flex items-center gap-1.5">
                <span>{resultado.meses}</span>
                <span className="text-sm font-semibold text-slate-500">meses</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Remuneração TAC Mensal
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600">
                {formatMoneyNum(resultado.remuneracaoTAC)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg">
                  📈 Cronograma Completo de Evolução de TPV e Renda
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evolução mês a mês até a conquista da meta de {formatMoneyNum(resultado.meta)}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                {resultado.rows.length} meses projetados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 text-xs uppercase font-bold tracking-wider">
                    <th className="py-3 px-4">Mês</th>
                    <th className="py-3 px-4">TPV Projetado/Mês</th>
                    <th className="py-3 px-4">TPV Acumulado</th>
                    <th className="py-3 px-4">Comissão (0,32%)</th>
                    <th className="py-3 px-4">Remuneração TAC</th>
                    <th className="py-3 px-4">Total Mensal (Comissão + TAC)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {resultado.rows.map((row) => (
                    <tr 
                      key={row.mesIndex} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        row.atingiuMeta ? 'bg-emerald-50/60 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {row.nomeMes}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                        +{formatMoneyNum(row.tpvPorMes)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {formatMoneyNum(row.acumulado)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-600 whitespace-nowrap">
                        {formatMoneyNum(row.comissao)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-blue-600 whitespace-nowrap">
                        {formatMoneyNum(row.remuneracaoTAC)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-purple-700 text-base">
                          {formatMoneyNum(row.comissaoMaisTAC)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {row.atingiuMeta ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            🏆 Meta Atingida!
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Em construção
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!resultado && (
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Defina seus parâmetros para projetar a premiação</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Informe o TPV médio por cliente e a quantidade estimada de novos clientes por mês, depois clique em <strong>Projetar Premiação</strong> para simular o cronograma de conquista e remunerações.
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 italic">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          * As imagens dos prêmios e campanhas são meramente ilustrativas.
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          Circuito Oficial de Premiações B91 • Gestão Comercial
        </span>
      </div>
    </div>
  );
};
