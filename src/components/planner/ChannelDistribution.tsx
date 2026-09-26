import React from 'react';
import { Share2, Plus, Trash2 } from 'lucide-react';
import { ChannelGoal } from '../../types/planner';
import { formatCurrencyBRL, formatPercent } from '../../utils/plannerCalculations';

interface ChannelDistributionProps {
  channels: ChannelGoal[];
  totalTargetRevenue: number;
  onUpdateChannel: (id: string, updated: Partial<ChannelGoal>) => void;
  onAddChannel: () => void;
  onDeleteChannel: (id: string) => void;
}

export const ChannelDistribution: React.FC<ChannelDistributionProps> = ({
  channels,
  totalTargetRevenue,
  onUpdateChannel,
  onAddChannel,
  onDeleteChannel,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Distribuição por Canais de Aquisição
            </h2>
            <p className="text-xs text-slate-500">
              Meta de faturamento e volume de leads dividida por canais comerciais
            </p>
          </div>
        </div>

        <button
          onClick={onAddChannel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Canal</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/70">
              <th className="py-2.5 px-3 font-semibold">Canal Comercial</th>
              <th className="py-2.5 px-3 font-semibold">% da Meta</th>
              <th className="py-2.5 px-3 font-semibold">Meta de Faturamento</th>
              <th className="py-2.5 px-3 font-semibold">Faturado Real</th>
              <th className="py-2.5 px-3 font-semibold">Progresso</th>
              <th className="py-2.5 px-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {channels.map((ch) => {
              const progress = ch.targetRevenue > 0 ? (ch.actualRevenue / ch.targetRevenue) * 100 : 0;

              return (
                <tr key={ch.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={ch.name}
                      onChange={(e) => onUpdateChannel(ch.id, { name: e.target.value })}
                      className="font-medium text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white px-1 py-0.5 rounded focus:outline-none w-full max-w-[200px]"
                    />
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 font-mono">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ch.percentage}
                        onChange={(e) => {
                          const pct = Number(e.target.value);
                          onUpdateChannel(ch.id, {
                            percentage: pct,
                            targetRevenue: (totalTargetRevenue * pct) / 100,
                          });
                        }}
                        className="w-14 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                      <span className="text-slate-500">%</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                    {formatCurrencyBRL(ch.targetRevenue)}
                  </td>

                  <td className="py-3 px-3">
                    <input
                      type="number"
                      value={ch.actualRevenue}
                      onChange={(e) => onUpdateChannel(ch.id, { actualRevenue: Number(e.target.value) })}
                      className="w-24 font-mono font-semibold text-emerald-700 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </td>

                  <td className="py-3 px-3">
                    <div className="w-28">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-0.5 font-mono">
                        <span>{formatPercent(progress)}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            progress >= 100 ? 'bg-emerald-500' : progress >= 70 ? 'bg-sky-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onDeleteChannel(ch.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                      title="Excluir canal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
