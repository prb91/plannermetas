import React, { useState } from 'react';
import { TrendingUp, Calculator, ToggleLeft, ToggleRight, CheckCircle2, AlertCircle, Download, Zap, FileSpreadsheet } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { CrescimentoResult } from '../../types/canvaPlanner';
import { calcularCrescimentoData, formatMoneyNum, parsePercentage } from '../../utils/canvaCalculations';
import { exportToCSV } from '../../utils/exportCsv';
import { dispararConfetes } from '../../utils/confettiEffect';

interface CrescimentoPageProps {
  onOpenResumo: (data: CrescimentoResult) => void;
}

export const CrescimentoPage: React.FC<CrescimentoPageProps> = ({ onOpenResumo }) => {
  const [comissaoProjetada, setComissaoProjetada] = useState<number>(10000);
  const [recorrenciaStr, setRecorrenciaStr] = useState<string>('0,32%');
  const [tpvMedio, setTpvMedio] = useState<number>(30000);
  const [clientesMes, setClientesMes] = useState<number>(6);

  const [usarTpvAtual, setUsarTpvAtual] = useState<boolean>(false);
  const [tpvAtual, setTpvAtual] = useState<number>(150000);

  const [usarTempoAtingimento, setUsarTempoAtingimento] = useState<boolean>(false);
  const [tempoAtingimento, setTempoAtingimento] = useState<number>(12);

  const [result, setResult] = useState<CrescimentoResult | null>(() => {
    return calcularCrescimentoData(
      10000,
      0.0032,
      30000,
      6,
      false,
      150000,
      false,
      12
    );
  });

  const remuneracaoTAC = clientesMes * 49.90;

  const handleCalcular = () => {
    const rec = parsePercentage(recorrenciaStr);
    const res = calcularCrescimentoData(
      comissaoProjetada,
      rec,
      tpvMedio,
      clientesMes,
      usarTpvAtual,
      tpvAtual,
      usarTempoAtingimento,
      tempoAtingimento
    );
    setResult(res);
    dispararConfetes();
  };

  const handleLimpar = () => {
    setComissaoProjetada(0);
    setRecorrenciaStr('0,32%');
    setTpvMedio(0);
    setClientesMes(0);
    setTpvAtual(0);
    setUsarTpvAtual(false);
    setUsarTempoAtingimento(false);
    setResult(null);
  };

  const handleExportCSV = () => {
    if (!result) return;
    const headers = [
      'Mês',
      'TPV Projetado / Mês',
      'TPV Acumulado',
      'Comissão Projetada',
      'Remuneração TAC',
      'Comissão + TAC'
    ];
    const rows = result.rows.map(r => [
      r.mes,
      r.tpvMensal,
      r.tpvAcumulado,
      r.comissao,
      r.remuneracaoTAC,
      r.comissaoMaisTAC
    ]);
    exportToCSV(`planner-remuneracao-crescimento`, headers, rows);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Banner de Instruções */}
      <div className="gradient-primary text-white rounded-xl p-6 sm:p-8 shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2 text-white">
          <span>📋</span> <span>Instruções de Uso</span>
        </h2>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <p className="mb-4 text-sm font-semibold text-gray-100">
            Informe os seguintes dados:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm mb-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <strong>Comissão desejada:</strong>
                <p className="text-slate-300">Valor que você deseja alcançar mensalmente</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <strong>TPV médio dos clientes:</strong>
                <p className="text-slate-300">Valor médio transacionado por cliente</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <strong>Recorrência média:</strong>
                <p className="text-slate-300">Utilize a média da sua carteira, caso possua</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <strong>Quantidade de clientes cadastrados no mês:</strong>
                <p className="text-slate-300">Número de novos cadastros mensais</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <strong>TPV Atual (Opcional):</strong>
                <p className="text-slate-300">Caso você já possua uma carteira ativa, pode utilizar (ou não) o TPV atual como ponto de partida.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <strong>Tempo de Atingimento (Opcional):</strong>
                <p className="text-slate-300">O tempo de atingimento pode ser definido por você — o planner recalculará automaticamente as metas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Configuração */}
      <div className="card-modern space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#ff6b35]" />
          <span>Projeção de Crescimento da Remuneração</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 font-medium text-xs">
              Comissão Projetada
            </label>
            <NumericFormat
              value={comissaoProjetada}
              onValueChange={(vals) => setComissaoProjetada(vals.floatValue || 0)}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              placeholder="R$ 0,00"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-slate-900 focus:border-[#ff6b35]"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium text-xs">
              Recorrência média (%)
            </label>
            <input
              type="text"
              value={recorrenciaStr}
              onChange={(e) => setRecorrenciaStr(e.target.value)}
              placeholder="0,32%"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-slate-900 focus:border-[#ff6b35]"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium text-xs">
              TPV médio por cliente
            </label>
            <NumericFormat
              value={tpvMedio}
              onValueChange={(vals) => setTpvMedio(vals.floatValue || 0)}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              placeholder="R$ 0,00"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-slate-900 focus:border-[#ff6b35]"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium text-xs">
              Clientes cadastrados/mês
            </label>
            <input
              type="number"
              min="0"
              value={clientesMes}
              onChange={(e) => setClientesMes(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-slate-900 focus:border-[#ff6b35]"
            />
          </div>
        </div>

        {/* Remuneração TAC */}
        <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center justify-between">
          <div>
            <label className="block text-slate-800 font-bold text-sm">💰 Remuneração TAC</label>
            <p className="text-xs text-slate-600">Clientes cadastrados/mês × R$ 49,90</p>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-700 font-mono">
            {formatMoneyNum(remuneracaoTAC)}
          </div>
        </div>

        {/* Toggle TPV Atual */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">TPV Atual</h3>
            <button
              onClick={() => setUsarTpvAtual(!usarTpvAtual)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                usarTpvAtual
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {usarTpvAtual ? (
                <>
                  <ToggleRight className="w-4 h-4 text-[#ff6b35]" />
                  <span>🔘 Ativado</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-slate-500" />
                  <span>⚪ Desativado</span>
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-slate-700 mb-1.5 font-medium text-xs">
              TPV Atual (último fechamento)
            </label>
            <NumericFormat
              value={tpvAtual}
              disabled={!usarTpvAtual}
              onValueChange={(vals) => setTpvAtual(vals.floatValue || 0)}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              placeholder="R$ 0,00"
              className={`w-full border-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                usarTpvAtual
                  ? 'bg-white border-gray-200 focus:border-[#ff6b35] text-slate-900'
                  : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            />
          </div>
        </div>

        {/* Toggle Tempo de Atingimento */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Tempo de Atingimento</h3>
            <button
              onClick={() => setUsarTempoAtingimento(!usarTempoAtingimento)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                usarTempoAtingimento
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {usarTempoAtingimento ? (
                <>
                  <ToggleRight className="w-4 h-4 text-[#ff6b35]" />
                  <span>🔘 Ativado</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-slate-500" />
                  <span>⚪ Desativado</span>
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-slate-700 mb-1.5 font-medium text-xs">
              Tempo para atingir meta (meses)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={tempoAtingimento}
              disabled={!usarTempoAtingimento}
              onChange={(e) => setTempoAtingimento(parseInt(e.target.value) || 12)}
              placeholder="12"
              className={`w-full border-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                usarTempoAtingimento
                  ? 'bg-white border-gray-200 focus:border-[#ff6b35] text-slate-900'
                  : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={handleCalcular}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Calcular Projeção</span>
          </button>
          <button
            onClick={handleLimpar}
            className="btn-secondary flex-1 flex items-center justify-center"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Resultados da Projeção */}
      {result && (
        <div className="card-modern space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>📊</span>
              <span>Projeção de Crescimento</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenResumo(result)}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>📸 Ver Resumo para Captura</span>
              </button>
            </div>
          </div>

          {/* Banner Resumo */}
          <div className="bg-blue-50/80 p-5 rounded-xl border border-blue-200 space-y-4">
            <h4 className="font-bold text-blue-900 text-sm">Resumo do Cálculo</h4>
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="font-semibold text-blue-700 block mb-0.5">TPV Necessário para Meta:</span>
                <span className="text-lg font-bold text-blue-950 font-mono">{formatMoneyNum(result.tpvNecessario)}</span>
                <span className="text-[11px] text-blue-600 block mt-0.5">
                  {formatMoneyNum(result.comissaoProjetada)} ÷ {(result.recorrencia * 100).toFixed(2)}%
                </span>
              </div>

              <div>
                <span className="font-semibold text-blue-700 block mb-0.5">TPV Mensal Projetado:</span>
                <span className="text-lg font-bold text-blue-950 font-mono">{formatMoneyNum(result.tpvMensal)}</span>
                <span className="text-[11px] text-blue-600 block mt-0.5">
                  {result.clientesMes} clientes × {formatMoneyNum(result.tpvMedio)}
                </span>
              </div>

              {result.tpvMensalNecessario !== null && (
                <div>
                  <span className="font-semibold text-purple-700 block mb-0.5">TPV Mensal Necessário:</span>
                  <span className="text-lg font-bold text-purple-950 font-mono">{formatMoneyNum(result.tpvMensalNecessario)}</span>
                  <span className="text-[11px] text-purple-600 block mt-0.5">
                    Para atingir em {result.tempoAtingimento} meses
                  </span>
                </div>
              )}
            </div>

            {/* Viabilidade do prazo fixado */}
            {result.tpvMensalNecessario !== null && (
              <div
                className={`p-3.5 rounded-lg border text-xs ${
                  result.metaAlcancavel
                    ? 'bg-green-100 border-green-300 text-green-900'
                    : 'bg-red-100 border-red-300 text-red-900'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {result.metaAlcancavel ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-700" />
                      <span>✅ Meta Alcançável!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-700" />
                      <span>⚠️ Meta Desafiadora!</span>
                    </>
                  )}
                </div>
                <div className="mt-1">
                  {result.metaAlcancavel
                    ? `Seu TPV mensal de ${formatMoneyNum(result.tpvMensal)} é suficiente para atingir a meta em ${result.tempoAtingimento} meses.`
                    : `Você precisa de mais ${formatMoneyNum(result.tpvMensalNecessario - result.tpvMensal)} por mês para atingir a meta no tempo desejado.`
                  }
                </div>
              </div>
            )}
          </div>

          {/* Notificação de Meta Atingida */}
          {result.mesNomeAtingida && (
            <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h4 className="text-green-800 font-bold text-sm">
                  Meta atingida em {result.mesNomeAtingida}!
                </h4>
                <p className="text-green-700 text-xs mt-0.5">
                  Você atingirá a comissão de <strong>{formatMoneyNum(result.comissaoProjetada)}</strong> em {result.mesNomeAtingida}.
                </p>
              </div>
            </div>
          )}

          {/* Tabela de Evolução */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                  <th className="py-3 px-3 font-bold text-xs uppercase">Mês</th>
                  <th className="py-3 px-3 font-bold text-xs uppercase">TPV Projetado/Mês</th>
                  <th className="py-3 px-3 font-bold text-xs uppercase">TPV Acumulado</th>
                  <th className="py-3 px-3 font-bold text-xs uppercase">Comissão Projetada</th>
                  <th className="py-3 px-3 font-bold text-xs uppercase">Remuneração TAC</th>
                  <th className="py-3 px-3 font-bold text-xs uppercase">Comissão + TAC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.rows.map((row, idx) => {
                  const isMeta = row.mes === result.mesNomeAtingida;

                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50 transition-colors ${
                        isMeta ? 'bg-green-50/80 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-medium text-gray-900">{row.mes}</td>
                      <td className="py-3 px-3 font-mono text-gray-700">{formatMoneyNum(row.tpvMensal)}</td>
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">{formatMoneyNum(row.tpvAcumulado)}</td>
                      <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">{formatMoneyNum(row.comissao)}</td>
                      <td className="py-3 px-3 font-mono text-blue-700 font-semibold">{formatMoneyNum(row.remuneracaoTAC)}</td>
                      <td className="py-3 px-3 font-mono text-purple-700 font-bold">{formatMoneyNum(row.comissaoMaisTAC)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
