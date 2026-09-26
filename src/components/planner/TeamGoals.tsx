import React from 'react';
import { UserCheck, Plus, Trash2, DollarSign } from 'lucide-react';
import { SalesRep } from '../../types/planner';
import { formatCurrencyBRL, formatPercent } from '../../utils/plannerCalculations';

interface TeamGoalsProps {
  team: SalesRep[];
  onUpdateMember: (id: string, updated: Partial<SalesRep>) => void;
  onAddMember: () => void;
  onDeleteMember: (id: string) => void;
}

export const TeamGoals: React.FC<TeamGoalsProps> = ({
  team,
  onUpdateMember,
  onAddMember,
  onDeleteMember,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Metas Individuais & Comissões da Equipe
            </h2>
            <p className="text-xs text-slate-500">
              Metas por vendedor/closer, faturamento realizado e estimativa de comissões
            </p>
          </div>
        </div>

        <button
          onClick={onAddMember}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Membro</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {team.map((member) => {
          const progress = member.targetRevenue > 0
            ? (member.actualRevenue / member.targetRevenue) * 100
            : 0;
          const commissionEarned = (member.actualRevenue * (member.commissionRate || 0)) / 100;

          return (
            <div
              key={member.id}
              className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-white transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => onUpdateMember(member.id, { name: e.target.value })}
                      className="font-bold text-slate-900 text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded px-1 py-0.5 focus:outline-none w-full"
                    />
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => onUpdateMember(member.id, { role: e.target.value })}
                      className="text-[11px] text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded px-1 py-0.5 focus:outline-none w-full"
                    />
                  </div>

                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Remover"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Meta Individual:</span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-slate-800">
                      <span>R$</span>
                      <input
                        type="number"
                        value={member.targetRevenue}
                        onChange={(e) => onUpdateMember(member.id, { targetRevenue: Number(e.target.value) })}
                        className="w-20 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-right font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Realizado:</span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-emerald-700">
                      <span>R$</span>
                      <input
                        type="number"
                        value={member.actualRevenue}
                        onChange={(e) => onUpdateMember(member.id, { actualRevenue: Number(e.target.value) })}
                        className="w-20 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-right font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Contratos Fechados:</span>
                    <input
                      type="number"
                      value={member.dealsClosed}
                      onChange={(e) => onUpdateMember(member.id, { dealsClosed: Number(e.target.value) })}
                      className="w-14 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-right font-mono text-slate-800 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Progress & Commission */}
              <div className="pt-3 mt-3 border-t border-slate-200 space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Atingimento:</span>
                    <span className="font-bold text-slate-800 font-mono">{formatPercent(progress)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        progress >= 100 ? 'bg-emerald-500' : progress >= 70 ? 'bg-sky-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                  <span className="flex items-center gap-1 font-medium text-emerald-800">
                    <DollarSign className="w-3.5 h-3.5" />
                    Comissão Prevista ({member.commissionRate}%):
                  </span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {formatCurrencyBRL(commissionEarned)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
