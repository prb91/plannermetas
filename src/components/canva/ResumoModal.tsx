import React from 'react';
import { ArrowLeft, Printer, Award, TrendingUp, MapPin } from 'lucide-react';
import { ConvencaoRJResult, PremiacoesResult, CrescimentoResult } from '../../types/canvaPlanner';
import { formatMoneyNum } from '../../utils/canvaCalculations';

interface ResumoModalProps {
  type: 'convencaoRJ' | 'premiacoes' | 'crescimento' | null;
  data: ConvencaoRJResult | PremiacoesResult | CrescimentoResult | null;
  onClose: () => void;
}

export const ResumoModal: React.FC<ResumoModalProps> = ({ type, data, onClose }) => {
  if (!type || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* Barra superior de controles (escondida na impressão) */}
        <div className="no-print flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onClose}
            className="btn-secondary py-2 px-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Planner</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-primary py-2 px-5 text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>

        {/* Conteúdo específico por tipo */}
        {type === 'convencaoRJ' && (() => {
          const d = data as ConvencaoRJResult;
          return (
            <div className="space-y-6">
              <div className="gradient-accent text-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3">
                  <MapPin className="w-8 h-8" />
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white m-0">
                      🏖️ Resumo - Convenção RJ
                    </h1>
                    <p className="text-orange-100 text-sm mt-1">{d.campanha.nome}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <span className="text-xs text-blue-700 font-semibold uppercase block">TPV Atual</span>
                  <strong className="text-lg font-bold text-blue-950 font-mono mt-1 block">
                    {formatMoneyNum(d.tpvAtual)}
                  </strong>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <span className="text-xs text-orange-700 font-semibold uppercase block">Meta da Campanha</span>
                  <strong className="text-lg font-bold text-orange-950 font-mono mt-1 block">
                    {formatMoneyNum(d.campanha.meta)}
                  </strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-700 font-semibold uppercase block">Prazo de Atingimento</span>
                  <strong className="text-lg font-bold text-slate-900 font-mono mt-1 block">
                    {d.mesesDisponiveis} meses
                  </strong>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-gray-300 text-slate-800">
                      <th className="py-2.5 px-3 font-bold">Mês</th>
                      <th className="py-2.5 px-3 font-bold">Meta TPV</th>
                      <th className="py-2.5 px-3 font-bold">Crescimento</th>
                      <th className="py-2.5 px-3 font-bold">TPV Atingido</th>
                      <th className="py-2.5 px-3 font-bold">Remuneração</th>
                      <th className="py-2.5 px-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {d.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold">{row.mes}</td>
                        <td className="py-2.5 px-3 font-mono">{formatMoneyNum(row.meta)}</td>
                        <td className="py-2.5 px-3 font-mono text-orange-600">
                          {row.crescimento > 0 ? `+${formatMoneyNum(row.crescimento)}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold">{formatMoneyNum(row.tpvAtingido)}</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">{formatMoneyNum(row.remuneracao)}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center text-xs text-gray-400 pt-4">
                Planner de Metas B91 • Gestão PR Negócios • {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          );
        })()}

        {type === 'premiacoes' && (() => {
          const d = data as PremiacoesResult;
          return (
            <div className="space-y-6">
              <div className="gradient-primary text-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-amber-300" />
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white m-0">
                      🏆 Resumo - Todas as Premiações
                    </h1>
                    <p className="text-gray-300 text-sm mt-1">{d.campanha.nome}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-semibold block">TPV Inicial</span>
                  <strong className="text-base font-bold font-mono">{formatMoneyNum(d.tpvAtual)}</strong>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="text-[11px] text-blue-700 font-semibold block">TPV / Mês</span>
                  <strong className="text-base font-bold font-mono text-blue-900">+{formatMoneyNum(d.tpvPorMes)}</strong>
                </div>

                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <span className="text-[11px] text-emerald-700 font-semibold block">Remuneração TAC</span>
                  <strong className="text-base font-bold font-mono text-emerald-800">{formatMoneyNum(d.remuneracaoTAC)}</strong>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <span className="text-[11px] text-orange-700 font-semibold block">Tempo Estimado</span>
                  <strong className="text-base font-bold font-mono text-orange-900">{d.meses} meses</strong>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-gray-300 text-slate-800">
                      <th className="py-2.5 px-3 font-bold">Mês</th>
                      <th className="py-2.5 px-3 font-bold">TPV Projetado / Mês</th>
                      <th className="py-2.5 px-3 font-bold">TPV Acumulado</th>
                      <th className="py-2.5 px-3 font-bold">Comissão Mensal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {d.rows.map((row) => (
                      <tr key={row.mesNum} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold">{row.mesNome}</td>
                        <td className="py-2.5 px-3 font-mono text-blue-700">+{formatMoneyNum(row.tpvPorMes)}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">{formatMoneyNum(row.acumulado)}</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">{formatMoneyNum(row.comissao)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center text-xs text-gray-400 pt-4">
                Planner de Metas B91 • Gestão PR Negócios • {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          );
        })()}

        {type === 'crescimento' && (() => {
          const d = data as CrescimentoResult;
          return (
            <div className="space-y-6">
              <div className="gradient-primary text-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-amber-300" />
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white m-0">
                      📈 Resumo - Projeção de Remuneração
                    </h1>
                    <p className="text-gray-300 text-sm mt-1">Evolução da renda mensal e comissões</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <span className="text-[11px] text-purple-700 font-semibold block">Comissão Meta</span>
                  <strong className="text-base font-bold font-mono text-purple-900">{formatMoneyNum(d.comissaoProjetada)}</strong>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="text-[11px] text-blue-700 font-semibold block">TPV Necessário</span>
                  <strong className="text-base font-bold font-mono text-blue-900">{formatMoneyNum(d.tpvNecessario)}</strong>
                </div>

                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <span className="text-[11px] text-emerald-700 font-semibold block">Remuneração TAC</span>
                  <strong className="text-base font-bold font-mono text-emerald-800">{formatMoneyNum(d.remuneracaoTAC)}</strong>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <span className="text-[11px] text-amber-700 font-semibold block">Meta Atingida Em</span>
                  <strong className="text-base font-bold font-mono text-amber-900">{d.mesNomeAtingida || `${d.tempoAtingimento} meses`}</strong>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-gray-300 text-slate-800">
                      <th className="py-2.5 px-3 font-bold">Mês</th>
                      <th className="py-2.5 px-3 font-bold">TPV / Mês</th>
                      <th className="py-2.5 px-3 font-bold">TPV Acumulado</th>
                      <th className="py-2.5 px-3 font-bold">Comissão</th>
                      <th className="py-2.5 px-3 font-bold">TAC</th>
                      <th className="py-2.5 px-3 font-bold">Total Mensal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {d.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold">{row.mes}</td>
                        <td className="py-2.5 px-3 font-mono">{formatMoneyNum(row.tpvMensal)}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">{formatMoneyNum(row.tpvAcumulado)}</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">{formatMoneyNum(row.comissao)}</td>
                        <td className="py-2.5 px-3 font-mono text-blue-700 font-semibold">{formatMoneyNum(row.remuneracaoTAC)}</td>
                        <td className="py-2.5 px-3 font-mono text-purple-700 font-bold">{formatMoneyNum(row.comissaoMaisTAC)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center text-xs text-gray-400 pt-4">
                Planner de Metas B91 • Gestão PR Negócios • {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
