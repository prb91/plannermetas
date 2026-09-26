import React, { useState } from 'react';
import { MapPin, CheckSquare, Calculator, Zap, BarChart3, Download, AlertTriangle, Calendar, FileSpreadsheet } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { CAMPANHAS_LISTA, ConvencaoRJResult } from '../../types/canvaPlanner';
import { calcularConvencaoRJData, formatMoneyNum, parsePercentage } from '../../utils/canvaCalculations';
import { exportToCSV } from '../../utils/exportCsv';
import { dispararConfetes } from '../../utils/confettiEffect';

interface ConvencaoRJPageProps {
  onOpenResumo: (data: ConvencaoRJResult) => void;
}

export const ConvencaoRJPage: React.FC<ConvencaoRJPageProps> = ({ onOpenResumo }) => {
  const [tpvAtual, setTpvAtual] = useState<number>(500000);
  const [recorrenciaStr, setRecorrenciaStr] = useState<string>('0,32%');
  const [campanhaId, setCampanhaId] = useState<number>(0);
  const [result, setResult] = useState<ConvencaoRJResult | null>(() => {
    return calcularConvencaoRJData(500000, 0.0032, 0);
  });

  const handleCalcular = () => {
    if (tpvAtual <= 0) return;
    const rec = parsePercentage(recorrenciaStr);
    const res = calcularConvencaoRJData(tpvAtual, rec, campanhaId);
    setResult(res);
    dispararConfetes();
  };

  const handleLimpar = () => {
    setTpvAtual(0);
    setRecorrenciaStr('0,32%');
    setCampanhaId(0);
    setResult(null);
  };

  const selectedCampanha = CAMPANHAS_LISTA[campanhaId] || CAMPANHAS_LISTA[0];

  const handleExportCSV = () => {
    if (!result) return;
    const headers = ['Mês', 'Meta TPV', 'Crescimento', 'TPV Atingido', 'Remuneração', 'Status'];
    const rows = result.rows.map(r => [
      r.mes,
      r.meta,
      r.crescimento,
      r.tpvAtingido,
      r.remuneracao,
      r.status
    ]);
    exportToCSV(`planner-convencao-rj-${result.campanha.nome.replace(/\s+/g, '-').toLowerCase()}`, headers, rows);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Banner Principal */}
      <div className="gradient-accent text-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-7 h-7 sm:w-8 sm:h-8" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Planner Convenção RJ
          </h2>
        </div>
        <p className="text-orange-100 text-sm sm:text-base">
          Calcule seu crescimento necessário para atingir a premiação na convenção regional
        </p>
      </div>

      {/* Regras de Elegibilidade */}
      <div className="card-modern">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="w-6 h-6 text-[#ff6b35]" />
          <h3 className="text-xl font-bold text-gray-900">
            Regras de Elegibilidade
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <span className="badge-success shrink-0 font-bold">1</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Atingir TPV mínimo</p>
              <p className="text-xs text-gray-600 mt-0.5">Valores abaixo da meta não são considerados</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="badge-success shrink-0 font-bold">2</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Recorrência mínima 0,32%</p>
              <p className="text-xs text-gray-600 mt-0.5">Mantida durante todo o período</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="badge-warning shrink-0 font-bold">3</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Manter 3 meses consecutivos</p>
              <p className="text-xs text-gray-600 mt-0.5">TPV e recorrência devem ser mantidos</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>⚠️ Importante:</strong> Caso a recorrência seja menor, compensar no volume TPV para equilibrar a diferença.
            </span>
          </div>

          <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong>⏰ Cronograma:</strong> Meses variáveis de crescimento construído + 3 meses para manter.
            </span>
          </div>
        </div>
      </div>

      {/* Formulário de Dados */}
      <div className="card-modern">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-[#ff6b35]" />
          <span>Dados de Entrada</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              💰 TPV Atual (último mês)
            </label>
            <NumericFormat
              value={tpvAtual}
              onValueChange={(vals) => setTpvAtual(vals.floatValue || 0)}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              placeholder="R$ 0,00"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff6b35] text-base font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              📊 Recorrência (%)
            </label>
            <input
              type="text"
              value={recorrenciaStr}
              onChange={(e) => setRecorrenciaStr(e.target.value)}
              placeholder="0,32%"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff6b35] text-base font-semibold text-gray-800"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 text-sm">
            🎁 Selecionar Campanha
          </label>
          <select
            value={campanhaId}
            onChange={(e) => setCampanhaId(Number(e.target.value))}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#ff6b35] text-base font-semibold text-gray-800 bg-white"
          >
            {CAMPANHAS_LISTA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.nome} (Meta: {formatMoneyNum(c.meta)})
              </option>
            ))}
          </select>
        </div>

        {/* Campanha Card Preview */}
        <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row items-center gap-4">
          <img
            src={selectedCampanha.imagem}
            alt={selectedCampanha.nome}
            className="w-32 h-20 object-cover rounded-lg shadow-xs border border-gray-300 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedCampanha.emoji}</span>
              <h4 className="text-base font-bold text-gray-900">{selectedCampanha.nome}</h4>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Meta estipulada de TPV: <strong className="text-slate-900 font-mono">{formatMoneyNum(selectedCampanha.meta)}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
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
              <BarChart3 className="w-6 h-6 text-[#ff6b35]" />
              <span>Projeção Detalhada</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenResumo(result)}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Ver Resumo para Captura</span>
              </button>
            </div>
          </div>

          {result.jaAtingiu ? (
            <div className="p-6 bg-green-50 rounded-xl border border-green-200 text-center space-y-3">
              <div className="text-5xl">🎉</div>
              <h4 className="text-2xl font-bold text-green-800">
                Parabéns! Meta já atingida!
              </h4>
              <p className="text-green-700 text-sm">
                Seu TPV atual de <strong>{formatMoneyNum(result.tpvAtual)}</strong> já garante a premiação: <strong>{result.campanha.nome}</strong>
              </p>
              <div className="p-3 bg-green-100 rounded-lg inline-block">
                <p className="text-green-800 font-semibold text-sm">
                  Comissão mensal estimada: {formatMoneyNum(result.tpvAtual * result.recorrencia)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Context Summary */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                  <span className="text-xs text-blue-700 font-medium block mb-1">📅 Convenção considerada</span>
                  <strong className="text-base text-blue-950 font-bold">Julho de {result.anoConvencao}</strong>
                  <span className="text-xs text-blue-600 block mt-1">{result.mesesDisponiveis} meses de construção</span>
                </div>

                <div className="bg-orange-50/70 p-4 rounded-xl border border-orange-100">
                  <span className="text-xs text-orange-700 font-medium block mb-1">Crescimento Mensal Necessário</span>
                  <strong className="text-base text-orange-950 font-bold font-mono">
                    +{formatMoneyNum(result.crescimentoNecessario)}/mês
                  </strong>
                  <span className="text-xs text-orange-600 block mt-1">+{result.percentualCrescimento.toFixed(1)}% ao mês</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Índice de Viabilidade</span>
                  <strong className={`text-base font-bold ${result.viabilidadeCor}`}>
                    {result.viabilidade}
                  </strong>
                  <span className="text-xs text-slate-500 block mt-1">baseado no ritmo de aceleração</span>
                </div>
              </div>

              {/* Tabela mês a mês */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                      <th className="py-3 px-4 font-bold text-xs uppercase">Mês</th>
                      <th className="py-3 px-4 font-bold text-xs uppercase">Meta TPV</th>
                      <th className="py-3 px-4 font-bold text-xs uppercase">Crescimento</th>
                      <th className="py-3 px-4 font-bold text-xs uppercase">TPV Atingido</th>
                      <th className="py-3 px-4 font-bold text-xs uppercase">Remuneração</th>
                      <th className="py-3 px-4 font-bold text-xs uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                    {result.rows.map((row, idx) => {
                      const isMeta = row.status.includes('Meta Atingida');
                      const isManutencao = row.status.includes('Manutenção');

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-orange-50/30 transition-colors ${
                            isMeta ? 'bg-emerald-50 font-semibold' : isManutencao ? 'bg-sky-50/40' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-medium text-gray-900">{row.mes}</td>
                          <td className="py-3 px-4 font-mono text-gray-700">{formatMoneyNum(row.meta)}</td>
                          <td className="py-3 px-4 font-mono text-orange-600">
                            {row.crescimento > 0 ? `+${formatMoneyNum(row.crescimento)}` : '-'}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">{formatMoneyNum(row.tpvAtingido)}</td>
                          <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">{formatMoneyNum(row.remuneracao)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isMeta
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isManutencao
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
