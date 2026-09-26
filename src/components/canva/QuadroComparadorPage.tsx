import React, { useState } from 'react';
import { 
  BarChart2, 
  FileSpreadsheet, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Rocket, 
  Zap,
  Calendar,
  DollarSign
} from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { CAMPANHAS_LISTA, Campanha } from '../../types/canvaPlanner';
import { formatMoneyNum, parsePercentage, gerarMesesDinamicos } from '../../utils/canvaCalculations';
import { exportToCSV } from '../../utils/exportCsv';
import { dispararConfetes } from '../../utils/confettiEffect';

interface QuadroComparadorPageProps {
  onOpenResumo?: (dados: any) => void;
  onApplyProfile?: (tpv: number, clientes: number, ticket: number, rec: string) => void;
}

export const QuadroComparadorPage: React.FC<QuadroComparadorPageProps> = () => {
  const [tpvAtual, setTpvAtual] = useState<number>(350000);
  const [clientesMes, setClientesMes] = useState<number>(6);
  const [tpvMedio, setTpvMedio] = useState<number>(35000);
  const [recorrenciaStr, setRecorrenciaStr] = useState<string>('0,32%');

  const recorrencia = parsePercentage(recorrenciaStr);
  const tpvPorMes = clientesMes * tpvMedio;
  const remuneracaoTAC = clientesMes * 49.90;

  // Aplicação rápida de perfis
  const aplicarPerfil = (tipo: 'iniciante' | 'intermediario' | 'top') => {
    if (tipo === 'iniciante') {
      setTpvAtual(100000);
      setClientesMes(3);
      setTpvMedio(25000);
      setRecorrenciaStr('0,32%');
    } else if (tipo === 'intermediario') {
      setTpvAtual(450000);
      setClientesMes(6);
      setTpvMedio(40000);
      setRecorrenciaStr('0,34%');
    } else {
      setTpvAtual(1200000);
      setClientesMes(12);
      setTpvMedio(60000);
      setRecorrenciaStr('0,38%');
    }
    dispararConfetes();
  };

  const mesesDinamicos = gerarMesesDinamicos(120);

  // Cálculo para cada uma das 6 campanhas
  const comparativo = CAMPANHAS_LISTA.map((c) => {
    const meta = c.meta;
    const jaAtingiu = tpvAtual >= meta;
    
    let mesesNecessarios = 0;
    let mesConquistaNome = 'Já conquistado!';

    if (!jaAtingiu) {
      if (tpvPorMes > 0) {
        mesesNecessarios = Math.ceil((meta - tpvAtual) / tpvPorMes);
        mesConquistaNome = mesesDinamicos[mesesNecessarios - 1] || `Mês ${mesesNecessarios}`;
      } else {
        mesesNecessarios = 999;
        mesConquistaNome = 'Ritmo estagnado';
      }
    } else {
      mesesNecessarios = 0;
    }

    const progressoPercent = Math.min(100, Math.round((tpvAtual / meta) * 100));
    const comissaoNaMeta = meta * recorrencia;

    let status = 'Em andamento';
    let statusColor = 'bg-blue-100 text-blue-800';

    if (jaAtingiu) {
      status = 'Conquistado 🎉';
      statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (mesesNecessarios <= 6) {
      status = 'Curto Prazo ⚡';
      statusColor = 'bg-amber-100 text-amber-900 border-amber-300';
    } else if (mesesNecessarios <= 18) {
      status = 'Médio Prazo 🎯';
      statusColor = 'bg-indigo-100 text-indigo-900 border-indigo-300';
    } else {
      status = 'Longo Prazo 🚀';
      statusColor = 'bg-slate-100 text-slate-700 border-slate-300';
    }

    return {
      campanha: c,
      jaAtingiu,
      mesesNecessarios,
      mesConquistaNome,
      progressoPercent,
      comissaoNaMeta,
      status,
      statusColor,
    };
  });

  const handleExportCSV = () => {
    const headers = [
      'Campanha',
      'Meta TPV',
      'TPV Atual',
      'Progresso (%)',
      'Meses Estimados',
      'Previsão de Conquista',
      'Comissão Recorrente na Meta',
      'Status',
    ];

    const rows = comparativo.map((item) => [
      item.campanha.nome,
      item.campanha.meta,
      tpvAtual,
      `${item.progressoPercent}%`,
      item.jaAtingiu ? 0 : item.mesesNecessarios,
      item.mesConquistaNome,
      formatMoneyNum(item.comissaoNaMeta),
      item.status,
    ]);

    exportToCSV('quadro-executivo-comparador-b91', headers, rows);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Banner Principal */}
      <div className="gradient-primary text-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Quadro Executivo Comparador
              </h2>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mt-2 max-w-2xl">
              Análise simultânea das 6 campanhas da B91. Compare o tempo de atingimento e a receita projetada de acordo com o ritmo atual de credenciamento.
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Perfis Rápidos */}
      <div className="card-modern p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">Simulação Rápida por Perfis</h4>
              <p className="text-xs text-gray-300">Carregue cenários comerciais prontos com um clique:</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => aplicarPerfil('iniciante')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-blue-200 border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5 text-blue-400" />
              <span>Iniciante (3 clientes)</span>
            </button>

            <button
              onClick={() => aplicarPerfil('intermediario')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Intermediário (6 clientes)</span>
            </button>

            <button
              onClick={() => aplicarPerfil('top')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-accent text-white shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Top Performer (12 clientes)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Painel de Variáveis Comerciais */}
      <div className="card-modern">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#ff6b35]" />
          <span>Variáveis de Ritmo Comercial</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              TPV Atual (Fechamento)
            </label>
            <NumericFormat
              value={tpvAtual}
              onValueChange={(v) => setTpvAtual(v.floatValue || 0)}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              className="w-full border-2 border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#ff6b35]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Clientes Cadastrados / Mês
            </label>
            <input
              type="number"
              min="0"
              value={clientesMes}
              onChange={(e) => setClientesMes(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full border-2 border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#ff6b35]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              TPV Médio por Cliente
            </label>
            <NumericFormat
              value={tpvMedio}
              onValueChange={(v) => setTpvMedio(v.floatValue || 0)}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              className="w-full border-2 border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#ff6b35]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Recorrência Média (%)
            </label>
            <input
              type="text"
              value={recorrenciaStr}
              onChange={(e) => setRecorrenciaStr(e.target.value)}
              placeholder="0,32%"
              className="w-full border-2 border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#ff6b35]"
            />
          </div>
        </div>

        {/* Resumo do Ritmo Mensal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium block">Crescimento Novo / Mês:</span>
            <strong className="text-sm font-bold text-slate-900 font-mono">
              +{formatMoneyNum(tpvPorMes)}
            </strong>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="text-blue-700 font-medium block">Remuneração TAC Mensal:</span>
            <strong className="text-sm font-bold text-blue-900 font-mono">
              {formatMoneyNum(remuneracaoTAC)}
            </strong>
          </div>

          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <span className="text-emerald-700 font-medium block">Acréscimo de Recorrência / Mês:</span>
            <strong className="text-sm font-bold text-emerald-900 font-mono">
              +{formatMoneyNum(tpvPorMes * recorrencia)}
            </strong>
          </div>
        </div>
      </div>

      {/* Grid Comparativo dos 6 Prêmios */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            🏁 Previsão de Conquista dos 6 Prêmios
          </h3>
          <span className="text-xs text-gray-500">
            Baseado em +{formatMoneyNum(tpvPorMes)}/mês
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparativo.map((item) => {
            const { campanha, jaAtingiu, mesesNecessarios, mesConquistaNome, progressoPercent, comissaoNaMeta, status, statusColor } = item;

            return (
              <div
                key={campanha.id}
                className="card-modern flex flex-col justify-between overflow-hidden border-2 border-gray-200 hover:border-[#ff6b35] transition-all"
              >
                <div>
                  {/* Foto da Campanha */}
                  <div className="relative h-36 -mx-6 -mt-6 mb-4 bg-slate-900 overflow-hidden">
                    <img
                      src={campanha.imagem}
                      alt={campanha.nome}
                      className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${statusColor}`}>
                        {status}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-white text-xs font-mono font-bold">
                      Meta: {formatMoneyNum(campanha.meta)}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <span>{campanha.emoji}</span>
                    <span>{campanha.nome}</span>
                  </h4>

                  {/* Barra de Progresso */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progresso do TPV</span>
                      <strong className="font-mono text-slate-900">{progressoPercent}%</strong>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-accent rounded-full transition-all duration-700"
                        style={{ width: `${progressoPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Métricas do Prêmio */}
                  <div className="space-y-2 text-xs pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Tempo estimado:
                      </span>
                      <strong className="text-slate-900 font-mono">
                        {jaAtingiu ? '0 meses' : `${mesesNecessarios} meses`}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Mês da Conquista:
                      </span>
                      <strong className="text-[#ff6b35] font-semibold">
                        {mesConquistaNome}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        Comissão na meta:
                      </span>
                      <strong className="text-emerald-700 font-mono font-bold">
                        {formatMoneyNum(comissaoNaMeta)}/mês
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  {jaAtingiu ? (
                    <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold py-2 px-3 rounded-lg text-center flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Requisito de TPV já alcançado!</span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 text-slate-700 text-xs py-2 px-3 rounded-lg text-center font-medium">
                      Faltam <strong className="text-slate-900 font-mono">{formatMoneyNum(campanha.meta - tpvAtual)}</strong> de TPV
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela Comparativa Geral */}
      <div className="card-modern space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-bold text-gray-900">
            📋 Resumo Executivo das Campanhas
          </h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                <th className="py-3 px-4 font-bold text-xs uppercase">Campanha</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Meta TPV</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Progresso</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Prazo Estimado</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Previsão Mês</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Comissão Recorrente</th>
                <th className="py-3 px-4 font-bold text-xs uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comparativo.map((c) => (
                <tr key={c.campanha.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-2">
                    <span>{c.campanha.emoji}</span>
                    <span>{c.campanha.nome}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-800">{formatMoneyNum(c.campanha.meta)}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-blue-700">{c.progressoPercent}%</td>
                  <td className="py-3 px-4 font-mono">{c.jaAtingiu ? 'Conquistado' : `${c.mesesNecessarios} meses`}</td>
                  <td className="py-3 px-4 font-medium text-slate-700">{c.mesConquistaNome}</td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{formatMoneyNum(c.comissaoNaMeta)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${c.statusColor}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
