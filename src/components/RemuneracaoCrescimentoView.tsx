import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  TrendingUp, 
  Target, 
  RotateCcw, 
  FileSpreadsheet, 
  Printer, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  FileDown,
  Info
} from 'lucide-react';
import { VALOR_TAC_POR_CLIENTE } from '../data/campanhas';
import { 
  formatMoneyNum, 
  formatPercentage, 
  parseValue, 
  parsePercentage, 
  gerarMesesDinamicos, 
  exportToCSV 
} from '../utils/formatters';
import { CrescimentoData, CrescimentoRow } from '../types';
import { CurrencyInput } from './CurrencyInput';
import { PercentageInput } from './PercentageInput';

interface RemuneracaoCrescimentoViewProps {
  onOpenReport?: (data: CrescimentoData) => void;
}

export const RemuneracaoCrescimentoView: React.FC<RemuneracaoCrescimentoViewProps> = ({
  onOpenReport,
}) => {
  const [comissaoProjetadaStr, setComissaoProjetadaStr] = useState<string>('');
  const [recorrenciaStr, setRecorrenciaStr] = useState<string>('');
  const [tpvMedioStr, setTpvMedioStr] = useState<string>('');
  const [clientesMesStr, setClientesMesStr] = useState<string>('');
  
  const [usarTpvAtual, setUsarTpvAtual] = useState<boolean>(false);
  const [tpvAtualStr, setTpvAtualStr] = useState<string>('');

  const [usarTempoAtingimento, setUsarTempoAtingimento] = useState<boolean>(false);
  const [tempoAtingimento, setTempoAtingimento] = useState<number>(12);

  const [resultado, setResultado] = useState<CrescimentoData | null>(null);

  const clientesMes = parseInt(clientesMesStr, 10) || 0;
  const remuneracaoTACMensal = clientesMes * VALOR_TAC_POR_CLIENTE;

  const handleCalcular = () => {
    const comissaoProjetada = parseValue(comissaoProjetadaStr);
    const recorrencia = parsePercentage(recorrenciaStr);
    const tpvMedio = parseValue(tpvMedioStr);

    if (comissaoProjetada <= 0 || recorrencia <= 0 || tpvMedio <= 0 || clientesMes <= 0) {
      setResultado(null);
      return;
    }

    const tpvNecessario = comissaoProjetada / recorrencia;
    const tpvMensal = tpvMedio * clientesMes;

    let baseTpv = 0;
    if (usarTpvAtual) {
      baseTpv = parseValue(tpvAtualStr);
    }

    let mesesProjecao = 24;
    let tpvMensalNecessario: number | null = null;

    if (usarTempoAtingimento) {
      mesesProjecao = tempoAtingimento || 12;
      const tpvParaCrescer = Math.max(0, tpvNecessario - baseTpv);
      tpvMensalNecessario = tpvParaCrescer / mesesProjecao;
    }

    const nomesMeses = gerarMesesDinamicos(60);
    let tpvAcumulado = baseTpv;
    let mesMetaAtingida: number | null = null;
    const rows: CrescimentoRow[] = [];

    for (let mes = 1; mes <= mesesProjecao; mes++) {
      tpvAcumulado += tpvMensal;
      const comissaoMensal = tpvAcumulado * recorrencia;

      if (comissaoMensal >= comissaoProjetada && mesMetaAtingida === null) {
        mesMetaAtingida = mes;
      }

      const isMetaMonth = mesMetaAtingida === mes;
      const nomeMes = nomesMeses[mes - 1] || `Mês ${mes}`;
      const comissaoMaisTAC = comissaoMensal + remuneracaoTACMensal;

      rows.push({
        mesIndex: mes,
        nomeMes,
        tpvMensal,
        tpvAcumulado,
        comissao: comissaoMensal,
        remuneracaoTAC: remuneracaoTACMensal,
        comissaoMaisTAC,
        isMetaMonth
      });

      if (!usarTpvAtual && comissaoMensal >= comissaoProjetada) {
        break;
      }
      if (usarTpvAtual && !usarTempoAtingimento && comissaoMensal >= comissaoProjetada) {
        break;
      }
    }

    if (mesMetaAtingida !== null) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    const nomeMesAtingida = mesMetaAtingida ? nomesMeses[mesMetaAtingida - 1] || `Mês ${mesMetaAtingida}` : null;

    const data: CrescimentoData = {
      comissaoMeta: comissaoProjetada,
      recorrencia,
      tpvMedio,
      clientesMes,
      tpvNecessario,
      tpvMensal,
      tpvAtualCrescimento: baseTpv,
      usarTpvAtual,
      usarTempoAtingimento,
      tempoAtingimentoMeses: mesesProjecao,
      tpvMensalNecessario,
      remuneracaoTAC: remuneracaoTACMensal,
      mesMetaAtingida,
      nomeMesAtingida,
      rows
    };

    setResultado(data);
  };

  useEffect(() => {
    if (comissaoProjetadaStr && tpvMedioStr && clientesMesStr) {
      handleCalcular();
    }
  }, [usarTpvAtual, usarTempoAtingimento, tempoAtingimento]);

  const handleLimpar = () => {
    setComissaoProjetadaStr('');
    setRecorrenciaStr('');
    setTpvMedioStr('');
    setClientesMesStr('');
    setTpvAtualStr('');
    setResultado(null);
  };

  const handleExportCSV = () => {
    if (!resultado) return;
    const rows: (string | number)[][] = [
      ['Planner de Metas B91 - Projeção de Crescimento da Remuneração'],
      ['Comissão Alvo Mensal', formatMoneyNum(resultado.comissaoMeta)],
      ['Taxa de Recorrência', formatPercentage(resultado.recorrencia)],
      ['TPV Total Necessário', formatMoneyNum(resultado.tpvNecessario)],
      ['TPV Projetado por Mês', formatMoneyNum(resultado.tpvMensal)],
      ['Remuneração TAC Mensal', formatMoneyNum(resultado.remuneracaoTAC)],
      ['Mês de Atingimento', resultado.nomeMesAtingida || 'Não atingido no período'],
      [],
      ['Mês', 'TPV Projetado/Mês', 'TPV Acumulado', 'Comissão Recorrência', 'Remuneração TAC', 'Comissão + TAC']
    ];

    resultado.rows.forEach(r => {
      rows.push([
        r.nomeMes,
        formatMoneyNum(r.tpvMensal),
        formatMoneyNum(r.tpvAcumulado),
        formatMoneyNum(r.comissao),
        formatMoneyNum(r.remuneracaoTAC),
        formatMoneyNum(r.comissaoMaisTAC)
      ]);
    });

    exportToCSV(`Projecao_Remuneracao_R$${resultado.comissaoMeta}`, rows);
  };

  return (
    <div className="space-y-8 py-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Planejamento de Renda B91</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Projeção de Crescimento da Remuneração
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Calcule o TPV necessário para atingir sua meta salarial de comissão com remuneração TAC agregada
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-lg text-slate-900">Configuração da Meta de Renda</h3>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Comissão Desejada / Mês (R$)
            </label>
            <CurrencyInput
              value={comissaoProjetadaStr}
              onValueChange={(values) => setComissaoProjetadaStr(values.value)}
              placeholder="R$ 0,00"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-bold text-base transition-all"
            />
          </div>

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
                min="1"
                value={clientesMesStr}
                onChange={(e) => setClientesMesStr(e.target.value)}
                placeholder="Ex: 8"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-semibold text-base transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-bold text-slate-800">Considerar TPV Atual na Base</span>
                <p className="text-xs text-slate-500">Inicia a projeção com a carteira atual</p>
              </div>
              <button
                onClick={() => setUsarTpvAtual(!usarTpvAtual)}
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
              <div className="mt-2 pt-2 border-t border-slate-200">
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

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-bold text-slate-800">Fixar Tempo de Atingimento</span>
                <p className="text-xs text-slate-500">Calcula quanto você precisa gerar por mês para bater no prazo</p>
              </div>
              <button
                onClick={() => setUsarTempoAtingimento(!usarTempoAtingimento)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  usarTempoAtingimento 
                    ? 'bg-slate-900 text-white shadow' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {usarTempoAtingimento ? '🔘 Ativado' : '⚪ Desativado'}
              </button>
            </div>

            {usarTempoAtingimento && (
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Prazo Desejado (Meses)
                  </label>
                  <select
                    value={tempoAtingimento}
                    onChange={(e) => setTempoAtingimento(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                  >
                    <option value={6}>6 meses (Semestre)</option>
                    <option value={12}>12 meses (1 ano)</option>
                    <option value={18}>18 meses (1 ano e meio)</option>
                    <option value={24}>24 meses (2 anos)</option>
                    <option value={36}>36 meses (3 anos)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handleCalcular}
            className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 bg-[#ff5e36] hover:bg-[#e84f29] text-white font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer min-h-[44px]"
          >
            <Target className="w-4 h-4" />
            <span>Calcular Projeção de Renda</span>
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
                  title="Exportar projeção de remuneração em PDF"
                >
                  <FileDown className="w-4 h-4 text-[#ff5e36]" />
                  <span>Exportar PDF / Imprimir</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {resultado && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 rounded-2xl border border-blue-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-blue-950 text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Resumo da Meta de Remuneração</span>
              </h4>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                Meta: {formatMoneyNum(resultado.comissaoMeta)} / mês
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
                <div className="text-xs font-bold text-slate-500 mb-1">TPV Necessário para Meta:</div>
                <div className="text-2xl font-black text-blue-900">{formatMoneyNum(resultado.tpvNecessario)}</div>
                <div className="text-[11px] text-blue-600 mt-1">
                  {formatMoneyNum(resultado.comissaoMeta)} ÷ {formatPercentage(resultado.recorrencia)}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
                <div className="text-xs font-bold text-slate-500 mb-1">TPV Mensal Projetado:</div>
                <div className="text-2xl font-black text-blue-900">{formatMoneyNum(resultado.tpvMensal)}</div>
                <div className="text-[11px] text-blue-600 mt-1">
                  {resultado.clientesMes} clientes × {formatMoneyNum(resultado.tpvMedio)}
                </div>
              </div>

              {resultado.tpvMensalNecessario !== null && (
                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
                  <div className="text-xs font-bold text-purple-700 mb-1">TPV Mensal Necessário no Prazo:</div>
                  <div className="text-2xl font-black text-purple-900">{formatMoneyNum(resultado.tpvMensalNecessario)}</div>
                  <div className="text-[11px] text-purple-600 mt-1">
                    Para atingir em {resultado.tempoAtingimentoMeses} meses
                  </div>
                </div>
              )}
            </div>

            {resultado.nomeMesAtingida && (
              <div className="p-4 bg-emerald-100/80 border border-emerald-300 rounded-xl text-emerald-900">
                <div className="font-bold text-sm flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Meta de {formatMoneyNum(resultado.comissaoMeta)} conquistada em {resultado.nomeMesAtingida}!</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg">
                  📊 Projeção de Crescimento da Remuneração Mês a Mês
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evolução do TPV, comissão de recorrência (0,32%) e remuneração TAC (R$ 49,90)
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
                    <th className="py-3 px-4">Comissão Recorrência</th>
                    <th className="py-3 px-4">Remuneração TAC</th>
                    <th className="py-3 px-4">Total Mensal (Comissão + TAC)</th>
                    <th className="py-3 px-4">Status da Meta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {resultado.rows.map((row) => (
                    <tr 
                      key={row.mesIndex} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        row.isMetaMonth ? 'bg-emerald-50/80 font-bold border-l-4 border-l-emerald-500' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {row.nomeMes}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                        +{formatMoneyNum(row.tpvMensal)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {formatMoneyNum(row.tpvAcumulado)}
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
                        {row.isMetaMonth ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            🎯 Meta Atingida!
                          </span>
                        ) : row.comissao >= resultado.comissaoMeta ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                            Acima da Meta
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Crescendo
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
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <Target className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Defina seus parâmetros para projetar a remuneração</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Informe sua comissão desejada por mês, TPV médio por cliente e novos clientes por mês, depois clique em <strong>Calcular Projeção de Renda</strong> para visualizar a evolução mensal com comissão e TAC.
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 text-center sm:text-left">
        <span className="flex items-center gap-1.5 italic">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          * Projeção calculada considerando recorrência estimada e remuneração TAC por ativação.
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          Remuneração • Planejamento Estratégico B91
        </span>
      </div>
    </div>
  );
};
