import React from 'react';
import { Target, TrendingUp, DollarSign, Award, Clock } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { formatCurrencyBRL, formatPercent } from '../../utils/plannerCalculations';

interface KpiOverviewProps {
  targetMonthlyRevenue: number;
  currentActualRevenue: number;
  averageTicket: number;
  targetAnnualRevenue: number;
  onChangeTargetMonthly: (val: number) => void;
  onChangeActualMonthly: (val: number) => void;
  onChangeAverageTicket: (val: number) => void;
}

export const KpiOverview: React.FC<KpiOverviewProps> = ({
  targetMonthlyRevenue,
  currentActualRevenue,
  averageTicket,
  targetAnnualRevenue,
  onChangeTargetMonthly,
  onChangeActualMonthly,
  onChangeAverageTicket,
}) => {
  const percentAchieved = targetMonthlyRevenue > 0
    ? (currentActualRevenue / targetMonthlyRevenue) * 100
    : 0;

  const gapToGoal = Math.max(0, targetMonthlyRevenue - currentActualRevenue);
  const salesNeeded = averageTicket > 0 ? Math.ceil(targetMonthlyRevenue / averageTicket) : 0;
  const currentSalesCount = averageTicket > 0 ? Math.floor(currentActualRevenue / averageTicket) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Meta Mensal */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
          <span className="font-medium">Meta Mensal (Alvo)</span>
          <Target className="w-4 h-4 text-sky-600" />
        </div>

        <div className="mt-1">
          <label className="text-[11px] text-slate-400 block mb-0.5">Editar valor:</label>
          <NumericFormat
            value={targetMonthlyRevenue}
            onValueChange={(values) => onChangeTargetMonthly(values.floatValue || 0)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            className="w-full text-xl font-bold text-slate-900 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
          />
        </div>

        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Meta Anual:</span>
          <span className="font-semibold text-slate-700 font-mono">
            {formatCurrencyBRL(targetAnnualRevenue)}
          </span>
        </div>
      </div>

      {/* KPI 2: Faturamento Realizado */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
          <span className="font-medium">Realizado no Mês</span>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="mt-1">
          <label className="text-[11px] text-slate-400 block mb-0.5">Faturado até hoje:</label>
          <NumericFormat
            value={currentActualRevenue}
            onValueChange={(values) => onChangeActualMonthly(values.floatValue || 0)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            className="w-full text-xl font-bold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white border border-emerald-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Falta para a meta:</span>
          <span className={`font-semibold font-mono ${gapToGoal === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {gapToGoal === 0 ? 'Meta Batida! 🏆' : formatCurrencyBRL(gapToGoal)}
          </span>
        </div>
      </div>

      {/* KPI 3: % Atingido com Barra de Progresso */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">% Conclusão da Meta</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {formatPercent(percentAchieved)}
            </span>
            <span className="text-xs text-slate-500">
              ({currentSalesCount} de {salesNeeded} vendas)
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                percentAchieved >= 100
                  ? 'bg-emerald-500'
                  : percentAchieved >= 70
                  ? 'bg-sky-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, percentAchieved))}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* KPI 4: Ticket Médio */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
          <span className="font-medium">Ticket Médio Estimado</span>
          <DollarSign className="w-4 h-4 text-sky-600" />
        </div>

        <div className="mt-1">
          <label className="text-[11px] text-slate-400 block mb-0.5">Valor médio por venda:</label>
          <NumericFormat
            value={averageTicket}
            onValueChange={(values) => onChangeAverageTicket(values.floatValue || 0)}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            className="w-full text-xl font-bold text-slate-900 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
          />
        </div>

        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Vendas totais necessárias:</span>
          <span className="font-semibold text-sky-700 font-mono">
            {salesNeeded} contratos
          </span>
        </div>
      </div>
    </div>
  );
};
