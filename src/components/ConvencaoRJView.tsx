import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Palmtree, 
  Target, 
  Calendar, 
  AlertTriangle, 
  FileSpreadsheet, 
  Printer, 
  RotateCcw,
  Info,
  FileDown
} from 'lucide-react';
import { CAMPANHAS, RECORRENCIA_PADRAO } from '../data/campanhas';
import { 
  formatMoneyNum, 
  formatPercentage, 
  parseValue, 
  parsePercentage, 
  gerarMesesDinamicos,
  exportToCSV 
} from '../utils/formatters';
import { ConvencaoRJData, CronogramaRowRJ } from '../types';
import { CurrencyInput } from './CurrencyInput';
import { PercentageInput } from './PercentageInput';

interface ConvencaoRJViewProps {
  initialTpv?: number;
  initialRecorrencia?: number;
  initialCampanhaId?: number;
  onOpenReport?: (data: ConvencaoRJData) => void;
}

export const ConvencaoRJView: React.FC<ConvencaoRJViewProps> = ({
  initialTpv,
  initialRecorrencia,
  initialCampanhaId = 0,
  onOpenReport,
}) => {
  // Cycle calculations
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1; // 1-12
  const anoAtual = hoje.getFullYear();
  const anoConvencao = mesAtual >= 7 ? anoAtual + 1 : anoAtual;
  const dataLimite = new Date(anoConvencao, 5, 1); // June (month 5 in 0-index)
  let calcMesesDisponiveis = (dataLimite.getFullYear() - hoje.getFullYear()) * 12 + (dataLimite.getMonth() - hoje.getMonth()) + 1;
  if (calcMesesDisponiveis < 1) calcMesesDisponiveis = 1;

  const [tpvAtualStr, setTpvAtualStr] = useState<string>(initialTpv ? initialTpv.toString() : '');
  const [recorrenciaStr, setRecorrenciaStr] = useState<string>(initialRecorrencia ? (initialRecorrencia * 100).toFixed(2).replace('.', ',') + '%' : '');
  const [campanhaId, setCampanhaId] = useState<number>(initialCampanhaId);
  const [resultado, setResultado] = useState<ConvencaoRJData | null>(null);

  const campanhaSelecionada = CAMPANHAS.find(c => c.id === campanhaId) || CAMPANHAS[0];

  const handleCalcular = () => {
    const tpv = parseValue(tpvAtualStr);
    const rec = parsePercentage(recorrenciaStr);

    if (tpv <= 0) {
      setResultado(null);
      return;
    }

    const meta = campanhaSelecionada.meta;
    const jaAtingida = tpv >= meta;

    if (jaAtingida) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const faltam = Math.max(0, meta - tpv);
    const crescimentoNecessario = faltam / calcMesesDisponiveis;
    const percentualCrescimento = tpv > 0 ? (crescimentoNecessario / tpv) * 100 : 0;

    let viabilidadeLabel = "🟢 Alcançável";
    let viabilidadeTipo: 'alcancavel' | 'desafiador' | 'agressivo' = 'alcancavel';
    let viabilidadeCor = "text-emerald-700 bg-emerald-50 border-emerald-200";

    if (percentualCrescimento <= 15) {
      viabilidadeLabel = "🟢 Alcançável (até 15% a.m.)";
      viabilidadeTipo = 'alcancavel';
      viabilidadeCor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    } else if (percentualCrescimento <= 30) {
      viabilidadeLabel = "🟡 Desafiador (15% a 30% a.m.)";
      viabilidadeTipo = 'desafiador';
      viabilidadeCor = "text-amber-700 bg-amber-50 border-amber-200";
    } else {
      viabilidadeLabel = "🔴 Agressivo (> 30% a.m.)";
      viabilidadeTipo = 'agressivo';
      viabilidadeCor = "text-rose-700 bg-rose-50 border-rose-200";
    }

    const meses = gerarMesesDinamicos(8);
    const cronograma: CronogramaRowRJ[] = [];
    let mesesValidosSequencia = 0;

    for (let i = 0; i < 8; i++) {
      let tpvDoMes: number;
      if (i === 0) {
        tpvDoMes = tpv + crescimentoNecessario;
      } else if (i < calcMesesDisponiveis) {
        tpvDoMes = tpv + (crescimentoNecessario * (i + 1));
      } else {
        tpvDoMes = meta;
      }

      const remuneracao = tpvDoMes * rec;
      const crescimentoMes = i < calcMesesDisponiveis ? crescimentoNecessario : 0;
      const mesNumero = parseInt(meses[i].split('/')[0]);
      const anoReferencia = mesNumero <= 7 ? anoConvencao : anoConvencao + 1;

      if (tpvDoMes >= meta) {
        mesesValidosSequencia++;
      } else {
        mesesValidosSequencia = 0;
      }

      let status = '';
      let statusTipo: CronogramaRowRJ['statusTipo'] = 'construcao';

      if (mesNumero === 7) {
        if (mesesValidosSequencia >= 3) {
          status = '🏆 Elegível (Final)';
          statusTipo = 'elegivel_final';
        } else {
          status = '❌ Não elegível (Final)';
          statusTipo = 'nao_elegivel';
        }
      } else if (mesNumero >= 4 && mesNumero <= 6) {
        if (tpvDoMes < meta) {
          status = '❌ Não elegível';
          statusTipo = 'nao_elegivel';
        } else if (mesesValidosSequencia < 3) {
          status = '⚠️ Validação';
          statusTipo = 'validacao';
        } else {
          status = '🏆 Elegível';
          statusTipo = 'elegivel';
        }
      } else {
        if (tpvDoMes < meta) {
          status = '⏳ Construção';
          statusTipo = 'construcao';
        } else {
          status = '⚠️ Pré-validação';
          statusTipo = 'pre_validacao';
        }
      }

      cronograma.push({
        mes: meses[i],
        mesNumero,
        tpvMeta: meta,
        crescimento: crescimentoMes,
        tpvAtingido: tpvDoMes,
        remuneracao,
        status,
        statusTipo,
        anoReferencia
      });
    }

    const data: ConvencaoRJData = {
      tpvAtual: tpv,
      recorrencia: rec,
      campanha: campanhaSelecionada,
      mesesDisponiveis: calcMesesDisponiveis,
      anoConvencao,
      meta,
      faltam,
      crescimentoNecessario,
      percentualCrescimento,
      viabilidade: {
        label: viabilidadeLabel,
        tipo: viabilidadeTipo,
        cor: viabilidadeCor
      },
      cronograma,
      jaAtingida
    };

    setResultado(data);
  };

  useEffect(() => {
    if (tpvAtualStr && parseValue(tpvAtualStr) > 0) {
      handleCalcular();
    }
  }, [campanhaId]);

  const handleLimpar = () => {
    setTpvAtualStr('');
    setRecorrenciaStr('');
    setResultado(null);
  };

  const handleExportCSV = () => {
    if (!resultado) return;
    const rows: (string | number)[][] = [
      ['Planner de Metas B91 - Convenção RJ'],
      ['Campanha', resultado.campanha.nome],
      ['Meta TPV', formatMoneyNum(resultado.meta)],
      ['TPV Atual', formatMoneyNum(resultado.tpvAtual)],
      ['Recorrência', formatPercentage(resultado.recorrencia)],
      ['Meses Disponíveis', resultado.mesesDisponiveis],
      ['Crescimento Necessário/Mês', formatMoneyNum(resultado.crescimentoNecessario)],
      ['Viabilidade', resultado.viabilidade.label],
      [],
      ['Mês', 'Meta TPV', 'Crescimento', 'TPV Atingido', 'Remuneração Mensal', 'Status']
    ];

    resultado.cronograma.forEach(r => {
      rows.push([
        r.mes,
        formatMoneyNum(r.tpvMeta),
        formatMoneyNum(r.crescimento),
        formatMoneyNum(r.tpvAtingido),
        formatMoneyNum(r.remuneracao),
        r.status
      ]);
    });

    exportToCSV(`Convencao_RJ_${resultado.campanha.premio.replace(/\s+/g, '_')}`, rows);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-1">
            <Palmtree className="w-4 h-4" />
            <span>Convenção Regional B91</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Planner Convenção RJ
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Planejamento estratégico de TPV para atingimento das metas com regras de elegibilidade oficial
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-xl border border-emerald-200 text-xs sm:text-sm">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <div>Convenção: <strong>Julho de {anoConvencao}</strong></div>
            <div className="text-emerald-700 text-xs">Meses de crescimento: <strong>{calcMesesDisponiveis} meses</strong></div>
          </div>
        </div>
      </div>

      {/* Input & Form Card */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Target className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-lg text-slate-900">Parâmetros de Simulação</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                TPV Atual (R$)
              </label>
              <CurrencyInput
                value={tpvAtualStr}
                onValueChange={(values) => setTpvAtualStr(values.value)}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-semibold text-base transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">Volume transacionado atual da sua carteira</p>
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
              <p className="text-[11px] text-slate-400 mt-1">Padrão institucional B91: 0,32%</p>
            </div>
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

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleCalcular}
              className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 bg-[#ff5e36] hover:bg-[#e84f29] text-white font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer min-h-[44px]"
            >
              <Target className="w-4 h-4" />
              <span>Calcular Projeção RJ</span>
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
                    title="Exportar projeção da Convenção RJ em PDF"
                  >
                    <FileDown className="w-4 h-4 text-[#ff5e36]" />
                    <span>Exportar PDF / Imprimir</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Selected Campaign Preview */}
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="relative h-48 bg-slate-100 overflow-hidden">
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
              <span>Campanha Oficial</span>
            </div>
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#ff5e36] text-white font-extrabold text-xs shadow-md">
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

            <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-xl">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
                Regra B91 de Qualificação
              </div>
              <p className="text-xs text-slate-700 leading-tight">
                Manter TPV acima de {formatMoneyNum(campanhaSelecionada.meta)} por 3 meses consecutivos no ciclo até Julho.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {resultado && (
        <div className="space-y-6">
          {resultado.jaAtingida ? (
            <div className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-center shadow-md">
              <div className="text-6xl mb-3 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                Parabéns! Meta de TPV já atingida!
              </h3>
              <p className="text-emerald-700 text-base max-w-xl mx-auto">
                Seu TPV atual de <strong>{formatMoneyNum(resultado.tpvAtual)}</strong> já cobre a meta de {formatMoneyNum(resultado.meta)} da premiação <strong>{resultado.campanha.premio}</strong>!
              </p>
            </div>
          ) : (
            <>
              {/* Summary KPIs */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Meta TPV
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {formatMoneyNum(resultado.meta)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span>{resultado.campanha.emoji}</span>
                    <span>{resultado.campanha.premio}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Falta Atingir
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-orange-600">
                    {formatMoneyNum(resultado.faltam)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Em {resultado.mesesDisponiveis} meses até a convenção
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Crescimento Necessário
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-blue-600">
                    {formatMoneyNum(resultado.crescimentoNecessario)} <span className="text-xs font-semibold text-slate-500">/mês</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Taxa: {resultado.percentualCrescimento.toFixed(1)}% ao mês
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Viabilidade Estratégica
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-800">
                    {resultado.viabilidade.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {resultado.percentualCrescimento <= 15 ? 'Ritmo sustentável' : resultado.percentualCrescimento <= 30 ? 'Exige foco em expansão' : 'Considere meta intermediária'}
                  </div>
                </div>
              </div>

              {/* Month-by-month table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-lg">
                      📅 Cronograma Mensal Rumo à Convenção RJ
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Crescimento mensal programado: <strong>{formatMoneyNum(resultado.crescimentoNecessario)}</strong> por mês
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    Convenção: Julho/{resultado.anoConvencao}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 text-xs uppercase font-bold tracking-wider">
                        <th className="py-3 px-4">Mês</th>
                        <th className="py-3 px-4">TPV Meta</th>
                        <th className="py-3 px-4">Crescimento</th>
                        <th className="py-3 px-4">TPV Atingido</th>
                        <th className="py-3 px-4">Remuneração Mensal</th>
                        <th className="py-3 px-4">Status de Elegibilidade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {resultado.cronograma.map((row, idx) => {
                        const isFinalMonth = row.mesNumero === 7;
                        return (
                          <tr 
                            key={idx} 
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isFinalMonth ? 'bg-amber-50/50 font-semibold' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                              {row.mes}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                              {formatMoneyNum(row.tpvMeta)}
                            </td>
                            <td className="py-3.5 px-4 text-blue-600 font-medium whitespace-nowrap">
                              {row.crescimento > 0 ? `+${formatMoneyNum(row.crescimento)}` : '—'}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                              <div>{formatMoneyNum(row.tpvAtingido)}</div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="font-bold text-emerald-600">
                                {formatMoneyNum(row.remuneracao)}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {formatPercentage(resultado.recorrencia)} de recorrência
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                row.statusTipo === 'elegivel' || row.statusTipo === 'elegivel_final'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : row.statusTipo === 'validacao'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : row.statusTipo === 'pre_validacao'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : row.statusTipo === 'nao_elegivel'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-slate-100 text-slate-700 border border-slate-300'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-50/70 border-t border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Regra Oficial de Elegibilidade:</strong> A meta de TPV estipulada para a campanha deve ser mantida obrigatoriamente por <strong>3 meses consecutivos</strong> com taxa de recorrência mínima de <strong>0,32%</strong>.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {!resultado && (
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff5e36] flex items-center justify-center mx-auto mb-2">
            <Target className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Preencha os parâmetros para calcular a projeção</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Informe o TPV atual da sua carteira e clique em <strong>Calcular Projeção RJ</strong> para visualizar o cronograma mensal de atingimento com evolução de comissões até a Convenção RJ.
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 italic">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          * As imagens do evento e da premiação são meramente ilustrativas.
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          Convenção RJ • Circuito Oficial de Premiações B91
        </span>
      </div>
    </div>
  );
};
