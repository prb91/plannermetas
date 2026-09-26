import React, { useState } from 'react';
import { Award, Calculator, BarChart3, Download, ToggleLeft, ToggleRight, Info, Zap, FileSpreadsheet } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { CAMPANHAS_LISTA, PremiacoesResult } from '../../types/canvaPlanner';
import { calcularPremiacoesData, formatMoneyNum, parsePercentage } from '../../utils/canvaCalculations';
import { exportToCSV } from '../../utils/exportCsv';
import { dispararConfetes } from '../../utils/confettiEffect';

interface PremiacoesPageProps {
  onOpenResumo: (data: PremiacoesResult) => void;
}

export const PremiacoesPage: React.FC<PremiacoesPageProps> = ({ onOpenResumo }) => {
  const [usarTpvAtual, setUsarTpvAtual] = useState<boolean>(true);
  const [tpvAtual, setTpvAtual] = useState<number>(300000);
  const [tpvMedio, setTpvMedio] = useState<number>(35000);
  const [clientesMes, setClientesMes] = useState<number>(5);
  const [recorrenciaStr, setRecorrenciaStr] = useState<string>('0,32%');
  const [campanhaId, setCampanhaId] = useState<number>(0);
  const [result, setResult] = useState<PremiacoesResult | null>(() => {
    return calcularPremiacoesData(300000, 35000, 5, 0.0032, 0, true);
  });

  const remuneracaoTAC = clientesMes * 49.90;

  const handleCalcular = () => {
    const rec = parsePercentage(recorrenciaStr);
    const res = calcularPremiacoesData(
      tpvAtual,
      tpvMedio,
      clientesMes,
      rec,
      campanhaId,
      usarTpvAtual
    );
    setResult(res);
    dispararConfetes();
  };

  const handleLimpar = () => {
    setTpvAtual(0);
    setTpvMedio(0);
    setClientesMes(0);
    setRecorrenciaStr('0,32%');
    setCampanhaId(0);
    setResult(null);
  };

  const selectedCampanha = CAMPANHAS_LISTA[campanhaId] || CAMPANHAS_LISTA[0];

  const handleExportCSV = () => {
    if (!result) return;
    const headers = ['Mês', 'TPV Novo / Mês', 'TPV Acumulado', 'Comissão Mensal'];
    const rows = result.rows.map(r => [
      r.mesNome,
      r.tpvPorMes,
      r.acumulado,
      r.comissao
    ]);
    exportToCSV(`planner-premiacoes-${result.campanha.nome.replace(/\s+/g, '-').toLowerCase()}`, headers, rows);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Banner Explicativo */}
      <div className="gradient-primary text-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          📊 Projeção de Cenário de Comissão
        </h2>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-white">
            <Info className="w-4 h-4 text-amber-300" />
            <span>Orientações de Uso</span>
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-gray-200">
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-300">•</span>
              <span><strong>Ative ou desative</strong> a opção de usar o seu TPV atual como ponto de partida</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-300">•</span>
              <span><strong>TPV médio por cliente:</strong> é o valor transacionado médio projetado por cliente ao mês</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-300">•</span>
              <span><strong>Clientes cadastrados/mês:</strong> quantidade de cadastros fechados por mês</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card de Configuração */}
      <div className="card-modern space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-[#ff6b35]" />
          <span>Todas as Premiações</span>
        </h2>

        {/* Toggle para TPV Atual */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-800">Modo de Cálculo</h3>
            <button
              onClick={() => setUsarTpvAtual(!usarTpvAtual)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                usarTpvAtual
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {usarTpvAtual ? (
                <>
                  <ToggleRight className="w-4 h-4 text-[#ff6b35]" />
                  <span>🔘 Com TPV Atual</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-slate-500" />
                  <span>⚪ Sem TPV Atual</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-600">
            <strong>Modo Ativo:</strong> {usarTpvAtual ? 'Calcula usando o TPV atual como base + crescimento mensal' : 'Inicia do zero e projeta apenas o crescimento dos novos clientes'}
          </p>
        </div>

        {/* Inputs em Grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 font-medium text-xs">
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
              className={`w-full border-2 rounded-lg px-4 py-3 text-sm font-semibold ${
                usarTpvAtual
                  ? 'bg-white border-gray-200 focus:border-[#ff6b35] text-slate-900'
                  : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
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

        {/* Recorrência e Seleção de Campanha */}
        <div className="grid sm:grid-cols-3 gap-4">
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

          <div className="sm:col-span-2">
            <label className="block text-slate-700 mb-2 font-medium text-xs">
              Selecionar campanha
            </label>
            <select
              value={campanhaId}
              onChange={(e) => setCampanhaId(Number(e.target.value))}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-slate-900 bg-white focus:border-[#ff6b35]"
            >
              {CAMPANHAS_LISTA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.nome} (Meta: {formatMoneyNum(c.meta)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Imagem do Prêmio Selecionado */}
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row items-center gap-4">
          <img
            src={selectedCampanha.imagem}
            alt={selectedCampanha.nome}
            className="w-32 h-20 object-cover rounded-lg shadow-xs border border-gray-300 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <h4 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
              <span>{selectedCampanha.emoji}</span>
              <span>{selectedCampanha.nome}</span>
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              Meta estipulada de TPV: <strong className="text-slate-900 font-mono">{formatMoneyNum(selectedCampanha.meta)}</strong>
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
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

      {/* Resultados */}
      {result && (
        <div className="card-modern space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#ff6b35]" />
              <span>Resultado da Projeção</span>
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

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">TPV Inicial</div>
              <div className="text-lg font-bold text-slate-900 font-mono mt-1">
                {formatMoneyNum(result.tpvAtual)}
              </div>
            </div>

            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
              <div className="text-xs text-blue-700 font-medium">TPV Projetado / mês</div>
              <div className="text-lg font-bold text-blue-900 font-mono mt-1">
                +{formatMoneyNum(result.tpvPorMes)}
              </div>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
              <div className="text-xs text-emerald-700 font-medium">Meses estimados p/ Meta</div>
              <div className="text-lg font-bold text-emerald-800 font-mono mt-1">
                {result.meses} meses
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                  <th className="py-3 px-4 font-bold text-xs uppercase">Mês</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">TPV Novo / Mês</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">TPV Acumulado</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase">Comissão Mensal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {result.rows.map((row) => (
                  <tr key={row.mesNum} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{row.mesNome}</td>
                    <td className="py-3 px-4 font-mono text-blue-700 font-medium">+{formatMoneyNum(row.tpvPorMes)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{formatMoneyNum(row.acumulado)}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">{formatMoneyNum(row.comissao)}</td>
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
