import React from 'react';
import { Filter, Users, UserCheck, FileSpreadsheet, CheckCircle2, ArrowRight } from 'lucide-react';
import { calculateFunnelMetrics, formatNumber, formatPercent } from '../../utils/plannerCalculations';

interface ReverseFunnelCalculatorProps {
  targetRevenue: number;
  averageTicket: number;
  leadToOpportunityRate: number;
  opportunityToProposalRate: number;
  proposalToSaleRate: number;
  onChangeRates: (leadToOpp: number, oppToProp: number, propToSale: number) => void;
}

export const ReverseFunnelCalculator: React.FC<ReverseFunnelCalculatorProps> = ({
  targetRevenue,
  averageTicket,
  leadToOpportunityRate,
  opportunityToProposalRate,
  proposalToSaleRate,
  onChangeRates,
}) => {
  const metrics = calculateFunnelMetrics(
    targetRevenue,
    averageTicket,
    proposalToSaleRate,
    opportunityToProposalRate,
    leadToOpportunityRate
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Cálculo Reverso do Funil Comercial
            </h2>
            <p className="text-xs text-slate-500">
              Volume de atividades necessárias para atingir a meta de faturamento definida
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
          Ticket Médio: <strong className="text-slate-800 font-mono">R$ {averageTicket.toLocaleString('pt-BR')}</strong>
        </div>
      </div>

      {/* Visual Funnel Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Step 1: Leads */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-sky-50/50 to-white p-4 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-sky-700 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                1. Leads / Contatos
              </span>
              <span className="px-1.5 py-0.5 rounded bg-sky-100 text-[11px] font-mono">Topo</span>
            </div>

            <div className="text-2xl font-bold text-slate-900 font-mono">
              {formatNumber(metrics.leadsNeeded)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Leads necessários no mês
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Conversão p/ Oportunidade:</span>
              <span className="font-bold text-slate-700 font-mono">{formatPercent(leadToOpportunityRate)}</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              value={leadToOpportunityRate}
              onChange={(e) => onChangeRates(Number(e.target.value), opportunityToProposalRate, proposalToSaleRate)}
              className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Step 2: Qualified Opportunities */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-indigo-50/40 to-white p-4 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-indigo-700 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                2. Oportunidades Qualificadas
              </span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-[11px] font-mono">Meio</span>
            </div>

            <div className="text-2xl font-bold text-slate-900 font-mono">
              {formatNumber(metrics.opportunitiesNeeded)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Reuniões ou diagnósticos realizados
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Conversão p/ Proposta:</span>
              <span className="font-bold text-slate-700 font-mono">{formatPercent(opportunityToProposalRate)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={opportunityToProposalRate}
              onChange={(e) => onChangeRates(leadToOpportunityRate, Number(e.target.value), proposalToSaleRate)}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Step 3: Proposals */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-purple-50/40 to-white p-4 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-purple-700 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" />
                3. Propostas Comerciais
              </span>
              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-[11px] font-mono">Fundo</span>
            </div>

            <div className="text-2xl font-bold text-slate-900 font-mono">
              {formatNumber(metrics.proposalsNeeded)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Orçamentos / negociações ativas
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Conversão Fechamento:</span>
              <span className="font-bold text-slate-700 font-mono">{formatPercent(proposalToSaleRate)}</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              value={proposalToSaleRate}
              onChange={(e) => onChangeRates(leadToOpportunityRate, opportunityToProposalRate, Number(e.target.value))}
              className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Step 4: Closed Deals (Sales) */}
        <div className="rounded-xl border-2 border-emerald-300 bg-gradient-to-b from-emerald-50 to-white p-4 relative flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-800 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                4. Vendas Fechadas
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-mono">Meta</span>
            </div>

            <div className="text-3xl font-extrabold text-emerald-700 font-mono">
              {metrics.salesNeeded}
            </div>
            <p className="text-[11px] text-emerald-900 font-medium mt-0.5">
              Contratos fechados para bater a meta
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-slate-600">
            Faturamento: <strong className="text-slate-900 font-mono">R$ {targetRevenue.toLocaleString('pt-BR')}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
