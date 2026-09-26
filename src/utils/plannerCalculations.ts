export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatPercent(value: number): string {
  return `${(value || 0).toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0));
}

export interface FunnelCalculation {
  salesNeeded: number;
  proposalsNeeded: number;
  opportunitiesNeeded: number;
  leadsNeeded: number;
}

export function calculateFunnelMetrics(
  targetRevenue: number,
  averageTicket: number,
  proposalToSaleRate: number,
  opportunityToProposalRate: number,
  leadToOpportunityRate: number
): FunnelCalculation {
  const safeTicket = averageTicket > 0 ? averageTicket : 1000;
  const salesNeeded = Math.ceil(targetRevenue / safeTicket);

  const saleRate = proposalToSaleRate > 0 ? proposalToSaleRate / 100 : 0.3;
  const proposalsNeeded = Math.ceil(salesNeeded / saleRate);

  const propRate = opportunityToProposalRate > 0 ? opportunityToProposalRate / 100 : 0.5;
  const opportunitiesNeeded = Math.ceil(proposalsNeeded / propRate);

  const leadRate = leadToOpportunityRate > 0 ? leadToOpportunityRate / 100 : 0.25;
  const leadsNeeded = Math.ceil(opportunitiesNeeded / leadRate);

  return {
    salesNeeded,
    proposalsNeeded,
    opportunitiesNeeded,
    leadsNeeded,
  };
}
