import React from 'react';
import { BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';
import { MonthlyMilestone } from '../../types/planner';
import { formatCurrencyBRL } from '../../utils/plannerCalculations';

interface MonthlyProgressChartProps {
  milestones: MonthlyMilestone[];
  onUpdateMonth: (monthName: string, actual: number) => void;
}

export const MonthlyProgressChart: React.FC<MonthlyProgressChartProps> = ({
  milestones,
  onUpdateMonth,
}) => {
  // Find highest value for chart scaling
  const maxVal = Math.max(
    ...milestones.map((m) => Math.max(m.target, m.actual)),
    100000
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Evolução Mensal: Meta vs. Realizado (12 Meses)
            </h2>
            <p className="text-xs text-slate-500">
              Curva de crescimento e atingimento do faturamento ao longo do ano
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-sky-200 rounded-sm" />
            <span className="text-slate-600">Meta</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            <span className="text-slate-600">Realizado</span>
          </div>
        </div>
      </div>

      {/* 12-Month Bars */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-4 items-end min-h-[220px]">
        {milestones.map((m) => {
          const targetHeight = Math.round((m.target / maxVal) * 120);
          const actualHeight = Math.round((m.actual / maxVal) * 120);
          const isHit = m.actual >= m.target && m.actual > 0;

          return (
            <div key={m.month} className="flex flex-col items-center gap-1 group">
              <div className="text-[10px] font-mono text-slate-400 group-hover:text-slate-800 transition-colors">
                {m.actual > 0 ? `${Math.round(m.actual / 1000)}k` : '-'}
              </div>

              <div className="flex items-end gap-1 h-[130px] w-full justify-center">
                {/* Target Bar */}
                <div
                  className="w-2.5 sm:w-3.5 bg-sky-200 rounded-t-sm transition-all"
                  style={{ height: `${Math.max(4, targetHeight)}px` }}
                  title={`Meta ${m.month}: ${formatCurrencyBRL(m.target)}`}
                />

                {/* Actual Bar */}
                <div
                  className={`w-2.5 sm:w-3.5 rounded-t-sm transition-all ${
                    isHit ? 'bg-emerald-500' : m.actual > 0 ? 'bg-amber-400' : 'bg-slate-200'
                  }`}
                  style={{ height: `${Math.max(4, actualHeight)}px` }}
                  title={`Realizado ${m.month}: ${formatCurrencyBRL(m.actual)}`}
                />
              </div>

              <span className="text-xs font-bold text-slate-700 mt-1">
                {m.month}
              </span>

              {/* Editable actual input on hover / focus */}
              <input
                type="number"
                value={m.actual || ''}
                placeholder="R$"
                onChange={(e) => onUpdateMonth(m.month, Number(e.target.value))}
                className="w-full text-[10px] font-mono text-center bg-slate-50 border border-slate-200 rounded py-0.5 opacity-60 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
